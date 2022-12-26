import { FontAwesome } from '@expo/vector-icons'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

import Input from '../components/Input'
import PageContainer from '../components/PageContainer'

const AuthScreen = () => {
    return <SafeAreaView style={{ flex: 1 }}>
        <PageContainer>
            <Input label="First name" icon="user-o" iconPack={FontAwesome} />
        </PageContainer>
    </SafeAreaView>
}


export default AuthScreen
