import React, { useReducer } from 'react'
import { Feather, FontAwesome } from '@expo/vector-icons'

import SubmitButton from '../components/SubmitButton'
import Input from '../components/Input'
import { validateInput } from '../utils/actions/formActions'

type FormState = {
    inputValidities: {
        firstName: boolean,
        lastName: boolean,
        email: boolean,
        password: boolean,
    },
    formIsValid: boolean
}


const reducer = (state: FormState, action: any) => {
    const { validationResult, inputId } = action

    const updatedValidities: any = {
        ...state.inputValidities,
        [inputId]: validationResult
    }

    let updatedFormIsValid = true;

    for (const key in updatedValidities) {
        if (updatedValidities[key] !== undefined) {
            updatedFormIsValid = false;
            break
        }
    }

    return {
        inputValidities: updatedValidities,
        formIsValid: updatedFormIsValid
    }
}

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
    const inputChangedHandler = (inputId: string, inputValue: string): void => {
        const result = validateInput(inputId, inputValue)
        dispatchFormState({ inputId, validationResult: result })
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
                disabled={!formState.formIsValid}
                onPress={() => { }}
                style={{ marginTop: 20 }} />
        </>
    )
}

export default SignUpForm
