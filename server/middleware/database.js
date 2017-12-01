import mongoose from 'mongoose'
import config from '../config'
import fs from 'fs'
import { resolve } from 'path'
import R from 'ramda'

const modelsPath = resolve(__dirname, '../database/schema')
const ROLE_ADMIN = 'admin'

fs.readdirSync(modelsPath)
  // .filter(file => ~file.search(/^[^\.].*\.js$/))
  // str.search() //如果匹配成功，则 search() 返回正则表达式在字符串中首次匹配项的索引。否则，返回 -1。
  // boolean -1 => true  0 => false
  .filter(file => !file.search(/^[^\.].*\.js$/))  // 若能匹配 则索引为0(需要整个文件名符合该正则,不是部分)
  .forEach(file => require(resolve(modelsPath, file)))

const wikiHouseData = require(resolve(__dirname, '../database/json/wikiHousesWithSwornMembers.json'))
let wikiCharacterData = require(resolve(__dirname, '../database/json/qiniuCharacters.json'))

// 保证_id与nmId一致
wikiCharacterData = R.map(i => {
  i._id = i.nmId
  return i
})(wikiCharacterData) 

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
    // 判断数据库是否存在该数据
    const wikiHouseModel = mongoose.model('WikiHouse')
    const wikiCharacterModel = mongoose.model('WikiCharacter')
    
    const isExistWikiHouse = await wikiHouseModel.find({}).exec()
    const isExistWikiCharacterModel = await wikiCharacterModel.find({}).exec()
    if (!isExistWikiHouse.length) {
      wikiHouseModel.insertMany(wikiHouseData)
    } else {
      console.log('wikiHouseModel 已存在数据')
    }
    if (!isExistWikiCharacterModel.length) {
      wikiCharacterModel.insertMany(wikiCharacterData)
    } else {
      console.log('wikiCharacterModel 已存在数据')
    }
    // 增加管理员帐号
    let User = mongoose.model('User')
    let adminUser = await User.findOne({
      email: 'admin@admin.com'
    }).exec()
    // 判断是否提前录入管理员帐号
    if (!adminUser) {
      console.log('正在录入管理员......' + config.admin_email)
      // 录入
      adminUser = new User({
        email: config.admin_email,
        password: config.admin_password,
        role: ROLE_ADMIN
      })
      await adminUser.save()
      console.log('录入管理员' + adminUser.email + '完成')
    }
    // 放行(什么也不做)
  })
}
