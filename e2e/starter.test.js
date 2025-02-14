import { convertToTimeAndDate } from "../modules/formatters";

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
  
  it('create schedule', async () => {
    await expect(element(by.text('Welcome to Boxoal'))).toBeVisible();
    await element(by.id('createScheduleButton')).tap();
    await element(by.id('scheduleTitle')).typeText('test');
    await element(by.id('createSchedule')).tap();
  });

  it('Go to timeboxes and try to make one, no goal so fail', async () => {
    await element(by.id('timeboxesTab')).atIndex(0).tap();
    await element(by.id('11:00 15/2')).atIndex(0).tap();
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
    await element(by.id('11:00 15/2')).atIndex(0).tap();
    await element(by.id('createTimeboxTitle')).typeText('test');
    await element(by.id('createTimeboxDescription')).typeText('test');
    await element(by.id('createTimeboxBoxes')).typeText('1');
    await element(by.id('createTimebox')).tap();
  });
  

  it('Open timebox and record, check that recorded box was created', async () => {
    await element(by.id('timeboxesTab')).atIndex(0).tap();
    await element(by.id('11:00 15/2')).atIndex(0).tap();
    await element(by.id('recordButton')).tap();
    await waitFor(element(by.id('recordingOverlay')).atIndex(0)).toExist().withTimeout(5000);
    await element(by.text('Stop Recording')).atIndex(0).tap();
    await expect(element(by.id('recordedBoxText'))).toHaveText('test');
  });

  it('Clear recording and delete timebox', async () => {
    await element(by.id('timeboxesTab')).atIndex(0).tap();
    await element(by.id('11:00 15/2')).atIndex(0).tap();
    await element(by.id('editTimebox')).tap();
    await element(by.id('clearRecording')).tap();
    await element(by.id('closeAlert')).tap();
    await element(by.id('deleteTimebox')).tap();
  });

  it('Go to timeboxes and try to make one, then show it has been made', async () => {
    await element(by.id('timeboxesTab')).atIndex(0).tap();
    await element(by.id('11:00 15/2')).atIndex(0).tap();
    await element(by.id('createTimeboxTitle')).typeText('test');
    await element(by.id('createTimeboxDescription')).typeText('test');
    await element(by.id('createTimeboxBoxes')).typeText('1');
    await element(by.id('createTimebox')).tap();
  });

  it('Open timebox and test manual entry then clear recording', async () => {
    await element(by.id('timeboxesTab')).atIndex(0).tap();
    await element(by.id('11:00 15/2')).atIndex(0).tap();
    await element(by.text('Time Entry')).atIndex(0).tap();
    await element(by.text('Enter')).atIndex(0).tap();
    await element(by.id('closeAlert')).tap();
  });

  it('Edit timebox', async () => {
    await element(by.id('timeboxesTab')).atIndex(0).tap();
    await element(by.id('11:00 15/2')).atIndex(0).tap();
    await element(by.id('editTimebox')).tap();
    await element(by.id('editTitle')).typeText('test2');
    await element(by.text('Update')).atIndex(0).tap();
    await element(by.id('closeAlert')).tap();
    await element(by.id('deleteTimebox')).tap();
  });

  it('Open settings', async () => {
    await element(by.id('timeboxesTab')).atIndex(0).tap();
    await element(by.id('settingsCog')).tap();
    await element(by.text('Day')).atIndex(0).tap();
    await element(by.id('exitSettings')).tap();
    await expect(element(by.id('11:00 14/2'))).not.toExist();
  });

  it('complete goal', async () => {
    await element(by.id('goalTab')).atIndex(0).tap();
    await element(by.id('completeGoal')).tap();
    await expect(element(by.id('testgoalTitle'))).not.toExist();
  });

  it('delete schedule', async () => {
    await element(by.id('goalTab')).atIndex(0).tap();
    await element(by.id('editScheduleButton')).tap();
    await element(by.id('deleteSchedule')).tap();
  });

  //cant test boxes height due to schedule change
  //can test schedule change but borderline useless
  //not testing settings due to it being too hard to test
});
