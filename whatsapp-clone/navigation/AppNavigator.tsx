import React from 'react'
import { NavigationContainer } from "@react-navigation/native";

import MainNavigator from './MainNavigator';

const AppNavigator = (props: any) => {
    return (
        <NavigationContainer>
            <MainNavigator children={""} />
        </NavigationContainer>
    )
}

export default AppNavigator
