"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchUsers = exports.editUser = exports.getUser = exports.getCurrentUser = exports.loginUser = exports.createUser = void 0;
const user_1 = require("../models/user");
const auth_1 = require("../services/auth");
const { Op } = require('@sequelize/core');
const createUser = async (req, res, next) => {
    let newUser = req.body;
    if (newUser.username && newUser.password && newUser.firstName && newUser.lastName
        && newUser.city && newUser.state) {
        let hashedPassword = await (0, auth_1.hashPassword)(newUser.password);
        newUser.password = hashedPassword;
        let created = await user_1.User.create(newUser);
        res.status(201).json({
            username: created.username,
            userId: created.userId
        });
    }
    else {
        res.status(400).send('Username and password required');
    }
};
exports.createUser = createUser;
const loginUser = async (req, res, next) => {
    let existingUser = await user_1.User.findOne({
        where: { username: req.body.username }
    });
    if (existingUser) {
        let passwordsMatch = await (0, auth_1.comparePasswords)(req.body.password, existingUser.password);
        if (passwordsMatch) {
            let token = await (0, auth_1.signUserToken)(existingUser);
            res.status(200).json({ token });
        }
        else {
            res.status(401).json('Invalid password');
        }
    }
    else {
        res.status(401).json('Invalid username');
    }
};
exports.loginUser = loginUser;
const getCurrentUser = async (req, res, next) => {
    let user = await (0, auth_1.verifyUser)(req);
    if (user) {
        res.status(200).json({
            username: user.username,
            userId: user.userId,
            firstName: user.firstName,
            lastName: user.lastName,
            state: user.state,
            city: user.city,
            createdOn: user.createdAt
        });
    }
    else {
        res.status(401).send();
    }
};
exports.getCurrentUser = getCurrentUser;
const getUser = async (req, res, next) => {
    let userId = req.params.id;
    let userFound = await user_1.User.findByPk(userId, {
        attributes: ['userId', 'username', 'firstName', 'lastName', 'city', 'state', 'createdAt']
    });
    if (userFound) {
        res.status(200).json(userFound);
    }
    else {
        res.status(404).json({});
    }
};
exports.getUser = getUser;
const editUser = async (req, res, next) => {
    let user = await (0, auth_1.verifyUser)(req);
    if (user && user.userId == parseInt(req.params.id)) {
        let updatedUser = req.body;
        updatedUser.userId = user.userId;
        if (updatedUser.firstName && updatedUser.lastName && updatedUser.username
            && updatedUser.city && updatedUser.state) {
            await user_1.User.update(updatedUser, {
                where: { userId: user.userId }
            });
            res.status(204).json();
        }
        else {
            res.status(400).json();
        }
    }
    else {
        res.status(401).send();
    }
};
exports.editUser = editUser;
const searchUsers = async (req, res, next) => {
    let searchName = req.params.name;
    let users = [];
    if (searchName.trim() != '') {
        users = await user_1.User.findAll({
            attributes: ['userId', 'username', 'firstName', 'lastName'],
            where: {
                [Op.or]: [
                    { username: { [Op.like]: `${searchName}%` } },
                    { firstName: { [Op.like]: `${searchName}%` } },
                    { lastName: { [Op.like]: `${searchName}%` } }
                ]
            }
        });
    }
    else {
        users = await user_1.User.findAll({
            attributes: ['username', 'firstName', 'lastName']
        });
    }
    res.status(200).json(users);
};
exports.searchUsers = searchUsers;
