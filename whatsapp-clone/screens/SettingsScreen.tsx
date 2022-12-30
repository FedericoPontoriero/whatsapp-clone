import { Feather, FontAwesome } from "@expo/vector-icons";
import React, { useCallback, useReducer, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Input from "../components/Input";
import PageContainer from "../components/PageContainer";
import { PageTitle } from "../components/PageTitle";
import SubmitButton from "../components/SubmitButton";
import colors from "../constants/colors";
import { updateLoggedInUserData } from "../store/authSlice";
import { RootState } from "../store/store";
import {
  updateSignedInUserData,
  userLogout,
} from "../utils/actions/authActions";
import { validateInput } from "../utils/actions/formActions";
import { FormState, reducer } from "../utils/reducers/formReducer";

const SettingsScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const userData = useSelector((state: RootState) => state.auth.userData);

  const initialState: FormState = {
    inputValues: {
      firstName: userData.firstName || "",
      lastName: userData.lastName || "",
      email: userData.email || "",
      about: userData.about || "",
    },
    inputValidities: {
      firstName: undefined,
      lastName: undefined,
      email: undefined,
      about: undefined,
    },
    formIsValid: false,
  };

  const [formState, dispatchFormState] = useReducer(reducer, initialState);

  const inputChangedHandler = useCallback(
    (inputId: string, inputValue: string): void => {
      const result = validateInput(inputId, inputValue);
      dispatchFormState({ inputId, validationResult: result, inputValue });
    },
    [dispatchFormState]
  );
  const dispatch = useDispatch();

  const saveHandler = useCallback(async () => {
    const updatedValues = formState.inputValues;
    try {
      setIsLoading(true);
      await updateSignedInUserData(userData.userId, updatedValues);
      dispatch(updateLoggedInUserData({ newData: updatedValues }));
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  }, [formState, dispatch]);

  return (
    <PageContainer style={styles.container}>
      <PageTitle text="Settings" />
      <Input
        id="firstName"
        label="First name"
        icon="user-o"
        autoCapitalize="none"
        iconPack={FontAwesome}
        errorText={formState.inputValidities["firstName"]}
        onInputChanged={inputChangedHandler}
        initialValue={userData.firstName}
      />
      <Input
        id="lastName"
        label="Last name"
        icon="user-o"
        iconPack={FontAwesome}
        autoCapitalize="none"
        errorText={formState.inputValidities["lastName"]}
        onInputChanged={inputChangedHandler}
        initialValue={userData.lastName}
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
        initialValue={userData.email}
      />
      <Input
        id="about"
        label="About"
        icon="user-o"
        iconPack={FontAwesome}
        autoCapitalize="none"
        errorText={formState.inputValidities["about"]}
        onInputChanged={inputChangedHandler}
        initialValue={userData.about}
      />
      <View style={{ marginTop: 20 }}>
        {showSuccessMessage && <Text>Saved!</Text>}
        {isLoading ? (
          <ActivityIndicator
            size={"small"}
            color={colors.primary}
            style={{ marginTop: 10 }}
          />
        ) : (
          <SubmitButton
            title="Save"
            onPress={saveHandler}
            disabled={!formState.formIsValid}
            style={{ marginTop: 20 }}
          />
        )}
      </View>
      <SubmitButton
        title="Logout"
        color={colors.red}
        onPress={() => dispatch(userLogout())}
        style={{ marginTop: 20 }}
      />
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default SettingsScreen;
