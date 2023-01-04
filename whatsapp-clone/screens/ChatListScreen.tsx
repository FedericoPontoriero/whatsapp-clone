import { RouteProp } from '@react-navigation/native'
import React, { useEffect } from 'react'
import { View, Text, StyleSheet, Button, FlatList } from 'react-native'
import { NavigationScreenProp } from 'react-navigation'
import { HeaderButtons, Item } from 'react-navigation-header-buttons'
import { useSelector } from 'react-redux'
import CustomHeaderButton from '../components/CustomHeaderButton'
import DataItem from '../components/DataItem'
import PageContainer from '../components/PageContainer'
import { PageTitle } from '../components/PageTitle'
import { RootState } from '../store/store'

interface ChatListScreenProps {
    navigation: NavigationScreenProp<any, any>
    route: RouteProp<{ params: { selectedUserId: string } }>
}

const ChatListScreen: React.FC = (props: ChatListScreenProps) => {

    const selectedUser = props.route?.params?.selectedUserId

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
        if (!selectedUser) return

        const chatUsers = [selectedUser, userData.userId]
        const navigationProps = {
            newChatData: { users: chatUsers }
        }
        props.navigation.navigate("ChatScreen", navigationProps)
    }, [props.route?.params])

    return <PageContainer>
        <PageTitle text='Chats' />
        <FlatList
            data={userChats}
            renderItem={(itemData) => {
                const chatData = itemData.item
                const chatId = chatData.key

                const otherUserId = chatData.users.find((uid) => uid !== userData.userId)
                const otherUser = storedUsers[otherUserId]

                if (!otherUser) return

                const title = `${otherUser.firstName} ${otherUser.lastName}`
                const subTitle = "This will be a message"
                const image = otherUser.profilePicture

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
    }
});

export default ChatListScreen;
