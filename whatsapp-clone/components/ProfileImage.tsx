import React from 'react'
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native'
import { FontAwesome } from "@expo/vector-icons"

import colors from '../constants/colors'
import { launchImagePicker } from '../utils/imagePickerHelper'

const userImage = require('../assets/userImage.jpg')

const ProfileImage = (props: any) => {
  const pickImage = () => {
    launchImagePicker()
  }

  return (
    <TouchableOpacity onPress={pickImage}>
      <Image
        source={userImage} style={{ ...styles.image, ...{ width: props.size, height: props.size } }} />
      <View style={styles.editIconContainer}>
        <FontAwesome name='pencil' size={15} color='black' />
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  image: {
    borderRadius: 50,
    borderColor: colors.grey,
    borderWidth: 1,
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.lightGrey,
    borderRadius: 20,
    padding: 8,
  }
})

export default ProfileImage
