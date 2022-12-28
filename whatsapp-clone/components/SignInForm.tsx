import React, { useCallback, useReducer } from 'react'
import { Feather } from '@expo/vector-icons'

import SubmitButton from '../components/SubmitButton'
import Input from '../components/Input'
import { validateInput } from '../utils/actions/formActions'
import { reducer } from '../utils/reducers/formReducer'

type FormStateSignIn = {
    inputValidities: {
        email: boolean;
        password: boolean;
    },
    formIsValid: boolean
}

const initialState: FormStateSignIn = {
    inputValidities: {
        email: false,
        password: false,
    },
    formIsValid: false
}

const SignInForm = () => {

    const [formState, dispatchFormState] = useReducer(
        reducer,
        initialState
    )

    const inputChangedHandler = useCallback((inputId: string, inputValue: string): void => {
        const result = validateInput(inputId, inputValue)
        dispatchFormState({ inputId, validationResult: result })
    }, [dispatchFormState])


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
                disabled={!formState.formIsValid}
                style={{ marginTop: 20 }}
            />
        </>
    )
}

export default SignInForm
