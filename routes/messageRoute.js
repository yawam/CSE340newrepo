const express = require("express");
const router = new express.Router();
const messageController = require("../Controllers/messageController");
const utilities = require("../utilities/");
const messValidate = require("../utilities/message-validation")
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
    messValidate.messageBoxRules(),
    messValidate.checkMessageData,
    utilities.handleErrors(messageController.sendMessage)
)

/***
 * route to display message
 * ***** */
router.get(
    "/messageBody/:message_id",
    utilities.handleErrors(messageController.buildMessageBodyView)
)

/****
 * route to replyMessageview
 * ***** */
router.get(
    "/reply/:message_id",
    utilities.handleErrors(messageController.buildReplyMessageView)
)

/****
 * route to process message reply
 * **** */
router.post(
    "/replyMessage",
    utilities.handleErrors(messageController.replyMessage)
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
 * route to build archive view
 * **** */
router.get(
    "/archiveMessage",
    utilities.handleErrors(messageController.buildArchiveView)

)

/****
 * route to delete message
 * ***** */
router.post(
    "/delete",
    utilities.handleErrors(messageController.deleteMessage)
)

/*****
 * Route to get json data from message table in database(not used)
 * ****** */
router.get(
    "/getMessage/:account_id", 
    utilities.handleErrors(messageController.getMessageJSON)
)