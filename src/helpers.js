export const pick = (o, ...keys) =>
  Object.keys(o).reduce((acc, k) => {
    if (keys.includes(k)) acc[k] = o[k]
    return acc
  }, {})

export const capitalize = st => st[0].toUpperCase() + st.slice(1)

export const mustacheIt = (strIn, vars = {}) => {

  const pattern = new RegExp('{{([0-9a-zA-Z_-]+)}}', 'g')

  return strIn.replace(pattern, (match, i, index) => {

    let result

    if (strIn[index - 1] === '{{' &&
      strIn[index + match.length] === '}}') {
      return i
    } else {
      result = vars.hasOwnProperty(i) ? vars[i] : null
      if (result === null || result === undefined) {
        return ''
      }
      return result
    }
  })
}
