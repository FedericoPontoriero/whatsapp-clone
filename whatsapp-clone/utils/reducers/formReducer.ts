export type FormState = {
    inputValues: {
        firstName: string,
        lastName: string,
        email: string,
        password: string,
    },
    inputValidities: {
        firstName: boolean,
        lastName: boolean,
        email: boolean,
        password: boolean,
    },
    formIsValid: boolean
}

export const reducer = (state: FormState, action: any) => {
    const { validationResult, inputId, inputValue } = action

    const updatedValues: any = {
        ...state.inputValues,
        [inputId]: inputValue
    }

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
        inputValues: updatedValues,
        inputValidities: updatedValidities,
        formIsValid: updatedFormIsValid
    }
}
