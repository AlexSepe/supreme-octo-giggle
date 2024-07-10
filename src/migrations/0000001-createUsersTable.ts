import * as Sequelize from "sequelize";

export default {
  up: async function (
    queryInterface: Sequelize.QueryInterface,
    DataTypes: typeof Sequelize
  ) {
    await queryInterface.createTable(
      "users",
      {
        guid: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },

        firstName: {
          type: DataTypes.STRING(191),
          allowNull: false,
        },

        lastName: {
          type: DataTypes.STRING(191),
          allowNull: false,
        },

        email: {
          type: DataTypes.STRING(191),
          allowNull: false,
        },

        passwordHash: {
          type: DataTypes.TEXT,
          allowNull: true,
        },

        lastLoginAt: {
          type: DataTypes.DATE,
          allowNull: true,
        },

        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
        deletedAt: DataTypes.DATE,
      },
      {
        charset: "utf8mb4",
      }
    );

    await queryInterface.addIndex("users", ["email"], {
      unique: true,
      fields: ["email"],
    });
  },

  down: async function (queryInterface: Sequelize.QueryInterface) {
    await queryInterface.dropTable("users");
  },
};