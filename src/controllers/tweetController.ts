import { RequestHandler } from "express";
import { Tweet } from "../models/tweet";
import { User } from "../models/user";
import { verifyUser } from "../services/auth";

export const getAllTweets: RequestHandler = async (req, res, next) => {
  let tweets = await Tweet.findAll({
    include: { model: User },
  });
  res.status(200).json(tweets);
};

export const createTweet: RequestHandler = async (req, res, next) => {
  let user: User | null = await verifyUser(req);

  if (!user) {
    return res.status(403).send();
  }

  let newMessage: Tweet = req.body;
  newMessage.userId = user.userId;

  if (newMessage.message) {
    try {
      let created = await Tweet.create(newMessage);
      res.status(201).json(created);
    } catch (err) {
      console.log(err);
    }
  } else {
    res.status(400).send();
  }
};

export const getTweet: RequestHandler = async (req, res, next) => {
  let tweetId = req.params.id;
  let messageFound = await Tweet.findByPk(tweetId, {
    include: { model: User },
  });
  if (messageFound) {
    res.status(200).json(messageFound);
  } else {
    res.status(404).json({});
  }
};

export const getTweetsByUserId: RequestHandler = async (req, res, next) => {
  let userId = req.params.id;
  let tweets = await Tweet.findAll({
    include: { model: User },
    where: { userId: userId },
  });

  res.status(200).json(tweets);
};

export const updateTweet: RequestHandler = async (req, res, next) => {
  let tweetId = req.params.id;
  let newMessage: Tweet = req.body;

  let messageFound = await Tweet.findByPk(tweetId);

  if (
    messageFound &&
    messageFound.tweetId == newMessage.tweetId &&
    newMessage.message
  ) {
    await Tweet.update(newMessage, {
      where: { tweetId: tweetId },
    });
    res.status(200).json();
  } else {
    res.status(400).json();
  }
};

export const deleteTweet: RequestHandler = async (req, res, next) => {
  let tweetId = req.params.id;
  let messageFound = await Tweet.findByPk(tweetId);

  if (messageFound) {
    await Tweet.destroy({
      where: { tweetId: tweetId },
    });
    res.status(200).json();
  } else {
    res.status(404).json();
  }
};
