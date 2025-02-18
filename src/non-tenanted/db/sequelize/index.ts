import { Sequelize } from "sequelize";
import config from "@/config";

let sequelizeConnection: Map<string, Sequelize> = new Map();

export function getSequelizeConnection(data: {
  dbName: string;
  dbUser: string;
  dbPassword: string;
}) {
  const existing = sequelizeConnection.get(data.dbName);
  if (existing) {
    return existing;
  }
  const sequelize = new Sequelize(
    `${config.db.dbHost}/${data.dbName}${config.db.dbOption}`,
    {
      dialect: "postgres",
      username: data.dbUser,
      password: data.dbPassword,
      logging: false,
    },
  );
  sequelize
    .authenticate()
    .then(() => {
      console.log(
        `Connection has been established successfully to database ${data.dbName}.`,
      );
    })
    .catch((error) => {
      console.error("Unable to connect to the database:", error);
    });
  sequelizeConnection.set(data.dbName, sequelize);
  return sequelize;
}

const sequelize = new Sequelize(
  `${config.db.dbHost}/${config.db.mainDBName}${config.db.dbOption}`,
  {
    dialect: "postgres",
    username: config.db.mainDBUser,
    password: config.db.mainDBPassword,
    logging: false,
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
