const express = require('express');
const router = new express.Router();
const userController = require("../controllers/userController")

router.post('/signup',userController.signup);

router.post('/login',userController.login)

router.post ('/logout',userController.allowLoggedInUser, userController.logout)

router.get('/user/:userId',userController.allowLoggedInUser,userController.getUser);

router.get('/users',userController.allowLoggedInUser,userController.grantAccess('readAny','profile'),userController.getUsers)

router.put('user/:userId',userController.allowLoggedInUser,userController.grantAccess('updateAny','profile'),userController.updateUser)


router.delete('user/:userId',userController.allowLoggedInUser),userController.grantAccess('deleteAny','profile'),userController.deleteUser


module.exports = router;