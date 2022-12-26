import React from 'react'
import { Feather, FontAwesome } from '@expo/vector-icons'

import SubmitButton from '../components/SubmitButton'
import Input from '../components/Input'

const SignUpForm = (props: any) => {
    const inputChangedHandler = (inputId: number, inputValue: string): void => {
        console.log('input');
    }

    return (
        <>
            <Input id='firstName' label="First name" icon="user-o" iconPack={FontAwesome} onInputChanged={inputChangedHandler} />
            <Input id='lastName' label="Last name" icon="user-o" iconPack={FontAwesome} onInputChanged={inputChangedHandler} />
            <Input id='email' label="Email" icon="mail" iconPack={Feather} onInputChanged={inputChangedHandler} />
            <Input id='password' label="Password" icon="lock" iconPack={Feather} onInputChanged={inputChangedHandler} />
            <SubmitButton title="Sign up" onPress={() => { }} style={{ marginTop: 20 }} />
        </>
    )
}

export default SignUpForm
