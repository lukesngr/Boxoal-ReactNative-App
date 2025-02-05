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

  /*
  it('Go to timeboxes and try to make one, no goal so fail', async () => {
    await element(by.id('timeboxesTab')).atIndex(0).tap();
    await element(by.id('10:30 6/2')).atIndex(0).tap();
    await element(by.id('createTimeboxTitle')).typeText('test');
    await element(by.id('createTimeboxDescription')).typeText('test');
    await element(by.id('createTimeboxBoxes')).typeText('1');
    await element(by.id('createTimebox')).tap();
    await expect(element(by.id('alertMessage'))).toHaveText('Please create a goal before creating a timebox');
  });

  it('Go to goals and make one', async () => {
    await element(by.id('goalTab')).atIndex(0).tap();
    await element(by.id('addGoalButton')).tap();
    await element(by.id('createGoalTitle')).typeText('test');
    await element(by.id('createGoalButton')).tap();
  });

  it('try to make second one and get rejected', async () => {
    await element(by.id('goalTab')).atIndex(0).tap();
    await element(by.id('addGoalButton')).tap();
    await element(by.id('createGoalTitle')).typeText('test');
    await element(by.id('createGoalButton')).tap();
    await expect(element(by.id('alertMessage'))).toHaveText('Please complete more goals and we will unlock more goal slots for you!');
  });

  it('Go to timeboxes and try to make one, then show it has been made', async () => {
    await element(by.id('timeboxesTab')).atIndex(0).tap();
    await element(by.id('10:30 6/2')).atIndex(0).tap();
    await element(by.id('createTimeboxTitle')).typeText('test');
    await element(by.id('createTimeboxDescription')).typeText('test');
    await element(by.id('createTimeboxBoxes')).typeText('1');
    await element(by.id('createTimebox')).tap();
  });*/

  it('Open timebox and record', async () => {
    await element(by.id('timeboxesTab')).atIndex(0).tap();
    await element(by.id('10:30 6/2')).atIndex(0).tap();
    await element(by.id('recordingOverlay')).toExist().withTimeout(5000);
  });
});
