const sequelizeConfig = require("./dist/config/sequelize.js"); // be sure to compile your project first.  Alterativly you could use `ts-node` and incldue the `./src/config/sequelize.ts`

const sequelizeConfigEnv =
  sequelizeConfig[process.env.NODE_ENV] || sequelizeConfig.DEFAULT;
module.exports = sequelizeConfigEnv.sequelize();