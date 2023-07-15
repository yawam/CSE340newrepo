const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

validate.messageBoxRules = () => {
    return[
        body("message_subject")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please provide a subject for your message."),
        
        body("message_body")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please provide a body for your message.")
    ]
}

validate.checkMessageData = async (req, res, next) => {
    const { message_to,
        message_subject,
        message_body,
        message_from} = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      let dropdown = await utilities.buildAccountDropdown()
      res.render("./messages/messageBox",{
        title: "Compose Message",
        dropdown,
        nav,
        errors: null,
        message_to,
        message_subject,
        message_body,
        message_from
    })
      return
    }
    next()
  }

module.exports = validate;