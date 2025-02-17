import { Sequelize } from "sequelize";
import config from "@/config";

const sequelize = new Sequelize(
  `${config.db.dbHost}/${config.db.mainDBName}${config.db.dbOption}`,
  {
    dialect: "postgres",
    username: config.db.mainDBUser,
    password: config.db.mainDBPassword,
  },
);

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });

export default sequelize;
