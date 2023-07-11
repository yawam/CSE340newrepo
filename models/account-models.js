const pool = require("../database/index")


/****
 * Get Accounts from DB
 * ***** */
async function getAccounts(){
    return await pool.query(
      "SELECT * FROM public.account WHERE account_id >= 5 ORDER BY account_firstname"
    )
    }


/*****
 * Register new account
 */

async function registerAccount(account_firstname, account_lastname, account_email, account_password){
    try{
        const sql = "INSERT INTO account(account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
        return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
    } catch(error){
        return error.message
    }
}

async function checkExistingEmail(account_email){
    try{
        const sql = "SELECT * FROM account WHERE account_email = $1"
        const email = await pool.query(sql, [account_email])
        return email.rowCount
    }catch(error){
        return error.message
    }
}

/******
 * Return account data using email address
 * ********* */
async function getAccountByEmail(account_email){
    try{
        const result = await pool.query(
            'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
            [account_email])
            return result.rows[0]
    } catch(error){
        return new Error("No matching email found")
    }
}

/*****
 * Returns account data with Id(account_id)
 * ***** */
async function getAccountById(account_id) {
    try {
      const result = await pool.query(
        'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_id = $1',
        [account_id])
      return result.rows[0]
    } catch (error) {
      return new Error("No matching Id found")
    }
  }

/*********
 * Perform an update of Accountdetails
 * ***** */
async function updateAccount(
   account_firstname,
  account_lastname,
  account_email,
  account_id
    ){
        try{
            const sql = "UPDATE public.account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4 RETURNING *"
            const data = await pool.query(sql, [account_firstname,
                account_lastname,
                account_email,
                account_id])
                return data.rows[0]
        } catch(error){
            return "Update Error" + error
        }
}

/******
 * Perform password Update
 * ******* */

async function updatePassword(
    account_password,
    account_id
  ) {
    try {
      const sql = 
        "UPDATE public.account SET account_password = $1 WHERE account_id = $2"
      return await pool.query(sql, [
        account_password,
        account_id
      ])
    } catch (error) {
      return ("Password update error: " + error)
    }
  }

module.exports = {getAccounts, registerAccount, checkExistingEmail, getAccountByEmail, updateAccount, getAccountById, updatePassword }