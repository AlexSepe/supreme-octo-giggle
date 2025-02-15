import { PluginConfig } from "actionhero";

const namespace = "plugins";

declare module "actionhero" {
  export interface ActionheroConfigInterface {
    [namespace]: ReturnType<(typeof DEFAULT)[typeof namespace]>;
  }
}

export const DEFAULT: { [namespace]: () => PluginConfig } = {
  [namespace]: () => {
    /*
    If you want to use plugins in your application, include them here:

    return {
      'myPlugin': { path: __dirname + '/../node_modules/myPlugin' }
    }

    You can also toggle on or off sections of a plugin to include (default true for all sections):

    return {
      'myPlugin': {
        path: __dirname + '/../node_modules/myPlugin',
        actions: true,
        tasks: true,
        initializers: true,
        servers: true,
        public: true,
        cli: true
      }
    }
    */

    return {
      "ah-sequelize-plugin": { path: __dirname + "/../../node_modules/ah-sequelize-plugin" },
      "ah-resque-ui": { path: __dirname + "/../../node_modules/ah-resque-ui" },
    };
  },
};
