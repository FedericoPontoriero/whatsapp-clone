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
    return validate({ [id]: value }, { [id]: constraints })
}
