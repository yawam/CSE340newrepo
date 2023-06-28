// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../Controllers/invController");
const utilities = require("../utilities/");
const invValidate = require("../utilities/inventory-validation");
const accountValidate = require("../utilities/account-validation");

// Route to build inventory by classification view
router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
);

// Route to build car view
router.get(
  "/detail/:invId",
  utilities.handleErrors(invController.buildByInvId)
);

// route to build management view
router.get(
  "/",
  utilities.checkJWTToken,
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildManagement)
);

//route to build addclass view
router.get(
  "/add-classification",
  utilities.checkJWTToken,
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildAddClassification)
);

// route to add inventory view
router.get(
  "/add-inventory",
  utilities.checkJWTToken,
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildAddInventory)
);
// need to build routes for processing classification insert
router.post(
  "/add-classification",
  utilities.checkJWTToken,
  utilities.checkAccountType,
  utilities.handleErrors(invController.addClassification)
);

// need to build route for inventory insert
router.post(
  "/add-inventory",
  utilities.checkJWTToken,
  utilities.checkAccountType,
  utilities.handleErrors(invController.AddNewInventory)
);

// route for inventory management execution
router.get(
  "/getInventory/:classification_id",
  utilities.handleErrors(invController.getInventoryJSON)
);

//route to get to modify inventory view
router.get(
  "/edit/:inv_id",
  utilities.checkJWTToken,
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildModifyView)
);

//route to process inventory view update
router.post(
  "/update/",
  invValidate.inventoryRules(),
  invValidate.checkUpdateData,
  utilities.checkJWTToken,
  utilities.checkAccountType,
  utilities.handleErrors(invController.updateInventory)
);

//route to build inventory delete view
router.get(
  "/delete/:inv_id",
  utilities.handleErrors(invController.buildDeleteView)
);
//accountValidate.checkAccountType,
// route to process inventory deletion
router.post(
  "/delete/",
  utilities.checkJWTToken,
  utilities.checkAccountType,
  utilities.handleErrors(invController.deleteInventory)
);
//accountValidate.checkAccountType,
//link for error
router.get("/throwError", utilities.handleErrors(invController.throwError));

module.exports = router;
