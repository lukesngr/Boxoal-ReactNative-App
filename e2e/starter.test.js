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
  });

  /* test worked so made schedule for user
  it('create schedule', async () => {
    await expect(element(by.text('Welcome to Boxoal'))).toBeVisible();
    await element(by.id('createScheduleButton')).tap();
    await element(by.id('scheduleTitle')).typeText('test');
    await element(by.id('createSchedule')).tap();
  });*/
});
