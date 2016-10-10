var DataTypes = require('sequelize');
var Slugify = require('sequelize-slugify');
var db = require('../../config/sequelize');

var Category = db.dbApi.define('categories', {
  id: {
    type: DataTypes.INTEGER(10).UNSIGNED,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  parent_id: {
    type: DataTypes.INTEGER(10).UNSIGNED,
    allowNull: true
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  slug: {
    type: DataTypes.STRING(50),
    allowNull: false
  }
}, {
  indexes: [
    {
      fields: ['parent_id', 'slug'],
      unique: true
    }
  ]
});

Slugify.slugifyModel(Category, {
  source: ['name']
});

Category.belongsTo(Category, {
  foreignKey: 'parent_id',
  targetKey: 'id',
  foreignKeyConstraint: true
});

Category.belongsTo(Category, { as: 'parent' });

Category.hasMany(Category, {
  foreignKey: 'parent_id',
  as: 'subcategories'
});

module.exports = Category;
