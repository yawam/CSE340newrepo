const pool = require("../database/index");
const accModel = require("./account-models");

async function sendMessage(
  message_to,
  message_subject,
  message_body,
  message_from
) {
  try {
    console.log(message_to, message_subject, message_body, message_from);
    const sql =
      "INSERT INTO message(message_subject, message_body, message_to, message_from )" +
      "VALUES ($1, $2, $3, $4) RETURNING *";
    return await pool.query(sql, [
      message_subject,
      message_body,
      message_to,
      message_from,
    ]);
  } catch (error) {
    return error.message;
  }
}

async function getMessageByMessage_to(account_id) {
  try {
    const sql = "SELECT a.account_firstname, account_lastname, message_id, message_from, message_to, message_created, message_read, message_body, message_subject FROM message m FULL JOIN account a ON m.message_from = a.account_id WHERE message_to = $1 AND message_archived = false"; /// AND message_read = false
    return await pool.query(sql, [account_id]);
  } catch (error) {
    console.error("getMessageByMessage_to error " + error);
  }

}
async function getMessage(message_id){
    try{
        const data = await pool.query(
            "SELECT * FROM public.message WHERE message_id = $1",
            [message_id]
        );
        return data.rows;
    } catch(error){
        console.error("getMessage query error " + error);
    }

}

async function markAsRead(message_id){
  try{
    const sql = "UPDATE public.message SET message_read = true WHERE message_id = $1"
        return await pool.query(sql, [message_id])
  } catch(error){
    console.error("Mark asRead query error" + error);
  }
}

async function archiveMessage(message_id){
  try{
    const sql = "UPDATE public.message SET message_archived = true WHERE message_id = $1"
        return await pool.query(sql, [message_id])
  } catch(error){
    console.error("Archived query error" + error);
  }
}

// async function getUnread(message_to) {
//   try {
//     const sql =
//       "SELECT a.account_firstname, account_lastname, message_from, message_to, message_created, message_read, message_body, message_subject FROM message m FULL JOIN account a ON m.message_from = a.account_id WHERE message_to = $1 AND message_read = false";

//     return await pool.query(sql, [message_to]);
//   } catch (error) {
//     return error.message;
//   }
// }

module.exports = { sendMessage, getMessageByMessage_to, getMessage, markAsRead, archiveMessage };
