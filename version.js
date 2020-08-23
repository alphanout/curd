const options = {
  client: "mysql2",
  connection: {
    host: "localhost",
    user: "root",
    password: "Home@127",
    database: "curd",
  },
};

const knex = require("knex")(options);

knex
  .raw("SELECT VERSION()")
  .then((version) => console.log(version[0][0]))
  .catch((err) => {
    console.log(err);
    throw err;
  })
  .finally(() => {
    knex.destroy();
  });
