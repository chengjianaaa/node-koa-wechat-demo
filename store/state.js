const state = {
  imageCdnPrefix: 'http://ozwiwzrks.bkt.clouddn.com/', // 图片CDN前缀
  houses: [], // 首页家族列表
  characters: [], // 首页角色列表
  cities: [], // 首页城市列表
  products: {}, // 周边手办
  currentHouse: {}, // 当前选中家族
  currentCharacter: {}, // 当前选中角色
  currentProduct: {}, // 当前选中手办
  user: {}, // 当前用户(里面含有订单)
  authUser: null // 当前授权微信用户
}

export default state