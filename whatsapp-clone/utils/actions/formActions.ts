import { validateString, validateEmail, validatePassword, validateLength } from '../validationConstraints'

export const validateInput = (inputId: string, inputValue: string) => {
    if (inputId === "firstName" || inputId === 'lastName') {
        return validateString(inputId, inputValue)
    } else if (inputId === 'email') {
        return validateEmail(inputId, inputValue)
    } else if (inputId === 'password') {
        return validatePassword(inputId, inputValue)
    } else if (inputId === 'about') {
        return validateLength(inputId, inputValue, 0, 150, true)
    }
}
