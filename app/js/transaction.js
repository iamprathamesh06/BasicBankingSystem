const transactionHistory = document.getElementById("transactionHistory");
let transactionData = [];
fetch("https://onlinebanking125.herokuapp.com/transaction-data")
  .then((response) => response.json())
  .then((responseData) => {
    transactionData = responseData;
  });

setTimeout(() => {
  if (transactionData.length != 0) {
    let transactionHtml = ``;
    let i = 0;
    transactionData.forEach((transaction) => {
      transactionHtml += `<div class="transaction">
        <h4>Transaction ID:</h4>
        <h4>${i+1}</h4>
        <p>${transaction.receName}'s Account is credited by Rs.${transaction.amount}</p>
        <p>${transaction.transName}'s Account is debited by Rs.${transaction.amount}</p>
    </div>`;
    i++;
    });
    transactionHistory.innerHTML = transactionHtml;
    
  } else {
   let  transactionHtml = `
    <h5 style="text-align: center; margin-top: 15rem;"> Currently Transaction History is Empty. Please do a transaction.</h5>
    `;
    transactionHistory.innerHTML = transactionHtml;
  }
}, 1000);
