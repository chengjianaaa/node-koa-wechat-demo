// import mongoose from 'mongoose'
// const Schema = mongoose.Schema

// const TICKET = 'ticket'
// const TicketSchema = new Schema({
//   name: String, // 名字
//   ticket: String, // ticket 票据
//   expires_in: Number, // 过期时间
//   meta: {
//     createAt: { // 创建时间
//       type: Date,
//       default: Date.now()
//     },
//     updateAt: {
//       type: Date, // 修改时间
//       default: Date.now()
//     }
//   }
// })

// TicketSchema.pre('save', function (next) {
//   if (this.isNew) { // TODO 箭头函数能用吗? this? => 不能 如果该回调是箭头函数 this指向全局(因为是参考的是词法作用域)
//     this.meta.createAt = this.meta.updateAt = Date.now()
//   } else {
//     this.updateAt = Date.now()
//   }
//   next()
// })

// TicketSchema.statics = {
//   async getTicket() {
//     const ticket = await this.findOne({ name: TICKET }).exec()
//     return ticket
//   },
//   async saveTicket(data) {
//     let ticket = await this.findOne({ name: TICKET }).exec()
//     if (ticket) {
//       // 更新ticket
//       ticket.ticket = data.ticket
//       ticket.expires_in = data.expires_in
//     } else {
//       // 创建ticket
//       ticket = new Ticket({
//         name: TICKET,
//         ticket: data.ticket,
//         expires_in: data.expires_in
//       })
//     }

//     try {
//       await ticket.save()
//     } catch (error) {
//       console.log(error)
//     }

//     return data
//   }
// }

// const Ticket = mongoose.model('Ticket', TicketSchema)
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TicketSchema = new mongoose.Schema({
  name: String,
  ticket: String,
  expires_in: Number,
  meta: {
    createAt: {
      type: Date,
      default: Date.now()
    },
    updateAt: {
      type: Date,
      default: Date.now()
    }
  }
})

TicketSchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now()
  } else {
    this.meta.updateAt = Date.now()
  }

  next()
})

TicketSchema.statics = {
  async getTicket() {
    const ticket = await this.findOne({ name: 'ticket' }).exec()

    return ticket
  },

  async saveTicket(data) {
    let ticket = await this.findOne({ name: 'ticket' }).exec()
    if (ticket) {
      ticket.ticket = data.ticket
      ticket.expires_in = data.expires_in
    } else {
      ticket = new Ticket({
        name: 'ticket',
        expires_in: data.expires_in,
        ticket: data.ticket
      })
    }

    try {
      await ticket.save()
    } catch (e) {
      console.log('存储失败')
      console.log(e)
    }

    return data
  }
}

const Ticket = mongoose.model('Ticket', TicketSchema)
