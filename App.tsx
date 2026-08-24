/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { IntroScreen } from './components/IntroScreen';
import { OnboardingFlow } from './components/onboarding/OnboardingFlow';
import { ReflectionsFlow } from './components/reflections/ReflectionsFlow';
import { ReflectionsIntroScreen } from './components/ReflectionsIntroScreen';
import { WelcomeScreen } from './components/WelcomeScreen';
import { STORAGE_KEYS } from './constants/storage';
import { RootNavigator } from './navigation/RootNavigator';
import type { AuthMode } from './navigation/types';
import { store } from './store';
import './global.css';

// Placeholder flow routing. Swap for a real navigation library (e.g.
// React Navigation) once this grows past a couple of screens.
type Screen =
  | 'welcome'
  | 'intro'
  | 'onboarding'
  | 'auth'
  | 'reflectionsIntro'
  | 'reflections';

function App() {
  const [screen, setScreen] = useState<Screen>('welcome');
  // 'signin' when the Welcome screen's "Sign in" link is tapped, so
  // RootNavigator lands on AccountGate's sign-in copy instead of signup's.
  const [authMode, setAuthMode] = useState<AuthMode>('signup');

  return (
    // Makes the redux+saga API layer (see store/) available to any screen
    // that wants to dispatch/select — no screen is wired to it yet.
    <Provider store={store}>
      <SafeAreaProvider>
        {/* Welcome is a dark navy gradient; every other screen is light cream. */}
        <StatusBar
          barStyle={screen === 'welcome' ? 'light-content' : 'dark-content'}
        />
        {screen === 'welcome' ? (
          <WelcomeScreen
            onGetStarted={() => setScreen('intro')}
            onSignIn={() => {
              setAuthMode('signin');
              setScreen('auth');
            }}
          />
        ) : screen === 'intro' ? (
          <IntroScreen onBegin={() => setScreen('onboarding')} />
        ) : screen === 'onboarding' ? (
          <OnboardingFlow
            onExit={() => setScreen('intro')}
            onComplete={async answers => {
              // Persisted so EmailFormScreen can pre-fill signup's "First name" field.
              if (answers.firstName.trim()) {
                await AsyncStorage.setItem(STORAGE_KEYS.onboardingName, answers.firstName.trim());
              }
              setAuthMode('signup');
              setScreen('auth');
            }}
          />
        ) : screen === 'auth' ? (
          <RootNavigator
            initialMode={authMode}
            onAuthResolved={account => {
              // Handoff point: a real RootNavigator branches here on
              // account.subscriptionStatus -> Paywall (firstRun/resume mode)
              // -> AppTabs. Neither is built yet, so fall through to the next
              // screen that already exists.
              console.log('Auth resolved:', account);
              setScreen('reflectionsIntro');
            }}
          />
        ) : screen === 'reflectionsIntro' ? (
          <ReflectionsIntroScreen
            onBack={() => setScreen('onboarding')}
            onContinue={() => setScreen('reflections')}
          />
        ) : (
          <ReflectionsFlow
            onExit={() => setScreen('reflectionsIntro')}
            onComplete={answers => {
              // Scoring/results screen doesn't exist yet — log for now so answers are visible.
              console.log('Reflections complete:', answers);
            }}
          />
        )}
      </SafeAreaProvider>
    </Provider>
  );
}

export default App;
