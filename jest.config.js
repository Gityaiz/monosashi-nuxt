// jest.config.js
const {defaults} = require('jest-config')
module.exports = {
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1"
  },
  // テストするファイル拡張子の指定
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'js', 'vue', 'ts', 'tsx'],
  // 変換を行うモジュールの指定
  transform: {
    "^.+\\.js$": "<rootDir>/node_modules/babel-jest",
    ".*\\.(vue)$": "<rootDir>/node_modules/jest-vue-preprocessor"
  }
}
