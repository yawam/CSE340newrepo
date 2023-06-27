const express = require("express");
const router = new express.Router();
const accountController = require("../Controllers/accountController");
const utilities = require("../utilities/");
const regValidate = require("../utilities/account-validation")

// route to build login view

router.get("/login", utilities.handleErrors(accountController.buildLogin));

// route to deliver registration view
router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegistration)
);

// enable registration route
router.post(
  "/register",
  utilities.handleErrors(accountController.registerAccount)
);

//Process the login attempt
router.post(
  '/login',
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

// route to deliver account view
router.get(
  '/',
  utilities.checkLogin, utilities.handleErrors(accountController.buildAccountManagementView)
)

module.exports = router