// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../Controllers/invController");
const utilities = require("../utilities/");

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
  "/management", utilities.handleErrors(invController.buildManagement)
)

//route to build addclass view
router.get(
  "/add-classification", utilities.handleErrors(invController.buildAddClassification)
)

// route to add inventory view
router.get(
  "/add-inventory", utilities.handleErrors(invController.buildAddInventory)
)
//link for error
router.get("/throwError", utilities.handleErrors(invController.throwError));

module.exports = router;
