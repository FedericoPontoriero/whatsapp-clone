import React, { useCallback, useEffect, useState } from 'react'
import { View, StyleSheet, ImageBackground, ImageSourcePropType, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, FlatList, Text, } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons'
import { RouteProp } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { NavigationScreenProp } from 'react-navigation';

import colors from '../constants/colors';
import { RootState } from '../store/store';
import PageContainer from '../components/PageContainer';
import Bubble from '../components/Bubble';
import { createChat, sendTextMessage } from '../utils/actions/chatActions';
import ReplyTo from '../components/ReplyTo';

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

    const chatData: any = (chatId && storedChats[chatId]) || props.route?.params?.newChatData

    const getChatTitleFromName = () => {
        const otherUserId = chatUsers.find(uid => uid !== userData.userId)
        const otherUserData = storedUsers[otherUserId]

        return otherUserData && `${otherUserData.firstName} ${otherUserData.lastName}`
    }

    useEffect(() => {
        props.navigation.setParams({
            headerTitle: getChatTitleFromName()
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
            await sendTextMessage(chatId, userData.userId, messageText, replyingTo && replyingTo.key)
            setMessageText("")
            setReplyingTo(null)
        } catch (err) {
            console.log(err);
            setErrorBannerText("Message failed to sent")
            setTimeout(() => setErrorBannerText(""), 5000)
        }
    }, [messageText, chatId])

    return (
        <SafeAreaView edges={['right', 'left', 'bottom']} style={styles.container}>
            <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={100}>
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
                                data={chatMessages}
                                renderItem={(itemData) => {
                                    const message = itemData.item
                                    const isOwnMessage = message.sentBy === userData.userId

                                    const messageType = isOwnMessage ? "myMessage" : "theirMessage"
                                    return <Bubble
                                        types={messageType}
                                        text={message.text}
                                        messageId={message.key}
                                        userId={userData.userId}
                                        chatId={chatId}
                                        date={message.sentAt}
                                        setReply={() => setReplyingTo(message)}
                                        replyingTo={message.replyTo && chatMessages.find(i => i.key === message.replyTo)}
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
                    <TouchableOpacity style={styles.mediaButton} >
                        <Feather name='plus' size={24} color={colors.blue} />
                    </TouchableOpacity>
                    <TextInput style={styles.textbox} onChangeText={text => setMessageText(text)} value={messageText} onSubmitEditing={sendMessage} />
                    {messageText === "" &&
                        <TouchableOpacity style={styles.mediaButton} >
                            <Feather name='camera' size={24} color={colors.blue} />
                        </TouchableOpacity>
                    }
                    {messageText !== "" &&
                        <TouchableOpacity style={{ ...styles.mediaButton, ...styles.sendButton }} onPress={sendMessage}>
                            <Feather name='send' size={20} color={'white'} />
                        </TouchableOpacity>
                    }
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    screen: {
        flex: 1
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
});

export default ChatScreen;
