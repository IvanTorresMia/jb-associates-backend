import { RequestHandler } from "express";
import { User } from "../models/user";
import { comparePasswords, hashPassword, signUserToken, verifyUser } from "../services/auth";
const { Op } = require('@sequelize/core');

export const createUser: RequestHandler = async (req, res, next) => {
    let newUser: User = req.body;
    
    if (newUser.username && newUser.password && newUser.firstName && newUser.lastName
        && newUser.city && newUser.state) {
            let hashedPassword = await hashPassword(newUser.password);
            newUser.password = hashedPassword;
            let created = await User.create(newUser);
            res.status(201).json({
                username: created.username,
                userId: created.userId
            });
    }
    else {
        res.status(400).send('Username and password required');
    }
}

export const loginUser: RequestHandler = async (req, res, next) => {
    let existingUser: User | null = await User.findOne({ 
        where: { username: req.body.username }
    });

    if (existingUser) {
        let passwordsMatch = await comparePasswords(req.body.password, existingUser.password);
        
        if (passwordsMatch) {
            let token = await signUserToken(existingUser);
            res.status(200).json({ token });
        }
        else {
            res.status(401).json('Invalid password');
        }
    }
    else {
        res.status(401).json('Invalid username');
    }
}

export const getCurrentUser: RequestHandler = async (req, res, next) => {
    let user: User | null = await verifyUser(req);

    if (user) {
        res.status(200).json({
            username: user.username,
            userId: user.userId,
            firstName: user.firstName,
            lastName: user.lastName,
            state: user.state,
            city: user.city,
            createdOn: user.createdAt
        })
    } else {
        res.status(401).send();
    }
}

export const getUser: RequestHandler = async (req, res, next) => {
    let userId = req.params.id;
    let userFound = await User.findByPk(userId, {
        attributes: [ 'userId', 'username', 'firstName', 'lastName', 'city', 'state', 'createdAt' ]
    });
    if (userFound) {
        res.status(200).json(userFound);
    }
    else {
        res.status(404).json({});
    }
}

export const editUser: RequestHandler = async (req, res, next) => {
    let user: User | null = await verifyUser(req);

    if (user && user.userId == parseInt(req.params.id)) {
        
        let updatedUser: User = req.body;
        updatedUser.userId = user.userId;
    
        if (updatedUser.firstName && updatedUser.lastName && updatedUser.username
            && updatedUser.city && updatedUser.state) {
                await User.update(updatedUser, {
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
}

export const searchUsers: RequestHandler = async (req, res, next) => {
    let searchName = req.params.name;

    let users: User[] = [];
    if (searchName.trim() != '') {
        users = await User.findAll({
            attributes: [ 'userId', 'username', 'firstName', 'lastName' ],
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
        users = await User.findAll({
            attributes: [ 'username', 'firstName', 'lastName' ]
        });
    }
        
    res.status(200).json(users);
}