import { getFirebaseApp } from "../firebaseHelper"
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth'
import { child, getDatabase, ref, set } from 'firebase/database'
import { authenticate } from "../../store/authSlice"
import { AnyAction, Dispatch } from "@reduxjs/toolkit"

export const signUp = (firstName: string, lastName: string, email: string, password: string) => {
    return async (dispatch: Dispatch<AnyAction>) => {
        const app = getFirebaseApp();
        const auth = getAuth(app)

        try {
            const result = await createUserWithEmailAndPassword(auth, email, password)
            const { uid, getIdTokenResult } = result.user;

            const userData = await createUser(firstName, lastName, email, uid)

            dispatch(authenticate({ token: getIdTokenResult, userData }))

        } catch (err: any) {
            const errorCode = err.code
            let message = "Something went wrong"

            if (errorCode === "auth/email-already-in-use") {
                message = 'This email is already in use'
            }
            throw new Error(message)
        }
    }
}

const createUser = async (firstName: string, lastName: string, email: string, userId: string) => {
    const firstLast = `${firstName} ${lastName}`.toLocaleLowerCase()
    const userData = {
        firstName,
        lastName,
        firstLast,
        email,
        userId,
        signUpDate: new Date().toISOString()
    }

    const dbRef = ref(getDatabase())
    const childRef = child(dbRef, `users/${userId}`)
    await set(childRef, userData)
}
