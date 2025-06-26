const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')
const config = require('../config')
const ids = require('./ID')

const newSchema = mongoose.Schema({
  nid: {
    type: Number,
    index: {
      unique: true,
    },
    default: -1,
  },
  title: String,
  content: String,
  status: {
    type: Number,
    default: config.status.Available, // 默认新建的消息显示
  },
  create: {
    type: Number,
    default: Date.now,
  },
}, {
  collection: 'News',
})

newSchema.plugin(mongoosePaginate)

newSchema.pre('validate', function (next) {
  if (this.title == null || this.title.length < 3) {
    next(new Error('The length of the title should not be less than 3'))
  }
  next()
})

newSchema.pre('save', function (next) {
  // 保存
  if (this.nid === -1) {
    // 表示新的新闻被创建了，因此赋予一个新的 id
    ids
      .generateId('News')
      .then((id) => {
        this.nid = id
      })
      .then(next)
  } else {
    next()
  }
})

module.exports = mongoose.model('News', newSchema)
