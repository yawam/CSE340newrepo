'use strict'

// let accountList = document.querySelector("#accountList")
// let account_id = accountList.value
// let accountIdURL = "/getMessage/" + res.locals.accountData.account_id
// fetch(accountIdURL)
// .then(function (response){
//     if(response.ok){
//         return response.json();
//     }
//     throw Error("Network response was not OK");
// })
// .then(function(data){
//     console.log(data);
//     buildMessageList(data)
// })
// .catch(function(error){
//     console.log('There was a problem: ', error.message)
// })

// Build Message Items into HTML table components and inject in DOM
function buildMessageList(data){
    // let messageList = document.getElementById("messageList")

    // table lables
    console.log("I'm getting here")
    let dataTable = '<thead>';
    dataTable += '<tr><th>Received</th><th>Subject</th><th>From</th><th>Read</th></tr>'
    dataTable += '</thead>';

    // table body
    dataTable += '<tbody>';

    // iterate over all messages according to specific items(columns)
    data.forEach(function (element){
        dataTable += `<a href=/message/messageBody><tr><td>${element.message_created}</td><td> ${element.message_subject}</td>`;
        dataTable += `<td>${element.message_from}</td><td>${element.message_read}</td></tr></a>`
    })
    dataTable += '</tbody>'

    messageList.innerHTML = dataTable
}


{/* <thead>
      <tr>
        <th>Received</th>
        <th>Subject</th>
        <th>From</th>
        <th>Read</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>timstamptz</td>
        <td>message_Subject</td>
        <td>GetnamebyID</td>
        <td>TrueORfalsefromDB</td>
      </tr>
      <!-- Additional rows to be looped in from database -->
    </tbody> */}