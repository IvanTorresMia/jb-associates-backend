"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTweet = exports.updateTweet = exports.getTweetsByUserId = exports.getTweet = exports.createTweet = exports.getAllTweets = void 0;
const tweet_1 = require("../models/tweet");
const user_1 = require("../models/user");
const auth_1 = require("../services/auth");
const getAllTweets = async (req, res, next) => {
    let tweets = await tweet_1.Tweet.findAll({
        include: { model: user_1.User },
    });
    res.status(200).json(tweets);
};
exports.getAllTweets = getAllTweets;
const createTweet = async (req, res, next) => {
    let user = await (0, auth_1.verifyUser)(req);
    if (!user) {
        return res.status(403).send();
    }
    let newMessage = req.body;
    newMessage.userId = user.userId;
    if (newMessage.message) {
        try {
            let created = await tweet_1.Tweet.create(newMessage);
            res.status(201).json(created);
        }
        catch (err) {
            console.log(err);
        }
    }
    else {
        res.status(400).send();
    }
};
exports.createTweet = createTweet;
const getTweet = async (req, res, next) => {
    let tweetId = req.params.id;
    let messageFound = await tweet_1.Tweet.findByPk(tweetId, {
        include: { model: user_1.User },
    });
    if (messageFound) {
        res.status(200).json(messageFound);
    }
    else {
        res.status(404).json({});
    }
};
exports.getTweet = getTweet;
const getTweetsByUserId = async (req, res, next) => {
    let userId = req.params.id;
    let tweets = await tweet_1.Tweet.findAll({
        include: { model: user_1.User },
        where: { userId: userId },
    });
    res.status(200).json(tweets);
};
exports.getTweetsByUserId = getTweetsByUserId;
const updateTweet = async (req, res, next) => {
    let tweetId = req.params.id;
    let newMessage = req.body;
    let messageFound = await tweet_1.Tweet.findByPk(tweetId);
    if (messageFound &&
        messageFound.tweetId == newMessage.tweetId &&
        newMessage.message) {
        await tweet_1.Tweet.update(newMessage, {
            where: { tweetId: tweetId },
        });
        res.status(200).json();
    }
    else {
        res.status(400).json();
    }
};
exports.updateTweet = updateTweet;
const deleteTweet = async (req, res, next) => {
    let tweetId = req.params.id;
    let messageFound = await tweet_1.Tweet.findByPk(tweetId);
    if (messageFound) {
        await tweet_1.Tweet.destroy({
            where: { tweetId: tweetId },
        });
        res.status(200).json();
    }
    else {
        res.status(404).json();
    }
};
exports.deleteTweet = deleteTweet;
