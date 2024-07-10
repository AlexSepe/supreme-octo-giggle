"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDelete = exports.UserView = exports.UserList = exports.UserCreate = void 0;
const actionhero_1 = require("actionhero");
const User_1 = require("./../models/User");
class UserCreate extends actionhero_1.Action {
    constructor() {
        super(...arguments);
        this.name = "user:create";
        this.description = "create a new user";
        this.inputs = {
            firstName: { required: true },
            lastName: { required: true },
            password: { required: true },
            email: { required: true },
        };
    }
    async run({ params, connection }) {
        const userDel = await User_1.User.findOne({
            where: { email: params.email },
            paranoid: false,
        });
        if (userDel) {
            //recupera user deletado
            (0, actionhero_1.log)("usuário found: " + userDel.guid + " deleted?" + userDel.isSoftDeleted());
            if (userDel.isSoftDeleted()) {
                await userDel.restore();
                userDel.firstName = params.firstName;
                (userDel.lastName = params.lastName), await userDel.save();
                await userDel.updatePassword(params.password);
                return { userGuid: userDel.guid };
            }
            else {
                connection.setStatusCode(400);
                return { error: "user already exists!!" };
            }
        }
        //cria novo usuário
        const user = new User_1.User({
            firstName: params.firstName,
            lastName: params.lastName,
            email: params.email,
        });
        await user.save();
        await user.updatePassword(params.password);
        return { userGuid: user.guid };
    }
}
exports.UserCreate = UserCreate;
class UserList extends actionhero_1.Action {
    constructor() {
        super(...arguments);
        this.name = "user:list";
        this.description = "list users";
        this.inputs = {};
    }
    async run({ params }) {
        const users = await User_1.User.findAll({ paranoid: true });
        return {
            data: users.map((u) => {
                var obj = {};
                Object.keys(u.dataValues).forEach(function (key) {
                    if (key !== "passwordHash") {
                        obj[key] = u[key];
                    }
                });
                return obj;
            }),
        };
    }
}
exports.UserList = UserList;
class UserView extends actionhero_1.Action {
    constructor() {
        super(...arguments);
        this.name = 'user:view';
        this.description = this.name;
        this.middleware = ['logged-in-session'];
        this.inputs = {};
    }
    async run(data) {
        const user = await User_1.User.findOne({ where: { guid: data.session.userGuid } });
        if (!user) {
            throw new Error('user not found');
        }
        var userData = user.apiData();
        //console.log(JSON.stringify(userData));    
        return { user: userData };
    }
}
exports.UserView = UserView;
class UserDelete extends actionhero_1.Action {
    constructor() {
        super(...arguments);
        this.name = "user:delete";
        this.description = "delete a user";
        this.inputs = {
            userGuid: { required: false },
        };
        this.middleware = ["logged-in-session"];
    }
    async run({ params, connection }) {
        const user = await User_1.User.findByPk(params.userGuid);
        (0, actionhero_1.log)("user findByPk " + JSON.stringify(params));
        if (!user) {
            connection.setStatusCode(404);
            return { error: "user not found" };
        }
        await user.destroy();
        //return { };
    }
}
exports.UserDelete = UserDelete;
