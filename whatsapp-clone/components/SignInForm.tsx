import React from 'react'
import { Feather } from '@expo/vector-icons'

import SubmitButton from '../components/SubmitButton'
import Input from '../components/Input'
import { validateInput } from '../utils/actions/formActions'

const SignInForm = () => {
    const inputChangedHandler = (inputId: string, inputValue: string): void => {
        validateInput(inputId, inputValue)
    }

    return (
        <>
            <Input
                id='email'
                label="Email"
                icon="mail"
                autoCapitalize='none'
                keyboardType='email-address'
                iconPack={Feather}
                onInputChanged={inputChangedHandler}
            />
            <Input
                id='password'
                label="Password"
                icon="lock"
                iconPack={Feather}
                autoCapitalize='none'
                secureTextEntry
                onInputChanged={inputChangedHandler}
            />
            <SubmitButton
                title="Sign in"
                onPress={() => { }}
                style={{ marginTop: 20 }}
            />
        </>
    )
}

export default SignInForm
