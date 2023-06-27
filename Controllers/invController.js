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
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav();
  let classificationSelect = await utilities.buildDropdown();
  res.render("./inventory/management", {
    title: "Inventory management",
    nav,
    errors: null,
    classificationSelect,
  });
};

/*****
 * Build Add Classification View
 */
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("./inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
  });
};

/****
 * build add inventory view
 * *** */
invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  let dropdown = await utilities.buildDropdown();
  res.render("./inventory/add-inventory", {
    title: "Add New Inventory Item",
    nav,
    dropdown,
    errors: null,
  });
};

/******
 * Process Add Inventory
 * ******* */

invCont.AddNewInventory = async function (req, res) {
  let nav = await utilities.getNav();
  let dropdown = await utilities.buildDropdown();
  const {
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;

  const result = await invModel.insertInventoryItem(
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  );

  if (result) {
    req.flash("notice", "Item has been added to the inventory");
    res.status(201).render("inventory/add-inventory", {
      title: "Add New Inventory Item",
      nav,
      dropdown,
      errors: null,
    });
  } else {
    req.flash("notice", "Inventory Item has not been added");
    res.status(501).render("inventory/add-inventory", {
      title: "Add New Inventory Item",
      nav,
      dropdown,
      errors: null,
    });
  }
};



/****
 * Process Add Classification
 * **** */

invCont.addClassification = async function (req, res) {
  console.log("YYY");
  let nav = await utilities.getNav();
  const { classification_name } = req.body;
  console.log(req.body);
  const result = await invModel.insertClassification(classification_name);
  console.log(result);
  if (result) {
    nav = await utilities.getNav();
    req.flash(
      "notice",
      `Congratulations, ${classification_name} has been added to classifications`
    );
    res.status(201).render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, adding this classification failed.");
    res.status(501).render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
    });
  }
};

/******
 * Return Inventory by Classification As JSON 
 * ***** */

invCont.getInventoryJSON = async(req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id){
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/*******
 * building modify inventory view
 * ****** */
invCont.buildModifyView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav();
  const itemData = await invModel.getBuildByCarView(inv_id)
  let classificationSelect = await utilities.buildDropdown(itemData[0].classification_id)
  const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`
  console.log(itemData)
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect,
    errors: null,
    inv_id: itemData[0].inv_id,
    inv_make: itemData[0].inv_make,
    inv_model: itemData[0].inv_model,
    inv_year: itemData[0].inv_year,
    inv_description: itemData[0].inv_description,
    inv_image: itemData[0].inv_image,
    inv_thumbnail: itemData[0].inv_thumbnail,
    inv_price: itemData[0].inv_price,
    inv_miles: itemData[0].inv_miles,
    inv_color: itemData[0].inv_color,
    classification_id: itemData[0].classification_id
  })
}

/******
 * Process Update Inventory
 * ******* */

invCont.updateInventory = async function (req, res, next) {
  console.log("I'm here!")
  let nav = await utilities.getNav();
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;

  const updateResult = await invModel.updateInventoryItem(
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  );

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated`);
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildDropdown(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed");
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    });
  }
};

/*******
 * building delete inventory view
 * ****** */
invCont.buildDeleteView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav();
  const itemData = await invModel.getBuildByCarView(inv_id)
  const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`
  console.log(itemData)
  res.render("./inventory/delete-confirm", {
    title: "Edit " + itemName,
    nav,
    errors: null,
    inv_id: itemData[0].inv_id,
    inv_make: itemData[0].inv_make,
    inv_model: itemData[0].inv_model,
    inv_year: itemData[0].inv_year,
    inv_price: itemData[0].inv_price,
  })
}

/******
 * Process Delete Inventory
 * ******* */

invCont.deleteInventory = async function (req, res, next) {
  console.log("I'm here!")
  let nav = await utilities.getNav();
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_price,
  } = req.body;

  const updateResult = await invModel.deleteInventoryItem(inv_id,);

  if (updateResult) {
    const itemName = inv_make + " " + inv_model
    req.flash("notice", `The ${itemName} was successfully deleted`);
    res.redirect("/inv/")
  } else {
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the delete failed");
    res.status(501).render("inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_price,
    });
  }
};



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
