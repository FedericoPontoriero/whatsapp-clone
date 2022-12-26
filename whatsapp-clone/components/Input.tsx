import { StyleSheet, Text, TextInput, View, ViewProps } from "react-native"

import colors from "../constants/colors"

interface InputProps extends ViewProps {
    label: string;
    icon?: string;
    iconPack: any;
    iconSize?: number;
    errorText?: string;
    id?: string;
    onInputChanged?: (inputId: number, inputValue: string) => void
}

const Input = (props: InputProps) => {
    const onChangeText = (text: string) => {
        if (props.onInputChanged) {
            props.onInputChanged(String(props.id), text)
        }
    }

    return <View style={styles.container}>
        <Text style={styles.label}>{props.label}</Text>
        <View style={styles.inputContainer}>
            {props.icon &&
                <props.iconPack name={props.icon} size={props.iconSize || 15} style={styles.icon} />
            }
            <TextInput style={styles.input} onChangeText={onChangeText} />
        </View>
        {props.errorText &&
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{props.errorText}</Text>
            </View>
        }
    </View>
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    inputContainer: {
        width: '100%',
        backgroundColor: colors.nearlyWhite,
        paddingHorizontal: 10,
        paddingVertical: 15,
        borderRadius: 2,
        flexDirection: 'row',
        alignItems: 'center',
    },
    label: {
        marginVertical: 8,
        fontFamily: 'bold',
        letterSpacing: 0.3,
        color: colors.textColor,
    },
    icon: {
        marginRight: 10,
        color: colors.grey,
    },
    input: {
        color: colors.textColor,
        flex: 1,
        fontFamily: "regular",
        letterSpacing: 0.3,
        paddingTop: 0,
    },
    errorContainer: {
        marginVertical: 5,
    },
    errorText: {
        color: 'red',
        fontSize: 13,
        fontFamily: 'regular',
        letterSpacing: 0.3,
    }
})

export default Input
