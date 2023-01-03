import { RouteProp } from '@react-navigation/native'
import React, { useEffect } from 'react'
import { View, Text, StyleSheet, Button } from 'react-native'
import { NavigationScreenProp } from 'react-navigation'
import { HeaderButtons, Item } from 'react-navigation-header-buttons'
import { useSelector } from 'react-redux'
import CustomHeaderButton from '../components/CustomHeaderButton'
import { RootState } from '../store/store'

interface ChatListScreenProps {
    navigation: NavigationScreenProp<any, any>
    route: RouteProp<{ params: { selectedUserId: string } }>
}

const ChatListScreen: React.FC = (props: ChatListScreenProps) => {

    const selectedUser = props.route?.params?.selectedUserId

    const userData: any = useSelector<RootState>(state => state.auth.userData)

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

    return <View style={styles.container}>
        <Text>Go to chat screen</Text>
        <Button title='Go Chat Screen' onPress={() => props.navigation.navigate("ChatScreen")} />
    </View>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default ChatListScreen;
