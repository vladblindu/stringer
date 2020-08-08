export const pick = (o, ...keys) =>
  Object.keys(o).reduce((acc, k) => {
    if (keys.includes(k)) acc[k] = o[k]
    return acc
  }, {})

export const capitalize = st => st[0].toUpperCase() + st.slice(1)
