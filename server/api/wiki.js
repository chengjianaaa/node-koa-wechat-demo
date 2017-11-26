import mongoose from 'mongoose'
const WikiHouse = mongoose.model('WikiHouse')
const WikiCharacter = mongoose.model('WikiCharacter')
export async function getHouse(limit = 10) {
  // 获取查询参数limit
  // 查询数据库
  let retData = await WikiHouse.find({}).limit(Number(limit)).populate({
    path: 'swornMembers.character',
    select: '_id name cname profile'
  }).exec()
  return retData
}
export async function getHouseById(id) {
  // 获取查询参数limit
  // 查询数据库
  let retData = await WikiHouse.findOne({
    _id: id
  }).populate({
    path: 'swornMembers.character',
    select: '_id name cname profile'
  }).exec()
  return retData
}
export async function getCharacter(limit = 20) {
  // 获取查询参数limit
  // 查询数据库
  let retData = await WikiCharacter.find({}).limit(Number(limit)).exec()
  return retData
}
export async function getCharacterById(id) {
  // 获取查询参数limit
  // 查询数据库
  let retData = await WikiCharacter.findOne({
    _id: id
  }).exec()
  return retData
}