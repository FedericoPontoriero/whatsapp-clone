import React from 'react'
import { Feather, FontAwesome } from '@expo/vector-icons'

import SubmitButton from '../components/SubmitButton'
import Input from '../components/Input'
import { validateEmail, validatePassword, validateString } from '../utils/validationConstraints'
import { validateInput } from '../utils/actions/formActions'

const SignUpForm = () => {
    const inputChangedHandler = (inputId: string, inputValue: string): void => {
        validateInput(inputId, inputValue)
    }

    return (
        <>
            <Input
                id='firstName'
                label="First name"
                icon="user-o"
                autoCapitalize='none'
                iconPack={FontAwesome}
                onInputChanged={inputChangedHandler} />
            <Input
                id='lastName'
                label="Last name"
                icon="user-o"
                iconPack={FontAwesome}
                autoCapitalize='none'
                onInputChanged={inputChangedHandler} />
            <Input
                id='email'
                label="Email"
                icon="mail"
                iconPack={Feather}
                autoCapitalize='none'
                keyboardType="email-address"
                onInputChanged={inputChangedHandler} />
            <Input
                id='password'
                secureTextEntry
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
