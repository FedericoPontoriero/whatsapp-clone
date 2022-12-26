import React from 'react'
import { StyleSheet, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native'

import colors from '../constants/colors'

interface SubmitButtonProps extends TouchableOpacityProps {
    color?: string;
    disabled?: boolean;
    title?: string;
    style?: object;
}
const SubmitButton = (props: SubmitButtonProps) => {
    const enabledBgColor = props.color || colors.primary
    const disabledBgColor = colors.lightGrey;
    const bgColor = props.disabled ? disabledBgColor : enabledBgColor

    return <TouchableOpacity style={{ ...styles.button, ...{ backgroundColor: bgColor }, ...props.style }} onPress={props.disabled ? () => { } : props.onPress}>
        <Text style={{ color: props.disabled ? colors.grey : 'white' }}>{props.title}</Text>
    </TouchableOpacity>
}

const styles = StyleSheet.create({
    button: {
        paddingHorizontal: 30,
        paddingVertical: 10,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
})

export default SubmitButton
