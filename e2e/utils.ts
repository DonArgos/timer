const {execSync} = require('child_process');

const SCREENSHOT_OPTIONS = {
  timeout: 10000,
  killSignal: 'SIGKILL',
};

export const takeScreenshot = (language: string, name: string) => {
  const fileName = `screenshot-${name}.png`;
  if (device.getPlatform() === 'android') {
    const fileAddress = `/sdcard/${fileName}`;
    execSync(`adb shell screencap ${fileAddress}`, SCREENSHOT_OPTIONS);
    execSync(
      `adb pull ${fileAddress} $(pwd)/android/fastlane/metadata/android/en-US/images/phoneScreenshots/`,
      SCREENSHOT_OPTIONS,
    );
  } else {
    const fileAddress = `fastlane/screenshots/ios/${language}/${fileName}`;
    execSync(
      `xcrun simctl io booted screenshot ${fileAddress}`,
      SCREENSHOT_OPTIONS,
    );
  }
};
