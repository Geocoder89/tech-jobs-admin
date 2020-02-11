const User = require("../models/userModel");
const { roles } = require("../roles");
const jwt = require('jsonwebtoken');




exports.signup = async function(req, res) {
  // console.log(req.body);
  const user = new User(req.body);

  try {
    await user.save();
    const token = await user.generateAuthToken();
    // console.log(user)
    return res.status(201).json({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.login = async (req, res, next) => {
  // find user

  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    // console.log(user);
    if (!user) return next(new Error("Email does not exist"));

    // get token
    const token = await user.generateAuthToken();
    // return a response containing the user found and the token generated
    // console.log({user,token})
     res.send({user,token });
  } catch (e) {
    res.status(400).send(e);
  }
};

exports.logout = async (req, res) => {
 
  try{
   
    req.user.tokens = req.user.tokens.filter((token)=>{
        return token.token !== req.token
    });

    

    await req.user.save();

    res.send();
    console.log(req.user.tokens)
} catch(e){
    res.status(500).send();
}
};

// middleware to get all users,getting a particular user,updating a particular user and deleting a particular user

// to get all users
exports.getUsers = async (req, res, next) => {
  const users = await User.find({});
  res.status(200).json({
    data: users
  });
};

// to get a particular user

exports.getUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const user = await User.findbyId(userId);
    if (!user) return next(new Error("the mentioned user does not exist"));

    res.status(200).json({
      data: user
    });
  } catch (error) {
    next(error);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const update = req.body;

    const userId = req.params.userId;
    await User.findByIdAndUpdate(userId, update);
    const user = await User.findById(userId);
    res.status(200).json({
      data: user,
      message: "User has been updated"
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    await User.findByIdAndDelete(userId);

    res.status(200).json({
      data: null,
      message: "User has been deleted"
    });
  } catch (error) {
    next(error);
  }
};

// middleware designed for permissions and authorization and also to determine if a user is logged in to carry out a particular action

exports.grantAccess = function(action, resource) {
  return async (req, res, next) => {
    try {
      const permissions = roles.can(req.user.role)[action](resource);
      if (!permissions.granted) {
        return res.status(401).json({
          error: "You do not have permission to perform this action"
        });
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

exports.allowLoggedInUser = async (req, res, next) => {
  console.log(req.body)
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token
    });
    if (!user) {
      throw new Error(e);
    }
    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    res.status(401).send(e);
  }
};

// exports.allowLoggedInUser = async (req, res, next) => {
//   try {
//    const user = res.locals.loggedInUser;
//    if (!user)
//     return res.status(401).json({
//      error: "You need to be logged in to access this route"
//     });
//     req.user = user;
//     next();
//    } catch (error) {
//     next(error);
//    }
//  }