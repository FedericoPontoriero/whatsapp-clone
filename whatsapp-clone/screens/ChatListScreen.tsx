import React from 'react'
import { View, Text, StyleSheet, Button } from 'react-native'
import { NavigationScreenProp } from 'react-navigation'

interface ChatListScreenProps {
    navigation: NavigationScreenProp<any, any>
}

const ChatListScreen = ({ navigation: { navigate } }: ChatListScreenProps) => {
    return <View style={styles.container}>
        <Text>Go to chat screen</Text>
        <Button title='Go to settings' onPress={() => navigate("ChatScreen")} />
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
