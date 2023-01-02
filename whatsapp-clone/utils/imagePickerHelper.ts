import * as ImagePicker from 'expo-image-picker'
import { Platform } from 'react-native'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import uuid from 'react-native-uuid'

import { getFirebaseApp } from './firebaseHelper';

export const launchImagePicker = async () => {
  await checkMediaPermissions();
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 1,
  })

  if (!result.canceled) {
    return result.uri
  }
}

export const uploadImageAsync = async (uri: string) => {
  const app = getFirebaseApp();
  const blob: Blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response)
    };

    xhr.onerror = function (e) {
      console.log(e);
      reject(new TypeError("Network request failed"))
    };

    xhr.responseType = "blob"
    xhr.open("GET", uri, true)
    xhr.send()
  })

  const pathFolder = 'profilePics'
  const storageRef = ref(getStorage(app), `${pathFolder}/${uuid.v4()}`)

  await uploadBytesResumable(storageRef, blob)

  return await getDownloadURL(storageRef)
}

const checkMediaPermissions = async () => {
  if (Platform.OS !== 'web') {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (permissionResult.granted === false) return Promise.reject('We need permission to access you photos')
  }

  return Promise.resolve()
}
