import React from 'react'
import { NavigationContainer } from "@react-navigation/native";

import MainNavigator from './MainNavigator';
import AuthScreen from '../screens/AuthScreen';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

const AppNavigator = (props: any) => {
  const isAuth = useSelector((state: RootState) => state.auth.token !== null && state.auth.token !== "")

  return (
    <NavigationContainer>
      {isAuth &&
        <MainNavigator children={""} />
      }
      {!isAuth &&
        <AuthScreen />
      }
    </NavigationContainer>
  )
}

export default AppNavigator
