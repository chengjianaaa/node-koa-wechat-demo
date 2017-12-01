import rp from 'request-promise'
import _ from 'lodash'
import { writeFileSync } from 'fs'

const PAGE_SIZE = 50 // 每页数据个数
let charactersData = []
const sleep = time => new Promise((resolve, reject) => {
  setTimeout(resolve, time)
})
let CURRENT_TIME = 0
export const getAllCharacterData = async (currentPage = 1) => {
  // url: 'https://www.anapioficeandfire.com/api/characters?page=1&pageSize=10',
  // 构建请求参数
  const url = `https://www.anapioficeandfire.com/api/characters?page=${currentPage}&pageSize=${PAGE_SIZE}` 
  let data = await rp(url)
  console.log('------正在爬虫------getAllCharacterData------第 ' + currentPage + '页')
  data = JSON.parse(data) // 转为JSON
  console.log('------分析爬虫------getAllCharacterData------共爬到 ' + data.length + ' 条数据------现在共有------' + (data.length + charactersData.length))
  CURRENT_TIME++
  console.log('------处理爬虫------组装数据------' + CURRENT_TIME)
  charactersData = _.union(charactersData, data) // TODO: 自己实现union
  if (data.length < PAGE_SIZE) {
    console.log('------结束爬虫------写入JSON文件------开始-----')
    console.log('------结束爬虫------写入JSON文件------完成-----')
  } else {
    // 写入JSON文件
    writeFileSync('./characters.json', JSON.stringify(charactersData, null, 2), 'utf8') // 共2100多条
    await sleep(1000) // 休息1s
    getAllCharacterData(++currentPage)
  }
}