const shuffle = require("../src/shuffle");

describe('shuffle function returns an array', () => {
  test('returns an array', () => {
    const inputArray = [1, 2, 3, 4, 5];
    const result = shuffle(inputArray);
    expect(Array.isArray(result)).toBe(true);
  })})

  test('all the same items are in the array', () => {
    const inputArray = [1, 2, 3, 4, 5];
    const result = shuffle(inputArray);
    inputArray.forEach(item => {
      expect(result).toContain(item);
    });
  });
