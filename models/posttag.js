'use strict'

const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class PostTag extends Model {
    static associate (models) {
      // define association here
    }
  }
  PostTag.init({
    postId: DataTypes.INTEGER,
    tagId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'PostTag'
  })
  return PostTag
}
