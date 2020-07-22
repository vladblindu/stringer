export const pick = (o, ...keys) =>
  Object.keys(o).reduce((acc, k) => {
    if (keys.includes(k)) acc[k] = o[k]
    return acc
  }, {})
