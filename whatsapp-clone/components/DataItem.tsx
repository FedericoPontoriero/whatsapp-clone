import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { StyleSheet, Text, TouchableOpacityProps, TouchableWithoutFeedback, View } from 'react-native'
import colors from '../constants/colors'
import ProfileImage from './ProfileImage'

interface DataItemProps extends TouchableOpacityProps {
  title: string
  subTitle: string
  image: string
  type?: string
  isChecked?: boolean
  onPress?: () => void
}

const DataItem = (props: DataItemProps) => {
  const { title, subTitle, image, type, isChecked } = props;

  return (
    <TouchableWithoutFeedback onPress={props.onPress}>
      <View style={styles.container}>
        <ProfileImage
          showEditButton={false}
          uri={image}
          size={40}
        />
        <View style={styles.textContainer}>
          <Text style={styles.title}
            numberOfLines={1}
          >
            {title}
          </Text>
          <Text style={styles.subTitle}
            numberOfLines={1}
          >
            {subTitle}
          </Text>
        </View>

        {
          type === "checkbox" &&
          <View style={{ ...styles.iconContainer, ...isChecked && styles.checkedStyle }}>
            <Ionicons name="checkmark" size={18} color="white" />
          </View>
        }

      </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 7,
    borderBottomColor: colors.extraLightGrey,
    borderBottomWidth: 1,
    alignItems: 'center',
    minHeight: 50,
  },
  textContainer: {
    marginLeft: 14,
  },
  title: {
    fontFamily: 'medium',
    fontSize: 16,
    letterSpacing: 0.3,
  },
  subTitle: {
    fontFamily: 'regular',
    color: colors.grey,
    letterSpacing: 0.3,
  },
  iconContainer: {
    borderWidth: 1,
    borderRadius: 50,
    borderColor: colors.lightGrey,
    backgroundColor: 'white',
  },
  checkedStyle: {
    backgroundColor: colors.primary,
    borderColor: 'transparent',
  },
})

export default DataItem
