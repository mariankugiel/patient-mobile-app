import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpc, trpcClient } from "@/lib/trpc";

import { ErrorBoundary } from "./error-boundary";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { useAuthStore } from "@/lib/auth/auth-store";
import { setLogoutCallback } from "@/lib/api/axios-config";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "index",
};

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Prevent infinite loading states
      retry: 1,
      // Prevent stale data issues
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });
  
  const { restoreSession, logout } = useAuthStore();

  // Set up logout callback for axios interceptor
  useEffect(() => {
    setLogoutCallback(() => {
      logout();
    });
  }, [logout]);

  // Restore session on app start
  useEffect(() => {
    if (loaded) {
      restoreSession();
    }
  }, [loaded, restoreSession]);

  useEffect(() => {
    if (error) {
      console.error(error);
      throw error;
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <ThemeProvider>
          <ErrorBoundary>
            <RootLayoutNav />
          </ErrorBoundary>
          </ThemeProvider>
        </LanguageProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}

function RootLayoutNav() {
  return (
    <Stack 
      screenOptions={{ 
        headerShown: false,
        contentStyle: { backgroundColor: 'white' }
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="auth" options={{ headerShown: false }} />
      <Stack.Screen name="profile" options={{ headerShown: false, presentation: 'card' }} />
      <Stack.Screen name="messages" options={{ headerShown: false, presentation: 'card' }} />
      <Stack.Screen name="notifications" options={{ headerShown: false, presentation: 'card' }} />
      <Stack.Screen name="add-metric" options={{ headerShown: false, presentation: 'card' }} />
      <Stack.Screen name="add-appointment" options={{ headerShown: false, presentation: 'card' }} />
      <Stack.Screen name="upload-document" options={{ headerShown: false, presentation: 'card' }} />
      <Stack.Screen name="add-activity" options={{ headerShown: false, presentation: 'card' }} />
      <Stack.Screen name="add-medication" options={{ headerShown: false, presentation: 'card' }} />
    </Stack>
  );
}