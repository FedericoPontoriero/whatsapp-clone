import { AntDesign, Ionicons } from '@expo/vector-icons'
import React from 'react'
import { StyleSheet, Text, TouchableOpacityProps, TouchableWithoutFeedback, View } from 'react-native'
import colors from '../constants/colors'
import ProfileImage from './ProfileImage'

interface DataItemProps extends TouchableOpacityProps {
  title: string
  subTitle?: string
  image?: string
  type?: string
  isChecked?: boolean
  onPress?: () => void
  icon?: any
}

const imageSize = 40

const DataItem = (props: DataItemProps) => {
  const { title, subTitle, image, type, isChecked, icon } = props;

  return (
    <TouchableWithoutFeedback onPress={props.onPress}>
      <View style={styles.container}>
        {
          !icon &&
          <ProfileImage
            showEditButton={false}
            uri={image}
            size={imageSize}
          />
        }

        {
          icon &&
          <View style={styles.leftIconContainer}>
            <AntDesign name={icon} size={20} color={colors.blue} />
          </View>
        }
        <View style={styles.textContainer}>
          <Text style={{ ...styles.title, ...{ color: type === "button" ? colors.blue : colors.textColor } }}
            numberOfLines={1}
          >
            {title}
          </Text>
          {subTitle &&
            <Text style={styles.subTitle}
              numberOfLines={1}
            >
              {subTitle}
            </Text>
          }
        </View>

        {
          type === "checkbox" &&
          <View style={{ ...styles.iconContainer, ...isChecked && styles.checkedStyle }}>
            <Ionicons name="checkmark" size={18} color="white" />
          </View>
        }

        {
          type === "link" &&
          <View>
            <Ionicons name="chevron-forward-outline" size={18} color={colors.grey} />
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
  leftIconContainer: {
    backgroundColor: colors.extraLightGrey,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    width: imageSize,
    height: imageSize,
  },
})

export default DataItem
