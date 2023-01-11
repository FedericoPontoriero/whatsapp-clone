import { FontAwesome } from '@expo/vector-icons'
import { RouteProp } from '@react-navigation/native'
import { off } from 'firebase/database'
import React, { useEffect, useRef, useState } from 'react'
import { View, Text, StyleSheet, ActivityIndicator, TextInput, FlatList } from 'react-native'
import { NavigationScreenProp } from 'react-navigation'
import { HeaderButtons, Item } from 'react-navigation-header-buttons'
import { useDispatch, useSelector } from 'react-redux'

import CustomHeaderButton from '../components/CustomHeaderButton'
import DataItem from '../components/DataItem'
import PageContainer from '../components/PageContainer'
import ProfileImage from '../components/ProfileImage'
import colors from '../constants/colors'
import commonStyles from '../constants/commonStyles'
import { RootState } from '../store/store'
import { setStoredUsers } from '../store/userSlice'
import { searchUsers } from '../utils/actions/userActions'

interface ChatListScreenProps {
  navigation: NavigationScreenProp<any, any>
  route: RouteProp<any, any>
}

const NewChatScreen = (props: ChatListScreenProps) => {
  const dispatch = useDispatch()

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [users, setUsers] = useState<any>()
  const [noResultsFound, setNoResultsFound] = useState<boolean>(false)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [chatName, setChatName] = useState('')
  const [selectedUsers, setSelectedUsers] = useState([])

  const userData = useSelector((state: RootState) => state.auth.userData);
  const storedUsers = useSelector<RootState>(state => state.users.storedUsers)

  const selectedUsersFlatList: any = useRef()

  const chatId = props.route.params && props.route.params.chatId
  const isNewChat = !chatId
  const existingUsers = props.route.params && props.route.params.existingUsers
  const isGroupChat = props.route.params && props.route.params.isGroupChat
  const isGroupChatDisabled = selectedUsers.length === 0 || (isNewChat && chatName === '')


  useEffect(() => {
    props.navigation.setParams({
      headerLeft: () => {
        return <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
          <Item title='Close'
            onPress={() => props.navigation.goBack()} />
        </HeaderButtons>
      },
      headerRight: () => {
        return <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
          {isGroupChat &&
            <Item title={isNewChat ? 'Create' : 'Add'}
              disabled={isGroupChatDisabled}
              color={isGroupChatDisabled ? colors.lightGrey : undefined}
              onPress={() => {
                const screenName = isNewChat ? "ChatList" : "ChatSettings"
                props.navigation.navigate(screenName, {
                  selectedUsers,
                  chatName,
                  chatId,
                })
              }} />
          }
        </HeaderButtons>
      },
      headerTitle: isGroupChat ? "Add participants" : "New Chat"
    })
  }, [chatName, selectedUsers])

  useEffect(() => {
    const delaySearch = setTimeout(async () => {
      if (!searchTerm || searchTerm === '') {
        setUsers(null);
        setNoResultsFound(false);
        return;
      }
      setIsLoading(true);

      const usersResult = await searchUsers(searchTerm)
      delete usersResult[userData.userId]
      setUsers(usersResult)

      if (Object.keys(usersResult).length === 0) setNoResultsFound(true)
      else {
        setNoResultsFound(false)
        dispatch(setStoredUsers({ newUsers: usersResult }))
      }

      setIsLoading(false)

    }, 500)

    return () => clearTimeout(delaySearch)
  }, [searchTerm])

  const userPressed = userId => {
    if (isGroupChat) {
      const newSelectedUsers = selectedUsers.includes(userId) ?
        selectedUsers.filter(id => id !== userId) :
        selectedUsers.concat(userId)

      setSelectedUsers(newSelectedUsers)
    } else {
      props.navigation.navigate("ChatList", {
        selectedUserId: userId
      })
    }
  }

  return <PageContainer>

    {
      isNewChat && isGroupChat &&
      <View style={styles.chatNameContainer}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textbox}
            placeholder="Enter a name for your chat"
            autoCorrect={false}
            onChangeText={text => setChatName(text)}
            autoComplete={"off"} />
        </View>
      </View>
    }

    {isGroupChat &&
      <View style={styles.selectedUsersContainer}>
        <FlatList
          style={styles.selectedUsersList}
          contentContainerStyle={{ alignItems: 'center' }}
          ref={ref => selectedUsersFlatList.current = ref}
          onContentSizeChange={() => selectedUsersFlatList.current.scrollToEnd()}
          data={selectedUsers}
          keyExtractor={item => item}
          horizontal={true}
          renderItem={itemData => {
            const userId = itemData.item
            const userData = storedUsers[userId]
            return <ProfileImage size={40}
              style={styles.selectedUserStyle}
              uri={userData.profilePicture}
              showEditButton={false}
              onPress={() => userPressed(userId)}
              showRemoveButton={true}
            />
          }}
        />
      </View>
    }

    <View style={styles.searchContainer}>
      <FontAwesome name="search" size={15} color={colors.lightGrey} />
      <TextInput
        placeholder='Search'
        style={styles.searchBox}
        onChangeText={(text) => setSearchTerm(text)} />
    </View>
    {
      isLoading &&
      <View style={commonStyles.center}>
        <ActivityIndicator size={'large'} color={colors.primary} />
      </View>
    }

    {
      !isLoading && !noResultsFound && users &&
      <FlatList
        data={Object.keys(users)}
        renderItem={(itemData) => {
          const userId = itemData.item
          const userData = users[userId]

          if (existingUsers && existingUsers.includes(userId)) {
            return;
          }

          return <DataItem
            onPress={() => userPressed(userId)}
            title={`${userData.firstName} ${userData.lastName}`}
            subTitle={userData.about}
            image={userData.profilePicture}
            type={isGroupChat ? "checkbox" : ""}
            isChecked={selectedUsers.includes(userId)}
          />
        }}
      />
    }

    {
      !isLoading && !users && (
        <View style={commonStyles.center}>
          <FontAwesome name='users' size={55} color={colors.lightGrey} style={styles.noResultsIcon} />
          <Text style={styles.noResultsText}>Enter a name to search for a user</Text>
        </View>
      )
    }

    {
      !isLoading && !noResultsFound && (
        <View style={commonStyles.center}>
          <FontAwesome name='question' size={55} color={colors.lightGrey} style={styles.noResultsIcon} />
          <Text style={styles.noResultsText}>No users found!</Text>
        </View>
      )
    }
  </PageContainer>
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.extraLightGrey,
    height: 30,
    marginVertical: 8,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 5,
  },
  searchBox: {
    marginLeft: 8,
    fontSize: 15,
    width: '100%',
  },
  noResultsIcon: {
    marginBottom: 20,
  },
  noResultsText: {
    color: colors.textColor,
    fontFamily: 'regular',
    letterSpacing: 0.3,
  },
  chatNameContainer: {
    paddingVertical: 10,
  },
  inputContainer: {
    width: '100%',
    paddingHorizontal: 10,
    paddingVertical: 15,
    backgroundColor: colors.nearlyWhite,
    flexDirection: 'row',
    borderRadius: 2,
  },
  textbox: {
    color: colors.textColor,
    width: '100%',
    fontFamily: 'regular',
    letterSpacing: 0.3,
  },
  selectedUsersContainer: {
    height: 50,
    justifyContent: 'center',
  },
  selectedUsersList: {
    height: '100%',
    paddingTop: 10,
  },
  selectedUserStyle: {
    marginRight: 10,
    marginBottom: 10,
  },
});

export default NewChatScreen;
