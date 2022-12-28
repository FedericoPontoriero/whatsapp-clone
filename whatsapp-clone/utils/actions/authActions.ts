import { getFirebaseApp } from "../firebaseHelper"
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth'

export const signUp = async (firstName: string, lastName: string, email: string, password: string) => {
    const app = getFirebaseApp();
    const auth = getAuth(app)

    try {
        const result = await createUserWithEmailAndPassword(auth, email, password)
    } catch (err) {
        console.error(err);
    }
}
