import mongoose from 'mongoose'
const Product = mongoose.model('Product')
export async function getProduct(limit = 10) {
  try {    
    // 获取查询参数limit
    // 查询数据库
    let retData = await Product.find({}).limit(Number(limit)).exec()
    return retData
  } catch (error) {
    throw error
  }
}
export async function getProductById(id) {
  try {
    // 查询数据库
    let retData = await Product.findOne({
      _id: id
    }).exec()
    return retData
  } catch (error) {
    throw error
  }
}
export async function postProduct(product) {
  try {    
    // 保存到数据库
    // TODO 判断是否储存成功
    product = new Product(product)
    product = await product.save()
    return product
  } catch (error) {
    throw error
  }
}
export async function putProduct(product) {
  try {
    // 保存到数据库
    // TODO 判断是否储存成功
    // product = new Product(product)
    product = await product.save()
    return product
  } catch (error) {
    throw error
  }
}
export async function delProduct(product) {
  try {
    // 保存到数据库
    // TODO 判断是否删除成功
    await product.remove()
  } catch (error) {
    throw error
  }
}