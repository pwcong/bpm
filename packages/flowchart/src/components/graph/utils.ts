// 一定会多余两个点
export function getDot(points, scale) {
  const ps: { x: number; y: number }[] = points.slice(-2);
  let { x: xa, y: ya } = ps[0];
  let { x: xb, y: yb } = ps[1];
  xa = xa / scale;
  ya = ya / scale;
  xb = xb / scale;
  yb = yb / scale;
  const x = xb - xa;
  const y = yb - ya;

  // 勾股定理
  const len = Math.pow(Math.pow(x, 2) + Math.pow(y, 2), 0.5);
  if (len > 50) {
    const xc = (1 - 40 / len) * x + xa;
    const yc = (1 - 40 / len) * y + ya;
    return {
      x: xc,
      y: yc,
    };
  }
  const allX = xa + xb;
  const allY = ya + yb;
  return {
    x: allX / 2,
    y: allY / 2,
  };
}
