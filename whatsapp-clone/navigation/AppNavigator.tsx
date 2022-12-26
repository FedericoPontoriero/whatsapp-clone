import React from 'react'
import { NavigationContainer } from "@react-navigation/native";

import MainNavigator from './MainNavigator';
import AuthScreen from '../screens/AuthScreen';

const AppNavigator = (props: any) => {
    const isAuth = false;

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
