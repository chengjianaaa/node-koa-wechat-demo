import mongoose from 'mongoose'
const WikiHouse = mongoose.model('WikiHouse')
const WikiCharacter = mongoose.model('WikiCharacter')
export async function getHouse(limit = 10) {
  try {
    // 获取查询参数limit
    // 查询数据库
    let retData = await WikiHouse.find({}).limit(Number(limit)).populate({
      path: 'swornMembers.character',
      select: '_id name cname profile'
    }).exec()
    return retData
  } catch (error) {
    throw error
  }
}
export async function getHouseById(id) {
  try {
    // 根据id
    // 查询数据库
    let retData = await WikiHouse.findOne({
      _id: id
    }).populate({
      path: 'swornMembers.character',
      select: '_id name cname profile'
    }).exec()
    return retData
  } catch (error) {
    throw error
  }
}
export async function getCharacter(limit = 20) {
  try {
    // 获取查询参数limit
    // 查询数据库
    let retData = await WikiCharacter.find({}).limit(Number(limit)).exec()
    return retData
  } catch (error) {
    throw error
  }
}
export async function getCharacterById(id) {
  try {
    // 根据id
    // 查询数据库
    let retData = await WikiCharacter.findOne({
      _id: id
    }).exec()
    return retData
  } catch (error) {
    throw error
  }
}