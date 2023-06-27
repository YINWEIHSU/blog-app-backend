'use strict'

const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Tag extends Model {
    static associate (models) {
      // define association here
      Tag.belongsToMany(models.Post, {
        through: models.PostTag,
        foreignKey: 'tagId',
        otherKey: 'postId'
      })
    }
  }
  Tag.init({
    name: DataTypes.STRING,
    count: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Tag',
    freezeTableName: true,
    tableName: 'Tags'
  })
  return Tag
}
