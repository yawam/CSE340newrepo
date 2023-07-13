const utilities = require("../utilities/");
const accountModel = require("../models/account-models");
const messModel = require("../models/message-model")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

/***
 * Deliver log in view
 ****/

async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  // let login = await utilities.buildLogin()
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  });
}

/***
 * Deliver registration view
 */

async function buildRegistration(req, res, next) {
  let nav = await utilities.getNav();
  // let register = await utilities.buildRegistration()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  });
}

/***
 * Process Registration
 */
async function registerAccount(req, res) {
  let nav = await utilities.getNav();
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body;

  //hash the password before storing
  let hashedPassword;
  try {
    //regular password and cost(salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash(
      "notice",
      "Sorry, there was an error processing the registration."
    );
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    });
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  );

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    );
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    });
  }
}

/*****
 * process account login
 * ***** */
async function accountLogin(req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;
  const accountData = await accountModel.getAccountByEmail(account_email);
  console.log(accountData);
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.");
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    });
    return;
  }
  try {
    await bcrypt.compare(account_password, accountData.account_password);
    delete accountData.account_password;
    const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: 3600 * 1000,
    });
    res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
    return res.redirect("/account/");
  } catch (error) {
    return new Error("Access Forbidden");
  }
}

/****
 * build account management view
 * ***** */
async function buildAccountManagementView(req, res, next) {
  let nav = await utilities.getNav();
  let account_id = res.locals.accountData.account_id
  let unread =  await messModel.getUnreadMessages(account_id)
  console.log(unread.rows[0].count)
  res.render("account/management", {
    title: "Account Management",
    nav,
    errors: null,
    unread:unread.rows[0].count
  });
}

/********
 * Build account update info view
 * ****** */
async function buildAccountInfoUpdateView(req, res) {
  let nav = await utilities.getNav();
  const account_id = parseInt(req.params.account_id);
  res.render("account/update-account", {
    title: "Update Account Details",
    nav,
    error: null,
    account_id,
  });
}

/******
 * Process Account info Update
 * ***** */
async function updateAccountInfo(req, res) {
  let nav = await utilities.getNav();
  const { account_firstname, account_lastname, account_email, account_id } =
    req.body;

  const updateResult = await accountModel.updateAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_id
  );

  if (updateResult) {
    req.flash("notice", `Congratulations, you updated the account`);
    res.status(201).render("/account/", {
      title: "Login",
      nav,
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, the Update failed.");
    res.status(501).render("account/update-account", {
      title: "Update Account Details",
      nav,
      errors: null,
      account_firstname: account_firstname,
      account_lastname: account_lastname,
      account_email: account_email,
      account_id: account_id,
    });
  }
}

/*****
 * Process Password Update
 * ****** */
async function passwordUpdate(req, res) {
  let nav = await utilities.getNav();
  const {
    account_id,
    account_password,
    account_firstname,
    account_lastname,
    account_email,
  } = req.body;

  // Hash before storing
  let hashedPassword = await bcrypt.hashSync(account_password, 10);
  const accountPassword = await accountModel.updatePassword(
    hashedPassword,
    account_id
  );
  const accountData = await accountModel.getAccountById(account_id);
  if (accountPassword) {
    try {
      const accessToken = jwt.sign(
        accountData,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 3600 * 1000 }
      );
      res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
      return (
        req.flash("notice", "Password has been updated"),
        res.redirect("/account/")
      );
    } catch (error) {
      return new Error("Access Forbidden");
    }
  } else {
    req.flash("notice", "Password Could not be changed");
    res.status(501).render(`./account/update`, {
      title: "Edit Account Information",
      nav,
      errors: null,
      account_id: account_id,
      account_firstname: account_firstname,
      account_lastname: account_lastname,
      account_email: account_email,
    });
  }
}

module.exports = {
  buildLogin,
  buildRegistration,
  registerAccount,
  accountLogin,
  buildAccountManagementView,
  buildAccountInfoUpdateView,
  updateAccountInfo,
  passwordUpdate,
};
