import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { ThemeProvider, useTheme } from "@/theme";
import { LocaleProvider } from "@/i18n";

function ThemedStatusBar() {
  const { isNight } = useTheme();
  return <StatusBar style={isNight ? "light" : "dark"} />;
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <LocaleProvider>
        <SafeAreaProvider>
          <ThemedStatusBar />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="search" options={{ presentation: "modal" }} />
            <Stack.Screen name="thread/[id]" />
            <Stack.Screen name="auth/login" />
            <Stack.Screen name="auth/signup" />
          </Stack>
        </SafeAreaProvider>
      </LocaleProvider>
    </ThemeProvider>
  );
}
