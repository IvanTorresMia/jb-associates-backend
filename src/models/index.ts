import { Sequelize } from "sequelize";
import { AssociateUserTweets, TweetFactory } from "./tweet";
import { UserFactory } from "./user";

const dbName = "jbAssociatesDb";
const username = "root";
const password = "password1";

const sequelize = new Sequelize(dbName, username, password, {
  host: "localhost",
  port: 3306,
  dialect: "mysql",
});

UserFactory(sequelize);
TweetFactory(sequelize);
AssociateUserTweets();

export const db = sequelize;
