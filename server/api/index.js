// import { getSignatureAsync, getAuthorizeCodeURL, getUserByCode } from './wechat'

// export {
//   getSignatureAsync,
//   getAuthorizeCodeURL,
//   getUserByCode
// }

import * as wechat from './wechat'
import * as wiki from './wiki'
import * as product from './product'

export default {
  wechat: wechat,
  wiki: wiki,
  product: product
}