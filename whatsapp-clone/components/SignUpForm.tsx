import React from 'react'
import { Feather, FontAwesome } from '@expo/vector-icons'

import SubmitButton from '../components/SubmitButton'
import Input from '../components/Input'

const SignUpForm = (props: any) => {
    return (
        <>
            <Input label="First name" icon="user-o" iconPack={FontAwesome} />
            <Input label="Last name" icon="user-o" iconPack={FontAwesome} />
            <Input label="Email" icon="mail" iconPack={Feather} />
            <Input label="Password" icon="lock" iconPack={Feather} />
            <SubmitButton title="Sign up" onPress={() => { }} style={{ marginTop: 20 }} />
        </>
    )
}

export default SignUpForm
