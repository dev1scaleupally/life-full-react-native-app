/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { useState } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { IntroScreen } from './components/IntroScreen';
import { OnboardingFlow } from './components/onboarding/OnboardingFlow';
import { ReflectionsFlow } from './components/reflections/ReflectionsFlow';
import { ReflectionsIntroScreen } from './components/ReflectionsIntroScreen';
import { WelcomeScreen } from './components/WelcomeScreen';
import './global.css';

// Placeholder flow routing. Swap for a real navigation library (e.g.
// React Navigation) once this grows past a couple of screens.
type Screen =
  | 'welcome'
  | 'intro'
  | 'onboarding'
  | 'reflectionsIntro'
  | 'reflections';

function App() {
  const [screen, setScreen] = useState<Screen>('welcome');

  return (
    <SafeAreaProvider>
      {/* Welcome is a dark navy gradient; every other screen is light cream. */}
      <StatusBar
        barStyle={screen === 'welcome' ? 'light-content' : 'dark-content'}
      />
      {screen === 'welcome' ? (
        <WelcomeScreen onGetStarted={() => setScreen('intro')} />
      ) : screen === 'intro' ? (
        <IntroScreen onBegin={() => setScreen('onboarding')} />
      ) : screen === 'onboarding' ? (
        <OnboardingFlow
          onExit={() => setScreen('intro')}
          onComplete={answers => {
            // Answers aren't persisted anywhere yet — log for now so they're visible.
            console.log('Onboarding complete:', answers);
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
  );
}

export default App;
