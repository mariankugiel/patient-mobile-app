import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeMode = 'light' | 'dark' | 'system';
export type TextSize = 'small' | 'normal' | 'large';

interface AccessibilitySettings {
  textSize: TextSize;
  higherContrast: boolean;
  reduceMotion: boolean;
}

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => Promise<void>;
  resolvedTheme: 'light' | 'dark';
  textSize: TextSize;
  setTextSize: (size: TextSize) => Promise<void>;
  accessibility: AccessibilitySettings;
  setAccessibility: (settings: AccessibilitySettings) => Promise<void>;
  updateAccessibility: (updates: Partial<AccessibilitySettings>) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@saluso_theme';
const TEXT_SIZE_STORAGE_KEY = '@saluso_text_size';
const ACCESSIBILITY_STORAGE_KEY = '@saluso_accessibility';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [theme, setThemeState] = useState<ThemeMode>('system');
  const [textSize, setTextSizeState] = useState<TextSize>('normal');
  const [accessibility, setAccessibilityState] = useState<AccessibilitySettings>({
    textSize: 'normal',
    higherContrast: false,
    reduceMotion: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Resolve the actual theme based on system preference
  const resolvedTheme = useMemo(() => {
    if (theme === 'system') {
      return systemColorScheme === 'dark' ? 'dark' : 'light';
    }
    return theme;
  }, [theme, systemColorScheme]);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const [savedTheme, savedTextSize, savedAccessibility] = await Promise.all([
        AsyncStorage.getItem(THEME_STORAGE_KEY),
        AsyncStorage.getItem(TEXT_SIZE_STORAGE_KEY),
        AsyncStorage.getItem(ACCESSIBILITY_STORAGE_KEY),
      ]);

      if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system')) {
        setThemeState(savedTheme as ThemeMode);
      }

      if (savedTextSize && (savedTextSize === 'small' || savedTextSize === 'normal' || savedTextSize === 'large')) {
        setTextSizeState(savedTextSize as TextSize);
      }

      if (savedAccessibility) {
        try {
          const parsed = JSON.parse(savedAccessibility);
          setAccessibilityState({
            textSize: parsed.textSize || 'normal',
            higherContrast: parsed.higherContrast || false,
            reduceMotion: parsed.reduceMotion || false,
          });
        } catch (e) {
          console.error('Failed to parse accessibility settings', e);
        }
      }
    } catch (error) {
      console.error('Failed to load preferences', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setTheme = async (newTheme: ThemeMode) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
      setThemeState(newTheme);
    } catch (error) {
      console.error('Failed to save theme', error);
    }
  };

  const setTextSize = async (size: TextSize) => {
    try {
      await AsyncStorage.setItem(TEXT_SIZE_STORAGE_KEY, size);
      setTextSizeState(size);
      setAccessibilityState(prev => ({ ...prev, textSize: size }));
    } catch (error) {
      console.error('Failed to save text size', error);
    }
  };

  const setAccessibility = async (settings: AccessibilitySettings) => {
    try {
      await AsyncStorage.setItem(ACCESSIBILITY_STORAGE_KEY, JSON.stringify(settings));
      setAccessibilityState(settings);
      setTextSizeState(settings.textSize);
    } catch (error) {
      console.error('Failed to save accessibility settings', error);
    }
  };

  const updateAccessibility = async (updates: Partial<AccessibilitySettings>) => {
    const newSettings = { ...accessibility, ...updates };
    await setAccessibility(newSettings);
  };

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      resolvedTheme,
      textSize,
      setTextSize,
      accessibility,
      setAccessibility,
      updateAccessibility,
    }),
    [theme, resolvedTheme, textSize, accessibility]
  );

  if (isLoading) {
    return null;
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

