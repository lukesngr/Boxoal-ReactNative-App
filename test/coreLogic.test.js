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

describe('calculateBoxesBetweenTwoTimes', () => {
  describe('minute-based calculations', () => {
    const boxSizeUnit = 'min';

    test('calculates boxes for same hour different minutes', () => {
      const time1 = dayjs('2024-01-15T10:00:00');
      const time2 = dayjs('2024-01-15T10:30:00');
      expect(calculateBoxesBetweenTwoTimes(time1, time2, boxSizeUnit, 15)).toBe(2);
    });

    test('calculates boxes across hour boundary', () => {
      const time1 = dayjs('2024-01-15T10:45:00');
      const time2 = dayjs('2024-01-15T11:15:00');
      expect(calculateBoxesBetweenTwoTimes(time1, time2, boxSizeUnit, 15)).toBe(2);
    });

    test('handles non-aligned start time', () => {
      const time1 = dayjs('2024-01-15T10:05:00');
      const time2 = dayjs('2024-01-15T10:30:00');
      // Should floor the result - partial boxes at start aren't counted
      expect(calculateBoxesBetweenTwoTimes(time1, time2, boxSizeUnit, 15)).toBe(1);
    });

    test('handles non-aligned end time', () => {
      const time1 = dayjs('2024-01-15T10:00:00');
      const time2 = dayjs('2024-01-15T10:37:00');
      // Should floor the result - partial boxes at end aren't counted
      expect(calculateBoxesBetweenTwoTimes(time1, time2, boxSizeUnit, 15)).toBe(2);
    });

    test('handles multiple hours difference', () => {
      const time1 = dayjs('2024-01-15T10:00:00');
      const time2 = dayjs('2024-01-15T12:00:00');
      expect(calculateBoxesBetweenTwoTimes(time1, time2, boxSizeUnit, 15)).toBe(8);
    });

    test('handles reversed times', () => {
      const time1 = dayjs('2024-01-15T12:00:00');
      const time2 = dayjs('2024-01-15T10:00:00');
      expect(calculateBoxesBetweenTwoTimes(time1, time2, boxSizeUnit, 15)).toBe(-8);
    });

    test('handles different box sizes', () => {
      const time1 = dayjs('2024-01-15T10:00:00');
      const time2 = dayjs('2024-01-15T11:00:00');
      expect(calculateBoxesBetweenTwoTimes(time1, time2, boxSizeUnit, 30)).toBe(2);
    });

    test('handles exact box size alignments', () => {
      const time1 = dayjs('2024-01-15T10:00:00');
      const time2 = dayjs('2024-01-15T10:45:00');
      expect(calculateBoxesBetweenTwoTimes(time1, time2, boxSizeUnit, 15)).toBe(3);
    });
  });

  describe('hour-based calculations', () => {
    const boxSizeUnit = 'hr';

    test('calculates full hours', () => {
      const time1 = dayjs('2024-01-15T10:00:00');
      const time2 = dayjs('2024-01-15T12:00:00');
      expect(calculateBoxesBetweenTwoTimes(time1, time2, boxSizeUnit, 1)).toBe(2);
    });

    test('handles partial hours', () => {
      const time1 = dayjs('2024-01-15T10:30:00');
      const time2 = dayjs('2024-01-15T12:45:00');
      // Should only count complete hours
      expect(calculateBoxesBetweenTwoTimes(time1, time2, boxSizeUnit, 1)).toBe(2);
    });

    test('handles 2-hour box sizes', () => {
      const time1 = dayjs('2024-01-15T10:00:00');
      const time2 = dayjs('2024-01-15T14:00:00');
      expect(calculateBoxesBetweenTwoTimes(time1, time2, boxSizeUnit, 2)).toBe(2);
    });

    test('handles reversed times with hours', () => {
      const time1 = dayjs('2024-01-15T14:00:00');
      const time2 = dayjs('2024-01-15T10:00:00');
      expect(calculateBoxesBetweenTwoTimes(time1, time2, boxSizeUnit, 1)).toBe(-4);
    });

    test('handles non-divisible hour ranges', () => {
      const time1 = dayjs('2024-01-15T10:00:00');
      const time2 = dayjs('2024-01-15T13:00:00');
      expect(calculateBoxesBetweenTwoTimes(time1, time2, boxSizeUnit, 2)).toBe(1);
    });
  });

  describe('edge cases', () => {
    test('handles same time', () => {
      const time = dayjs('2024-01-15T10:00:00');
      expect(calculateBoxesBetweenTwoTimes(time, time, 'min', 15)).toBe(0);
      expect(calculateBoxesBetweenTwoTimes(time, time, 'hr', 1)).toBe(0);
    });

    test('handles minute difference but not enough for a box', () => {
      const time1 = dayjs('2024-01-15T10:00:00');
      const time2 = dayjs('2024-01-15T10:14:00');
      expect(calculateBoxesBetweenTwoTimes(time1, time2, 'min', 15)).toBe(0);
    });

    test('handles exactly one box size difference', () => {
      const time1 = dayjs('2024-01-15T10:00:00');
      const time2 = dayjs('2024-01-15T10:15:00');
      expect(calculateBoxesBetweenTwoTimes(time1, time2, 'min', 15)).toBe(1);
    });

    test('handles midnight boundary', () => {
      const time1 = dayjs('2024-01-15T23:45:00');
      const time2 = dayjs('2024-01-16T00:15:00');
      // Note: This might need adjustment based on how you want to handle day boundaries
      expect(calculateBoxesBetweenTwoTimes(time1, time2, 'min', 15)).toBe(2);
    });

    test('handles very large time differences', () => {
      const time1 = dayjs('2024-01-15T00:00:00');
      const time2 = dayjs('2024-01-15T23:59:00');
      expect(calculateBoxesBetweenTwoTimes(time1, time2, 'hr', 1)).toBe(23);
    });
  });

});



/*
describe('calculatePixelsFromTopOfGridBasedOnTime', () => {
  // Setup common test variables
  const overlayDimensions = {
    headerWidth: 100,
    timeboxHeight: 50,
    headerHeight: 20,
    overlayHeight: 1000
  };

  describe('when dimensions not initialized', () => {
    test('should return 0 when headerWidth is 0', () => {
      const unsetDimensions = { ...overlayDimensions, headerWidth: 0 };
      const time = dayjs('2024-01-15T10:00:00');
      
      const result = calculatePixelsFromTopOfGridBasedOnTime(
        '08:30',
        'min',
        15,
        unsetDimensions,
        time
      );
      
      expect(result).toBe(0);
    });
  });

  describe('minute-based calculations', () => {
    test('should calculate correct pixels when time is after wakeup time', () => {
      const time = dayjs('2024-01-15T10:30:00'); // 2 hours after wakeup
      
      const result = calculatePixelsFromTopOfGridBasedOnTime(
        '08:30',
        'min',
        15,
        overlayDimensions,
        time
      );
      
      // 8 boxes (2 hours = 8 15-min boxes) * 50 pixels per box
      expect(result).toBe(400);
    });

    test('should calculate correct pixels when time includes partial box', () => {
      const time = dayjs('2024-01-15T08:37:00'); // 7 minutes after wakeup
      
      const result = calculatePixelsFromTopOfGridBasedOnTime(
        '08:30',
        'min',
        15,
        overlayDimensions,
        time
      );
      
      // 7 minutes = (7/15) * 50 pixels
      expect(result).toBe(23.333333333333336);
    });

    test('should handle time before wakeup time on same day', () => {
      const time = dayjs('2024-01-15T07:30:00'); // 1 hour before wakeup
      
      const result = calculatePixelsFromTopOfGridBasedOnTime(
        '08:30',
        'min',
        15,
        overlayDimensions,
        time
      );
      
      // Should calculate from previous day's wakeup time
      expect(result).toBe(5750); // (23 hours + 0 minutes) worth of pixels
    });
  });

  describe('hour-based calculations', () => {
    test('should calculate correct pixels for full hours after wakeup', () => {
      const time = dayjs('2024-01-15T11:30:00'); // 3 hours after wakeup
      
      const result = calculatePixelsFromTopOfGridBasedOnTime(
        '08:30',
        'hr',
        1,
        overlayDimensions,
        time
      );
      
      // 3 boxes * 50 pixels per box
      expect(result).toBe(150);
    });

    test('should handle partial hours correctly', () => {
      const time = dayjs('2024-01-15T09:45:00'); // 1.25 hours after wakeup
      
      const result = calculatePixelsFromTopOfGridBasedOnTime(
        '08:30',
        'hr',
        1,
        overlayDimensions,
        time
      );
      
      // 1.25 boxes * 50 pixels per box
      expect(result).toBe(62.5);
    });
  });

  describe('edge cases', () => {
    test('should handle midnight crossover correctly', () => {
      const time = dayjs('2024-01-16T00:30:00'); // 30 minutes after midnight
      
      const result = calculatePixelsFromTopOfGridBasedOnTime(
        '08:30',
        'min',
        15,
        overlayDimensions,
        time
      );
      
      // Should calculate from previous day's wakeup time
      expect(result).toBe(3850); // (16 hours worth of pixels)
    });

    test('should handle exact wakeup time', () => {
      const time = dayjs('2024-01-15T08:30:00'); // Exactly at wakeup time
      
      const result = calculatePixelsFromTopOfGridBasedOnTime(
        '08:30',
        'min',
        15,
        overlayDimensions,
        time
      );
      
      expect(result).toBe(0);
    });

    test('should handle time far before wakeup time', () => {
      const time = dayjs('2024-01-15T01:30:00'); // Early morning
      
      const result = calculatePixelsFromTopOfGridBasedOnTime(
        '08:30',
        'min',
        15,
        overlayDimensions,
        time
      );
      
      // Should calculate from previous day's wakeup time
      expect(result).toBe(4100); // (17 hours worth of pixels)
    });

    test('should handle negative remainder time', () => {
      const time = dayjs('2024-01-15T08:20:00'); // 10 minutes before wakeup
      
      const result = calculatePixelsFromTopOfGridBasedOnTime(
        '08:30',
        'min',
        15,
        overlayDimensions,
        time
      );
      
      // Should handle the negative remainder correctly
      expect(result).toBe(5733.333333333334); // (23 hours + 50 minutes worth of pixels)
    });
  });

  describe('different box sizes', () => {
    test('should handle 30-minute boxes', () => {
      const time = dayjs('2024-01-15T09:30:00'); // 1 hour after wakeup
      
      const result = calculatePixelsFromTopOfGridBasedOnTime(
        '08:30',
        'min',
        30,
        overlayDimensions,
        time
      );
      
      // 2 boxes * 50 pixels per box
      expect(result).toBe(100);
    });

    test('should handle 2-hour boxes', () => {
      const time = dayjs('2024-01-15T12:30:00'); // 4 hours after wakeup
      
      const result = calculatePixelsFromTopOfGridBasedOnTime(
        '08:30',
        'hr',
        2,
        overlayDimensions,
        time
      );
      
      // 2 boxes * 50 pixels per box
      expect(result).toBe(100);
    });
  });
});*/

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