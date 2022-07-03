export function isEmptyObject(obj: any) {
  /*
      Apparently the fastest way to check if  object is empty
      https://jsbench.me/qfkqv692c8/1
  */

  // eslint-disable-next-line guard-for-in
  for (const _i in obj) return false;
  return true;
}
