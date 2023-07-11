const invModel = require("../models/inventory-model");
const accModel = require("../models/account-models");

const Util = {};
const jwt = require("jsonwebtoken");
require("dotenv").config();

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications();
  let list = "<ul>";
  list += '<li><a href="/" title="Home page">Home</a></li>';
  data.rows.forEach((row) => {
    list += "<li>";
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>";
    list += "</li>";
  });
  list += "</ul>";
  return list;
};

/* **************************************
 * Build the classification view HTML
 * ************************************ */
Util.buildClassificationGrid = async function (data) {
  let grid;
  if (data.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach((vehicle) => {
      grid += "<li>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        'details"><img src="' +
        vehicle.inv_thumbnail +
        '" alt="Image of ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' on CSE Motors" /></a>';
      grid += '<div class="namePrice">';
      grid += "<hr />";
      grid += "<h2>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details">' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        "</a>";
      grid += "</h2>";
      grid +=
        "<span>$" +
        new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
        "</span>";
      grid += "</div>";
      grid += "</li>";
    });
    grid += "</ul>";
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

/****
 * Build view for car
 */

Util.buildInvView = async function (data) {
  let div;
  if (data.length > 0) {
    div =
      '<h1 id="invName">' +
      data[0].inv_year +
      " " +
      data[0].inv_make +
      " " +
      data[0].inv_model +
      "</h1>";
    div +=
      '<div class="car-image">' +
      '<img src="' +
      data[0].inv_image +
      '"' +
      '" alt="Image of ' +
      data[0].inv_make +
      " " +
      data[0].inv_model +
      ' on CSE Motors" />';
    div +=
      '<div class="describe"><h2>' +
      data[0].inv_make +
      " " +
      data[0].inv_model +
      "</h2><h3>Price: $" +
      new Intl.NumberFormat("en-US").format(data[0].inv_price) +
      "</h3>";
    div +=
      '<h3 id="description">Description:</h3> <p>' +
      data[0].inv_description +
      "</p>";
    div += '<h3 id="color">Color:</h3> <p>' + data[0].inv_color + "</p>";
    div +=
      '<h3 id="miles">Miles:</h3> <p>' +
      new Intl.NumberFormat("en-US").format(data[0].inv_miles) +
      "</p></div></div>";
  } else {
    div += "Sorry, no inventory details could be found.";
  }
  return div;
};

/*******
 * Build classification dropdown
 * ****** */
Util.buildDropdown = async function (classification_id = null) {
  let data = await invModel.getClassifications();
  let dropdown = "<select id='classification_id' name='classification_id' id='classificationList' >";
  dropdown += "<option value='' > -- Select --</option>";
  data.rows.forEach((row) => {
    dropdown += "<option value=" + row.classification_id;
    if (classification_id == row.classification_id) {
      dropdown += " selected ";
    }
    dropdown += ">" + row.classification_name + "</option>";
  });
  dropdown += "</select>";
  return dropdown;
};

/*****
 * Build Accounts Dropdown
 * **** */
Util.buildAccountDropdown = async function (account_id = null){
  let data = await accModel.getAccounts();
  let dropdown = "<select id='message_to' name='message_to' id='accountList' >";
  dropdown += "<option value='' > -- Select --</option>";
  data.rows.forEach((row) => {
    dropdown += "<option value=" + row.account_id;
    if (account_id == row.account_id) {
      dropdown += " selected ";
    }
    dropdown += ">" + row.account_firstname + " " + row.account_lastname + "</option>";
  });
  dropdown += "</select>";
  return dropdown;
}

/****
 * build inbox list (unread to be implemented la'er)
 * ** */
Util.buildMessageList = async function (data){

  // table lables
  console.log("I'm getting here")
  console.log(data)
  let dataTable = '<thead>';
  dataTable += '<tr><th>Received</th><th>Subject</th><th>From</th><th>Read</th></tr>'
  dataTable += '</thead>';

  // table body
  dataTable += '<tbody>';

  // iterate over all messages according to specific items(columns)
  data.forEach((element) => {
      dataTable += `<tr><td>${element.message_created}</td><td><a href=/message/messageBody/${element.message_id} title= highlight Test> ${element.message_subject}</a></td>`;
      dataTable += `<td>${element.account_firstname + " " + element.account_lastname}</td><td>${element.message_read}</td></tr>`
  })
  dataTable += '</tbody>'

  return dataTable
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 **************************************** */
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/*******
 * Middleware to check token validity
 * ****** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        console.log("yoo1");
        if (err) {
          console.log("yo");
          req.flash("Please log in");
          res.clearCookie("jwt");
          res.redirect("/account/login");
        }
        console.log("yoo2");
        res.locals.accountData = accountData;
        res.locals.loggedin = 1;
        console.log(res.locals.loggedin);
        next();
      }
    );
  } else {
    next()
  }
};

/*****
 *  Middleware to check login
 * ******* */
Util.checkLogin = (req, res, next) => {
  console.log(res.locals.loggedin);
  if (res.locals.loggedin) {
    next();
  } else {
    req.flash("notice", "Please Log in.");
    return res.redirect("/account/login");
  }
};

Util.checkAccountType = (req, res, next) => {
  console.log("I reached Here");
  console.log("This is an" + res.locals.accountData.account_type)
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

module.exports = Util;
