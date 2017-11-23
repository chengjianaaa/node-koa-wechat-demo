let cheerio = require('cheerio') 
let rp = require('request-promise') 
let R = require('ramda') 
let fs = require('fs') 
let resolve = require('path').resolve

// 获取剧照
const getIMDBCharacterImageData = async () => {
  // 读取.json数据
  const imdbWithProfileValidData = require(resolve(__dirname, './imdbWithProfileValid.json'))
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
        fs.writeFileSync('./fullCharacters.json', JSON.stringify(imdbWithProfileValidData, null, 2), 'utf8') // 临时保存
      } catch (error) {
        console.log('getIMDBCharacterImageData catch到错误')
        continue
      }
    }
  }
  console.log('------结束爬虫------写入JSON文件------开始-----')
  // 写进新文件
  fs.writeFileSync('./fullCharacters.json', JSON.stringify(imdbWithProfileValidData, null, 2), 'utf8')
  console.log('------结束爬虫------写入JSON文件------完成-----')
  // 保存文件
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

getIMDBCharacterImageData()
