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
import { WelcomeScreen } from './components/WelcomeScreen';
import './global.css';

// Placeholder flow routing. Swap for a real navigation library (e.g.
// React Navigation) once this grows past a couple of screens.
type Screen = 'welcome' | 'intro' | 'onboarding';

function App() {
  const [screen, setScreen] = useState<Screen>('welcome');

  return (
    <SafeAreaProvider>
      {/* Welcome is a dark navy gradient; Intro/Onboarding are light cream. */}
      <StatusBar barStyle={screen === 'welcome' ? 'light-content' : 'dark-content'} />
      {screen === 'welcome' ? (
        <WelcomeScreen onGetStarted={() => setScreen('intro')} />
      ) : screen === 'intro' ? (
        <IntroScreen onBegin={() => setScreen('onboarding')} />
      ) : (
        <OnboardingFlow
          onExit={() => setScreen('intro')}
          onComplete={answers => {
            // Next screen doesn't exist yet — log for now so answers are visible.
            console.log('Onboarding complete:', answers);
          }}
        />
      )}
    </SafeAreaProvider>
  );
}

export default App;
