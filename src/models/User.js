const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')
const config = require('../config')

const userSchema = mongoose.Schema({
  uid: {
    type: String,
    required: true,
    validate: {
      validator (v) {
        return /^[\w-]{3,20}$/.test(v)
      },
      message:
        'Invalid uid. It should be 3-20 characters long '
        + 'and only contains letters, numbers, dash and underscore',
    },
    immutable: true,
    index: {
      unique: true,
    },
  },
  pwd: {
    type: String,
    required: true,
  },
  privilege: {
    type: Number,
    enum: Object.values(config.privilege),
    default: config.privilege.User,
  },
  nick: {
    type: String,
    default: '',
    validate: {
      validator (v) {
        return v.length <= 30
      },
      message:
        'Nick is too long. It should be less than 30 characters long',
    },
  },
  motto: {
    type: String,
    default: '',
    validate: {
      validator (v) {
        return v.length <= 300
      },
      message:
        'Motto is too long. It should be less than 300 characters long',
    },
  },
  mail: {
    type: String,
    default: '',
    validate: {
      validator (v) {
        return v.length === 0 || (v.length <= 254
          && /^[\w.%+-]{1,64}@[a-z0-9.-]{1,255}\.[a-z]{2,}$/i.test(v))
      },
      message: 'Invalid email address',
    },
  },
  school: {
    type: String,
    default: '',
    validate: {
      validator (v) {
        return v.length <= 30
      },
      message:
        'School name is too long. It should be less than 30 characters long',
    },
  },
  create: {
    type: Number,
    default: Date.now,
    immutable: true,
  },
  gid: {
    type: [ Number ],
    default: [],
    index: true,
  },
  submit: {
    type: Number,
    default: 0,
  },
  solve: {
    type: Number,
    default: 0,
  },
}, {
  collection: 'User',
})

userSchema.plugin(mongoosePaginate)

module.exports = mongoose.model('User', userSchema)
