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
        body("inv_make")
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

modulate.exports = validate;