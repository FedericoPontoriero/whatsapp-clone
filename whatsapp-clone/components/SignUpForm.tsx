import React, { useCallback, useReducer } from 'react'
import { Feather, FontAwesome } from '@expo/vector-icons'

import SubmitButton from '../components/SubmitButton'
import Input from '../components/Input'
import { validateInput } from '../utils/actions/formActions'
import { FormState, reducer } from '../utils/reducers/formReducer'

const initialState: FormState = {
    inputValidities: {
        firstName: false,
        lastName: false,
        email: false,
        password: false,
    },
    formIsValid: false
}

const SignUpForm = () => {
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
                id='firstName'
                label="First name"
                icon="user-o"
                autoCapitalize='none'
                iconPack={FontAwesome}
                errorText={formState.inputValidities['firstName']}
                onInputChanged={inputChangedHandler} />
            <Input
                id='lastName'
                label="Last name"
                icon="user-o"
                iconPack={FontAwesome}
                autoCapitalize='none'
                errorText={formState.inputValidities['lastName']}
                onInputChanged={inputChangedHandler} />
            <Input
                id='email'
                label="Email"
                icon="mail"
                iconPack={Feather}
                autoCapitalize='none'
                keyboardType="email-address"
                errorText={formState.inputValidities['email']}
                onInputChanged={inputChangedHandler} />
            <Input
                id='password'
                secureTextEntry
                label="Password"
                icon="lock"
                autoCapitalize="none"
                iconPack={Feather}
                errorText={formState.inputValidities['password']}
                onInputChanged={inputChangedHandler} />
            <SubmitButton
                title="Sign up"
                disabled={!formState.formIsValid}
                onPress={() => { }}
                style={{ marginTop: 20 }} />
        </>
    )
}

export default SignUpForm
