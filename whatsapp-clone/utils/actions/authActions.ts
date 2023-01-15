import * as Device from 'expo-device'
import * as Notifications from 'expo-notifications'
import { getFirebaseApp } from "../firebaseHelper"
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { child, getDatabase, ref, set, update } from 'firebase/database'
import { authenticate, logout } from "../../store/authSlice"
import { AnyAction, Dispatch } from "@reduxjs/toolkit"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { getUserData } from "./userActions"

let timer: ReturnType<typeof setTimeout>;

export const signUp = (firstName: string, lastName: string, email: string, password: string) => {
    return async (dispatch: Dispatch<AnyAction>) => {
        const app = getFirebaseApp();
        const auth = getAuth(app)

        try {
            const result = await createUserWithEmailAndPassword(auth, email, password)
            const { uid, getIdTokenResult } = result.user;
            const accessToken = await getIdTokenResult()
            const expiryDate = new Date(accessToken.expirationTime)
            const timeNow = new Date()
            const timeUntilExpiry = Number(expiryDate) - Number(timeNow)

            const userData = await createUser(firstName, lastName, email, uid)

            dispatch(authenticate({ token: accessToken, userData }))
            saveDataToStorage(accessToken.token, uid, expiryDate)
            await storePushToken(userData)

            timer = setTimeout(() => {
                dispatch(userLogout())
            }, timeUntilExpiry)

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

export const userLogout = (): any => {
    return async (dispatch: Dispatch<AnyAction>) => {
        AsyncStorage.clear()
        clearTimeout(timer);
        dispatch(logout(true))
    }
}

export const signIn = (email: string, password: string) => {
    return async (dispatch: Dispatch<AnyAction>) => {
        const app = getFirebaseApp();
        const auth = getAuth(app)

        try {
            const result = await signInWithEmailAndPassword(auth, email, password)
            const { uid, getIdTokenResult } = result.user;
            const accessToken = await getIdTokenResult()
            const expiryDate = new Date(accessToken.expirationTime)
            const timeNow = new Date()
            const timeUntilExpiry = Number(expiryDate) - Number(timeNow)

            const userData = await getUserData(uid)

            dispatch(authenticate({ token: accessToken, userData }))
            saveDataToStorage(accessToken.token, uid, expiryDate)
            await storePushToken(userData)

            timer = setTimeout(() => {
                dispatch(userLogout())
            }, timeUntilExpiry)

        } catch (err: any) {
            const errorCode = err.code
            let message = "Something went wrong"

            if (errorCode === "auth/wrong-password" || errorCode === "auth/user-not-found") {
                message = 'The username or password was incorrect'
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

const saveDataToStorage = (token: string, userId: string, expiryDate: Date) => {
    AsyncStorage.setItem("userData", JSON.stringify({
        token,
        userId,
        expiryDate
    }))
}

export const updateSignedInUserData = async (userId: string, newData: any) => {
    if (newData.firtsName && newData.lastName) {
        const firstLast = `${newData.firstName} ${newData.lastName}`.toLocaleLowerCase()
        newData.firstLast = firstLast
    }

    const dbRef = ref(getDatabase())
    const childRef = child(dbRef, `users/${userId}`)
    await update(childRef, newData)
}

const storePushToken = async (userData) => {
    if (!Device.isDevice) {
        return;
    }

    const token = (await Notifications.getExpoPushTokenAsync()).data;

    const tokenData = userData.pushTokens || {};
    const tokenArray = Object.values(tokenData)

    if (tokenArray.includes(token)) return;

    tokenArray.push(token)

    for (let i = 0; i < tokenArray.length; ++i) {
        const tok = tokenArray[i]
        tokenData[i] = tok
    }

    const app = getFirebaseApp()
    const dbRef = ref(getDatabase(app))
    const userRef = child(dbRef, `users/${userData.userId}/pushTokens`)

    await set(userRef, tokenData)
}
