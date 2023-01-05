import React, { useRef } from 'react'
import { StyleProp, StyleSheet, Text, TextStyle, TouchableWithoutFeedback, View, ViewStyle } from 'react-native'
import { Menu, MenuOption, MenuOptions, MenuTrigger } from 'react-native-popup-menu'
import uuid from 'react-native-uuid'
import * as Clipboard from 'expo-clipboard'

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

  const menuRef = useRef(null)
  const id = useRef(uuid.v4())

  let Container: any = View

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
      Container = TouchableWithoutFeedback
      break

    case "theirMessage":
      wrapperStyle.justifyContent = 'flex-start'
      bubbleStyle.maxWidth = '90%'
      Container = TouchableWithoutFeedback
      break

    default:
      break
  }

  const copyToClipboard = async (text: string) => {
    try {
      await Clipboard.setStringAsync(text)
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <View style={wrapperStyle}>
      <Container style={{ width: '100%' }} onLongPress={() => { menuRef.current.props.ctx.menuActions.openMenu(id.current) }}>
        <View style={bubbleStyle}>
          <Text style={textStyle}>{text}</Text>
          <Menu ref={menuRef} name={String(id.current)}>
            <MenuTrigger />
            <MenuOptions>
              <MenuOption text='Copy to clipboard' onSelect={() => copyToClipboard(text)} />
              <MenuOption text='Option 2' />
              <MenuOption text='Option 3' />
            </MenuOptions>
          </Menu>
        </View>
      </Container>
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
