const utilities = require(".")
const { body, validationResult } = require("express-validator")
const inventoryModel = require("../models/inventory-model")
const validate = {}

/******
 * server-side validation for classification input
 * ***** */
validate.classificationRules = () => {
    return[
        //valid classification is required and cannot already exist in DB
        body("classification_name")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please provide a classification name.")
        .custom(async(classification_name) => {
            const classificationExists = await inventoryModel.checkExistingClassification(classification_name)
            if(classificationExists){
                throw new Error ("Email exists. Please log in or use different email")
            }
        })
    ]
}
