module.exports = {
  KEYS: process.env.NODE_ENV === 'production' ? require('./.prodKeys.js') : require('./.devKeys.js')
}
