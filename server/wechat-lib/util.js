import xml2js from 'xml2js'
export function parseXML(xml) {
  return new Promise((resolve, reject) => {
    xml2js.parseString(xml, {trim: true}, (err, json) => {
      if (err) {
        reject(err)
      } else {
        resolve(json)
      }
    })
  })
}
