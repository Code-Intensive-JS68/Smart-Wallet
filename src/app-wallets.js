

let wallets = [];

firebase.auth().onAuthStateChanged(() => {
  this.currentUser = firebase.auth().currentUser.uid;
  console.log(currentUser);
  db.collection("wallets").where("userID","==", currentUser)
    .get()
    .then((data) => {
      data.docs.forEach((element) => {
        const singleWallet = element.data();
        //console.log(singleWallet);
        wallets.push(singleWallet);
      });
      createList(wallets, filterBySearchBox);
    });
})



const filterBySearchBox = {
  searchText: "",
};
$("#wallet-search").on("input", () => {
  filterBySearchBox.searchText = $("#wallet-search").val();
  createList(wallets, filterBySearchBox);
});


// const renderWallets = function () {
//   db.collection("wallets")
//     .get()
//     .then((data) => {
//       data.docs.forEach((element) => {
//         const singleWallet = element.data();
//         //console.log(singleWallet);
//         wallets.push(singleWallet);
//       });
//       createList(wallets, filterBySearchBox);
//     });
// };

const createList = function (wallets, filterBySearchBox) {
  const filteredWallets = $.grep(wallets, (element) => {
    return element.name
      .toLowerCase()
      .includes(filterBySearchBox.searchText.toLowerCase());
  });
  $("#wallet-column").empty();

  filteredWallets.forEach((element) => {
    // $(".delete-wallet").on("click", () => {
    //     $(".modal-detail").modal('hide');
    //     deleteWallet(element);
    // })
    $("#wallet-column").append(
      `
        <div class="wallet-card row" data-bs-toggle="modal" data-bs-target="#modal` +
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
            <div class="wallet-currency col-1">
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
                <h5 class="modal-title col" id="exampleModalLabel">Thông tin chi tiết ví</h5>

                <button type="button" class="update-wallet btn btn-outline-success  col-1" data-bs-toggle="collapse" role="button" data-bs-target="#modalUpdate` +
        element.walletID +
        `" >Sửa</button>
                <button type="button" class="delete-wallet btn btn-outline-danger col-1 mx-3" onClick="deleteWallet('` +
        element.walletID +
        `')" >Xóa</button>

              </div>
              <div class="modal-body">
                <div class="collapse" id="modalUpdate` +
        element.walletID +
        `" >
                 <div class="card card-body">
                    <form action="" class="row" id="form-wallet-update">
                      <div class="mb-2 col-8">
                       <label for="updateWalletName" class="col-sm-2 col-form-label-sm ">Tên
                        ví</label>
                    <div class="col-sm-10">
                      <input type="text" class="form-control-sm larger-box" placeholder="Tên ví của bạn"
                      id="updateWalletName`+element.walletID+`">
                    </div>
                  </div>
                  <div class="mb-2 col-4 ">
                  <label for="updateWalletColor" class="col col-form-label-sm">Màu sắc</label>
      <div class="col">
         <input type="color" class="form-select" id="updateWalletColor`+element.walletID+`" value='#1C4E80'>
      </div>
  </div>
  <div class="mb-2 ">
      <label for="updateWalletType" class="col col-form-label-sm">Loại</label>
      <div class="col">
          <select class="form-select form-select-sm" aria-label="Default select example"
              id="updateWalletType`+element.walletID+`">
              <option value="Tiền mặt">Tiền mặt</option>
              <option value="Tiết kiệm">Tiết kiệm</option>
              <option value="Đầu tư">Đầu tư</option>
          </select>
      </div>
      <div class="row mt-3 mx-1">
      <button type="button" class="btn btn-primary update-wallet" onclick="updateWallet('` +
      element.walletID +
      `')" data-bs-toggle="collapse" role="button" data-bs-target="#modalUpdate` +
      element.walletID +
      ` " >Lưu</button>
      </div>

  </div>
  </div>
</div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              </div>
        </div>
      	`
    );
  });
};
  
function updateWallet(walletID){
  const updateWallet = {
      name: $(`#updateWalletName${walletID}`).val(),
      color: $(`#updateWalletColor${walletID}`).val(),
      type: $(`#updateWalletType${walletID}`).val(),
    };
  db.collection("wallets")
  .doc(walletID)
  .update(updateWallet)
  .then(() => {
        $(`#modal${walletID}`).modal("hide");
        createList(wallets, filterBySearchBox);
        window.location.reload();
    })
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
    amount: $(".input-wallet-amount").val(),
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
// renderWallets()
