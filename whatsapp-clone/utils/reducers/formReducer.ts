export type FormState = {
    inputValidities: {
        firstName: boolean,
        lastName: boolean,
        email: boolean,
        password: boolean,
    },
    formIsValid: boolean
}

export const reducer = (state: FormState, action: any) => {
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
