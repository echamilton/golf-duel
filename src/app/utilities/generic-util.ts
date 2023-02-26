export const sortScores = (data: any) => {
  return data.sort((a: any, b: any) => {
    switch ('score') {
      case 'score':
        return compare(+a.score, +b.score, true);
      default:
        return 0;
    }
    function compare(a: number, b: number, isAsc: boolean) {
      return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }
  });
};

export const numbersOnlyObject = (object: any) => {
  let key;
  for (key in object) {
    if (typeof object[key] !== 'number') {
      delete object[key];
    }
  }
  return object;
};
