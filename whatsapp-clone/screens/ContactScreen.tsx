import React, { useCallback, useEffect, useState } from 'react'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import { useSelector } from 'react-redux'
import DataItem from '../components/DataItem'
import PageContainer from '../components/PageContainer'
import { PageTitle } from '../components/PageTitle'
import ProfileImage from '../components/ProfileImage'
import SubmitButton from '../components/SubmitButton'
import colors from '../constants/colors'
import { RootState } from '../store/store'
import { removeUserFromChat } from '../utils/actions/chatActions'
import { getUserChats } from '../utils/actions/userActions'

const ContactScreen = (props) => {
  const storedUsers = useSelector<RootState>(state => state.users.storedUsers)
  const userData = useSelector<RootState>(state => state.auth.userData)
  const storedChats = useSelector<RootState>(state => state.chats.chatsData)

  const [commonChats, setCommonChats] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const currentUser = storedUsers[props.route.params.uid]
  const chatId = props.route.params.chatId
  const chatData = chatId && storedChats[chatId]

  useEffect(() => {
    const getCommonUserChats = async () => {
      const currentUserChats = await getUserChats(currentUser.userId)
      setCommonChats(
        Object.values(currentUserChats).filter((cid: string) => storedChats[cid] && storedChats[cid].isGroupChat)
      )
    }

    getCommonUserChats()
  }, [])

  const removeFromChat = useCallback(async () => {
    try {
      setIsLoading(true)

      await removeUserFromChat(userData, currentUser, chatData)

      props.navigation.goBack()
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false)
    }
  }, [props.navigation, isLoading])

  return <PageContainer>
    <View style={styles.topContainer}>
      <ProfileImage
        showEditButton={false}
        uri={currentUser.profilePicture}
        size={80}
        style={{ marginBottom: 20 }}
      />

      <PageTitle text={`${currentUser.firstName} ${currentUser.lastName}`} />

      {
        currentUser.about &&
        <Text numberOfLines={2} style={styles.about}>{currentUser.about}</Text>
      }

    </View>

    {
      commonChats.length > 0 &&
      <>
        <Text style={styles.heading}>{commonChats.length} {commonChats.length === 1 ? "Group" : "Groups"} in common</Text>

        {
          commonChats.map((cid) => {
            const chatData = storedChats[cid]
            return <DataItem
              key={cid}
              title={chatData.chatName}
              subTitle={chatData.latestMessageText}
              type='link'
              onPress={() => props.navigation.push("ChatScreen", { chatId: cid })}
              image={chatData.chatImage}
            />
          })
        }

      </>
    }

    {
      chatData && chatData.isGroupChat &&
        isLoading ?
        <ActivityIndicator size={'small'} color={colors.primary} /> :
        <SubmitButton
          title='Remove from chat'
          onPress={removeFromChat}
          color={colors.red}
        />
    }

  </PageContainer>
}

const styles = StyleSheet.create({
  topContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  about: {
    fontFamily: 'medium',
    fontSize: 16,
    letterSpacing: 0.3,
    color: colors.grey,
  },
  heading: {
    fontFamily: 'bold',
    letterSpacing: 0.3,
    color: colors.textColor,
    marginVertical: 8,
  },
})

export default ContactScreen
