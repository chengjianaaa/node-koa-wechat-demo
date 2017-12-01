import cheerio from 'cheerio'
import rp from 'request-promise'
import R from 'ramda'
import { writeFileSync } from 'fs'
import { resolve } from 'path'

// 获取角色
export const getIMDBCharacterData = async () => {
  // 构建请求参数
  const options = {
    uri: 'http://www.imdb.com/title/tt0944947/fullcredits?ref_=tt_cl_sm#cast',
    // uri: 'http://localhost:8888/', // 本地静态数据HTML
    transform: (body) => {
      // writeFileSync('./imdb.html', body, 'utf8')
      return cheerio.load(body)
    }
  }
  console.log('------正在爬虫------getIMDBCharacterData------')
  // 构建DOM查询对象
  const $ = await rp(options)
  // const $ = cheerio.load(HTMLDATA)
  let characterDOM = $('table.cast_list tr.odd, tr.even')
  console.log('------分析爬虫------getIMDBCharacterData------共爬到 ' + characterDOM.length + ' 条数据------')
  let data = []
  // characterDOM = characterDOM.slice(0, 100)
  characterDOM.each(function() {
    // 获取演员字段
    const playedByDOM = $(this).find('td.itemprop span.itemprop')
    // 获取角色字段
    const characterDOM = $(this).find('td.character a') // 到2017/11/22 会找到2个元素
    // 获取nmId字段
    const nmIdDOM = $(this).find('td.itemprop a')
    // 获取chId字段
    const chIdDOM = $(this).find('td.character a')
    data.push({
      playedBy: playedByDOM.text(),
      name: characterDOM.length === 2 ? characterDOM[0].children[0].data : characterDOM.length === 1 ? characterDOM[0].prev.data.trim() : '',
      nmId: nmIdDOM.attr('href'),
      chId: chIdDOM.length ? chIdDOM.attr('href') : ''
    })
  })
  // console.log(data)
  console.log('------处理爬虫------过滤空数据/调整数据------')
  // 过滤空数据
  let fn = R.compose(
    R.map(item => {
      // /name/nm5141232/?ref_=ttfc_fc_cl_t488
      const reg1 = /\/name\/(.*?)\/\?ref/
      // /title/tt0944947/characters/nm5141232?ref_=ttfc_fc_cl_t488
      const reg2 = /\/title\/(.*?)\/characters\/(.*?)\?ref/
      // Faith Militant\n         / ...  \n  \n  \n  (uncredited)
      const reg3 = /(.*?)\n(.*?)/ // TODO: 优化掉多个\n
      const match1 = item.nmId.match(reg1)
      const match2 = item.chId.match(reg2)
      const match3 = item.name.match(reg3)
      item.nmId = match1 ? match1[1] : '#'
      item.chId = match2 ? match2[1] + match2[2] + '' : '#'
      item.name = match3 ? match3[0].replace('\n', '') : item.name 
      return item
    }),
    R.filter(item => item.playedBy && item.name && item.nmId && item.chId) // 保证所有字段存在
  )
  // 调整数据
  let filterData = fn(data)

  // console.log(filterData)
  console.log('------结束爬虫------写入JSON文件------开始-----')
  // 写入JSON文件
  writeFileSync('./imdb.json', JSON.stringify(filterData, null, 2), 'utf8')
  console.log('------结束爬虫------写入JSON文件------完成-----')
}
// 获取头像
export const getIMDBCharacterProfileData = async () => {
  // 读取wikiCharacters.json
  const charactersData = require(resolve(__dirname, '../database/json/wikiCharacters.json'))
  // 遍历wikiCharacters.json,根据nmId 来获取图片url
  // let tempLength = 2
  for (let i = 0; i < charactersData.length; i++) {
    let characterItem = charactersData[i]
    if (!characterItem.profile) {
      // 构建请求参数
      const url = `http://www.imdb.com/title/tt0944947/characters/${characterItem.nmId}`
      console.log('------正在爬虫------fetchIMDBProfile------第' + i + '张')
      const imageUrl = await fetchIMDBProfile(url)
      console.log('------处理爬虫------保存profile字段------')
      // 保存图片url为profile字段
      characterItem.profile = imageUrl
    }
  }
  console.log('------结束爬虫------写入JSON文件------开始-----')
  // 写进新文件
  writeFileSync('./imdbWithProfile.json', JSON.stringify(charactersData, null, 2), 'utf8')
  console.log('------结束爬虫------写入JSON文件------完成-----')
}
// 获取剧照
export const getIMDBCharacterImageData = async () => {
  // 读取.json数据
  const imdbWithProfileValidData = require(resolve(__dirname, '../database/json/imdbWithProfileValid.json'))
  // 遍历
  for (let i = 0; i < 2; i++) {
    let item = imdbWithProfileValidData[i]
    if (!item.images || item.images.length === 0) {
      // 组装请求参数
      const url = `http://www.imdb.com/title/tt0944947/characters/${item.nmId}`
      console.log('------正在爬虫------getIMDBCharacterImageData------第' + i + '张')
      console.log(url)
      try {
        // 爬虫剧照images
        const imagesUrlArray = await fetchIMDBImage(url)
        console.log('------处理爬虫------保存images字段------')
        // 保存到images字段
        item.images = imagesUrlArray
        writeFileSync('./fullCharacters.json', JSON.stringify(imdbWithProfileValidData, null, 2), 'utf8') // 临时保存
      } catch (error) {
        console.log('getIMDBCharacterImageData catch到错误')
        continue
      }
    }
  }
  console.log('------结束爬虫------写入JSON文件------开始-----')
  // 写进新文件
  writeFileSync('./fullCharacters.json', JSON.stringify(imdbWithProfileValidData, null, 2), 'utf8')
  console.log('------结束爬虫------写入JSON文件------完成-----')
  // 保存文件
}
const fetchIMDBProfile = async (url) => {
  // 构建请求参数
  const options = {
    uri: url, 
    transform: (body) => cheerio.load(body)
  }
  // console.log('------正在爬虫------fetchIMDBProfile------')
  // 构建DOM查询对象
  const $ = await rp(options)
  let imagesDOM = $('a.titlecharacters-image-grid__thumbnail-link img')
  // console.log(imagesDOM.length) // 23
  // 获取src
  // https://images-na.ssl-images-amazon.com/images/M/MV5BODI3ODA5NTQ5OF5BMl5BanBnXkFtZTgwODkzODMzMzI@._V1_.jpg
  let imageUrl = imagesDOM.attr('src') // .attr()方法只获取第一个匹配元素的属性值
  // 截取imageUrl 保证原图尺寸
  if (imageUrl) {
    imageUrl = imageUrl.split('_V1').shift()
    imageUrl += '_V1.jpg'
  }
  console.log(imageUrl)
  return imageUrl
}
const fetchIMDBImage = async (url) => {
  // 构建请求参数
  const options = {
    uri: url, 
    transform: (body) => cheerio.load(body)
  }
  // console.log('------正在爬虫------fetchIMDBProfile------')
  // 构建DOM查询对象
  const $ = await rp(options)
  let imagesDOM = $('a.titlecharacters-image-grid__thumbnail-link img')
  let images = []
  imagesDOM.each(function() {
    let imageUrl = $(this).attr('src') 
    // 获取src
    // https://images-na.ssl-images-amazon.com/images/M/MV5BODI3ODA5NTQ5OF5BMl5BanBnXkFtZTgwODkzODMzMzI@._V1_.jpg
    // 截取imageUrl 保证原图尺寸
    if (imageUrl) {
      imageUrl = imageUrl.split('_V1').shift()
      imageUrl += '_V1.jpg'
    }
    // console.log(imageUrl)
    images.push(imageUrl)
  })
  return images
}

const cheackIMDBProfile = () => {
  const charactersWithProfileData = require(resolve(__dirname, '../database/json/imdbWithProfile.json'))
  console.log('------cheackIMDBProfile------初始数据数量------' + charactersWithProfileData.length)
  let validCharactersWithProfileData = []
  charactersWithProfileData.forEach(function(item, index) {
    // 拿到每一个Item
    if (item.profile && item.profile !== 'null') {
      validCharactersWithProfileData.push(item)
    }
  })
  console.log('------cheackIMDBProfile------过滤后数据数量------' + validCharactersWithProfileData.length)
  console.log('------cheackIMDBProfile------写入JSON文件------开始-----')
  // 写进新文件
  writeFileSync('./imdbWithProfileValid.json', JSON.stringify(validCharactersWithProfileData, null, 2), 'utf8')
  console.log('------cheackIMDBProfile------写入JSON文件------完成-----')
}