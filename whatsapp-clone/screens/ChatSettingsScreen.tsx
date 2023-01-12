import React, { useCallback, useEffect, useReducer, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import DataItem from '../components/DataItem'

import Input from '../components/Input'
import PageContainer from '../components/PageContainer'
import { PageTitle } from '../components/PageTitle'
import ProfileImage from '../components/ProfileImage'
import SubmitButton from '../components/SubmitButton'
import colors from '../constants/colors'
import { RootState } from '../store/store'
import { addUsersToChat, removeUserFromChat, updateChatData } from '../utils/actions/chatActions'
import { validateInput } from '../utils/actions/formActions'
import { reducer } from '../utils/reducers/formReducer'

const ChatSettingsScreen = (props) => {
    const chatId = props.route.params.chatId
    const chatData: any = useSelector<RootState>(state => state.chats.chatsData[chatId] || {})
    const userData: any = useSelector<RootState>(state => state.auth.userData)
    const storedUsers = useSelector<RootState>(state => state.users.storedUsers)

    const starredMessages = useSelector<RootState>(state => state.messages.starredMessages[chatId] ?? {})

    const [isLoading, setIsLoading] = useState(false)
    const [showSuccessMessage, setShowSuccessMessage] = useState(false)

    const initialState = {
        inputValues: {
            chatName: chatData.chatName
        },
        inputValidities: {
            chatName: undefined
        },
        formIsValid: false,
    };

    const [formState, dispatchFormState] = useReducer(reducer, initialState);
    const selectedUsers = props.route.params && props.route.params.selectedUsers

    useEffect(() => {
        if (!selectedUsers) return;

        const selectedUserData = [];
        selectedUsers.forEach(uid => {
            if (uid === userData.userId) return;

            if (!storedUsers[uid]) {
                console.log('No user data found in the store');
                return;
            }

            selectedUserData.push(storedUsers[uid])
        })

        addUsersToChat(userData, selectedUserData, chatData)
    }, [selectedUsers])

    const inputChangedHandler = useCallback(
        (inputId: string, inputValue: string): void => {
            const result = validateInput(inputId, inputValue);
            dispatchFormState({ inputId, validationResult: result, inputValue });
        },
        [dispatchFormState]
    );
    const dispatch = useDispatch();

    const saveHandler = useCallback(async () => {
        const updatedValues = formState.inputValues;
        try {
            setIsLoading(true);
            await updateChatData(chatId, userData.userId, updatedValues)
            setShowSuccessMessage(true);
            setTimeout(() => {
                setShowSuccessMessage(false);
            }, 2000);
        } catch (err) {
            console.log(err);
        } finally {
            setIsLoading(false);
        }
    }, [formState]);

    const hasChanges = () => {
        const currentValues = formState.inputValues;
        return (
            currentValues.chatName !== chatData.chatName
        );
    };

    const leaveChat = useCallback(async () => {
        try {
            setIsLoading(true)

            await removeUserFromChat(userData, userData, chatData)

            props.navigation.popToTop()
        } catch (err) {
            console.log(err);
        } finally {
            setIsLoading(false)
        }
    }, [props.navigation, isLoading])

    if (!chatData.users) return null

    return <PageContainer>
        <PageTitle text='Chat Settings' />
        <ScrollView style={styles.scrollView}>
            <ProfileImage
                showEditButton={true}
                size={80}
                chatId={chatId}
                userId={userData.userId}
                uri={chatData.chatImage}
            />

            <Input
                id='chatName'
                label='Chat name'
                autoCapitalize='none'
                initialValue={chatData.chatName}
                allowEmpty={false}
                onInputChanged={inputChangedHandler}
                errorText={formState.inputValidities["chatName"]}
            />

            <View style={styles.sectionContainer}>
                <Text style={styles.heading}>{chatData.users.length} Participants</Text>
                <DataItem
                    title='Add users'
                    icon="plus"
                    type='button'
                    onPress={() => props.navigation.navigate("NewChat", { isGroupChat: true, existingUsers: chatData.users, chatId })}
                />
                {
                    chatData.users.slice(0, 4).map(uid => {
                        const currentUser = storedUsers[uid]
                        return <DataItem
                            key={uid}
                            image={currentUser.profilePicture}
                            title={`${currentUser.firstName} ${currentUser.lastName}`}
                            subTitle={currentUser.about}
                            type={uid !== userData.userId && "link"}
                            onPress={() => uid !== userData.userId && props.navigation.navigate("Contact", { uid, chatId })}
                        />
                    })
                }

                {
                    chatData.users.length > 4 &&
                    <DataItem
                        type={'link'}
                        title="View all"
                        hideImage={true}
                        onPress={() => props.navigation.navigate("DataList", { title: "Participants", data: chatData.users, type: "users", chatId })}
                    />
                }

            </View>

            {showSuccessMessage && <Text>Saved!</Text>}

            {
                isLoading ?
                    <ActivityIndicator size={'small'} color={colors.primary} /> :
                    hasChanges() && <SubmitButton
                        title='Save changes'
                        color={colors.primary}
                        onPress={saveHandler}
                        disabled={!formState.formIsValid}
                    />
            }
            <DataItem
                type={'link'}
                title="Starred messages"
                hideImage={true}
                onPress={() => props.navigation.navigate("DataList", { title: "Starred messages", data: Object.values(starredMessages), type: "messages" })}
            />

        </ScrollView>


        {
            <SubmitButton
                title='Leave chat'
                color={colors.red}
                onPress={() => leaveChat()}
                style={{ marginBottom: 20 }}
            />
        }
    </PageContainer>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollView: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    sectionContainer: {
        width: '100%',
        marginTop: 10,
    },
    heading: {
        marginVertical: 8,
        color: colors.textColor,
        fontFamily: 'bold',
        letterSpacing: 0.3,
    },
})

export default ChatSettingsScreen
