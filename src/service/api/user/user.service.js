"use strict";

const UserRepository = require(`./user.repository`);
const {ErrorRegisterMessage, ErrorAuthMessage} = require(`../../../lang`);
const passwordUtils = require(`../../lib/password`);

class UserService {
  constructor(sequelize) {
    this.repository = new UserRepository(sequelize);
  }

  async create(data) {
    const {email} = data;
    const userByEmail = await this.repository.findByEmail(email);

    if (userByEmail) {
      throw new Error(ErrorRegisterMessage.EMAIL_EXIST);
    }

    data.passwordHash = await passwordUtils.hash(data.password);
    const user = await this.repository.create(data);
    delete user.passwordHash;
    return user;
  }

  async auth(data) {
    const {email, password} = data;
    const user = await this.repository.findByEmail(email);

    if (!user) {
      throw new Error(ErrorAuthMessage.EMAIL);
    }

    const passwordIsCorrect = await passwordUtils.compare(
        password,
        user.passwordHash
    );

    if (passwordIsCorrect) {
      delete user.passwordHash;
      return user;
    } else {
      throw new Error(ErrorAuthMessage.PASSWORD);
    }
  }
}

module.exports = UserService;
