describe('Example', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('Get started and login', async () => {
    await expect(element(by.text('Get Started'))).toBeVisible();
    await element(by.text('Get Started')).tap();
    await element(by.id('loginUsername')).typeText('test');
    await element(by.id('loginPassword')).typeText('Test2024#');
    await element(by.id('signInButton')).tap();
    await expect(element(by.text('Welcome to Boxoal'))).toBeVisible();
  });
});
