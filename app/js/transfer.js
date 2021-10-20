const transferPanel = document.getElementById('transferPanel');
const paymentGate = document.getElementById('PaymentGate');
let customerList = [];

//Data fetching from server requires some time so 200ms given for wait for the customerList Updation task then we can load our site.
fetch("https://onlinebanking125.herokuapp.com/customer-data")
    .then(response => response.json())
    .then(responseData => {
        customerList = responseData;
    });

const showCustomers = () => {
    setTimeout(() => {
        let customers = `
        `;

        for (var j = 0; j < customerList.length; j++) {
            customers += `
            <div class="infobox">
            <h4>${customerList[j].customerName}</h4>
            <button class="btn btn-primary transferbtn">Send Money</button>
            </div>
            `;
        }

        // console.log(customers);

        transferPanel.innerHTML = customers;

        let transfer = document.getElementsByClassName('transferbtn')
        for (var i = 0; i < transfer.length; i++) {
            transfer[i].addEventListener('click', (e) => {
                var parentBlock = e.currentTarget.parentNode;
                const Transferername = parentBlock.querySelector('h4').innerText;
                console.log(Transferername);
                MakePayment(Transferername);
            })
        }
    }, 1000);
}

const MakePayment = (Transferername) => {
    gateWayInnerHtml = `<option value="" disabled selected hidden>Select Payee</option>`;
    for (let i = 0; i < customerList.length; i++) {
        let personName = customerList[i].customerName;
        if (personName != Transferername) {
            gateWayInnerHtml += `<option value="${personName}">${personName}</option>`
        }
    }

    gateWayHtml = `
    <button id="Cancel">Cancel</button>
     <div id="PaymentPanel">
     <form action="" method="POST">
        <div class="transferer">
            <h5 class="head">Transfer From: </h5>
            <input type="text" name="transfererName" id="transfererName" readonly="readonly" value="${Transferername}">
        </div>
        
        <div class="Payee">
            <h5 class="head">Transfer To: </h5>
            <select name="nameList" id="transferTo"  required>
                ${gateWayInnerHtml}
            </select>
        </div>

        <div class="Amount">
            <h5 class="head">Amount: (in Rs.)</h5>
            <input type="text" name="Amount" required id="Amount">
        </div>

        <button class="PaymentButton btn btn-primary">SEND</button>
    </form>
</div>`;
    paymentGate.style.display = "block";
    paymentGate.innerHTML = gateWayHtml;
    const cancelBtn = document.getElementById("Cancel");
    cancelBtn.addEventListener('click', () => {
        paymentGate.style.display = "none";
    })
}

showCustomers();



