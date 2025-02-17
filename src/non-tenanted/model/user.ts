import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "@/non-tenanted/db/sequelize";

export interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
  tenants_id: string[];
}

type UserCreationAttributes = Optional<IUser, "id" | "tenants_id">;

class User extends Model<IUser, UserCreationAttributes> {
  declare id: string;
  declare name: string;
  declare email: string;
  declare password: string;
  declare tenants_id: string[];

  hasTenants() {
    return this.tenants_id.length !== 0;
  }
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,

      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tenants_id: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [],
    },
  },
  {
    sequelize,
    timestamps: true,
    underscored: true,
    modelName: "User",
  },
);

User.sync();

export { User };
