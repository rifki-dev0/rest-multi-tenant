import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "@/libs/db/sequelize";

export interface ITenant {
  id: string;
  name: string;
  uuid: string;
}

type TenantCreationAttributes = Optional<ITenant, "id" | "uuid">;

class Tenant extends Model<ITenant, TenantCreationAttributes> {
  declare id: string;
  declare name: string;
  declare uuid: string;
}

Tenant.init(
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    uuid: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
  },
  {
    sequelize,
    timestamps: true,
    underscored: true,
    modelName: "Tenants",
    paranoid: true,
  },
);

Tenant.sync();

export { Tenant };
