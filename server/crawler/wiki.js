// http://zh.asoiaf.wikia.com/api/v1/Search/List?query=Tyrion%20Lannister // 查询名字 => 拿到id
// http://zh.asoiaf.wikia.com/api/v1/Articles/AsSimpleJson?id=${id} // 根据id => 查询详细信息
import R from 'ramda'
import rp from 'request-promise'
import _ from 'lodash'
import { writeFileSync } from 'fs'
import { resolve } from 'path'
import { updateImage } from '../libs/qiniu'
import randomToken from 'random-token'
let time = 0 // getWikiId 请求次数
let detailTime = 0 // getWikiDetailById 请求次数
// 待查询的9大家族
const HOUSES = [
  {
    name: 'House Stark of Winterfell',
    cname: '史塔克家族',
    words: 'Winter is Coming'
  },
  {
    name: 'House Targaryen',
    cname: '坦格利安家族',
    words: 'Fire and Blood'
  },
  {
    name: 'House Lannister of Casterly Rock',
    cname: '兰尼斯特家族',
    words: 'Hear Me Roar!'
  },
  {
    name: 'House Arryn of the Eyrie',
    cname: '艾林家族',
    words: 'As High as Honor'
  },
  {
    name: 'House Tully of the Riverrun',
    cname: '徒利家族',
    words: 'Family, Duty, Honor'
  },
  {
    name: 'House Greyjoy of Pyke',
    cname: '葛雷乔伊家族',
    words: 'We Do Not Sow'
  },
  {
    name: "House Baratheon of Storm's End",
    cname: '风息堡的拜拉席恩家族',
    words: 'Ours is the Fury'
  },
  {
    name: 'House Tyrell of Highgarden',
    cname: '提利尔家族',
    words: 'Growing Strong'
  },
  {
    name: 'House Nymeros Martell of Sunspear',
    cname: '马泰尔家族',
    words: 'Unbowed, Unbent, Unbroken'
  }
]

// 清空请求次数
const setTimeToZero = () => {
  time = 0
  detailTime = 0
}
// 等待time秒
const sleep = time => new Promise(resolve => setTimeout(resolve, time))
const normalizedContent = content => _.reduce(content, (acc, item) => {
  if (item.text) acc.push(item.text)

  if (item.elements && item.elements.length) {
    let _acc = normalizedContent(item.elements)
    acc = R.concat(acc, _acc)
  }
  return acc
}, [])
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
// 上传 基于亚马逊图床的图片 到 七牛云上,并替换相应profile/images字段
export const updateImagesToQiNiu = async () => {
  // 获取待遍历json数据
  let chineseCharactersData = require(resolve(__dirname, '../../chineseCharacters.json'))
  // 遍历数据
  chineseCharactersData = R.map(async (item) => {
    // 拿到profile(头像)字段
    let profile = item.profile
    // 拿到images(剧照)字段
    let images = item.images
    // 请求上传
    let key = `${item.nmId}/${randomToken(32)}`
    console.log('profile保存在qiniu的key为 -----' + key)
    await updateImage(profile, key)
    // 保存字段
    item.profile = key
    // 遍历images
    for (let i = 0; i < item.images.length; ++i) {
      let _key = `${item.nmId}/${randomToken(32)}`
      console.log('images保存在qiniu的key为 -----' + _key)
      try {
        await updateImage(item.images[i], _key)
      } catch (e) {
        item.images.splice(i, 1)
      }
      await sleep(100)
      // 保存字段
      item.images[i] = _key
    }
    return item
  })(chineseCharactersData)
  chineseCharactersData = await Promise.all(chineseCharactersData)
  console.log('开始写入文件')
  // 写入文件
  writeFileSync('./qiniuCharacters.json', JSON.stringify(chineseCharactersData, null, 2), 'utf8')
  console.log('保存文件完成')
}
// 根据data里面name/cname字段,查询拿到WikiId
export const getWikiId = async (data) => {
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
// 根据wikiID,拿到WikiDetail详细信息
export const getWikiDetailById = async (data) => {
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

  const getLevel = R.compose(
    R.project(['title', 'content', 'level']),
    R.reject(R.propEq('title', '扩展阅读')),
    R.reject(R.propEq('title', '引用与注释')),
    R.filter(i => i.content.length),
    R.prop('sections')
  )
  let cnameAndIntro = getCnameAndIntro(res)
  let sections = getLevel(res)
  // let _res = R.merge(data, getCnameAndIntro(res))
  let _res = R.merge(data, cnameAndIntro)

  sections = normalizedSections(sections)
  // 保存相应字段
  _res.sections = sections
  _res.wikiId = id
  console.log(id + '-----detailTime ----- ' + detailTime++)
  return R.pick(['name', 'cname', 'playedBy', 'profile', 'images', 'nmId', 'chId', 'sections', 'intro', 'wikiId', 'words'], _res)
}
// 获取WikiCharacters的主要流程
export const getWikiCharacters = async () => {
  // 拿到JSON文本数据
  let characterData = require(resolve(__dirname, '../../fullCharacters.json'))
  console.log(characterData.length)
  // 遍历JSON,根据name拿到中文wiki对应的id
  characterData = R.map(getWikiId, characterData) // 返回Prominse数组(async 数组)
  characterData = await Promise.all(characterData)
  // 根据id拿到详细detail信息
  console.log('-------根据id拿到详细detail信息-------------')
  characterData = R.map(getWikiDetailById, characterData) // 返回Prominse数组(async 数组)
  characterData = await Promise.all(characterData)
  // 格式化数据
  // 保存数据在文件系统
  writeFileSync('./chineseCharacters.json', JSON.stringify(characterData, null, 2), 'utf8')
  setTimeToZero()
  console.log('保存文件完成')
}
// 获取getWikiHouse的主要流程
export const getWikiHouse = async () => {
  // 获取带查询的家族数据
  // 遍历家族数据
  let data = R.map(getWikiId, HOUSES)
  // 获取家族的cname/name字段
  // 用cname/name 换取wikiId
  data = await Promise.all(data)
  // 用wikiId 获取 详细detail数据
  data = R.map(getWikiDetailById, data)
  data = await Promise.all(data)
  // 解析数据
  // 保存文件
  console.log('保存文件开始')
  writeFileSync('./wikiHouses.json', JSON.stringify(data, null, 2), 'utf8')
  setTimeToZero()
  console.log('保存文件完成')
}
// 获取getSwornMembers的主要流程
export const getSwornMembers = () => {
  // 拿到wikiHouse家族数据
  let wikiHouseData = require(resolve(__dirname, '../../wikiHouses.json'))
  // 拿到qiniuCharacters角色数据
  let qiniuCharacterData = require(resolve(__dirname, '../../qiniuCharacters.json'))
  // 遍历
  // 过滤数据
  let swornMembers = R.map(
    R.compose(
      i => _.reduce(i, (acc, item) => {
        acc = acc.concat(item)
        return acc
      }, []),
      R.map(i => {
        let item = R.find(R.propEq('cname', i[0]))(qiniuCharacterData) // 为了拿到nmId
        return {
          character: item.nmId,
          text: i[1]
        }
      }),
      R.filter(item => R.find(R.propEq('cname', item[0]))(qiniuCharacterData)),
      R.map(i => {
        let itemArray = i.split('，') // 中文逗号
        let name = itemArray.shift() //  拿到名字(未过滤)
        return [name.replace(/(【|】|爵士|一世女王|三世国王|公爵|国王|王后|夫人|公主|王子)/g, ''), 
          itemArray.join('，') // 若itemArray只有一个元素,分割符无效,单纯变为字符串
        ]
      }),
      R.nth(1),
      R.splitAt(1),
      R.prop('content'),
      R.nth(0),
      R.filter(i => R.test(/伊耿历三世纪末的/, i.title)),
      R.prop('sections')
    )
  )(wikiHouseData)
  // 保存字段
  wikiHouseData = _.map(wikiHouseData, (item, index) => {
    item.swornMembers = swornMembers[index]
    return item
  })
  // 保存文件
  console.log('保存文件开始')
  writeFileSync('./wikiHousesWithSwornMembers.json', JSON.stringify(wikiHouseData, null, 2), 'utf8')
  console.log('保存文件完成')
}