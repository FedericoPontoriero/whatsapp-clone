import { StyleSheet, Text } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import * as SplashScreen from "expo-splash-screen";
import { useCallback, useEffect, useState } from "react";

SplashScreen.preventAutoHideAsync();

export default function App() {
    const [appIsLoaded, setAppIsLoaded] = useState(false);

    useEffect(() => {
        setAppIsLoaded(true);
    }, []);

    const onLayout = useCallback(async () => {
        if (appIsLoaded) {
            await SplashScreen.hideAsync();
        }
    }, [appIsLoaded]);

    if (!appIsLoaded) return null;

    return (
        <SafeAreaProvider onLayout={onLayout} style={styles.container}>
            <SafeAreaView>
                <Text>Hi</Text>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
});
