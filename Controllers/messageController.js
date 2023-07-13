const utilities = require("../utilities");
const messModel = require("../models/message-model");
const accModel = require("../models/account-models");

const messCont = {}

/****
 * function to deliver inbox view
 * ****** */
messCont.buildInbox = async function(req, res){
    let nav = await utilities.getNav();
    let account_id = res.locals.accountData.account_id
    console.log(account_id)
    const message_data = await messModel.getMessageByMessage_to(account_id)
    const messageList = await utilities.buildMessageList(message_data.rows)
    title = res.locals.accountData.account_firstname;
    res.render("./messages/inbox", {
        title: title + " Inbox",
        nav,
        errors: null,
        messageList
    });
};

/***
 * function to deliver message form view
 * ** */

messCont.buildMessageBox = async function(req, res){
    let nav = await utilities.getNav();
    let dropdown = await utilities.buildAccountDropdown();
    res.render("./messages/messageBox",{
        title: "Compose Message",
        dropdown,
        nav,
        errors: null
    })
}

messCont.buildMessageBodyView = async function(req, res){
    let nav = await utilities.getNav();
    const message_id = req.params.message_id;
    const messageBody_data = await messModel.getMessage(message_id) // without the join
    // console.log(messageBody_data)


    let account_id = res.locals.accountData.account_id
    const message_data = await messModel.getMessageByMessage_to(account_id) // with join
    // console.log(message_data)

    let title = messageBody_data[0].message_subject
    let messageBody = messageBody_data[0].message_body
    let sender = message_data.rows[0].account_firstname + " " + message_data.rows[0].account_lastname
    let timestamp = messageBody_data[0].message_created
    res.render("./messages/messageBody", {
        title,
        nav,
        messageBody,
        sender,
        timestamp,
        errors: null,
        message_id: messageBody_data[0].message_id
    })
}

/*****
 * processing send message (post into database)
 * ***** */
messCont.sendMessage = async function(req, res, next){
    let nav = await utilities.getNav();
    console.log("I got here")
    let dropdown = await utilities.buildAccountDropdown();
    const{
        message_to,
        message_subject,
        message_body,
        message_from

    } = req.body
    console.log(message_from)

    const result = await messModel.sendMessage(
        message_to,
        message_subject,
        message_body,
        message_from
    )
    console.log("I got here")

    if(result){
        console.log("now I'm here")
        req.flash("notice", "Message has been sent");
        res.status(201).render("./messages/messageBox",{
            title: "Compose Message",
            dropdown,
            nav,
            errors: null
        });
    } else {
        console.log("now I'm not")
        req.flash("notice", "Message has not been sent");
        res.status(501).render("./messages/messageBox",{
        title: "Compose Message",
        dropdown,
        nav,
        errors: null
    })

}

}

/*****
 * Build reply message view
 * ***** */
messCont.buildReplyMessageView = async function(req,res){
    let nav = await utilities.getNav();
    const message_id = req.params.message_id
    let account_id = res.locals.accountData.account_id
    const message_data = await messModel.getMessageByMessage_to(account_id)

    const messageBody_data = await messModel.getMessage(message_id)
    console.log(messageBody_data)

    let subject = messageBody_data[0].message_subject
    let messageBody = messageBody_data[0].message_body
    let sender = message_data.rows[0].account_firstname + " " + message_data.rows[0].account_lastname
    res.render("./messages/reply",{
        title: "Reply Message",
        nav,
        subject,
        sender,
        messageBody,
        errors: null,
        message_id
    })
}

/******
 * Process reply message
 * **** */
messCont.replyMessage = async function(req, res){
    let nav = await utilities.getNav();
    let account_id = res.locals.accountData.account_id
    console.log(account_id)
    const message_data = await messModel.getMessageByMessage_to(account_id)
    const messageList = await utilities.buildMessageList(message_data.rows)
    title = res.locals.accountData.account_firstname;
    const{ message_id,
        message_subject,
        message_body } = req.body

        console.log(message_id)

    const replied = await messModel.replyMessage(
        message_id, message_subject, message_body
    )

    if(replied){
        req.flash("notice", "Message has been replied to");
        res.render("./messages/inbox", {
            title: title + " Inbox",
            nav,
            errors: null,
            messageList
        });

    }else{
        req.flash("notice", "Message has not been replied to");
        res.render("./messages/inbox", {
            title: title + " Inbox",
            nav,
            errors: null,
            messageList
        });

    }
}

/******
 * process mark as read
 * ***** */
messCont.markAsRead = async function(req,res){
    let nav = await utilities.getNav()
    const{ message_id } = req.body;

    const marked = await messModel.markAsRead(message_id)
    console.log(message_id)
    // const mess_id = req.params.message_id;
    // console.log(mess_id)

    const messageBody_data = await messModel.getMessage(message_id)
    console.log(messageBody_data)

    let account_id = res.locals.accountData.account_id
    const message_data = await messModel.getMessageByMessage_to(account_id)

    let title = messageBody_data[0].message_subject
    let messageBody = messageBody_data[0].message_body
    let sender = message_data.rows[0].account_firstname + " " + message_data.rows[0].account_lastname
    let timestamp = messageBody_data[0].message_created

    if(marked){
        req.flash("notice", "Message has been marked as read");
        res.status(201).render("./messages/messageBody", {
            title,
            nav,
            messageBody,
            sender,
            timestamp,
            errors: null,
            message_id
        })

    }else {
        req.flash("notice", "Message has not been marked as read");
        res.status(501).render("./messages/messageBody", {
            title,
            nav,
            messageBody,
            sender,
            timestamp,
            errors: null,
            message_id
        })

    }
}

/****
 * Process archiving message
 * ***** */
messCont.archiveMessage = async function(req,res){
    let nav = await utilities.getNav()
    const{ message_id } = req.body

    const archived = await messModel.archiveMessage(message_id)
    console.log(message_id)
    // const mess_id = req.params.message_id;
    // console.log(mess_id)

    const messageBody_data = await messModel.getMessage(message_id)
    console.log(messageBody_data)

    let account_id = res.locals.accountData.account_id
    const message_data = await messModel.getMessageByMessage_to(account_id)

    let title = messageBody_data[0].message_subject
    let messageBody = messageBody_data[0].message_body
    let sender = message_data.rows[0].account_firstname + " " + message_data.rows[0].account_lastname
    let timestamp = messageBody_data[0].message_created

    if(archived){
        req.flash("notice", "Message has been archived");
        res.status(201).render("./messages/messageBody", {
            title,
            nav,
            messageBody,
            sender,
            timestamp,
            errors: null,
            message_id
        })

    }else {
        req.flash("notice", "Message has not been archived");
        res.status(501).render("./messages/messageBody", {
            title,
            nav,
            messageBody,
            sender,
            timestamp,
            errors: null,
            message_id
        })

    }
}

/*****
 * build archive view
 * ** */
messCont.buildArchiveView = async function(req, res){
    let nav = await utilities.getNav();
    let account_id = res.locals.accountData.account_id
    console.log(account_id)
    const message_data = await messModel.getArchiveMessages(account_id)
    console.log(message_data)
    const messageList = await utilities.buildMessageList(message_data.rows)
    title = res.locals.accountData.account_firstname;
    res.render("./messages/archive", {
        title: title + " Archived Messages",
        nav,
        errors: null,
        messageList
    });
}

/****
 * delete Message
 * **** */
messCont.deleteMessage = async function(req, res){
    let nav = await utilities.getNav();
    const{ message_id } = req.body

    let deleted = await messModel.deleteMessage(message_id)
    let account_id = res.locals.accountData.account_id
    console.log(account_id)
    const message_data = await messModel.getMessageByMessage_to(account_id)
    const messageList = await utilities.buildMessageList(message_data.rows)
    title = res.locals.accountData.account_firstname;

    if(deleted){
        req.flash("notice","Message has been deleted")
        res.render("./messages/inbox", {
            title: title + " Inbox",
            nav,
            errors: null,
            messageList
        });
    }else{
        req.flash("notice","Message has been deleted")
        res.render("./messages/inbox", {
            title: title + " Inbox",
            nav,
            errors: null,
            messageList
    })
}
}

/****
 * getting message json data
 * ***** */
messCont.getMessageJSON = async(req, res, next) => {
    const account_id = locals.accountData.account_id
    const message_data = await messModel.getMessageByMessage_to(account_id)
    if(message_data[0].message_id){
        console.log(message_data)
        return res.json(message_data)
    } else {
        next(new Error("No data returned"))
    }
}



module.exports = messCont