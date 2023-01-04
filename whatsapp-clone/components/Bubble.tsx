import React from 'react'
import { StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native'

import colors from '../constants/colors'

interface BubbleProps {
  text: string
  types: "system"
}

const Bubble = (props: BubbleProps) => {
  const { text, types } = props;

  const bubbleStyle: StyleProp<ViewStyle> = { ...styles.container }
  const textStyle: StyleProp<TextStyle> = { ...styles.text }

  switch (types) {
    case "system":
      textStyle.color = '#65644A'
      bubbleStyle.backgroundColor = colors.beige
      bubbleStyle.alignItems = 'center'
      bubbleStyle.marginTop = 10
      break

    default:
      break
  }

  return (
    <View style={styles.wrapperStyle}>
      <View style={styles.container}>
        <Text style={styles.text}>{text}</Text>
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
