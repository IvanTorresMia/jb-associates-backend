"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssociateUserTweets = exports.TweetFactory = exports.Tweet = void 0;
const sequelize_1 = require("sequelize");
const user_1 = require("./user");
class Tweet extends sequelize_1.Model {
}
exports.Tweet = Tweet;
function TweetFactory(sequelize) {
    Tweet.init({
        tweetId: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        message: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        userId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        updatedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        }
    }, {
        freezeTableName: true,
        tableName: 'messages',
        sequelize
    });
}
exports.TweetFactory = TweetFactory;
function AssociateUserTweets() {
    user_1.User.hasMany(Tweet, { foreignKey: 'userId' });
    Tweet.belongsTo(user_1.User, { foreignKey: 'userId' });
}
exports.AssociateUserTweets = AssociateUserTweets;
