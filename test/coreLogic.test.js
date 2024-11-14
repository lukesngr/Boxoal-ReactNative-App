import { 
  calculateMaxNumberOfBoxesAfterTimeIfEmpty,
  calculateBoxesBetweenTwoTimes,
  calculateMaxNumberOfBoxes,
  addBoxesToTime,
  calculateOverlayHeightForNow,
  calculateSizeOfRecordingOverlay,
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

describe('Box Calculation Functions', () => {
  describe('calculateMaxNumberOfBoxesAfterTimeIfEmpty', () => {
    test('handles minutes with time ahead of wakeup', () => {
      const result = calculateMaxNumberOfBoxesAfterTimeIfEmpty('min', 15, [12, 45], [8, 30]);
      expect(result).toBe(79);
    });

    test('handles minutes with time behind wakeup', () => {
      const result = calculateMaxNumberOfBoxesAfterTimeIfEmpty('min', 15, [7, 45], [8, 30]);
      expect(result).toBe(3);
    });

    test('handles hours with time ahead of wakeup', () => {
      const result = calculateMaxNumberOfBoxesAfterTimeIfEmpty('hr', 1, [12, 0], [8, 0]);
      expect(result).toBe(20);
    });

    test('handles hours with time behind wakeup', () => {
      const result = calculateMaxNumberOfBoxesAfterTimeIfEmpty('hr', 1, [7, 0], [8, 0]);
      expect(result).toBe(1);
    });

    test('handles edge case with non-divisible minutes', () => {
      const result = calculateMaxNumberOfBoxesAfterTimeIfEmpty('min', 15, [12, 47], [8, 30]);
      expect(result).toBe(79);
    });
  });

  describe('calculateMaxNumberOfBoxes', () => {
    test('handles empty schedule', () => {
      const result = calculateMaxNumberOfBoxes('08:30', 'min', 15, [], '12:45', '1/1');
      expect(result).toBe(79);
    });

    test('handles schedule with one future timebox', () => {
      const timeboxes = [{
        startTime: '2024-01-01T14:00:00'
      }];
      const result = calculateMaxNumberOfBoxes('08:30', 'min', 15, timeboxes, '12:45', '1/1');
      expect(result).toBe(5);
    });

    test('handles schedule with multiple timeboxes', () => {
      const timeboxes = [
        { startTime: '2024-01-01T14:00:00' },
        { startTime: '2024-01-01T16:00:00' }
      ];
      const result = calculateMaxNumberOfBoxes('08:30', 'min', 15, timeboxes, '12:45', '1/1');
      expect(result).toBe(5);
    });
  });
});

describe('Overlay and Recording Functions', () => {
  describe('calculateOverlayHeightForNow', () => {
    test('handles standard case', () => {
      const overlayDimensions = { timeboxHeight: 50, headerWidth: 100 };
      const result = calculateOverlayHeightForNow('08:30', 'min', 15, overlayDimensions);
      expect(typeof result).toBe('number');
      expect(result).toBeGreaterThanOrEqual(0);
    });

    test('handles uninitialized dimensions', () => {
      const overlayDimensions = { headerWidth: 0 };
      const result = calculateOverlayHeightForNow('08:30', 'min', 15, overlayDimensions);
      expect(result).toBe(0);
    });
  });

  describe('calculateSizeOfRecordingOverlay', () => {
    const overlayDimensions = {
      overlayHeight: 1000,
      headerHeight: 50,
      timeboxHeight: 50
    };

    test('handles past recording', () => {
      const day = { date: 14 };
      const currentDate = dayjs().date(15);
      const recordedStartTime = currentDate.subtract(1, 'day').toISOString();
      const result = calculateSizeOfRecordingOverlay(
        '08:30',
        'min',
        15,
        overlayDimensions,
        500,
        day,
        recordedStartTime
      );
      expect(result).toEqual([1000, 50]);
    });

    test('handles current day recording', () => {
      const day = { date: dayjs().date() };
      const recordedStartTime = dayjs().toISOString();
      const result = calculateSizeOfRecordingOverlay(
        '08:30',
        'min',
        15,
        overlayDimensions,
        500,
        day,
        recordedStartTime
      );
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(2);
    });
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
      expect(getProgressWithGoal(timeboxes)).toBe(80);
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

    test('handles delayed start', () => {
      const recordedStartTime = new Date('2024-01-15T08:30:00');
      const recordedEndTime = new Date('2024-01-15T09:30:00');
      const result = calculateXPPoints(timeboxData, recordedStartTime, recordedEndTime);
      expect(result).toBe(1.5);
    });

    test('handles very delayed start', () => {
      const recordedStartTime = new Date('2024-01-15T10:00:00');
      const recordedEndTime = new Date('2024-01-15T11:00:00');
      const result = calculateXPPoints(timeboxData, recordedStartTime, recordedEndTime);
      expect(result).toBe(1.5);
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