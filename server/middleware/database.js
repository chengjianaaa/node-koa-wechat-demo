import mongoose from 'mongoose'
import config from '../config'
import fs from 'fs'
import { resolve } from 'path'

const modelsPath = resolve(__dirname,'../database/schema')

fs.readdirSync(modelsPath)
  // .filter(file => ~file.search(/^[^\.].*\.js$/))
  // str.search() //如果匹配成功，则 search() 返回正则表达式在字符串中首次匹配项的索引。否则，返回 -1。
  // boolean -1 => true  0 => false
  .filter(file => !file.search(/^[^\.].*\.js$/))  // 若能匹配 则索引为0(需要整个文件名符合该正则,不是部分)
  .forEach(file => require(resolve(modelsPath, file)))

export const database = app => {
  if (app.env === 'development') {
    console.log('mongoose开启调试模式')
    mongoose.set('debug', true)
  }
  // 连接mongo
  mongoose.connect(config.db)

  // 监听事件
  mongoose.connection.on('disconnected', () => {
    console.log('mongoose 失去连接disconnected')
    mongoose.connect(config.db)
  })
  mongoose.connection.on('error', err => {
    console.log('mongoose 连接错误error')
    console.error(err)
  })
  mongoose.connection.on('open', async () => {
    console.log('连接到mongodo数据库 :', config.db)
  })
  
}
