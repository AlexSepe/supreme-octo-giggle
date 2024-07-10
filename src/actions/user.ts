import { Action, Connection, ParamsFrom, log } from "actionhero";
import { User } from "./../models/User";

export class UserCreate extends Action {
  name = "user:create";
  description = "create a new user";
  inputs = {
    firstName: { required: true },
    lastName: { required: true },
    password: { required: true },
    email: { required: true },
  };

  async run({ params, connection }: { params: ParamsFrom<UserCreate>, connection: Connection }) {
    const userDel = await User.findOne({
      where: { email: params.email },
      paranoid: false,
    });
    if (userDel) {
      //recupera user deletado
      log("usuário found: " + userDel.guid + " deleted?" + userDel.isSoftDeleted());
      if (userDel.isSoftDeleted()) {        
        await userDel.restore();
        userDel.firstName = params.firstName;
        (userDel.lastName = params.lastName), await userDel.save();
        await userDel.updatePassword(params.password);
        return { userGuid: userDel.guid };
      } else {
        connection.setStatusCode(400);
        return {error: "user already exists!!"};
      }
    }

    //cria novo usuário
    const user = new User({
      firstName: params.firstName,
      lastName: params.lastName,
      email: params.email,
    });
    await user.save();
    await user.updatePassword(params.password);
    return { userGuid: user.guid };
  }
}

export class UserList extends Action {
  name = "user:list";
  description = "list users";
  inputs = {};

  async run({ params }: { params: ParamsFrom<UserList> }) {
    const users = await User.findAll({ paranoid: true });
    return {
      data: users.map((u) => {
        var obj: any = {};
        Object.keys(u.dataValues).forEach(function(key) {
          if (key !== "passwordHash"){
            obj[key] = (u as any)[key];
          }          
        });
        return obj;
      }),
    };
  }
}

export class UserView extends Action {  
  name = 'user:view';
  description = this.name;
  middleware = ['logged-in-session'];
  inputs = {};

  async run (data) {    
    const user = await User.findOne({ where: { guid: data.session.userGuid } })
    if (!user) { throw new Error('user not found') }

    var userData = user.apiData();
    //console.log(JSON.stringify(userData));    
    return {user: userData};
  }
}

export class UserDelete extends Action {
  name = "user:delete";
  description = "delete a user";
  inputs = {
    userGuid: { required: false },
  };
  middleware = ["logged-in-session"];

  async run({ params, connection }: { params: ParamsFrom<UserDelete>, connection: Connection }) {
    const user = await User.findByPk(params.userGuid);
    log("user findByPk " + JSON.stringify(params));
    if (!user) {
      connection.setStatusCode(404);
      return {error: "user not found"};
    }
    await user.destroy();
    //return { };
  }
}
