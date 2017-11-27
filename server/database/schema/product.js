const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Mixed = Schema.Types.Mixed
const ProductSchema = new mongoose.Schema({
  price: String, // 价格
  title: String, // 标题
  intro: String, // 介绍
  parameters: [  // 
    { key: String, value: String }
  ],
  images: [ // 图片
    String
  ],
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

ProductSchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now()
  } else {
    this.meta.updateAt = Date.now()
  }
  next()
})

const Product = mongoose.model('Product', ProductSchema)
