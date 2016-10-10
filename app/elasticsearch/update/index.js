var Category = require('./category');
var Tag = require('./tag');
var User = require('./user');

Category.update();
Tag.update();
User.update();

module.exports = {
  Category: Category,
  Tag: Tag,
  User: User
};
