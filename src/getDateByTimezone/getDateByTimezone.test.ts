import getDateByTimezone from './getDateByTimezone';

describe('getDateByTimezone', () => {
  it(
    'should take a date in UTC and output it in the specified timezone',
    () => {
      expect(
        getDateByTimezone('2020-12-25 00:00:00', 'Australia/Sydney')
          .toString()
      )
        .toBe(
          'Fri Dec 25 2020 00:00:00 GMT+1030 (Australian Central Daylight Time)'
        );
    }
  );

  it('should error if timezone is not set', () => {
    try {
      expect(getDateByTimezone('2020-12-25', '')).toThrow();
    } catch (ex) {
      expect(ex).toBeTruthy();
    }
  });

  it('should error if date is not set', () => {
    try {
      expect(getDateByTimezone('', 'Australia/Sydney')).toThrow();
    } catch (ex) {
      expect(ex).toBeTruthy();
    }
  });
});
