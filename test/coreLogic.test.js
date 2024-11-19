import { 
  calculateMaxNumberOfBoxesAfterTimeIfEmpty,
  calculateBoxesBetweenTwoTimes,
  calculateMaxNumberOfBoxes,
  addBoxesToTime,
  calculateOverlayHeightForNow,
  calculateSizeOfRecordingOverlay,
  calculatePixelsFromTopOfGridBasedOnTime,
  thereIsNoRecording,
  generateTimeBoxGrid,
  getHeightForBoxes,
  getProgressWithGoal,
  getDateWithSuffix,
  goToDay,
  filterRecordingBasedOnDay,
  calculateXPPoints,
  getProgressAndLevel,
  convertToDayjs,
  convertToTimeAndDate
} from '../modules/coreLogic';
import dayjs from 'dayjs';
import { calculateRemainderTimeBetweenTwoTimes } from '../modules/formatters';

describe('Time and Date Conversion Functions', () => {
  test('convertToDayjs handles standard time and date', () => {
    const result = convertToDayjs('14:30', '15/1');
    expect(result.format('HH:mm DD/MM')).toBe('14:30 15/01');
  });

  test('convertToDayjs handles midnight', () => {
    const result = convertToDayjs('00:00', '1/1');
    expect(result.format('HH:mm DD/MM')).toBe('00:00 01/01');
  });

  test('convertToTimeAndDate handles standard datetime', () => {
    const input = new Date('2024-01-15T14:30:00');
    const [time, date] = convertToTimeAndDate(input);
    expect(time).toBe('14:30');
    expect(date).toBe('15/1');
  });

  test('convertToTimeAndDate handles midnight', () => {
    const input = new Date('2024-01-15T00:00:00');
    const [time, date] = convertToTimeAndDate(input);
    expect(time).toBe('00:00');
    expect(date).toBe('15/1');
  });
});

describe('Recording and Progress Functions', () => {
  describe('thereIsNoRecording', () => {
    test('handles empty recorded boxes', () => {
      expect(thereIsNoRecording([], null, '1/1', '08:00')).toBe(true);
    });

    test('handles daily reoccurring with match', () => {
      const recordedBoxes = [{
        recordedStartTime: new Date('2024-01-15T08:00:00')
      }];
      const reoccuring = { reoccurFrequency: 'daily' };
      expect(thereIsNoRecording(recordedBoxes, reoccuring, '15/1', '08:00')).toBe(false);
    });

    test('handles daily reoccurring without match', () => {
      const recordedBoxes = [{
        recordedStartTime: new Date('2024-01-15T08:00:00')
      }];
      const reoccuring = { reoccurFrequency: 'daily' };
      expect(thereIsNoRecording(recordedBoxes, reoccuring, '16/1', '08:00')).toBe(true);
    });
  });

  describe('getProgressWithGoal', () => {
    test('handles empty timeboxes', () => {
      expect(getProgressWithGoal([])).toBe(100);
    });

    test('handles timeboxes with recordings', () => {
      const timeboxes = [
        { recordedTimeBoxes: [{}], goalPercentage: 0.5 },
        { recordedTimeBoxes: [{}], goalPercentage: 0.3 }
      ];
      expect(getProgressWithGoal(timeboxes)).toBe(1);
    });

    test('handles timeboxes without recordings', () => {
      const timeboxes = [
        { recordedTimeBoxes: [], goalPercentage: 0.5 },
        { recordedTimeBoxes: [], goalPercentage: 0.5 }
      ];
      expect(getProgressWithGoal(timeboxes)).toBe(0);
    });
  });
});

describe('XP and Level Functions', () => {
  describe('calculateXPPoints', () => {
    const timeboxData = {
      startTime: '2024-01-15T08:00:00',
      endTime: '2024-01-15T09:00:00'
    };

    test('handles perfect timing', () => {
      const recordedStartTime = new Date('2024-01-15T08:00:00');
      const recordedEndTime = new Date('2024-01-15T09:00:00');
      const result = calculateXPPoints(timeboxData, recordedStartTime, recordedEndTime);
      expect(result).toBe(2);
    });

    //testing this isnt that iedge cases
    test('makes sure not 0', () => {
      const recordedStartTime = new Date('2024-01-15T01:00:00');
      const recordedEndTime = new Date('2024-05-21T21:00:00');
      const result = calculateXPPoints(timeboxData, recordedStartTime, recordedEndTime);
      expect(result).toBeGreaterThan(0);
    });
  });

  describe('getProgressAndLevel', () => {
    test('handles low XP points', () => {
      const result = getProgressAndLevel(5);
      expect(result).toEqual({ progress: 0, level: 1 });
    });

    test('handles medium XP points', () => {
      const result = getProgressAndLevel(50);
      expect(result.level).toBeGreaterThan(1);
      expect(result.progress).toBeGreaterThanOrEqual(0);
      expect(result.progress).toBeLessThanOrEqual(1);
    });

    test('handles high XP points', () => {
      const result = getProgressAndLevel(1000);
      expect(result.level).toBeGreaterThan(10);
      expect(result.progress).toBeGreaterThanOrEqual(0);
      expect(result.progress).toBeLessThanOrEqual(1);
    });
  });
});