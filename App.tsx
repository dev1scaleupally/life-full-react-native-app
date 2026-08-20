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
import { WelcomeScreen } from './components/WelcomeScreen';
import './global.css';

// Placeholder flow routing. Swap for a real navigation library (e.g.
// React Navigation) once this grows past a couple of screens.
type Screen = 'welcome' | 'intro';

function App() {
  const [screen, setScreen] = useState<Screen>('welcome');

  return (
    <SafeAreaProvider>
      {/* Welcome is a dark navy gradient; Intro is light cream. */}
      <StatusBar barStyle={screen === 'welcome' ? 'light-content' : 'dark-content'} />
      {screen === 'welcome' ? (
        <WelcomeScreen onGetStarted={() => setScreen('intro')} />
      ) : (
        <IntroScreen onBegin={() => {}} />
      )}
    </SafeAreaProvider>
  );
}

export default App;
