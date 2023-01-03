import { FontAwesome } from '@expo/vector-icons'
import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ActivityIndicator, TextInput, FlatList } from 'react-native'
import { NavigationScreenProp } from 'react-navigation'
import { HeaderButtons, Item } from 'react-navigation-header-buttons'
import { useSelector } from 'react-redux'

import CustomHeaderButton from '../components/CustomHeaderButton'
import DataItem from '../components/DataItem'
import PageContainer from '../components/PageContainer'
import colors from '../constants/colors'
import commonStyles from '../constants/commonStyles'
import { RootState } from '../store/store'
import { searchUsers } from '../utils/actions/userActions'

interface ChatListScreenProps {
  navigation: NavigationScreenProp<any, any>
}

const NewChatScreen = (props: ChatListScreenProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [users, setUsers] = useState<any>()
  const [noResultsFound, setNoResultsFound] = useState<boolean>(false)
  const [searchTerm, setSearchTerm] = useState<string>('')

  const userData = useSelector((state: RootState) => state.auth.userData);

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
      else setNoResultsFound(false)

      setIsLoading(false)

    }, 500)

    return () => clearTimeout(delaySearch)
  }, [searchTerm])

  const userPressed = userId => {
    props.navigation.navigate("ChatList", {
      selectedUserId: userId
    })
  }

  return <PageContainer>
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
          return <DataItem
            onPress={() => userPressed(userId)}
            title={`${userData.firstName} ${userData.lastName}`}
            subTitle={userData.about}
            image={userData.profilePicture}
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
});

export default NewChatScreen;
