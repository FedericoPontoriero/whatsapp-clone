import React, { useEffect } from 'react'
import { FlatList } from 'react-native'
import { useSelector } from 'react-redux'
import DataItem from '../components/DataItem'
import PageContainer from '../components/PageContainer'
import { RootState } from '../store/store'

const DataListScreen = (props) => {
  const { title, data, type, chatId } = props.route.params

  const storedUsers = useSelector<RootState>(state => state.users.storedUsers)
  const userData: any = useSelector<RootState>(state => state.auth.userData)

  useEffect(() => {
    props.navigation.setParams({ headerTitle: title })
  }, [title])

  return <PageContainer>
    <FlatList
      data={data}
      keyExtractor={item => item}
      renderItem={(itemData) => {
        let key, onPress, image, title, subTitle, itemType

        if (type === "users") {
          const uid = itemData.item
          const currentUser = storedUsers[uid]

          if (!currentUser) return;

          const isLoggedInUser = uid === userData.userId

          key = uid
          image = currentUser.profilePicture
          title = `${currentUser.firstName} ${currentUser.lastName}`
          subTitle = currentUser.about
          itemType = isLoggedInUser ? undefined : 'link'
          onPress = isLoggedInUser ? undefined : () => props.navigation.navigate("Contact", { uid, chatId })
        }

        return <DataItem
          key={key}
          onPress={onPress}
          image={image}
          title={title}
          subTitle={subTitle}
          type={itemType}
        />
      }}
    />
  </PageContainer>
}

export default DataListScreen
