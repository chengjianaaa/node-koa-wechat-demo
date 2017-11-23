// http://zh.asoiaf.wikia.com/api/v1/Search/List?query=Tyrion%20Lannister // 查询名字 => 拿到id
// http://zh.asoiaf.wikia.com/api/v1/Articles/AsSimpleJson?id=${id} // 根据id => 查询详细信息
import R from 'ramda'
import rp from 'request-promise'
import _ from 'lodash'
import { writeFileSync } from 'fs'
import { resolve } from 'path'
 
let time = 0
let detailTime = 0
const getWikiCharacters = async () => {
  // 拿到JSON文本数据
  let characterData = require(resolve(__dirname, '../../fullCharacters.json'))
  console.log(characterData.length) 
  // 遍历JSON,根据name拿到中文wiki对应的id
  // characterData = [
  //   characterData[0],
  //   characterData[1]
  // ]
  characterData = R.map(getWikiId, characterData) // 返回Prominse数组(async 数组)
  characterData = await Promise.all(characterData)
  // 根据id拿到详细detail信息
  console.log('-------根据id拿到详细detail信息-------------')
  characterData = R.map(getWikiDetailById, characterData) // 返回Prominse数组(async 数组)
  characterData = await Promise.all(characterData)
  // console.log(characterData)
  // 格式化数据
  // 保存数据在文件系统
  writeFileSync('./chineseCharacters.json', JSON.stringify(characterData, null, 2), 'utf8')
  console.log('保存文件完成')
}
const getWikiId = async (data) => {
  // 拿到data里面的name/cname字段
  const dataName = data.cname || data.name
  // 组装请求参数
  const url = `http://zh.asoiaf.wikia.com/api/v1/Search/List?query=${encodeURI(dataName)}`
  // 开始请求
  let res = []
  try {
    res = await rp(url)
  } catch (error) {
    console.log('getWikiCharacters----' + dataName + '网络请求失败')
  }
  // 解析数据
  res = JSON.parse(res)
  res = res.items[0]
  console.log(dataName, ':', res.id, res.title, time++)
  // 保存相应字段
  // 返回id
  return R.merge(data, res) // 返回新对象,里面有id
}
const getWikiDetailById = async (data) => {
  // 拿到data里面的id字段
  const { id } = data
  // 组装请求参数
  const url = `http://zh.asoiaf.wikia.com/api/v1/Articles/AsSimpleJson?id=${id}`
  // 开始请求
  let res = []
  try {
    res = await rp(url)
  } catch (error) {
    console.log('getWikiDetailById----' + id + '----网络请求失败')
  }
  // 解析数据
  res = JSON.parse(res)

  const getCnameAndIntro = R.compose(
    i => ({
      cname: i.title,
      intro: R.map(R.prop(['text']))(i.content)
    }), // 组装好对象(需要的字段参数), 再返回
    R.pick(['title', 'content']), // 拿到title,content字段,返回一个新对象(key 和 value)
    R.nth(0), // 取数组第一个item
    R.filter(i => i.content.length), // 数组中过滤content为空的item
    R.prop('sections') // 拿到section字段里的内容(value ,不包括key)
  )
  // console.log(getCnameAndIntro(res))
  const getLevel = R.compose(
    R.project(['title', 'content', 'level']),
    R.reject(R.propEq('title', '扩展阅读')),
    R.reject(R.propEq('title', '引用与注释')),
    R.filter(i => i.content.length),
    R.prop('sections')
  )
  let cnameAndIntro = getCnameAndIntro(res)
  let sections = getLevel(res)
  // console.log(cnameAndIntro)
  // console.log(sections)
  let _res = R.merge(data, getCnameAndIntro(res))

  sections = normalizedSections(sections)
  // 保存相应字段
  _res.sections = sections
  _res.wikiId = id
  console.log(id + '-----detailTime ----- ' + detailTime++)
  return R.pick(['name', 'cname', 'playedBy', 'profile', 'images', 'nmId', 'chId', 'sections', 'intro', 'wikiId', 'words'], _res)
}
const normalizedSections = R.compose(
  R.nth(1),
  R.splitAt(1),
  R.map(
    i => ({
      level: i.level,
      title: i.title,
      content: normalizedContent(i.content)
    })
  )
)
const normalizedContent = content => _.reduce(content, (acc, item) => {
  if (item.text) acc.push(item.text)

  if (item.elements && item.elements.length) {
    let _acc = normalizedContent(item.elements)
    acc = R.concat(acc, _acc)
  }
  return acc
}, [])
getWikiCharacters()