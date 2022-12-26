import { Feather, FontAwesome } from '@expo/vector-icons'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

import Input from '../components/Input'
import PageContainer from '../components/PageContainer'
import SubmitButton from '../components/SubmitButton'

const AuthScreen = () => {
    return <SafeAreaView style={{ flex: 1 }}>
        <PageContainer>
            <Input label="First name" icon="user-o" iconPack={FontAwesome} />
            <Input label="Last name" icon="user-o" iconPack={FontAwesome} />
            <Input label="Email" icon="mail" iconPack={Feather} />
            <Input label="Password" icon="lock" iconPack={Feather} />
            <SubmitButton title="Sign up" onPress={() => { }} style={{ marginTop: 20 }} />
        </PageContainer>
    </SafeAreaView>
}


export default AuthScreen
