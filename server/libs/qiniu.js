import qiniu from 'qiniu'
import { exec } from 'shelljs'
import config from '../config'
const accessKey = config.qiniu_accessKey
const secretKey = config.qiniu_secretKey
const mac = new qiniu.auth.digest.Mac(accessKey, secretKey)
// let config = new qiniu.conf.Config()
// // 空间对应的机房
// config.zone = qiniu.zone.Zone_z2
const BUCKET = 'ice-and-fire' // 对象储存仓库名字
// let bucketManager = new qiniu.rs.BucketManager(mac, config)

// 获取上传凭证
export const getUploadtoken = (key) => {
  const options = {
    scope: BUCKET + ':' + key
  }
  let putPolicy = new qiniu.rs.PutPolicy(options)
  let uploadToken = putPolicy.uploadToken(mac)
  console.log(' 当前的上传凭证为 ----' + uploadToken)
  return uploadToken
}
export const updateImage = async (url, key) => new Promise((resolve, reject) => {
  let bash = `qshell fetch ${url} ${BUCKET} ${key}`

  exec(bash, (code, stdout, stderr) => {
    if (stderr) return reject(stderr)
    if (stdout === 'Fetch error, 504 , xreqid:') return reject(stdout)

    resolve(stdout)
  })
})