let wallets = [];

firebase.auth().onAuthStateChanged(() => {
  this.currentUser = firebase.auth().currentUser.uid;
  db.collection("wallets")
    .where("userID", "==", currentUser)
    .get()
    .then((data) => {
      data.docs.forEach((element) => {
        const singleWallet = element.data();
        wallets.push(singleWallet);
      });
      createList(wallets, filterBySearchBox);
    });
});

const filterBySearchBox = {
  searchText: "",
};
$("#wallet-search").on("input", () => {
  filterBySearchBox.searchText = $("#wallet-search").val();
  createList(wallets, filterBySearchBox);
});

const createList = function (wallets, filterBySearchBox) {
  const filteredWallets = $.grep(wallets, (element) => {
    return element.name
      .toLowerCase()
      .includes(filterBySearchBox.searchText.toLowerCase());
  });
  $("#wallet-column").empty();

  filteredWallets.forEach((element) => {
    $("#wallet-column").append(
      `
        <div class="wallet-card row shadow-sm" data-bs-toggle="modal" data-bs-target="#modal` +
        element.walletID +
        `">
            <div class="wallet-name col">
                <i class="fas fa-circle" style="color:` +
        element.color +
        `"></i>
                <strong>` +
        element.name +
        `</strong>
            </div>
            <div class="wallet-type col text-secondary">` +
        element.type +
        `
            </div>
            <div class="wallet-amount col">
                <strong>` +
        element.amount +
        `</strong>
            </div>
            <div class="wallet-currency col-2">
                <strong>` +
        element.currency +
        `</strong>
            </div>
        </div>
        </div>
        <div class="modal fade modal-detail" id="modal` +
        element.walletID +
        `" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content">
              <div class="modal-header row">
                <h5 class="modal-title col font-weight-bold" id="exampleModalLabel">Th??ng tin chi ti???t v??</h5>

                <button type="button" class="update-wallet btn btn-outline-success font-weight-bold col-1" data-bs-toggle="collapse" role="button" data-bs-target="#modalUpdate` +
        element.walletID +
        `" >S???a</button>
                <button type="button" class="delete-wallet btn btn-outline-danger col-1 mx-3 font-weight-bold" onClick="deleteWallet('` +
        element.walletID +
        `')" >X??a</button>

              </div>
              <div class="modal-body">
                <div class="row wallet-details">
                <div class="col-2">
                <h2><i class="fas fa-circle" style="color:` +
        element.color +
        `"></i></h2>
                </div>

                <div class=" col">
                <div class="row">
                <h6 class="text-secondary">T??n V??</h6>
                <h4 class="font-weight-bold">` +
        element.name +
        `</h4>
                </div>
                <div class="row">
                <h6 class="text-secondary">Lo???i V??</h6>
                <h4 class="font-weight-bold">` +
        element.type +
        `</h4>
                </div>
                </div>
                <div class="col">
                <div class="amount-detail">
                <h6 class="text-secondary">S??? d?? V??</h6>
                <h4 class="font-weight-bold">` +
        element.amount +
        ` ` +
        element.currency +
        `</h4>
               </div>
               </div>
                </div>

                <div class="collapse" id="modalUpdate` +
        element.walletID +
        `" >
                 <div class="card card-body">
                    <form action="" class="row" id="form-wallet-update">
                      <div class="mb-2 col-8">
                       <label for="updateWalletName" class="col-sm-2 col-form-label-sm font-weight-bold">T??n
                        v??</label>
                    <div class="col-sm-10">
                      <input type="text" class="form-control-sm larger-box" placeholder="` +
        element.name +
        `"
                      id="updateWalletName` +
        element.walletID +
        `" value="` +
        element.name +
        `">
                    </div>
                  </div>
                  <div class="mb-2 col-4 ">
                  <label for="updateWalletColor" class="col col-form-label-sm font-weight-bold">M??u s???c</label>
      <div class="col">
         <input type="color" class="form-select"  value="` +
        element.color +
        `" id="updateWalletColor` +
        element.walletID +
        `">
      </div>
  </div>
  <div class="mb-2 ">
      <label for="updateWalletType" class="col col-form-label-sm font-weight-bold">Lo???i</label>
      <div class="col">
          <select class="form-select form-select-sm" aria-label="Default select example"
              id="updateWalletType` +
        element.walletID +
        `">
              <option value="` +
        element.type +
        `" selected">` +
        element.type +
        `</option>
              <option value="Ti???n m???t">Ti???n m???t</option>
              <option value="Ti???t ki???m">Ti???t ki???m</option>
              <option value="?????u t??">?????u t??</option>
              <option value="Chi ti??u c???n thi???t">Chi ti??u c???n thi???t</option>
              <option value="T??? thi???n">T??? thi???n</option>
          </select>
      </div>
      <div class="row mt-3 mx-1">
      <button type="button" class="btn btn-primary update-wallet font-weight-bold" onclick="updateWallet('` +
        element.walletID +
        `')" data-bs-toggle="collapse" role="button" data-bs-target="#modalUpdate` +
        element.walletID +
        ` " >L??u</button>
      </div>

  </div>
  </div>
</div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary font-weight-bold" data-bs-dismiss="modal">????ng</button>
              </div>
        </div>
      	`
    );
  });
};

function updateWallet(walletID) {
  const updateWallet = {
    name: String($(`#updateWalletName${walletID}`).val()),
    color: String($(`#updateWalletColor${walletID}`).val()),
    type: String($(`#updateWalletType${walletID}`).val()),
  };
  db.collection("wallets")
    .doc(walletID)
    .update(updateWallet)
    .then(() => {
      $(`#modal${walletID}`).modal("hide");
      createList(wallets, filterBySearchBox);
      window.location.reload();
    });
}

const deleteWallet = function (walletID) {
  db.collection("wallets")
    .doc(walletID)
    .delete()
    .then(() => {
      const walletIndex = wallets.findIndex(
        (wallet) => wallet.walletID === walletID
      );
      if (walletIndex != -1) {
        wallets.splice(walletIndex, 1);
        $(`#modal${walletID}`).modal("hide");
        createList(wallets, filterBySearchBox);
      }
    });
};

$(".submit-new-wallet").click((event) => {
  event.preventDefault();
  const walletID = uuidv4();
  const wallet = {
    userID: firebase.auth().currentUser.uid,
    name: $(".input-wallet-name").val(),
    currency: $(".input-wallet-currency").val(),
    walletID: walletID,
    color: $(".input-wallet-color").val(),
    type: $(".input-wallet-type").val(),
    amount: Number($(".input-wallet-amount").val()),
  };
  db.collection("wallets")
    .doc(walletID)
    .set(wallet)
    .then(() => {
      wallets.push(wallet);
      createList(wallets, filterBySearchBox);
    })
    .catch((err) => {
      console.error("Error occured", err);
    });
});

//Sign out etc...
const loginUser = document.getElementById("loginUser");
//Get current signed in user
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    const uid = user.uid;
    const email = user.email;
    loginUser.innerHTML = `${email}`;
  } else {
    location.href = "login.html";
  }
});

let logoutBtn = document.getElementById("logout");
logoutBtn.addEventListener("click", logout);

//signOut fucntion
async function logout() {
  await firebase
    .auth()
    .signOut()
    .catch((error) => {
      // An error happened.
      alert(error);
    });

  localStorage.removeItem("userID");
  location.href = "login.html";
}
