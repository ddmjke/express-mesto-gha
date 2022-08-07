const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const SALT_WORK_FACTOR = 10;

const validateEmail = (email) => validator.isEmail(email);

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },

  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },

  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },

  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: validateEmail,
      message: 'Неправильный формат почты',
    },
  },

  password: {
    type: String,
    required: true,
  },
});

userSchema.pre('save', (next) => {
  const user = this;
  if (!user.isModified('password')) return next();

  bcrypt.hash(user.password, SALT_WORK_FACTOR)
    .then((hash) => {
      user.password = hash;
      return next();
    })
    .catch(() => {
      throw new Error('hash error');
    });
  return next();
});

module.exports = mongoose.model('user', userSchema);
