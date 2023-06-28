const utilities = require("../utilities/");
const { body, validationResult } = require("express-validator");
const accountModel = require("../models/account-models");
const validate = {};

/****
 * Registration Data Validation Rules
 * ** */

validate.registrationRules = () => {
  return [
    // firstname is required and must be string
    body("account_firstname")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."), // on error, this message is sent

    //lastname is required and must be string
    body("account_lastname")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."), // on error this message is sent

    //valid email is required and cannot already exist in DB
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required") // on error this message is sent
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(
          account_email
        );
        if (emailExists) {
          throw new Error("Email exists. Please log in or use different email");
        }
      }),

    body("account_password")
      .trim()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ];
};

validate.accountUpdateRules = () => {
  return [
    // firstname is required and must be string
    body("account_firstname")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."), // on error, this message is sent

    //lastname is required and must be string
    body("account_lastname")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."), // on error this message is sent

    //valid email is required and cannot already exist in DB
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required"), // on error this message is sent
  ];
};

validate.passwordUpdateRules = () => {
  body("account_password")
    .trim()
    .isStrongPassword({
      minLength: 12,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage("Password does not meet requirements.");
};

validate.checkPasswordData = async (res, req, next) => {
  const {
    account_password,
    account_id,
  } = req.body;

  const accountData = await accountModel.getAccountById(account_id);

  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("account/update", {
      errors,
      title: "Update Account Information",
      nav,
      account_password,
    });
    return;
  }
  next();
};

validate.loginRules = () => {
  return [
    // email
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("A Valid Email is required"),

    body("account_password")
      .trim()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements"),
  ];
};

validate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("account/register", {
      errors,
      title: "Registration",
      nav,
      account_firstname,
      account_lastname,
      account_email,
    });
    return;
  }
  next();
};

validate.checkAccountData = async (req, res, next) => {
  const { account_id, account_firstname, account_lastname, account_email } =
    req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("account/update", {
      errors,
      title: "Updates",
      nav,
      account_id,
      account_firstname,
      account_lastname,
      account_email,
    });
    return;
  }
  next();
};

validate.checkLoginData = async (req, res, next) => {
  const { account_email } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("../views/account/login", {
      errors: null,
      title: "Login",
      nav,
      account_email,
    });
    return;
  }
  next();
};

validate.checkAccountType = (req, res, next) => {
  console.log("I reached Here");
  if (
    res.locals.accountData.account_type == "Admin" ||
    res.locals.accountData.account_type == "Employee"
  ) {
    next();
  } else {
    req.flash(
      "notice",
      "Access Denied. Only authorized users can access that page"
    );
    return res.redirect("/account");
  }
};

module.exports = validate;
