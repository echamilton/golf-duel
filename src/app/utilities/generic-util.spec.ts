import { cloneMe, numbersOnlyObject, sortScores } from './generic-util';

describe('generic-util', () => {
  it('should sort the scores accordingly', () => {
    const testDataObject = [
      {
        name: 'Bob',
        score: 15
      },
      {
        name: 'Dude',
        score: 3
      }
    ];

    const resultObject = sortScores(testDataObject);
    expect(resultObject[0].name).toEqual('Dude');
    expect(resultObject[1].name).toEqual('Bob');
  });

  it('should not sort the value accordingly', () => {
    const testDataObject = [
      {
        name: 'Bob',
        value: 15
      },
      {
        name: 'Dude',
        value: 3
      }
    ];

    const resultObject = sortScores(testDataObject);
    expect(resultObject[0].name).toEqual('Bob');
    expect(resultObject[1].name).toEqual('Dude');
  });

  it('should remove keys that do not have numbers', () => {
    const testDataObject = {
      name: 'Bob',
      age: 15
    };

    const expectedObject = {
      age: 15
    };

    const resultObject = numbersOnlyObject(testDataObject);
    expect(expectedObject).toStrictEqual(resultObject);
  });

  it('should create a copy of deep object', () => {
    const expectedObject = {
      name: 'Bob',
      other: {
        age: 15
      }
    };

    const resultObject = cloneMe(expectedObject);

    expect(expectedObject).toStrictEqual(resultObject);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
