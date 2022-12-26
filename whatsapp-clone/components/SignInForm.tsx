import React from 'react'
import { Feather } from '@expo/vector-icons'

import SubmitButton from '../components/SubmitButton'
import Input from '../components/Input'

const SignInForm = () => {
    return (
        <>
            <Input label="Email" icon="mail" iconPack={Feather} />
            <Input label="Password" icon="lock" iconPack={Feather} />
            <SubmitButton title="Sign in" onPress={() => { }} style={{ marginTop: 20 }} />
        </>
    )
}

export default SignInForm
