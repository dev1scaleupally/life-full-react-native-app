import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AccountGateScreen } from '../screens/auth/AccountGateScreen';
import { EmailFormScreen } from '../screens/auth/EmailFormScreen';
import { EmailVerifyScreen } from '../screens/auth/EmailVerifyScreen';
import { ForgotPasswordScreen } from '../screens/auth/ForgotPasswordScreen';
import { NewPasswordScreen } from '../screens/auth/NewPasswordScreen';
import { ResetLinkSentScreen } from '../screens/auth/ResetLinkSentScreen';
import type { AuthMode, AuthStackParamList } from './types';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export type AuthStackProps = {
  /** @default 'signup' */
  initialMode?: AuthMode;
};

/**
 * Sign in / sign up. Every route renders headerShown:false — each screen
 * builds its own header/footer shell (see screens/auth/AuthShell.tsx).
 */
export function AuthStack({ initialMode = 'signup' }: AuthStackProps) {
  return (
    <Stack.Navigator initialRouteName="AccountGate" screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="AccountGate"
        component={AccountGateScreen}
        initialParams={{ mode: initialMode }}
      />
      <Stack.Screen
        name="EmailForm"
        component={EmailFormScreen}
        initialParams={{ mode: initialMode }}
      />
      <Stack.Screen name="EmailVerify" component={EmailVerifyScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="ResetLinkSent" component={ResetLinkSentScreen} />
      <Stack.Screen name="NewPassword" component={NewPasswordScreen} />
    </Stack.Navigator>
  );
}
