import React, { useEffect } from 'react'
import { View, Text, StyleSheet, Button } from 'react-native'
import { NavigationScreenProp } from 'react-navigation'
import { HeaderButtons, Item } from 'react-navigation-header-buttons'
import CustomHeaderButton from '../components/CustomHeaderButton'

interface ChatListScreenProps {
  navigation: NavigationScreenProp<any, any>
}

const NewChatScreen = (props: ChatListScreenProps) => {
  useEffect(() => {
    props.navigation.setParams({
      headerLeft: () => {
        return <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
          <Item title='Close'
            onPress={() => props.navigation.goBack()} />
        </HeaderButtons>
      },
      headerTitle: "New chat"
    })
  }, [])

  return <View style={styles.container}>
    <Text>Go to chat screen</Text>
  </View>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default NewChatScreen;
