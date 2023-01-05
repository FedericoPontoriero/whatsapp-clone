import React from 'react'
import { StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native'

import colors from '../constants/colors'

interface BubbleProps {
  text: string
  types: "system" | "error" | "myMessage" | "theirMessage" | string
}

const Bubble = (props: BubbleProps) => {
  const { text, types } = props;

  const bubbleStyle: StyleProp<ViewStyle> = { ...styles.container }
  const wrapperStyle: StyleProp<ViewStyle> = { ...styles.wrapperStyle }
  const textStyle: StyleProp<TextStyle> = { ...styles.text }

  switch (types) {
    case "system":
      textStyle.color = '#65644A'
      bubbleStyle.backgroundColor = colors.beige
      bubbleStyle.alignItems = 'center'
      bubbleStyle.marginTop = 10
      break

    case "error":
      bubbleStyle.backgroundColor = colors.red
      textStyle.color = "white"
      bubbleStyle.marginTop = 10
      break

    case "myMessage":
      wrapperStyle.justifyContent = 'flex-end'
      bubbleStyle.backgroundColor = '#E7FED6'
      bubbleStyle.maxWidth = '90%'
      break

    default:
      break
  }

  return (
    <View style={wrapperStyle}>
      <View style={bubbleStyle}>
        <Text style={textStyle}>{text}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapperStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  text: {
    fontFamily: 'regular',
    letterSpacing: 0.3,
  },
  container: {
    backgroundColor: 'white',
    borderRadius: 6,
    padding: 5,
    marginBottom: 10,
    borderColor: '#E2DACC',
    borderWidth: 1,
  },
})

export default Bubble
