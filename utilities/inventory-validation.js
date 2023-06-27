const utilities = require(".")
const { body, validationResult } = require("express-validator")
const inventoryModel = require("../models/inventory-model")
const validate = {}

/******
 * Server side validation for inventory input
 * ******** */

validate.inventoryRules = () => {
    return[
        //make is required
        body("inv_make")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please provide make."),

        // model is required
        body("inv_model")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please provide model."),

        // year is required and should be 4-digits only
        body("inv_year")
        .trim()
        .isLength({ min: 4, max:4 })
        .withMessage("Please provide year."),

        // description also required
        body("inv_description")
        .trim()
        .isLength({ min:1})
        .withMessage("Please provide description."),

        // image path is required
        body("inv_image")
        .trim()
        .isLength({ min:1})
        .withMessage("Please provide image path."),

        // thumbnail path is required
        body("inv_thumbnail")
        .trim()
        .isLength({ min:1})
        .withMessage("Please provide thumbnail."),

        // price required
        body("inv_price")
        .trim()
        .isLength({ min:1})
        .withMessage("Please provide price."),
        
        //miles required
        body("inv_miles")
        .trim()
        .isLength({ min:1})
        .withMessage("Please provide price."),

        //color required
        body("inv_color")
        .trim()
        .isLength({ min:1})
        .withMessage("Please provide price."),

        // classification ID validation not needed data is already valid

    ]
}

/* ******************************
 * Check data and return errors or continue to vehicle registration
 * ***************************** */
validate.checkInvData = async (req, res, next) => {
    const { inv_make
          , inv_model
          , inv_year
          , inv_description
          , inv_image
          , inv_thumbnail
          , inv_price
          , inv_miles
          , inv_color
          , classification_id } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      let dropdown = await utilities.getClassifications()
      res.render("inventory/add-inventory", {
        errors,
        title: "Add New Vehicle to Inventory",
        dropdown,
        nav,
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
      })
      return
    }
    next()
  }

   /* ******************************
 * Check data and return errors to edit view
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
    const { inv_make
          , inv_model
          , inv_year
          , inv_description
          , inv_image
          , inv_thumbnail
          , inv_price
          , inv_miles
          , inv_color
          , classification_id
          , inv_id } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      let classificationSelect = await utilities.buildDropdown()
      const itemName = `${inv_make} ${inv_model}`
      res.render("inventory/edit-inventory", {
        errors,
        title: "Edit " + itemName,
        classificationSelect,
        nav,
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
        inv_id
      })
      return
    }
    next()
  }

//   account_firstname: Basic
// account_lastname: Client
// account_email: basic@340.edu
// account_password: I@mABas1cCl!3nt
// account_firstname: Happy
// account_lastname: Employee
// account_email: happy@340.edu
// account_password: I@mAnEmpl0y33
// account_firstname: Manager
// account_lastname: User
// account_email: manager@340.edu
// account_password: I@mAnAdm!n1strat0r
    

module.exports = validate;