import React, { useCallback, useState } from 'react'
import { View, StyleSheet, ImageBackground, ImageSourcePropType, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons'

import colors from '../constants/colors';
import { RouteProp } from '@react-navigation/native';
const backgroundImage: ImageSourcePropType = require("../assets/droplet.jpg");

interface ChatScreenProps {
    route: RouteProp<{ params: { newChatData: string } }>
}
const ChatScreen = (props: ChatScreenProps) => {
    const [messageText, setMessageText] = useState("")

    const chatData = props.route?.params?.newChatData

    const sendMessage = useCallback(() => {
        setMessageText("")
    }, [messageText])

    return (
        <SafeAreaView edges={['right', 'left', 'bottom']} style={styles.container}>
            <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={100}>
                <ImageBackground style={styles.backgroundImage} source={backgroundImage}>

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
