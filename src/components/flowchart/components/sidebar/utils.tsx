export function getZoomData(min: number, max: number, step?: number) {
  step = step || 10;
  const data: Array<number> = [];

  for (let i = min; i <= max; i += step) {
    data.push(i);
  }

  return data;
}
