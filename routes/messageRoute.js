const express = require("express");
const router = new express.Router();
const messageController = require("../Controllers/messageController");
const utilities = require("../utilities/");
// message validation
// const regValidate = require("../utilities/account-validation");


/*****
 * route to build inbox page
 * ****/

router.get(
    "/",
    utilities.handleErrors(messageController.buildInbox)
)

/****
 * route to build messageBox
 * *** */ 
router.get(
    "/compose",
    utilities.handleErrors(messageController.buildMessageBox)
)
module.exports = router

/*****
 *  route to process message sending
 * **** */
router.post(
    "/send",
    utilities.handleErrors(messageController.sendMessage)
)

/***
 * route to display message
 * ***** */
router.get(
    "/messageBody/:message_id",
    utilities.handleErrors(messageController.buildMessageBodyView)
)

/*****
 *route process marking as read
 * ****** */
router.post(
    "/read",
    utilities.handleErrors(messageController.markAsRead)
)

/****
 * route to process archiving message
 * ***** */
router.post(
    "/archive",
    utilities.handleErrors(messageController.archiveMessage)
)

/*****
 * Route to get json data from message table in database(not used)
 * ****** */
router.get(
    "/getMessage/:account_id", 
    utilities.handleErrors(messageController.getMessageJSON)
)