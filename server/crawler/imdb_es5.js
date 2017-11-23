let cheerio = require('cheerio') 
let rp = require('request-promise') 
let R = require('ramda') 
let fs = require('fs') 
// let { resolve } = require('path') 
let resolve = require('path').resolve

const getIMDBCharacterData = async () => {
  // 构建请求参数
  const options = {
    // uri: 'http://www.imdb.com/title/tt0944947/fullcredits?ref_=tt_cl_sm#cast',
    uri: 'http://localhost:8888/', // 本地静态数据HTML
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
  characterDOM.each(function () {
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
      const reg3 = /(.*?)\n(.*?)/ // TDDO 优化掉多个\n
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
  fs.writeFileSync('./imdb.json', JSON.stringify(filterData, null, 2), 'utf8')
  console.log('------结束爬虫------写入JSON文件------完成-----')
}
const getIMDBCharacterProfileData = async () => {
  // 读取wikiCharacters.json
  const charactersData = require(resolve(__dirname, './wikiCharacters.json'))
  // 遍历wikiCharacters.json,根据nmId 来获取图片url
  // let tempLength = 2
  const length = charactersData.length
  for (let i = 0; i < length; i++) {
    let characterItem = charactersData[i]
    if (!characterItem.profile) {
      // 构建请求参数
      const url = `http://www.imdb.com/title/tt0944947/characters/${characterItem.nmId}`
      console.log('------正在爬虫------fetchIMDBProfile------第' + i + '张----共' + length + '张')
      console.log(url)
      try {        
        const imageUrl = await fetchIMDBProfile(url)
        console.log('------处理爬虫------保存profile字段------')
        // 保存图片url为profile字段
        characterItem.profile = imageUrl
        fs.writeFileSync('./imdbWithProfile.json', JSON.stringify(charactersData, null, 2), 'utf8')
      } catch (error) {
        console.log('catch 错误')
        continue 
      }
    }
  }
  console.log('------结束爬虫------写入JSON文件------开始-----')
  // 写进新文件
  fs.writeFileSync('./imdbWithProfile.json', JSON.stringify(charactersData, null, 2), 'utf8')
  console.log('------结束爬虫------写入JSON文件------完成-----')
}
const fetchIMDBProfile = async (url) => {
  // 构建请求参数
  const options = {
    uri: url,
    transform: (body) => cheerio.load(body)
  }
  // console.log('------正在爬虫------fetchIMDBProfile------')
  // 构建DOM查询对象
  try {
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
  } catch (error) {
    console.log('catch fetchIMDBProfile错误')
    return 'null'
    // throw error
  }
}

getIMDBCharacterProfileData()