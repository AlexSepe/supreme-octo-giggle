"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    up: async function (queryInterface, DataTypes) {
        await queryInterface.createTable("extractionjob", {
            jobId: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            mendixToken: {
                type: DataTypes.STRING(500),
                allowNull: false,
            },
            appId: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            branchName: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            exportPages: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
            },
            exportMicroflows: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
            },
            exportNanoflows: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
            },
            exportEntities: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
            },
            status: {
                type: DataTypes.STRING(50),
                allowNull: false,
            },
            jsonResult: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            log: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            completedAt: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            startedAt: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE,
            deletedAt: DataTypes.DATE,
        }, {
            charset: "utf8mb4",
        });
        await queryInterface.addIndex("extractionjob", ["appId"], {
            unique: false,
            fields: ["appId"],
        });
    },
    down: async function (queryInterface) {
        await queryInterface.dropTable("extractionjob");
    },
};
