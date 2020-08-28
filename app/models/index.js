const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  // operatorsAliases: false,
  // storage:'../../data/db',
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// db.tutorials = require("./model.js")(sequelize, Sequelize);
let t = require("./user.model.js")(sequelize, Sequelize);

db.user = t.user;
db.course = t.course;
db.student_enrolled = t.student_enrolled;

sequelize.sync({ alter: true }).then(() => {
  console.log('db created table');
  console.log("");
  console.log("***************************************************");
}).catch((err) => {
  console.log(err);
  console.log("");
});

module.exports = db;