const customerPanel = document.getElementById("customerPanel");
const viewDetail = document.getElementsByClassName("viewDetail");
const addCustomer = document.getElementById("addCustomer");
const deleteCustomer = document.getElementById("deleteCustomer");
const customerOperationPanel = document.getElementById(
  "customerOperationPanel"
);
let customerList = [];
//Data fetching from server requires some time so 200ms given for wait for the customerList Updation task then we can load our site.
fetch("http://localhost/customer-data")
  .then((response) => response.json())
  .then((responseData) => {
    customerList = responseData;
  });

const showCustomers = () => {
  setTimeout(() => {
    let customers = `
            `;

    for (var j = 0; j < customerList.length; j++) {
      customers += `
            <div class="infobox">
            <div class="primary-info">
                <h4>${customerList[j].customerName}</h4>
                <button class="btn btn-primary viewDetail">View Detail</button>
            </div>
            <div class="additional-info" id = ${customerList[j].customerID}>
                <div class="info">
                    <h6>Account No: </h6>
                    <h6>${customerList[j].accountNumber}</h6>
                </div>
                <div class="info">
                    <h6>Account Balance: </h6>
                    <h6>${customerList[j].customerBal}</h6>
                </div>
                <div class="info">
                    <h6>Customer Id: </h6>
                    <h6>${customerList[j].customerID}</h6>
                </div>
                <a href='/transfer'>
                <button class="btn btn-primary sendBtn">Transfer</button>
                </a>
            </div>
        </div>
                `;
    }

    // console.log(customers);
    customerPanel.innerHTML = customers;
    let viewDetail = document.getElementsByClassName("viewDetail");
    for (let i = 0; i < customerList.length; i++) {
      viewDetail[i].addEventListener("click", (e) => {
        const parentBlock = e.currentTarget.parentNode.parentNode;
        const id = parentBlock.querySelectorAll("h6")[5].innerText;
        console.log(id);
        const viewDetailOf = document.getElementById(id);
        if (viewDetailOf.style.display == "flex") {
          viewDetailOf.style.display = "none";
          viewDetail[i].innerText = "View Detail";
        } else {
          viewDetailOf.style.display = "flex";
          viewDetail[i].innerText = "Hide Detail";
        }
      });
    }

    let newAccNumber = parseInt(customerList.length)+1001;
    let newCustomerID = parseInt(customerList.length)+1;
    addCustomer.addEventListener("click", () => {
      let addCustomerPanel = `
    <div id="addCustomerPanel">
            <button id="Cancel">Cancel</button>
            <h2> Add New Customer </h2>
            <form id='newCustomerInfo' action="/addcustomer" method="post">
            <h6>First Name: </h6>
                    <input type="text" name="newCustomerFirstName" id="newCustomerName"  required>
                    <h6>Last Name: </h6>
                    <input type="text" name="newCustomerLastName" id="newCustomerLastName" required>
                    <h6>Account No: </h6>
                    <input type="text" name="newAccountNumber" id="newAccountNumber" value="${newAccNumber}" readonly>
      
                    <h6>Customer ID: </h6>
                    <input type="text" name="newCustomerID" id="newCustomerID" value="${newCustomerID}" readonly >
      
                    <h6>Balance: </h6>
                    <input type="text" name="newCustomerBalance" id="newCustomerBalance">
            
                <div class="buttons">
                    <input type="reset"  class='btn btn-primary'value="Clear">
                    <input type="submit" class='btn btn-primary' value="Submit">
                </div>
            </form>

        </div>
    `;
      newAccNumber++;
      newCustomerID++;
      customerOperationPanel.innerHTML = addCustomerPanel;
      customerOperationPanel.style.display = "block";
      const cancel = document.getElementById("Cancel");
      cancel.addEventListener("click", () => {
        customerOperationPanel.style.display = "none";
        customerOperationPanel.innerHTML = ``;
        newCustomerID--;
        newAccNumber--;
      });
    });
  }, 1000);
};

deleteCustomer.addEventListener("click", () => {
  customerListForDeletion = `<option value="" disabled selected hidden>Select Account</option>`;
  for (let i = 0; i < customerList.length; i++) {
    let personName = customerList[i].customerName;
    customerListForDeletion += `<option value="${customerList[i].customerName}">${personName}</option>`;
  }

  let deleteCustomerPanel = `
    <div id="deleteCustomerPanel" style="height: 12rem;">
    <button id="Cancel">Cancel</button>
    <h2> Delete Customer </h2>
    <form id='deleteCustomerInfo' action="/deleteCustomer" method="post">
        <select name="nameList" id="nameList">
            ${customerListForDeletion}
        </select>
        <input type="submit" class='btn btn-primary' value="Submit">
    </form>
</div>`;
  customerOperationPanel.innerHTML = deleteCustomerPanel;
  customerOperationPanel.style.display = "block";
  const cancel = document.getElementById("Cancel");
  cancel.addEventListener("click", () => {
    customerOperationPanel.style.display = "none";
    customerOperationPanel.innerHTML = ``;
  });
});

showCustomers();
