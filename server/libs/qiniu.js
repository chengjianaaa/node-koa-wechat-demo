import qiniu from 'qiniu'
import { exec } from 'shelljs'

const BUCKET = 'ice-and-fire'
export const updateImage = async (url, key) => new Promise((resolve, reject) => {
  let bash = `qshell fetch ${url} ${BUCKET} ${key}`

  exec(bash, (code, stdout, stderr) => {
    if (stderr) return reject(stderr)
    if (stdout === 'Fetch error, 504 , xreqid:') return reject(stdout)

    resolve(stdout)
  })
})