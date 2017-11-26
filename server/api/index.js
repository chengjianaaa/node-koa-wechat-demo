// import { getSignatureAsync, getAuthorizeCodeURL, getUserByCode } from './wechat'

// export {
//   getSignatureAsync,
//   getAuthorizeCodeURL,
//   getUserByCode
// }

import * as wechat from './wechat'
import * as wiki from './wiki'

export default {
  wechat: wechat,
  wiki: wiki
}