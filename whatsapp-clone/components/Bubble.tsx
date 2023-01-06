import React, { useRef } from 'react'
import { StyleProp, StyleSheet, Text, TextStyle, TouchableWithoutFeedback, View, ViewStyle } from 'react-native'
import { Menu, MenuOption, MenuOptions, MenuTrigger } from 'react-native-popup-menu'
import uuid from 'react-native-uuid'
import * as Clipboard from 'expo-clipboard'

import colors from '../constants/colors'
import { Feather, FontAwesome } from '@expo/vector-icons'
import { starMessage } from '../utils/actions/chatActions'
import { useSelector } from 'react-redux'
import { RootState } from '../store/store'

interface BubbleProps {
  text: string
  types: "system" | "error" | "myMessage" | "theirMessage" | string
  messageId?: string
  userId?: string
  chatId?: string
  date?: string
}

function formatAmPm(dateString: string) {
  const date = new Date(dateString)
  let hours = date.getHours()
  let minutes: string | number = date.getMinutes()
  const ampm = hours <= 12 ? 'pm' : 'am'
  hours = hours % 12
  hours = hours ? hours : 12
  minutes = minutes < 10 ? '0' + minutes : minutes
  const strTime = hours + ':' + minutes + ' ' + ampm
  return strTime
}

const MenuItem = (props) => {
  const Icon = props.iconPack ?? Feather

  return <MenuOption onSelect={props.onSelect}>
    <View style={styles.menuItemContainer}>
      <Text style={styles.menuText}>
        {props.text}
      </Text>
      <Icon name={props.icon} size={18} />
    </View>
  </MenuOption>
}

const Bubble = (props: BubbleProps) => {
  const { text, types, messageId, userId, chatId, date } = props;

  const starredMessages = useSelector<RootState>(state => state.messages.starredMessages[chatId] ?? {})

  const bubbleStyle: StyleProp<ViewStyle> = { ...styles.container }
  const wrapperStyle: StyleProp<ViewStyle> = { ...styles.wrapperStyle }
  const textStyle: StyleProp<TextStyle> = { ...styles.text }

  const menuRef = useRef(null)
  const id = useRef(uuid.v4())

  let Container: any = View
  let isUserMessage = false
  const dateString = formatAmPm(date)

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
      isUserMessage = true
      break

    case "theirMessage":
      wrapperStyle.justifyContent = 'flex-start'
      bubbleStyle.maxWidth = '90%'
      Container = TouchableWithoutFeedback
      isUserMessage = true
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

  const isStarred = isUserMessage && starredMessages[messageId] !== undefined;

  return (
    <View style={wrapperStyle}>
      <Container style={{ width: '100%' }} onLongPress={() => { menuRef.current.props.ctx.menuActions.openMenu(id.current) }}>
        <View style={bubbleStyle}>
          <Text style={textStyle}>{text}</Text>

          {
            dateString && <View style={styles.timeContainer}>
              {isStarred && <FontAwesome style={{ marginRight: 5 }} name='star' size={14} color={colors.textColor} />}
              <Text style={styles.time}>{dateString}</Text>
            </View>
          }

          <Menu ref={menuRef} name={String(id.current)}>
            <MenuTrigger />
            <MenuOptions>
              <MenuItem text='Copy to clipboard' onSelect={() => copyToClipboard(text)} icon={'copy'} />
              <MenuItem text={`${isStarred ? 'Unstar' : 'Star'} message`} onSelect={() => starMessage(messageId, chatId, userId)} icon={isStarred ? 'star' : 'star-o'} iconPack={FontAwesome} />
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
  menuItemContainer: {
    flexDirection: 'row',
    padding: 5,
  },
  menuText: {
    flex: 1,
    fontFamily: 'regular',
    letterSpacing: 0.3,
    fontSize: 16,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  time: {
    fontFamily: 'regular',
    letterSpacing: 0.3,
    color: colors.grey,
    fontSize: 12,
  },
})

export default Bubble
