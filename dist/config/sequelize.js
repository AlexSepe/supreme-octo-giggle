"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT = void 0;
const url_1 = require("url");
const path_1 = require("path");
require("dotenv/config");
const namespace = "sequelize";
const databaseName = "ah_sequelize";
exports.DEFAULT = {
    [namespace]: (config) => {
        let dialect = "postgres";
        let host = process.env.DB_HOST || "127.0.0.1";
        let port = process.env.DB_PORT || "5432";
        let database = process.env.DB_DATABASE ||
            `${databaseName}_${config.process.env}${process.env.JEST_WORKER_ID ? "_" + process.env.JEST_WORKER_ID : ""}`;
        let username = process.env.DB_USER || process.env.CI ? "postgres" : undefined;
        let password = process.env.DB_PASS || undefined;
        // if your environment provides database information via a single JDBC-style URL like mysql://username:password@hostname:port/default_schema
        const connectionURL = process.env.DATABASE_URL || process.env.MYSQL_URL || process.env.PG_URL;
        if (connectionURL) {
            const parsed = new url_1.URL(connectionURL);
            if (parsed.protocol)
                dialect = parsed.protocol.slice(0, -1);
            if (parsed.username)
                username = parsed.username;
            if (parsed.password)
                password = parsed.password;
            if (parsed.hostname)
                host = parsed.hostname;
            if (parsed.port)
                port = parsed.port;
            if (parsed.pathname)
                database = parsed.pathname.substring(1);
        }
        if (dialect === "postgresql")
            dialect = "postgres";
        console.info("dbconn: " + connectionURL);
        return {
            autoMigrate: true,
            logging: false,
            dialect: dialect,
            port: parseInt(port),
            database: database,
            host: host,
            username: username,
            password: password,
            models: [(0, path_1.join)(__dirname, "..", "models")],
            migrations: [(0, path_1.join)(__dirname, "..", "migrations")],
            migrationLogLevel: "info",
            // you can also pass "dialectOptions", for example if you need `{ssl: true}` for Postgres
            // For Example, if you want to change the schema of a Postgres database away from "public", you would need to include the following configs:
            // schema: schema,
            // searchPath: schema,
            // dialectOptions: { prependSearchPath: true },
        };
    },
};
// for the sequelize CLI tool
module.exports.development = exports.DEFAULT.sequelize({
    env: "development",
    process: { env: "development" },
});
module.exports.staging = exports.DEFAULT.sequelize({
    env: "staging",
    process: { env: "staging" },
});
module.exports.production = exports.DEFAULT.sequelize({
    env: "production",
    process: { env: "production" },
});
