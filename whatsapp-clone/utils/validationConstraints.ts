import { validate } from "validate.js"

export const validateString = (id: string, value: string) => {
    const constraints = {
        presence: { allowEmpty: false },
        format: {}
    }
    if (value !== "") {
        constraints.format = {
            pattern: "[a-z]+",
            flags: "i",
            message: "value can only contain letters"
        }
    }
    const validationResult = validate({ [id]: value }, { [id]: constraints })

    return validationResult && validationResult[id]
}

export const validateEmail = (id: string, value: string) => {
    const constraints = {
        presence: { allowEmpty: false },
        email: false
    }
    if (value !== "") {
        constraints.email == true
    }
    const validationResult = validate({ [id]: value }, { [id]: constraints })

    return validationResult && validationResult[id]
}


export const validatePassword = (id: string, value: string) => {
    const constraints = {
        presence: { allowEmpty: false },
        length: {}
    }
    if (value !== "") {
        constraints.length = {
            minimum: 6,
            message: "must be at least 6 characters"
        }
    }
    const validationResult = validate({ [id]: value }, { [id]: constraints })

    return validationResult && validationResult[id]
}
