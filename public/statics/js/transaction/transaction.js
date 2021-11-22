import { insertTransaction } from "./firebase.js";
import { deleteTrans } from "./firebase.js";
import { updateTrans } from "./firebase.js";
import { renderTransaction } from "./uitransaction.js";
import { getTransaction } from "./firebase.js";


const template = document.createElement("template");

template.innerHTML = `
<link>
<script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta2/js/all.js" integrity="sha512-3g7yqwo1stj1EMzNXYPbV8pqgW0ZhaQsi9iyMP+hvQCIFcdt0AWw5onarTYjklFtIuCf/RvE2MGnr+5tZ1WzFQ==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
</link>
<style>
.transaction-child {
    background-color:#fff;
    margin: 0px 0 10px;
    border-radius: 5px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 50px;
    border: 1px solid #e5e9ed;
    width:98%;
    cursor: pointer;

}

.transaction-child:hover {
    border-color: #3ba71a;
}

.type-transaction {
    display: flex;
    justify-content: space-between;
    width: 100px;
    min-width: 15%;
}

.category-transaction {
    color: #000;
    font-weight: 600;
    font-size: 20px;
    min-width: 10%;
}

.amount {
    position: relative;
    min-width:10%
}

.amount::before {
    content: "vnđ";
    position: absolute;
    right: -20px;
}


.amount.expense {
    color:#f04e56;
    font-size: 20px;
    font-weight: 600;
}

.amount.expense:after {
    position: absolute;
    content: "-";
    color:#f04e56;
    font-size: 20px;
    font-weight: 600;
    left: -15px;
}

.date-transaction {
    font-size: 20px;
    font-weight: 600;
    color:#909194;
    min-width:15%
    
}

.amount.revenue {
    color:#3ba71a;
    font-size: 20px;
    font-weight: 600;
}

.amount.revenue::after {
    position: absolute;
    content: "+";
    color:#3ba71a;
    font-size: 20px;
    font-weight: 600;
    left: -15px;
}

.icon-transaction {
    font-size: 22px;
    min-width: 5%;
}

.note-transaction {
    font-size: 12px;
    min-width:30%;
    max-width:250px;
    font-weight: 500;
    margin-left:20px;
    line-height: 15px;
    max-height: 30px;
    overflow: hidden;
    display: block;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2; /*Tạo dấu 3 chấm và làm tên k dài*/
}
.update-transaction:hover {
    color:rgb(6, 138, 179);
    cursor: pointer;
}

.remove-transaction:hover {
    color: red;
    cursor: pointer;
}

</style>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta2/css/all.min.css" integrity="sha512-YWzhKL2whUzgiheMoBFwW8CKV4qpHQAEuvilg9FAn5VJUDwKZZxkJNuGM4XkWuk94WCrrwslk8yWNGmY1EduTA==" crossorigin="anonymous" referrerpolicy="no-referrer" />
<div class="transaction-child">
<div class="type-transaction">
  <div class="icon-transaction">
  </div>
  <span class="category-transaction"></span>
</div>
<div class="date-transaction"></div>
<div class="amount"></div>
<div class="note-transaction">
</div>
<div class = "update-transaction">
    <i class="fas fa-pencil-alt"></i>
</div>
<div class="remove-transaction">
    <i class="fas fa-times-circle"></i>
</div>
</div>`;

class Transaction extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({
      mode: "open",
    });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  render(name) {
    switch (name) {
      case "category":
        const category_trans = this.shadowRoot.querySelector(
          ".category-transaction"
        );
        const iconCate = this.shadowRoot.querySelector(".icon-transaction");
        category_trans.innerHTML = this.getCategory().name;
        iconCate.innerHTML = this.getCategory().icon;
        break;
      case "date":
        const date_trans = this.shadowRoot.querySelector(".date-transaction");
        date_trans.innerText = this.getDate();
        break;
      case "note":
        const note_trans = this.shadowRoot.querySelector(".note-transaction");
        note_trans.innerText = this.getNote();
        break;
      case "amount":
        const amount = this.shadowRoot.querySelector(".amount");
        amount.classList.add(this.getCategory().type);
        amount.innerText = this.getAmount();
      default:
        break;
    }
  }

  connectedCallback() {
    //event del
    let del = this.shadowRoot.querySelector(".remove-transaction");
    del.addEventListener("click", async (e) => {
      e.stopPropagation();
      let delId = this.getAttribute("walletID")
      let delAmount =  this.getAmount();
      let delType = this.getCategory().type;
      console.log(delAmount,delType)
      let check = confirm("Bạn muốn xóa giao dịch này không?");
      if (check) {
        await deleteTrans(this.getId());
        this.remove();
        balanceDelTrans(delId, delAmount, delType);
      }
    });

    //Hien thi modal info
    this.addEventListener("click", (e) => {
      console.log(e.target);
      modalInfo.classList.add("open");
      infoCate.innerHTML = this.getCategory().name;
      infoAmount.innerHTML = this.getAmount();
      infoDate.innerHTML = this.getDate();
      infoNote.innerHTML = this.getNote();
    });

    //Hien thi modal update

    let update = this.shadowRoot.querySelector(".update-transaction");
    update.addEventListener("click", (e) => {
      e.stopPropagation();
      modalUpdate.classList.add("open");
      modalUpdate.setAttribute("id", this.getId());
    });

    //Save update

    saveUpdate.addEventListener("click", (e) => {
      let oldAmount = this.getAmount();
      let oldType = this.getCategory().type;
      let walletID = this.getAttribute("walletID");
      let updateType;
      console.log(updateCate.value)
      if (
        updateCate.value == "wage" ||
        updateCate.value == "bank" ||
        updateCate.value == "prize" ||
        updateCate.value == "gift" ||
        updateCate.value == "get-loan" ||
        updateCate.value == "other-revenue"
      ) {
        updateType = "revenue";
      } else {
        updateType = "expense";
      }
      console.log(updateType)

      e.preventDefault();
      validateUpdate(
        modalUpdate.getAttribute("id"),
        updateCate.value,
        updateAmount.value,
        updateType,
        walletID,
        oldAmount,
        oldType
      );
      console.log(this);
    });
  }

  disconnectedCallback() {
    console.log("disconnectedCallback");
  }

  static get observedAttributes() {
    return ["id", "walletID", "category", "date", "note", "amount"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.render(name);
  }

  getId() {
    return this.getAttribute("id");
  }

  getCategory() {
    const category = this.getAttribute("category");

    switch (category) {
      case "food":
        return {
          name: "Ăn uống",
          icon: `<i class="fas fa-utensils"></i>`,
          type: "expense",
        };
      case "cafe":
        return {
          name: "Cafe",
          icon: `<i class="fas fa-coffee"></i>`,
          type: "expense",
        };
      case "shopping":
        return {
          name: "Shopping",
          icon: `<i class="fas fa-shopping-cart"></i>`,
          type: "expense",
        };
      case "receipt":
        return {
          name: "Hóa đơn",
          icon: `<i class="fas fa-file-invoice"></i>`,
          type: "expense",
        };
      case "fuel":
        return {
          name: "Xăng xe",
          icon: `<i class="fas fa-gas-pump"></i>`,
          type: "expense",
        };
      case "travel":
        return {
          name: "Di chuyển",
          icon: `<i class="fas fa-bus"></i>`,
          type: "expense",
        };
      case "healing":
        return {
          name: "Chữa bệnh",
          icon: `<i class="fas fa-hospital"></i>`,
          type: "expense",
        };
      case "pet":
        return {
          name: "Thú cưng",
          icon: `<i class="fas fa-paw"></i>`,
          type: "expense",
        };
      case "love":
        return {
          name: "Người yêu",
          icon: `<i class="fas fa-heart"></i>`,
          type: "expense",
        };
      case "family":
        return {
          name: "Gia đình",
          icon: `<i class="fas fa-home"></i>`,
          type: "expense",
        };
      case "study":
        return {
          name: "Học tập",
          icon: `<i class="fas fa-book"></i>`,
          type: "expense",
        };
      case "game":
        return {
          name: "Giải trí",
          icon: `<i class="fas fa-gamepad"></i>`,
          type: "expense",
        };
      case "sport":
        return {
          name: "Thể thao",
          icon: `<i class="fas fa-volleyball-ball"></i>`,
          type: "expense",
        };
      case "loan":
        return {
          name: "Cho vay",
          icon: ` <i class="fas fa-money-bill-wave-alt"></i>`,
          type: "expense",
        };
      case "other-expense":
        return {
          name: "Khác",
          icon: `<i class="fas fa-boxes"></i>`,
          type: "expense",
        };
      case "wage":
        return {
          name: "Tiền lương",
          icon: `<i class="fas fa-money-bill-wave-alt"></i>`,
          type: "revenue",
        };
      case "bank":
        return {
          name: "Tiết Kiệm",
          icon: `<i class="fas fa-piggy-bank"></i>`,
          type: "revenue",
        };
      case "prize":
        return {
          name: "Giải thưởng",
          icon: `<i class="fas fa-award"></i>`,
          type: "revenue",
        };
      case "gift":
        return {
          name: "Quà Tặng",
          icon: `<i class="fas fa-gift"></i>`,
          type: "revenue",
        };
      case "get-loan":
        return {
          name: "Vay",
          icon: `<i class="fas fa-boxes"></i>`,
          type: "revenue",
        };
      case "other-revenue":
        return {
          name: "Khác",
          icon: `<i class="fas fa-boxes"></i>`,
          type: "revenue",
        };
    }
  }

  getInfo() {
    let modalInfo = document.querySelector(".modal-info");
    this.addEventListener("click", () => {
      console.log;
      modalInfo.classList.add(".open");
    });
    console.log(this);
  }

  getNote() {
    return this.getAttribute("note");
  }

  getDate() {
    let ts = this.getAttribute("date");
    const date = new Date(parseInt(ts * 1000));
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  }

  getAmount() {
    const amount = this.getAttribute("amount");
    if (isNaN(amount / 1)) {
      return 0;
    } else return parseInt(amount);
  }
}

window.customElements.define("user-transaction", Transaction);

//Giao diện

let modal = document.querySelector(".modal");
let addTransBtn = document.querySelector(".add-transaction");
let modalClose = document.querySelector(".js-modal-close");
let modalInfo = document.querySelector(".modal-info");
let modalUpdate = document.querySelector(".modal-update");
let infoNote = document.querySelector(".info-note");
let infoCate = document.querySelector(".info-cate");
let infoAmount = document.querySelector(".info-amount");
let infoDate = document.querySelector(".info-date");
let saveUpdate = document.querySelector(".save-update");
let updateAmount = document.querySelector(".update-input-amount");
let updateCate = document.querySelector("#select-update-cate");

//Hiển thị modal addTrans

addTransBtn.onclick = function () {
  modal.classList.add("open");
};

//Ẩn modal

modalClose.onclick = function () {
  modal.classList.remove("open");
};

document
  .querySelector(".js-modal-info-close")
  .addEventListener("click", (e) => {
    let modalInfo = document.querySelector(".modal-info");
    modalInfo.classList.remove("open");
  });

document
  .querySelector(".js-modal-update-close")
  .addEventListener("click", (e) => {
    let modalUpdate = document.querySelector(".modal-update");
    modalUpdate.classList.remove("open");
  });

//Resetmodal

//Get submit form

let formTrans = document.querySelector("#form-trans");

formTrans.addEventListener("submit", function (e) {
  e.preventDefault();
  let typeTrans;
  let cateSelect = document.querySelector("#select-cate").value;
  let noteTrans = document.querySelector("#note-modal").value;
  let inputAmount = document.querySelector(".input-amount").value;
  let timeArr = document.querySelector("#select-time").value.split("-");
  let timeTrans = new Date(
    timeArr[0],
    timeArr[1] - 1,
    timeArr[2],
    0,
    0,
    0
  ).getTime();

  console.log(cateSelect)
  if (
    cateSelect == "wage" ||
    cateSelect == "bank" ||
    cateSelect == "prize" ||
    cateSelect == "gift" ||
    cateSelect == "get-loan" ||
    cateSelect == "other-revenue"
  ) {
    typeTrans = "revenue";
  } else {
    typeTrans = "expense";
  }

  console.log(typeTrans)
    let options = selectForWallet.options;
    let walletID = options[options.selectedIndex].getAttribute("walletID");

  validateTrans(cateSelect, inputAmount, timeTrans, noteTrans, typeTrans, walletID);

});

//Validate trans
function validateTrans(
  cateSelect,
  inputAmount,
  timeTrans,
  noteTrans,
  typeTrans,
  walletID
) {
  if (cateSelect != "undefine") {
      if(walletID != null){
          if (inputAmount) {
            modal.classList.remove("open");
            insertTransaction(
              cateSelect,
              inputAmount,
              timeTrans,
              noteTrans,
              typeTrans,
              walletID,
              userID
            ).then((d) => {});
            updateWalletBalance(walletID, inputAmount, typeTrans).then((d) => {})
            formTrans.reset();
          } else {
            alert("Hãy nhập số tiền");
          }
      }else{
          alert("Hãy chọn loại ví")
      }
  } else {
    alert("hãy chọn loại giao dịch");
  }
}

//Validate Update

function validateUpdate(id, updateCate, updateAmount, updateType, walletID, oldAmount, oldType) {
  if (updateCate != "undefine") {
    if (updateAmount) {
      modal.classList.remove("open");
      balanceUpTrans(walletID, updateAmount, updateType,oldAmount,oldType);
      updateTrans(id, updateCate, updateAmount, updateType).then((d) => {
        window.location.reload();
      });
    } else {
      alert("Hãy nhập số tiền");
    }
  } else {
    alert("hãy chọn loại giao dịch");
  }
}

//Search By Month
let inputSearchMonth = document.querySelector("#input-month");
let btnSearchMonth = document.querySelector("#search-month");

btnSearchMonth.addEventListener("click", () => {
  // console.log(month)
  filterMonth();
});

let TransUI = document.querySelector(".transaction-history");
async function filterMonth() {
  await db.collection("transaction").onSnapshot((sn) => {
    let changes = sn.docChanges();
    TransUI.innerHTML = "";
    changes.forEach((change) => {
      if(change.doc.data().userID == userID){
        let data = change.doc.data();
        if (inputSearchMonth.value) {
          let month = inputSearchMonth.value.split("-")[1];
          if (
            data.date.toMillis() >=
              moment()
                .month(month - 1)
                .startOf("month")
                .valueOf() &&
            data.date.toMillis() <=
              moment()
                .month(month - 1)
                .endOf("month")
                .valueOf()
          ) {
            renderTransaction(change.doc);
          }
          selectWallet.value = "Chọn ví";
        } else {
        }
      }
    });
    });
}

//Chọn ví khi thêm giao dịch 

let selectForWallet = document.querySelector("#select-for-wallet");

async function renderSelectForWallets() {
    await db.collection("wallets").onSnapshot((sn) => {
        let changes = sn.docChanges();
        changes.forEach((change) => {
          if(change.doc.data().userID == userID){
            console.log(change.doc.data().userID)
            let option = document.createElement("option");
            option.text = change.doc.data().name;
            option.setAttribute("walletID", change.doc.data().walletID);
            selectForWallet.add(option);
            console.log(userID)
          }
          })
    })
}
renderSelectForWallets()

// Tạo danh sách chọn ví


let selectWallet = document.querySelector("#select-wallet");

async function renderSelectWallets() {
  await db.collection("wallets").onSnapshot((sn) => {
    let changes = sn.docChanges();
    changes.forEach((change) => {
      if(change.doc.data().userID == userID){
      let option = document.createElement("option");
      option.text = change.doc.data().name;
      option.setAttribute("walletID", change.doc.data().walletID);
      selectWallet.add(option);
    }
      });
  });
}

renderSelectWallets();

selectWallet.addEventListener("change", () => {
  let options = selectWallet.options;
  let id = options[options.selectedIndex].getAttribute("walletID");
  selectWallet.setAttribute("walletSelectID", id);
  filterWallet(id);
});

async function filterWallet(id) {
  await db.collection("transaction").onSnapshot((sn) => {
    let changes = sn.docChanges();
    TransUI.innerHTML = "";
    changes.forEach((change) => {
      if(change.doc.data().userID == userID) {
        let dataTrans = change.doc;
        if (dataTrans.data().walletID == id) {
          renderTransaction(dataTrans);
          inputSearchMonth.value = "";
        }
      }
    });
  });
}

// Get amount wallet by walletID

async function getWalletBalance(walletID) {
   let snapshot = await db.collection("wallets").get()
   let balanceWallet;
    snapshot.docs.forEach((doc) => {
        if(doc.data().walletID == walletID) {
           let balance = doc.data().amount
            balanceWallet = balance
        }
    })
    return balanceWallet
}

//Update wallet balance

 async function updateWalletBalance(walletID, amountTrans, typeTrans){
   let balance = await getWalletBalance(walletID)
     if(typeTrans == "revenue"){
         amountTrans
     } else {
        amountTrans = -amountTrans
     }
     console.log(amountTrans)
    await db.collection("wallets").doc(walletID).update({
            amount: Number(balance) + Number(amountTrans)
        })
}

// Update wallet balance after delele transaction

async function balanceDelTrans(walletID, amount, type) { 
  console.log(walletID, amount, type)
  console.log("xoa")
  let balance = await getWalletBalance(walletID);
  let amountReturn ;
  if(type == "expense"){
    amountReturn = amount;
} else {
   amountReturn = -amount;
}
console.log("amounrreturn", amountReturn)
await db.collection("wallets").doc(walletID).update({
       amount: Number(balance) + Number(amountReturn)
   })

}

// Update wallet balance after update transaction

async function balanceUpTrans(walletID, newAmount, newType, oldAmount, oldType) {
  console.log(walletID, newAmount, newType)
  console.log("them")
  let amountReturn ;
  let balance = await getWalletBalance(walletID);
  
  if(oldType == "expense"){
    amountReturn = oldAmount;
  } else {
   amountReturn = -oldAmount;
  }

  if(newType == "revenue"){
    newAmount
  } else {
   newAmount = -newAmount
  }

  console.log( oldType, newType);


await db.collection("wallets")
        .doc(walletID)
        .update({
       amount: Number(balance) + Number(newAmount) + Number(amountReturn)
      })
}


//Sign out etc...
const loginUser = document.getElementById('loginUser');
//Get current signed in user
firebase.auth().onAuthStateChanged((user) => {
if (user) {
// User is signed in, see docs for a list of available properties
// https://firebase.google.com/docs/reference/js/firebase.User
    const uid = user.uid;
    const email = user.email;
    console.log(uid);
    loginUser.innerHTML = `${email}`
    localStorage.getItem("userID", uid)

    } else {
      location.href = "login.html";
    }
});
   
let logoutBtn = document.getElementById("logout");
logoutBtn.addEventListener('click', logout);

//signOut fucntion
function logout() {
  firebase.auth().signOut().then(() => {
    location.href = "login.html";
    localStorage.removeItem("userID")
 }).catch((error) => {
// An error happened.
   alert(error); 
  });
}

let userID = localStorage.getItem("userID");

getTransaction(userID)
