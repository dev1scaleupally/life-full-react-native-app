/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useRef, useState } from 'react';
import { StatusBar, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { IntroScreen } from './components/IntroScreen';
import { MainTabs } from './components/MainTabs';
import { OnboardingFlow } from './components/onboarding/OnboardingFlow';
import { optionLabel, toBasicProfile, type OnboardingAnswers } from './components/onboarding/types';
import { OnboardingResultsScreen, type DomainResult } from './components/OnboardingResultsScreen';
import { ProfileScreen, type ProfileDomainResult } from './components/ProfileScreen';
import { FLAT_QUESTIONS, type ReflectionAnswers } from './components/reflections/types';
import { ReflectionsFlow } from './components/reflections/ReflectionsFlow';
import { ReflectionsIntroScreen } from './components/ReflectionsIntroScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { WelcomeScreen } from './components/WelcomeScreen';
import { STORAGE_KEYS } from './constants/storage';
import { RootNavigator } from './navigation/RootNavigator';
import type { AuthMode } from './navigation/types';
import { progressApi } from './services/api/progressApi';
import { ApiError, type DomainId, type OnboardingResponseEntry } from './services/api/types';
import type { AuthAccount } from './services/auth/types';
import { store } from './store';
import { authActions } from './store/auth/authSlice';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { onboardingActions } from './store/onboarding/onboardingSlice';
import { computePriorityOrder, scoreBand, scoreOnboarding } from './utils/onboardingScoring';
import './global.css';

// Placeholder flow routing. Swap for a real navigation library (e.g.
// React Navigation) once this grows past a couple of screens.
type Screen =
  | 'welcome'
  | 'intro'
  | 'onboarding'
  | 'auth'
  | 'reflectionsIntro'
  | 'reflections'
  | 'results'
  | 'profile'
  | 'main'
  | 'settings';

/** Everything OnboardingResultsScreen needs — computed entirely on-device
 * (utils/onboardingScoring.ts) right after reflections, before any account
 * exists. POST /onboarding/responses re-derives the authoritative version of
 * these same numbers server-side once the buffered answers are committed
 * post-signup, but the app never waits on that to show results. */
type ResultsData = {
  overallScore: number;
  overallBand: string;
  cognitiveAlignmentScore: number;
  domainResults: DomainResult[];
};

/** Everything ProfileScreen needs (spec 4.10) — reached either right after a
 * fresh signup's silent commit (real data throughout, baseline-only, no
 * deltas yet) or a returning sign-in (real domain scores from GET /progress,
 * but no name/About You — there's no GET /me yet; see the comment where
 * this gets built below). */
type ProfileData = {
  firstName: string;
  subtitle: string | null;
  currentDomain: DomainId;
  overallScore: number;
  overallBand: string;
  overallBaselineScore: number | null;
  cognitiveAlignmentScore: number;
  cognitiveAlignmentBaselineScore: number | null;
  domainResults: ProfileDomainResult[];
  aboutYou: {
    retirement: string;
    formerRole: string | null;
    livingSituation: string;
    location: string;
  } | null;
};

function buildAboutYou(answers: OnboardingAnswers): NonNullable<ProfileData['aboutYou']> {
  const retirementLabel = optionLabel('retirementStatus', answers.retirementStatus);
  const howLongLabel = optionLabel('howLongRetired', answers.howLongRetired);
  return {
    retirement: [retirementLabel, howLongLabel].filter(Boolean).join(' · ') || '—',
    formerRole: answers.careerRole.trim() || null,
    livingSituation: optionLabel('livingSituation', answers.livingSituation) ?? '—',
    location: optionLabel('location', answers.location) ?? '—',
  };
}

function buildSubtitle(answers: OnboardingAnswers): string | null {
  const career = optionLabel('careerField', answers.careerField);
  const age = optionLabel('ageRange', answers.ageRange);
  return [career, age].filter(Boolean).join(', ') || null;
}

function App() {
  return (
    // Makes the redux+saga API layer (see store/) available to any screen
    // that wants to dispatch/select — AppShell (below) is the first thing
    // that actually uses it, for the onboarding submit.
    <Provider store={store}>
      <SafeAreaProvider>
        <AppShell />
      </SafeAreaProvider>
    </Provider>
  );
}

function AppShell() {
  const [screen, setScreen] = useState<Screen>('welcome');
  // 'signin' when the Welcome screen's "Sign in" link is tapped, so
  // RootNavigator lands on AccountGate's sign-in copy instead of signup's.
  const [authMode, setAuthMode] = useState<AuthMode>('signup');
  // Carried from OnboardingFlow's completion all the way to auth resolving —
  // that's the moment both halves of POST /onboarding/responses' body (this,
  // plus reflectionAnswers below) are finally both in hand AND there's a real
  // access token to send them with.
  const [basicProfile, setBasicProfile] = useState<OnboardingAnswers | null>(null);
  // Carried from ReflectionsFlow's completion through auth (submitting
  // requires a real access token, so auth has to sit between reflections and
  // the actual POST /onboarding/responses) to that submit.
  const [reflectionAnswers, setReflectionAnswers] = useState<ReflectionAnswers | null>(null);
  const [resultsData, setResultsData] = useState<ResultsData | null>(null);
  // Best-effort account info resolved from auth — see EmailFormScreen: real
  // for a fresh signup (the user just typed it), blank for a plain sign-in
  // (no GET /me exists yet to look it up).
  const [authAccount, setAuthAccount] = useState<AuthAccount | null>(null);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const dispatch = useAppDispatch();
  const submitStatus = useAppSelector(state => state.onboarding.submitStatus);
  const submitError = useAppSelector(state => state.onboarding.submitError);
  const submitResult = useAppSelector(state => state.onboarding.result);
  // False until rootSaga's app-launch session check (hydrate + refresh) has
  // actually run — gate navigation on this, not just isAuthenticated, so a
  // real stored session doesn't flash the Welcome/login screen before
  // landing on Main. (See rootSaga.ts: this used to never flip at all — the
  // refresh dispatch fired before authSaga was listening for it.)
  const bootstrapped = useAppSelector(state => state.auth.bootstrapped);
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
  // Same fire-and-forget pattern as the auth screens: set right before
  // dispatching responsesSubmitted, cleared once the saga's outcome has
  // been handled below.
  const pendingSubmitRef = useRef(false);

  useEffect(() => {
    if (!bootstrapped || screen !== 'welcome' || !isAuthenticated) return;
    (async () => {
      // A silent session restore never goes through EmailFormScreen/
      // AccountGateScreen, so authAccount is still null here even for a
      // real, previously-signed-in account — there's no GET /me to ask
      // instead. Fall back to whatever name got cached last time this
      // device actually learned one (see onAuthResolved below); a fresh
      // device/reinstall still has nothing, and shows the "there" fallback.
      let cachedFirstName: string | undefined;
      if (!authAccount) {
        const cached = await AsyncStorage.getItem(STORAGE_KEYS.accountName);
        if (cached) {
          try {
            const parsed = JSON.parse(cached) as { firstName: string; lastName: string };
            cachedFirstName = parsed.firstName;
            setAuthAccount({
              id: '',
              email: '',
              firstName: parsed.firstName,
              lastName: parsed.lastName,
              emailVerified: true,
              subscriptionStatus: 'never_subscribed',
              provider: 'email',
            });
          } catch {
            // Corrupted cache — ignore, proceed with no cached name.
          }
        }
      }
      // A restored session doesn't tell us whether this user ever finished
      // onboarding — loadProfileFromServer is the thing that actually
      // knows, and routes to 'intro' itself when it doesn't find anything.
      // Progress found -> straight to Home, not Profile.
      loadProfileFromServer(cachedFirstName, 'main');
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bootstrapped, isAuthenticated]);

  // Shared by the returning-sign-in path, the app-launch bootstrap redirect,
  // and Home's Profile icon — GET /progress is the only source for a
  // previously-committed user's scores (no GET /me, so no name/About You
  // here — flagged where aboutYou is set below).
  //
  // GET /progress returns a dedicated 409 (ledger.repo.ts's
  // OnboardingIncompleteError -> ConflictException) when this user has
  // never completed onboarding — that specific case sends them through
  // onboarding from scratch. Anything else (network failure, a genuine 5xx)
  // is a real error and is left alone rather than silently reinterpreted as
  // "just needs onboarding".
  // Dispatches the real POST /onboarding/responses commit for the buffered
  // on-device answers — shared by onAuthResolved (fresh signup, right after
  // account creation) and the results screen's "Start free trial" (when the
  // user was already signed in the whole time, e.g. via the 409 "not
  // onboarded yet" redirect — no reason to send them through sign-in again
  // just to do the same commit).
  function commitOnboarding(profile: OnboardingAnswers, answers: ReflectionAnswers) {
    const responses: OnboardingResponseEntry[] = FLAT_QUESTIONS.map(({ question }) => ({
      questionId: question.id,
      // Always the raw 1–5 the user picked — the backend reverses
      // reverse-coded questions itself, never pre-reverse this.
      rawScore: answers[question.id],
      userText: null,
    }));
    pendingSubmitRef.current = true;
    dispatch(onboardingActions.responsesSubmitted({ basicProfile: toBasicProfile(profile), responses }));
  }

  // landOn: where success lands — Home's/Settings' Profile icon always wants
  // 'profile' (that's the point of tapping it); a login/session-restore
  // wants 'main' instead, straight to Home, now that profileData is at
  // least populated and ready for whenever Profile is actually opened.
  function loadProfileFromServer(fallbackFirstName?: string, landOn: 'profile' | 'main' = 'profile') {
    return progressApi
      .get()
      .then(progress => {
        const overall = progress.overallWellbeing.at(-1);
        const overallBaseline = progress.overallWellbeing.length > 1 ? progress.overallWellbeing[0] : null;
        const cognitive = progress.cognitiveAlignment.at(-1);
        const cognitiveBaseline = progress.cognitiveAlignment.length > 1 ? progress.cognitiveAlignment[0] : null;
        if (!overall || !cognitive) throw new Error('GET /progress returned no baseline point');
        const domainScores = progress.domains.map(d => ({ domain: d.domain, score: d.points.at(-1)!.score }));
        setProfileData({
          // fallbackFirstName covers the bootstrap-restore call, made before
          // its own setAuthAccount(cached) has actually re-rendered yet.
          firstName: fallbackFirstName ?? authAccount?.firstName ?? '',
          subtitle: null,
          currentDomain: computePriorityOrder(domainScores)[0]!,
          overallScore: overall.score,
          overallBand: overall.band,
          overallBaselineScore: overallBaseline?.score ?? null,
          cognitiveAlignmentScore: cognitive.score,
          cognitiveAlignmentBaselineScore: cognitiveBaseline?.score ?? null,
          domainResults: progress.domains.map(d => {
            const latest = d.points.at(-1)!;
            const baseline = d.points.length > 1 ? d.points[0] : null;
            return {
              domain: d.domain,
              score: latest.score,
              band: latest.band,
              baselineScore: baseline?.score ?? null,
            };
          }),
          // No GET /me/profile endpoint exists to fetch a previously-saved
          // BasicProfile — a real backend requirement, not a frontend gap.
          aboutYou: null,
        });
        setScreen(landOn);
      })
      .catch(err => {
        if (err instanceof ApiError && err.statusCode === 409) {
          console.log('[App] GET /progress: onboarding not completed yet — starting fresh');
          setScreen('intro');
          return;
        }
        // A genuine failure (network, 5xx) — nothing safe to route to, so
        // this is left as a logged error rather than guessing.
        console.error('[App] GET /progress failed:', err);
      });
  }

  useEffect(() => {
    if (!pendingSubmitRef.current || submitStatus === 'loading') return;
    pendingSubmitRef.current = false;
    if (submitStatus === 'error') {
      // The on-device preview is already on screen — this is the silent
      // background commit failing, not the user-visible results. Retrying
      // it isn't wired yet, so this is a real gap: the buffered answers
      // stay local until something retries the commit.
      console.error('[App] onboarding commit API error:', submitError);
      return;
    }
    console.log('[App] onboarding buffered answers committed:', submitResult);
    if (basicProfile && resultsData) {
      // Fresh signup: this commit IS the baseline, so every delta is null —
      // matches the spec's "Baseline only: shows the baseline; the delta
      // appears after the first re-administration."
      setProfileData({
        firstName: authAccount?.firstName || basicProfile.firstName.trim(),
        subtitle: buildSubtitle(basicProfile),
        currentDomain: resultsData.domainResults[0]!.domain,
        overallScore: resultsData.overallScore,
        overallBand: resultsData.overallBand,
        overallBaselineScore: null,
        cognitiveAlignmentScore: resultsData.cognitiveAlignmentScore,
        cognitiveAlignmentBaselineScore: null,
        domainResults: resultsData.domainResults.map(d => ({ ...d, baselineScore: null })),
        aboutYou: buildAboutYou(basicProfile),
      });
    }
    // Paywall isn't built yet — land on Profile (same on-device numbers,
    // now with a real account behind them) rather than stranding the user
    // on the now-signed-in auth screen.
    setScreen('profile');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitStatus]);

  // Blank rather than Welcome while the launch session check is in flight —
  // otherwise a real returning user sees a flash of the login screen before
  // getting bounced to Main once bootstrapped resolves.
  if (!bootstrapped) {
    return <View className="flex-1 bg-surface-screen" />;
  }

  return (
    <>
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
            setBasicProfile(answers);
            // Straight into reflections — signup comes later, right before
            // submitting, not right after "About you".
            setScreen('reflectionsIntro');
          }}
        />
      ) : screen === 'reflectionsIntro' ? (
        <ReflectionsIntroScreen
          onBack={() => setScreen('onboarding')}
          onContinue={() => setScreen('reflections')}
        />
      ) : screen === 'reflections' ? (
        <ReflectionsFlow
          onExit={() => setScreen('reflectionsIntro')}
          onComplete={answers => {
            // Pre-account data handling: computed entirely on-device, no
            // network call, no account required yet — buffered here until
            // sign-up actually commits it (see onAuthResolved below). If the
            // user abandons before signing in, this buffer just never gets
            // committed; nothing was ever sent.
            setReflectionAnswers(answers);
            const scored = scoreOnboarding(answers);
            setResultsData({
              overallScore: scored.overallWellbeingScore,
              overallBand: scoreBand(scored.overallWellbeingScore),
              cognitiveAlignmentScore: scored.cognitiveAlignmentScore,
              domainResults: scored.priorityOrder.map(
                domain => scored.domainScores.find(d => d.domain === domain)!,
              ),
            });
            setScreen('results');
          }}
        />
      ) : screen === 'auth' ? (
        <RootNavigator
          initialMode={authMode}
          onAuthResolved={account => {
            console.log('Auth resolved:', account);
            setAuthAccount(account);
            // Only cache when we actually learned a real name (Google,
            // fresh signup) — never overwrite a good cached name with the
            // blank one a plain email sign-in produces (see EmailFormScreen).
            if (account.firstName.trim()) {
              AsyncStorage.setItem(
                STORAGE_KEYS.accountName,
                JSON.stringify({ firstName: account.firstName.trim(), lastName: account.lastName.trim() }),
              ).catch(() => {});
            }
            if (basicProfile && reflectionAnswers) {
              // Signing in is the consent + commit event: the on-device
              // buffer (already shown as results, before this point) gets
              // committed to the real ledger now that there's an access
              // token to send it with.
              commitOnboarding(basicProfile, reflectionAnswers);
              return;
            }
            // Returning-user sign-in (Welcome's "Sign in" link, or a Google
            // account that already existed) — no onboarding/reflections
            // collected this session, so there's nothing on-device to show;
            // load their already-committed data (or send them through
            // onboarding if they never completed it). Progress found ->
            // straight to Home, not Profile.
            loadProfileFromServer(undefined, 'main');
          }}
        />
      ) : screen === 'results' && resultsData ? (
        <OnboardingResultsScreen
          firstName={basicProfile?.firstName.trim() || 'there'}
          overallScore={resultsData.overallScore}
          overallBand={resultsData.overallBand}
          cognitiveAlignmentScore={resultsData.cognitiveAlignmentScore}
          domainResults={resultsData.domainResults}
          onStartTrial={() => {
            if (isAuthenticated && basicProfile && reflectionAnswers) {
              // Already signed in — this happens when onboarding was
              // reached while logged in (e.g. the 409 "not onboarded yet"
              // redirect). No reason to ask them to sign in again just to
              // do the same commit.
              commitOnboarding(basicProfile, reflectionAnswers);
              return;
            }
            setAuthMode('signup');
            setScreen('auth');
          }}
        />
      ) : screen === 'profile' && profileData ? (
        <ProfileScreen
          firstName={profileData.firstName}
          subtitle={profileData.subtitle}
          currentDomain={profileData.currentDomain}
          overallScore={profileData.overallScore}
          overallBand={profileData.overallBand}
          overallBaselineScore={profileData.overallBaselineScore}
          cognitiveAlignmentScore={profileData.cognitiveAlignmentScore}
          cognitiveAlignmentBaselineScore={profileData.cognitiveAlignmentBaselineScore}
          domainResults={profileData.domainResults}
          aboutYou={profileData.aboutYou}
          onBack={() => setScreen('main')}
          onBackToHome={() => setScreen('main')}
          onEdit={() => console.log('[App] Edit About You — Basic-Profile-editable is still TBD per spec')}
        />
      ) : screen === 'main' ? (
        <MainTabs
          onOpenProfile={() => {
            // Always re-fetch — profileData may be stale (or never set, if
            // Home was reached some other way) by the time this is tapped.
            loadProfileFromServer();
          }}
          onOpenSettings={() => setScreen('settings')}
        />
      ) : screen === 'settings' ? (
        <SettingsScreen
          firstName={authAccount?.firstName ?? ''}
          lastName={authAccount?.lastName ?? ''}
          subscriptionPlan={null}
          onBack={() => setScreen('main')}
          onBackToHome={() => setScreen('main')}
          onOpenProfile={() => {
            loadProfileFromServer().catch(err => {
              console.error('[App] GET /progress failed opening Profile from Settings:', err);
            });
          }}
          onOpenSubscription={() => console.log('[App] Manage subscription — no store integration built yet')}
          onOpenDataPrivacy={() => console.log('[App] Data & privacy — no export/document built yet')}
          onOpenHelp={() => console.log('[App] Help & contact — not built yet')}
          onOpenAbout={() => console.log('[App] About Lifefull — not built yet')}
          onOpenHowItWorks={() => console.log('[App] How Lifefull works — not built yet')}
          onSignOut={() => {
            dispatch(authActions.loggedOut());
            AsyncStorage.removeItem(STORAGE_KEYS.accountName).catch(() => {});
            setAuthAccount(null);
            setBasicProfile(null);
            setReflectionAnswers(null);
            setResultsData(null);
            setProfileData(null);
            setScreen('welcome');
          }}
          onDeleteAccount={() =>
            console.log('[App] Delete account — no backend endpoint exists yet (needs a real requirement)')
          }
        />
      ) : null}
    </>
  );
}

export default App;
