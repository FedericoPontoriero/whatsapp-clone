import React, { useCallback, useEffect, useReducer, useState } from "react";
import { Feather, FontAwesome } from "@expo/vector-icons";

import SubmitButton from "../components/SubmitButton";
import Input from "../components/Input";
import { validateInput } from "../utils/actions/formActions";
import { FormState, reducer } from "../utils/reducers/formReducer";
import { signUp } from "../utils/actions/authActions";
import { ActivityIndicator, Alert } from "react-native";
import colors from "../constants/colors";
import { useDispatch } from "react-redux";

const initialState: FormState = {
  inputValues: {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  },
  inputValidities: {
    firstName: false,
    lastName: false,
    email: false,
    password: false,
  },
  formIsValid: false,
};

const SignUpForm = () => {
  const dispatch = useDispatch()

  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const [formState, dispatchFormState] = useReducer(reducer, initialState);

  const inputChangedHandler = useCallback(
    (inputId: string, inputValue: string): void => {
      const result = validateInput(inputId, inputValue);
      dispatchFormState({ inputId, validationResult: result, inputValue });
    },
    [dispatchFormState]
  );

  useEffect(() => {
    if (error) {
      Alert.alert("An error has occurred", error, [{ text: "Ok" }])
    }
  }, [error])

  const authHandler = useCallback(async () => {
    try {
      setIsLoading(true)
      const action: any = signUp(
        formState.inputValues.firstName,
        formState.inputValues.lastName,
        formState.inputValues.email,
        formState.inputValues.password
      )
      await dispatch(action)
      setError(null)
    } catch (err: any) {
      setError(err.message)
      setIsLoading(false)
    }
  }, [dispatch, formState]);

  return (
    <>
      <Input
        id="firstName"
        label="First name"
        icon="user-o"
        autoCapitalize="none"
        iconPack={FontAwesome}
        errorText={formState.inputValidities["firstName"]}
        onInputChanged={inputChangedHandler}
      />
      <Input
        id="lastName"
        label="Last name"
        icon="user-o"
        iconPack={FontAwesome}
        autoCapitalize="none"
        errorText={formState.inputValidities["lastName"]}
        onInputChanged={inputChangedHandler}
      />
      <Input
        id="email"
        label="Email"
        icon="mail"
        iconPack={Feather}
        autoCapitalize="none"
        keyboardType="email-address"
        errorText={formState.inputValidities["email"]}
        onInputChanged={inputChangedHandler}
      />
      <Input
        id="password"
        secureTextEntry
        label="Password"
        icon="lock"
        autoCapitalize="none"
        iconPack={Feather}
        errorText={formState.inputValidities["password"]}
        onInputChanged={inputChangedHandler}
      />
      {
        isLoading ?
          <ActivityIndicator size={"small"} color={colors.primary} style={{ marginTop: 10 }} /> :
          <SubmitButton
            title="Sign up"
            disabled={!formState.formIsValid}
            onPress={authHandler}
            style={{ marginTop: 20 }}
          />
      }
    </>
  );
};

export default SignUpForm;
