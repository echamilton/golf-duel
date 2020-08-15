
export function sortScores(data: any) {
return data.sort((a, b) => {
    switch ('score') {
      case 'score': return compare(+a.score, +b.score, true);
      default: return 0;
    }
    function compare(a, b, isAsc) {
      return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }
  });
}
