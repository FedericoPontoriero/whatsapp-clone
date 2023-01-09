import { RouteProp } from '@react-navigation/native'
import React, { useEffect } from 'react'
import { View, Text, StyleSheet, Button, FlatList, TouchableOpacity } from 'react-native'
import { NavigationScreenProp } from 'react-navigation'
import { HeaderButtons, Item } from 'react-navigation-header-buttons'
import { useSelector } from 'react-redux'
import CustomHeaderButton from '../components/CustomHeaderButton'
import DataItem from '../components/DataItem'
import PageContainer from '../components/PageContainer'
import { PageTitle } from '../components/PageTitle'
import colors from '../constants/colors'
import { RootState } from '../store/store'

interface ChatListScreenProps {
    navigation: NavigationScreenProp<any, any>
    route: RouteProp<{ params: { selectedUserId: string, selectedUsers: string[], chatName: string } }>
}

const ChatListScreen: React.FC = (props: ChatListScreenProps) => {

    const selectedUser = props.route?.params?.selectedUserId
    const selectedUserList = props.route?.params?.selectedUsers
    const chatName = props.route?.params?.chatName


    const userData: any = useSelector<RootState>(state => state.auth.userData)
    const storedUsers: any = useSelector<RootState>(state => state.users.storedUsers)
    const userChats: any = useSelector<RootState>(state => {
        const chatsData = state.chats.chatsData
        return Object.values(chatsData).sort((a: any, b: any) => {
            return Number(new Date(b.updatedAt)) - Number(new Date(a.updatedAt))
        })
    })

    useEffect(() => {
        props.navigation.setParams({
            headerRight: () => {
                return <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
                    <Item title='New chat'
                        iconName='create-outline'
                        onPress={() => props.navigation.navigate("NewChat")} />
                </HeaderButtons>
            }
        })
    }, [])

    useEffect(() => {
        if (!selectedUser && !selectedUserList) return

        let chatData
        let navigationProps

        if (selectedUser) {
            chatData = userChats.find(cid => !cid.isGroupChat && cid.users.includes(selectedUser))
        }

        if (chatData) {
            navigationProps = { chatid: chatData.key }
        } else {
            const chatUsers = selectedUserList || [selectedUser]
            if (!chatUsers.includes(userData.userId)) {
                chatUsers.push(userData.userId)
            }

            navigationProps = {
                newChatData: {
                    users: chatUsers,
                    isGroupChat: selectedUserList !== undefined,
                    chatName,
                }
            }
        }

        props.navigation.navigate("ChatScreen", navigationProps)
    }, [props.route?.params])

    return <PageContainer>
        <PageTitle text='Chats' />

        <View>
            <TouchableOpacity
                onPress={() => props.navigation.navigate("NewChat", { isGroupChat: true })}
            >
                <Text style={styles.newGroupText}>New Group</Text>
            </TouchableOpacity>
        </View>

        <FlatList
            data={userChats}
            renderItem={(itemData) => {
                const chatData = itemData.item
                const chatId = chatData.key
                const isGroupChat = chatData.isGroupChat

                let title = ""
                const subTitle = chatData.latestMessageText || "New chat"
                let image = ""

                if (isGroupChat) {
                    title = chatData.chatName
                } else {
                    const otherUserId = chatData.users.find((uid) => uid !== userData.userId)
                    const otherUser = storedUsers[otherUserId]

                    if (!otherUser) return

                    title = `${otherUser.firstName} ${otherUser.lastName}`
                    image = otherUser.profilePicture
                }

                return <DataItem
                    title={title}
                    subTitle={subTitle}
                    image={image}
                    onPress={() => props.navigation.navigate("ChatScreen", { chatId })}
                />
            }}
        />
    </PageContainer>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    newGroupText: {
        color: colors.blue,
        fontSize: 17,
        marginBottom: 5,
    },
});

export default ChatListScreen;
