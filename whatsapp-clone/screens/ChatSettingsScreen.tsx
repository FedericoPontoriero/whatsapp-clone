import React, { useCallback, useReducer, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

import Input from '../components/Input'
import PageContainer from '../components/PageContainer'
import { PageTitle } from '../components/PageTitle'
import ProfileImage from '../components/ProfileImage'
import SubmitButton from '../components/SubmitButton'
import colors from '../constants/colors'
import { RootState } from '../store/store'
import { updateChatData } from '../utils/actions/chatActions'
import { validateInput } from '../utils/actions/formActions'
import { reducer } from '../utils/reducers/formReducer'

const ChatSettingsScreen = (props) => {
    const chatId = props.route.params.chatId
    const chatData: any = useSelector<RootState>(state => state.chats.chatsData[chatId])
    const userData: any = useSelector<RootState>(state => state.auth.userData)

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
            }, 3000);
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
        </ScrollView>
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
})

export default ChatSettingsScreen
