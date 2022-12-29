import React from 'react'
import { NavigationContainer } from "@react-navigation/native";

import MainNavigator from './MainNavigator';
import AuthScreen from '../screens/AuthScreen';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import StartUpScreen from '../screens/StartUpScreen';

const AppNavigator = () => {
  const isAuth = useSelector((state: RootState) => state.auth.token !== null && state.auth.token !== "")
  const didTryAutoLogin = useSelector((state: RootState) => state.auth.didTryAutoLogin)

  return (
    <NavigationContainer>
      {isAuth &&
        <MainNavigator children={""} />
      }
      {!isAuth && didTryAutoLogin &&
        <AuthScreen />
      }
      {!isAuth && !didTryAutoLogin &&
        <StartUpScreen />
      }
    </NavigationContainer>
  )
}

export default AppNavigator
