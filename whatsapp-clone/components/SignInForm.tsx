import React, { useCallback, useEffect, useReducer, useState } from "react";
import { Feather } from "@expo/vector-icons";

import SubmitButton from "../components/SubmitButton";
import Input from "../components/Input";
import { validateInput } from "../utils/actions/formActions";
import { reducer } from "../utils/reducers/formReducer";
import { signIn } from "../utils/actions/authActions";
import { ActivityIndicator, Alert } from "react-native";
import { useDispatch } from "react-redux";
import colors from "../constants/colors";

type FormStateSignIn = {
  inputValues: {
    email: string,
    password: string,
  },
  inputValidities: {
    email: boolean,
    password: boolean,
  },
  formIsValid: boolean,
};

const initialState: FormStateSignIn = {
  inputValues: {
    email: "",
    password: "",
  },
  inputValidities: {
    email: false,
    password: false,
  },
  formIsValid: false,
};

const SignInForm = () => {
  const [formState, dispatchFormState] = useReducer(reducer, initialState);
  const dispatch = useDispatch();

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const inputChangedHandler = useCallback(
    (inputId: string, inputValue: string): void => {
      const result = validateInput(inputId, inputValue);
      dispatchFormState({ inputId, validationResult: result, inputValue });
    },
    [dispatchFormState]
  );

  useEffect(() => {
    if (error) {
      Alert.alert("An error has occurred", error, [{ text: "Ok" }]);
    }
  }, [error]);

  const authHandler = useCallback(async () => {
    try {
      setIsLoading(true);
      const action: any = signIn(
        formState.inputValues.email,
        formState.inputValues.password
      );
      await dispatch(action);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  }, [dispatch, formState]);

  return (
    <>
      <Input
        id="email"
        label="Email"
        icon="mail"
        autoCapitalize="none"
        keyboardType="email-address"
        iconPack={Feather}
        onInputChanged={inputChangedHandler}
        errorText={formState.inputValidities["email"]}
      />
      <Input
        id="password"
        label="Password"
        icon="lock"
        iconPack={Feather}
        autoCapitalize="none"
        secureTextEntry
        onInputChanged={inputChangedHandler}
        errorText={formState.inputValidities["password"]}
      />
      {isLoading ?
        <ActivityIndicator size={'small'} color={colors.primary} style={{ marginTop: 10 }} /> :
        <SubmitButton
          title="Sign in"
          onPress={authHandler}
          disabled={!formState.formIsValid}
          style={{ marginTop: 20 }}
        />
      }
    </>
  );
};

export default SignInForm;
