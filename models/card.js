const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name : {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30
  },

  link : {
    type: String,
    required: true,
  },

  owner : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },

  //defaults to [] by default?
  likes : [{
    type : mongoose.Schema.Types.ObjectId,
    ref: 'user',
  }],

  createdAt : {
    type : Date,
    default: Date.now(),
  },

});

module.exports = mongoose.Model('card', cardSchema);

module.exports = new mongoose.Model('card', cardSchema);