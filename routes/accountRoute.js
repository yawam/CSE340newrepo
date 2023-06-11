const express = require("express");
const router = new express.Router();
const accountController = require("../Controllers/accountController");
const utilities = require("../utilities/");

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
  (req,res) => {
    res.status(200).send('login process')
  }
)

module.exports = router