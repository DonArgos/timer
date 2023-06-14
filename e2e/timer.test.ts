import {device, element, expect} from 'detox';
import {takeScreenshot} from './utils';
import {Language} from '../src/language';

describe('Example', () => {
  beforeAll(async () => {
    await device.launchApp({permissions: {notifications: 'YES'}});
  });

  describe.each([['light'], ['dark']])('%s mode', style => {
    it('should be able to change style', async () => {
      await element(by.id('settings-button')).tap();
      try {
        await expect(element(by.id(`style-button-${style}`))).toBeVisible();
      } catch {
        await element(
          by.id(`style-button-${style === 'light' ? 'dark' : 'light'}`),
        ).tap();
      }
      await device.reloadReactNative();
    });

    describe.each([['es'], ['en']])('%s language', lang => {
      const screenshotName = `${lang}-${style}`;

      it('should be able to change language', async () => {
        await element(by.id('settings-button')).tap();
        try {
          await expect(element(by.id(`language-label-${lang}`))).toBeVisible();
        } catch {
          await element(by.id('language-button')).tap();
        }
        await expect(element(by.id(`language-label-${lang}`))).toBeVisible();
      });

      it('should have settings', async () => {
        takeScreenshot(lang as Language, `${screenshotName}-settings`);
        await element(by.id('back-button')).tap();
      });

      it('should have durations form', async () => {
        await expect(element(by.id('total-duration-input'))).toBeVisible();
        await expect(element(by.id('work-duration-input'))).toBeVisible();
        await expect(element(by.id('rest-duration-input'))).toBeVisible();
        takeScreenshot(lang as Language, `${screenshotName}-main`);
      });

      it('should enable test mode', async () => {
        await element(by.id('settings-button')).longPress();
        takeScreenshot(lang as Language, `${screenshotName}-running`);
        await element(by.id('stop-button')).tap();
      });
    });
  });
});
