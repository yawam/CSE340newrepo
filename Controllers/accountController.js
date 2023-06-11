const utilities = require("../utilities/")
const accountModel = require("../models/account-models")
const bcrypt = require("bcryptjs")


/***
 * Deliver log in view
 ****/

async function buildLogin(req, res, next){
    let nav = await utilities.getNav()
    // let login = await utilities.buildLogin()
    res.render("account/login", {
        title: "Login",
        nav,
        errors: null
    })
}

/***
 * Deliver registration view
 */

async function buildRegistration(req, res, next){
    let nav = await utilities.getNav()
    // let register = await utilities.buildRegistration()
    res.render("account/register", {
        title : "Register",
        nav,
        errors: null
    })
}

/***
 * Process Registration
 */
async function registerAccount(req, res){
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body

    //hash the password before storing
    let hashedPassword
    try{
        //regular password and cost(salt is generated automatically)
        hashedPassword = await bcrypt.hashSync(account_password, 10)

    }catch(error){
        req.flash("notice", 'Sorry, there was an error processing the registration.')
        res.status(500).render("account/register", {
            title: "Registration",
            nav,
            errors: null,
        })
    }

    const regResult = await accountModel.registerAccount(
        account_firstname,
        account_lastname,
        account_email,
        hashedPassword
    ) 

    if (regResult){
        req.flash(
            "notice",
            `Congratulations, you\'re registered ${account_firstname}. Please log in.`
        )
        res.status(201).render("account/login", {
            title: "Login",
            nav,
            errors: null
        })
    } else {
        req.flash("notice", "Sorry, the registration failed.")
        res.status(501).render("account/register", {
            title: "Registration",
            nav,
            errors: null
        })
    }
}

module.exports = { buildLogin , buildRegistration, registerAccount}