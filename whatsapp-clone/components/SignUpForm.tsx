import React from 'react'
import { Feather, FontAwesome } from '@expo/vector-icons'

import SubmitButton from '../components/SubmitButton'
import Input from '../components/Input'
import { validateEmail, validatePassword, validateString } from '../utils/validationConstraints'

const SignUpForm = () => {
    const inputChangedHandler = (inputId: string, inputValue: string): void => {
        if (inputId === "firstName" || inputId === 'lastName') {
            validateString(inputId, inputValue)
        } else if (inputId === 'email') {
            validateEmail(inputId, inputValue)
        } else if (inputId === 'password') {
            validatePassword(inputId, inputValue)
        }
    }

    return (
        <>
            <Input
                id='firstName'
                label="First name"
                icon="user-o"
                iconPack={FontAwesome}
                onInputChanged={inputChangedHandler} />
            <Input
                id='lastName'
                label="Last name"
                icon="user-o"
                iconPack={FontAwesome}
                onInputChanged={inputChangedHandler} />
            <Input
                id='email'
                label="Email"
                icon="mail"
                iconPack={Feather}
                onInputChanged={inputChangedHandler} />
            <Input
                id='password'
                label="Password"
                icon="lock"
                autoCapitalize="none"
                iconPack={Feather}
                onInputChanged={inputChangedHandler} />
            <SubmitButton
                title="Sign up"
                onPress={() => { }}
                style={{ marginTop: 20 }} />
        </>
    )
}

export default SignUpForm
