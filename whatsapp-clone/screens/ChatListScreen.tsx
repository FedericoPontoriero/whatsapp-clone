import React, { useEffect } from 'react'
import { View, Text, StyleSheet, Button } from 'react-native'
import { NavigationScreenProp } from 'react-navigation'
import { HeaderButtons, Item } from 'react-navigation-header-buttons'
import CustomHeaderButton from '../components/CustomHeaderButton'

interface ChatListScreenProps {
    navigation: NavigationScreenProp<any, any>
}

const ChatListScreen = (props: ChatListScreenProps) => {
    useEffect(() => {
        props.navigation.setParams({
            headerRight: () => {
                return <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
                    <Item title='New chat'
                        iconName='create-outline'
                        onPress={() => props.navigation.navigate("New Chat")} />
                </HeaderButtons>
            }
        })
    }, [])

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
