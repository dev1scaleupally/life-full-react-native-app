package com.lifefullapp

import android.content.Intent
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

class MainActivity : ReactActivity() {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "Lifefull"

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)

  /**
   * Forwards a warm-app lifefull:// open to RN's Linking module. The
   * manifest's android:launchMode="singleTask" on this activity means a
   * deep link tapped while the app is already running reuses this same
   * Activity instance via onNewIntent rather than recreating it — without
   * this override (and the setIntent below), Linking.addEventListener('url',
   * ...) in hooks/useAuthDeepLinks.ts never fires for it. A cold launch
   * doesn't need this: RN reads the launch Intent's data URI on its own.
   */
  override fun onNewIntent(intent: Intent) {
    super.onNewIntent(intent)
    setIntent(intent)
  }
}
