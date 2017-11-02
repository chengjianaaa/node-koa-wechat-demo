import Koa from 'koa'
import Nuxt from 'nuxt'
import { resolve } from 'path'
import R from 'ramda'

const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 3000
const MIDDLEWARES = ['database', 'router.js']
const r = path => resolve(__dirname, path)
let config = require('../nuxt.config.js')
config.env = !(process.env === 'production')

class Server {
  constructor(){
    this.app = new Koa()
    console.log('server constructor start')
    this.useMiddleWares(this.app)(MIDDLEWARES)
  }
  useMiddleWares(app){
    return R.map(R.compose(
      R.map(i => i(app)),
      require,
      i => `${r('./middleware')}/${i}`
      // i => require('./middleware/' + i)
    ))
  }
  async start() {
    const nuxt = await new Nuxt(config)

    if (config.env !== 'production') {
      try {
        await nuxt.build()
      } catch (e) {
        console.error(e)
        process.exit(1)
      }
    }

    this.app.use(async (ctx, next) => {
      ctx.status = 200
      await nuxt.render(ctx.req, ctx.res)
    })

    this.app.listen(port, host)
    console.log('Server listening on ' + host + ':' + port) // eslint-disable-line no-console
  }
}
const app = new Server()
app.start()