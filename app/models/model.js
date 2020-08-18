//db create table students
module.exports = (sequelize, Sequelize) => {
  const Tutorial = sequelize.define("students", {
    name: {
      type: Sequelize.STRING,
    },
    // description: {
    //   type: Sequelize.STRING
    // },
    // published: {
    //   type: Sequelize.BOOLEAN
    // }
  });

  return Tutorial;
};
/*create a new Tutorial: create(object)
find a Tutorial by id: findByPk(id)
get all Tutorials: findAll()
update a Tutorial by id: update(data, where: { id: id })
remove a Tutorial: destroy(where: { id: id })
remove all Tutorials: destroy(where: {})
find all Tutorials by title: findAll({ where: { title: ... } })*/
