import React, { useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { NavigationContainerProps } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import ChatSettingsScreen from "../screens/ChatSettingsScreen";
import ChatListScreen from "../screens/ChatListScreen";
import SettingsScreen from "../screens/SettingsScreen";
import ChatScreen from "../screens/ChatScreen";
import NewChatScreen from "../screens/NewChatScreen";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { getFirebaseApp } from "../utils/firebaseHelper";
import { child, getDatabase, off, onValue, ref } from "firebase/database";
import { setChatsData } from "../store/chatSlice";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

interface MainNavigatorProps extends NavigationContainerProps { }

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{ headerTitle: "", headerShadowVisible: false }}
    >
      <Tab.Screen
        name="ChatList"
        component={ChatListScreen}
        options={{
          tabBarLabel: "Chats",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubble-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: "Settings",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const StackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Group>
        <Stack.Screen
          name="Home"
          component={TabNavigator}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="ChatSettings"
          component={ChatSettingsScreen}
          options={{
            headerTitle: "Settings",
            headerBackTitle: "Back",
          }}
        />
        <Stack.Screen
          name="ChatScreen"
          component={ChatScreen}
          options={{
            headerTitle: "",
            headerBackTitle: "Back",
          }}
        />
      </Stack.Group>

      <Stack.Group screenOptions={{ presentation: 'containedModal' }}>
        <Stack.Screen
          name="New Chat"
          component={NewChatScreen}
        />
      </Stack.Group>
    </Stack.Navigator>
  )
}

const MainNavigator = (props: MainNavigatorProps) => {
  const dispatch = useDispatch()

  const userData: any = useSelector<RootState>(state => state.auth.userData)
  const storedUsers = useSelector<RootState>(state => state.users.storedUsers)

  useEffect(() => {
    const app = getFirebaseApp()
    const dbRef = ref(getDatabase(app))
    const userChatsRef = child(dbRef, `userChats/${userData.userId}`)
    const refs: any = [userChatsRef,]

    onValue(userChatsRef, (querySnapshot) => {
      const chatIdsData = querySnapshot.val() || {}
      const chatIds = Object.values(chatIdsData)

      const chatsData = {}
      let chatsFoundCount = 0

      for (let i = 0; i < chatIds.length; ++i) {
        const chatId = chatIds[i]
        const chatRef = child(dbRef, `chats/${chatId}`)
        refs.push(chatRef)

        onValue(chatRef, (chatSnapshot) => {
          chatsFoundCount++
          const data = chatSnapshot.val()

          if (data) {
            data.key = chatSnapshot.key

            chatsData[chatSnapshot.key] = data;
          }

          if (chatsFoundCount >= chatIds.length) {
            dispatch(setChatsData({ chatsData }))
          }
        })
      }
    })

    return () => {
      refs.forEach(ref => off(refs))
    }
  }, [])

  return (
    <StackNavigator />
  );
};

export default MainNavigator;
