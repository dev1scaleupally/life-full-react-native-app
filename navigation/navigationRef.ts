import { createNavigationContainerRef } from '@react-navigation/native';
import type { AuthStackParamList } from './types';

/** Lets services/auth/deepLinks.ts navigate from outside the component tree. */
export const navigationRef = createNavigationContainerRef<AuthStackParamList>();
