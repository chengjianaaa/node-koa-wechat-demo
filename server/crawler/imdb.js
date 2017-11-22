import cheerio from 'cheerio'
import rp from 'request-promise'
import _ from 'lodash'
import R from 'ramda'
import { writeFileSync } from 'fs'

export const getIMDBCharacterData = async () => {
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
  writeFileSync('./imdb.json', JSON.stringify(filterData, null, 2), 'utf8')
  console.log('------结束爬虫------写入JSON文件------完成-----')
}

getIMDBCharacterData()