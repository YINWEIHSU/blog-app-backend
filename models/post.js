'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    static associate (models) {
      Post.belongsTo(models.User)
      Post.belongsTo(models.Category)
      Post.belongsToMany(models.Tag, {
        through: models.PostTag,
        foreignKey: 'postId',
        otherKey: 'tagId'
      })
    }
  }
  Post.init({
    title: DataTypes.STRING,
    content: DataTypes.TEXT,
    status: DataTypes.STRING,
    slug: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Post',
    underscored: true
  })
  return Post
}
