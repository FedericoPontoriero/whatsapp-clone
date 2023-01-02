import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { NavigationContainerProps } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import ChatSettingsScreen from "../screens/ChatSettingsScreen";
import ChatListScreen from "../screens/ChatListScreen";
import SettingsScreen from "../screens/SettingsScreen";
import ChatScreen from "../screens/ChatScreen";
import NewChatScreen from "../screens/NewChatScreen";

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

const MainNavigator = (props: MainNavigatorProps) => {
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
  );
};

export default MainNavigator;
