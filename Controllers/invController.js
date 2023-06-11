const invModel = require("../models/inventory-model");
const utilities = require("../utilities");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  });
};

/* *********
 *Build view for one car
 *********** */
invCont.buildByInvId = async function (req, res, next) {
  const inv_id = req.params.invId;
  const data = await invModel.getBuildByCarView(inv_id);
  const div = await utilities.buildInvView(data);
  let nav = await utilities.getNav();
  res.render("./inventory/inventory", {
    title: "vehicles",
    nav,
    div,
  });
};

/***
 * Build Management View
 * ** */
invCont.buildManagement = async function(req, res, next){
  let nav = await utilities.getNav()
  res.render("./inventory/management", {
    title: "Inventory management",
    nav,
    errors: null

  });
};

/*****
 * Build Add Classification View
 */
invCont.buildAddClassification = async function(req, res, next){
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null
  })
}

/****
 * build add inventory view
 * *** */
invCont.buildAddInventory = async function(req, res, next){
  let nav = await utilities.getNav()
  let dropdown = await utilities.buildDropdown()
  res.render("./inventory/add-inventory", {
    title: "Add New Inventory Item",
    nav,
    dropdown,
    errors: null
  })
}

/******
 * Process Add Inventory
 * ******* */

invCont.newInventory = async function( req, res){
  let nav = await utilities.getNav()
  let dropdown = await utilities.buildDropdown()
  const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body

  const result = await invModel.insertInventoryItem(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id)

  if (result){
    req.flash(
      "notice", "Item has been added to the inventory"
    )
    res.status(201).render("inventory/add-inventory", {
      title: "Add New Inventory Item",
      nav,
      dropdown,
      errors: null
    })
  } else{
    req.flash(
      "notice","Inventory Item has not been added"
    )
    res.status(501).render("inventory/add-inventory", {
      title: "Add New Inventory Item",
      nav,
      dropdown,
      errors: null
    })
  }
}

/****
 * Process Add Classification
 * **** */

invCont.addClassification = async function(req, res){
  const{ classification_name } = req.body
  const result = await invModel.insertClassification(classification_name)

  if(result){
    nav = await utilities.getNav();
    req.flash("notice", `Congratulations, ${classification_name} has been added to classifications`)
    res.status(201).render("inventory/add-classification",{
      title: "Add Classification",
      nav,
      errors: null
    })
  } else {
    req.flash("notice", "Sorry, adding this classification failed.")
    res.status(501).render("inventory/add-classification",{
      title: "Add Classification",
      nav,
      errors: null
    })
  }
}



/***
 * error message 500
 */
invCont.throwError = function (req, res, next) {
  try {
    throw new Error("Try again, you must");
  } catch (error) {
    next(error);
  }
};

module.exports = invCont;
