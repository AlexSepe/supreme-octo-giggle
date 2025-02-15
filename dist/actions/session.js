"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { Action, api } = require('actionhero');
const User_1 = require("./../models/User");
exports.SessionCreate = class SessionCreate extends Action {
    constructor() {
        super();
        this.name = 'session:create';
        this.description = this.name;
        this.inputs = {
            email: { required: true },
            password: { required: true }
        };
    }
    async run(data) {
        data.response.success = false;
        const user = await User_1.User.findOne({ where: { email: data.params.email } });
        if (!user) {
            throw new Error('user not found');
        }
        const match = await user.checkPassword(data.params.password);
        if (!match) {
            throw new Error('password does not match');
        }
        const sessionData = await api.session.create(data.connection, user);
        data.response.user = user.apiData(api);
        data.response.success = true;
        data.response.csrfToken = sessionData.csrfToken;
    }
};
exports.SessionDestroy = class SessionDestroy extends Action {
    constructor() {
        super();
        this.name = 'session:destroy';
        this.description = this.name;
        this.inputs = {};
    }
    async run(data) {
        data.response.success = false;
        await api.session.destroy(data.connection);
        data.response.success = true;
    }
};
exports.SessionCheck = class SessionCheck extends Action {
    constructor() {
        super();
        this.name = 'session:check';
        this.description = this.name;
        this.inputs = {};
    }
    async run(data) {
        data.response.success = false;
        const sessionData = await api.session.load(data.connection);
        if (!sessionData) {
            data.connection.setStatusCode(401);
            data.response.error = 'Please log in to continue';
            return;
        }
        const user = await User_1.User.findOne({ where: { guid: sessionData.userGuid } });
        if (!user) {
            throw new Error('user not found');
        }
        data.response.user = user.apiData();
        data.response.csrfToken = sessionData.csrfToken;
        data.response.success = true;
    }
};
exports.SessionWSAuthenticate = class SessionWSAuthenticate extends Action {
    constructor() {
        super();
        this.name = 'session:wsAuthenticate';
        this.description = this.name;
        this.inputs = {};
        this.blockedConnectionTypes = ['web'];
    }
    async run(data) {
        data.response.success = false;
        const sessionData = await api.session.load(data.connection);
        if (!sessionData) {
            throw new Error('Please log in to continue');
        }
        data.connection.authorized = true;
        data.response.authorized = true;
        data.response.success = true;
    }
};
