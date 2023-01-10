import React, { useCallback, useEffect, useRef, useState } from 'react'
import { View, StyleSheet, ImageBackground, ImageSourcePropType, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, FlatList, Text, Image, ActivityIndicator, } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons'
import { RouteProp } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { NavigationScreenProp } from 'react-navigation';

import colors from '../constants/colors';
import { RootState } from '../store/store';
import PageContainer from '../components/PageContainer';
import Bubble from '../components/Bubble';
import { createChat, sendImage, sendTextMessage } from '../utils/actions/chatActions';
import ReplyTo from '../components/ReplyTo';
import { launchImagePicker, openCamera, uploadImageAsync } from '../utils/imagePickerHelper';
import AwesomeAlert from 'react-native-awesome-alerts';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import CustomHeaderButton from '../components/CustomHeaderButton';

const backgroundImage: ImageSourcePropType = require("../assets/droplet.jpg");

interface ChatScreenProps {
    route: RouteProp<{ params: { newChatData: string, chatId: string } }>
    navigation: NavigationScreenProp<any, any>
}
const ChatScreen = (props: ChatScreenProps) => {
    const [chatUsers, setChatUsers] = useState([])
    const [messageText, setMessageText] = useState("")
    const [chatId, setChatId] = useState(props.route?.params?.chatId)
    const [errorBannerText, setErrorBannerText] = useState("")
    const [replyingTo, setReplyingTo] = useState<any>()
    const [tempImageUri, setTempImageUri] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const flatList: any = useRef()

    const storedUsers = useSelector<RootState>(state => state.users.storedUsers)
    const userData: any = useSelector<RootState>(state => state.auth.userData)
    const storedChats = useSelector<RootState>(state => state.chats.chatsData)
    const chatMessages: any = useSelector<RootState>(state => {
        if (!chatId) return [];
        const chatMessagesData = state.messages.messagesData[chatId]

        if (!chatMessagesData) return [];
        const messageList = []
        for (const key in chatMessagesData) {
            const message = chatMessagesData[key]

            messageList.push({
                key,
                ...message,
            })
        }

        return messageList
    })

    const chatData: any = (chatId && storedChats[chatId]) || props.route?.params?.newChatData || {}

    const getChatTitleFromName = () => {
        const otherUserId = chatUsers.find(uid => uid !== userData.userId)
        const otherUserData = storedUsers[otherUserId]

        return otherUserData && `${otherUserData.firstName} ${otherUserData.lastName}`
    }

    useEffect(() => {
        if (!chatData) return;

        props.navigation.setParams({
            headerTitle: chatData.chatName ?? getChatTitleFromName(),
            headerRight: () => {
                return <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
                    {
                        chatId &&
                        <Item
                            title='Chat settings'
                            iconName='settings-outline'
                            onPress={() => chatData.isGroupChat ?
                                props.navigation.navigate("ChatSettings", { chatId }) :
                                props.navigation.navigate("Contact", { uid: chatUsers.find(uid => uid !== userData.userid) })}
                        />
                    }
                </HeaderButtons>
            }
        })
        setChatUsers(chatData.users)
    }, [chatUsers])

    useEffect(() => {
        setChatUsers(chatData.users)
    }, [chatUsers])

    const sendMessage = useCallback(async () => {
        try {
            let id = chatId
            if (!id) {
                // No chat id. Create it
                id = await createChat(userData.userId, props.route.params.newChatData)
                setChatId(id)
            }
            await sendTextMessage(id, userData.userId, messageText, replyingTo && replyingTo.key)
            setMessageText("")
            setReplyingTo(null)
        } catch (err) {
            console.log(err);
            setErrorBannerText("Message failed to sent")
            setTimeout(() => setErrorBannerText(""), 5000)
        }
    }, [messageText, chatId])

    const pickImage = useCallback(async () => {
        try {
            const tempUri = await launchImagePicker()
            if (!tempUri) return;
            setTempImageUri(tempUri)
        } catch (err) {
            console.log(err);
        }
    }, [tempImageUri])

    const takePhoto = useCallback(async () => {
        try {
            const tempUri = await openCamera()
            if (!tempUri) return;
            setTempImageUri(tempUri)
        } catch (err) {
            console.log(err);
        }
    }, [tempImageUri])

    const uploadImage = useCallback(async () => {
        setIsLoading(true)

        try {
            let id = chatId
            if (!id) {
                id = await createChat(userData.userId, props.route.params.newChatData)
                setChatId(id)
            }
            const uploadUrl = await uploadImageAsync(tempImageUri, true)
            setIsLoading(false)
            //Send image
            await sendImage(id, userData.userId, uploadUrl, replyingTo && replyingTo.key)

            setReplyingTo(null)
            setTimeout(() => setTempImageUri(""), 500)
        } catch (err) {
            console.log(err);
            setIsLoading(false)
        }
    }, [isLoading, tempImageUri, chatId])

    return (
        <SafeAreaView edges={['right', 'left', 'bottom']} style={styles.container}>
            <ImageBackground style={styles.backgroundImage} source={backgroundImage}>
                <PageContainer style={{ backgroundColor: 'transparent' }}>
                    {
                        !chatId && <Bubble types='system' text='This is a new chat. Say hi!' />
                    }

                    {
                        errorBannerText !== "" && <Bubble text={errorBannerText} types="error" />
                    }

                    {
                        chatId &&
                        <FlatList
                            ref={(ref) => flatList.current = ref}
                            onContentSizeChange={() => flatList.current.scrollToEnd({ animated: false })}
                            onLayout={() => flatList.current.scrollToEnd({ animated: false })}
                            data={chatMessages}
                            renderItem={(itemData) => {
                                const message = itemData.item
                                const isOwnMessage = message.sentBy === userData.userId


                                let messageType: string
                                if (message.type && message.type === "info") {
                                    messageType = 'info'
                                } else if (isOwnMessage) {
                                    messageType = 'myMessage'
                                } else {
                                    messageType = 'theirMessage'
                                }

                                const sender = message.sentBy && storedUsers[message.sentBy]
                                const name = sender && `${sender.firstName} ${sender.lastName}`

                                return <Bubble
                                    name={!chatData.isGroupChat || isOwnMessage ? undefined : name}
                                    types={messageType}
                                    text={message.text}
                                    messageId={message.key}
                                    userId={userData.userId}
                                    chatId={chatId}
                                    date={message.sentAt}
                                    setReply={() => setReplyingTo(message)}
                                    replyingTo={message.replyTo && chatMessages.find(i => i.key === message.replyTo)}
                                    imageUrl={message.imageUrl}
                                />
                            }}
                        />
                    }
                </PageContainer>

                {
                    replyingTo && <ReplyTo
                        text={replyingTo.text}
                        user={storedUsers[replyingTo.sentBy]}
                        onCancel={() => setReplyingTo(null)}
                    />
                }

            </ImageBackground>

            <View style={styles.inputContainer}>
                <TouchableOpacity style={styles.mediaButton}
                    onPress={pickImage}>
                    <Feather name='plus' size={24} color={colors.blue} />
                </TouchableOpacity>
                <TextInput style={styles.textbox} onChangeText={text => setMessageText(text)} value={messageText} onSubmitEditing={sendMessage} />
                {messageText === "" &&
                    <TouchableOpacity style={styles.mediaButton}
                        onPress={takePhoto}>
                        <Feather name='camera' size={24} color={colors.blue} />
                    </TouchableOpacity>
                }
                {messageText !== "" &&
                    <TouchableOpacity
                        style={{ ...styles.mediaButton, ...styles.sendButton }} onPress={sendMessage}>
                        <Feather name='send' size={20} color={'white'} />
                    </TouchableOpacity>
                }
                <AwesomeAlert
                    show={tempImageUri !== ""}
                    title='Send image?'
                    closeOnTouchOutside={true}
                    closeOnHardwareBackPress={false}
                    showCancelButton={true}
                    showConfirmButton={true}
                    cancelText='Cancel'
                    confirmText='Send image'
                    confirmButtonColor={colors.primary}
                    cancelButtonColor={colors.red}
                    titleStyle={styles.popupTitleStyle}
                    onCancelPressed={() => setTempImageUri("")}
                    onConfirmPressed={uploadImage}
                    onDismiss={() => setTempImageUri("")}
                    customView={(
                        <View>
                            {
                                isLoading &&
                                <ActivityIndicator size='small'
                                    color={colors.primary} />
                            }
                            {
                                !isLoading && tempImageUri !== "" &&
                                <Image source={{ uri: tempImageUri }}
                                    style={{ width: 200, height: 200 }} />
                            }
                        </View>
                    )}
                />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    backgroundImage: {
        flex: 1,
    },
    inputContainer: {
        flexDirection: 'row',
        paddingVertical: 8,
        paddingHorizontal: 10,
        height: 50,
    },
    textbox: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 50,
        borderColor: colors.lightGrey,
        marginHorizontal: 15,
        paddingHorizontal: 12,
    },
    mediaButton: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 35,
    },
    sendButton: {
        backgroundColor: colors.blue,
        borderRadius: 50,
        padding: 8,
        width: 35
    },
    popupTitleStyle: {
        fontFamily: 'medium',
        letterSpacing: 0.3,
        color: colors.textColor,
    },
});

export default ChatScreen;
