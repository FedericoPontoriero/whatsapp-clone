import { initializeApp } from "firebase/app";

export const getFirebaseApp = () => {
    const firebaseConfig = {
        apiKey: "AIzaSyAbcsFoiZA19WFBXNq1UbZzXMEnRxPacj4",
        authDomain: "whatsapp-clone-47a6c.firebaseapp.com",
        projectId: "whatsapp-clone-47a6c",
        storageBucket: "whatsapp-clone-47a6c.appspot.com",
        messagingSenderId: "9971032009",
        appId: "1:9971032009:web:6d834961791629507e1218",
    };

    return initializeApp(firebaseConfig);

}
