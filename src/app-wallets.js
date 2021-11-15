let wallets = [];

const filterBySearchBox = {
  searchText: "",
};
$("#wallet-search").on("input", () => {
  filterBySearchBox.searchText = $("#wallet-search").val();
  createList(wallets, filterBySearchBox);
});

const renderWallets = function () {
  db.collection("wallets")
    .get()
    .then((data) => {
      data.docs.forEach((element) => {
        const singleWallet = element.data();
        console.log(singleWallet);
        wallets.push(singleWallet);
      });
      createList(wallets, filterBySearchBox);
    });
};

const createList = function (wallets, filterBySearchBox) {
  const filteredWallets = $.grep(wallets, (element) => {
    return element.name
      .toLowerCase()
      .includes(filterBySearchBox.searchText.toLowerCase());
  });
  $("#wallet-column").empty();

  filteredWallets.forEach((element) => {
    $(".delete-wallet").on("click", () => {
        $(`#`+element.id).modal('hide');
        deleteWallet(element);
    })
    $("#wallet-column").append(
      `
        <div class="wallet-card row">
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
            <div class="wallet-amount col" id="wallet-amount">
                <strong>` +
        element.amount +
        `</strong>
            </div>
            <div class="wallet-currency col-1">
                <strong>` +
        element.currency +
        `</strong>
            </div>
            <div class="wallet-detail-btn col-1">
            <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="` +
        element.walletID +
        `">
            ...
            </button>
            </div>
            <div class="modal fade" id="` +
        element.walletID +
        `" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered modal-lg">
    <div class="modal-content">
      <div class="modal-header row">
        <h5 class="modal-title col" id="exampleModalLabel">Thông tin chi tiết ví</h5>

        <button type="button" class="update-wallet btn btn-outline-success  col-1" >Sửa</button>
        <button type="button" class="delete-wallet btn btn-outline-danger  col-1 mx-3" >Xóa</button>

      </div>
      <div class="modal-body">
        ...
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary">Save changes</button>
      </div>
    </div>
  </div>
        </div>`
    );
  });
};

const deleteWallet = function (element){
    const walletIndex = wallets.findIndex(wallet => wallet.walletID === element.walletID);
    if(walletIndex != -1){
        wallets.splice(walletIndex, 1);
        createList(wallets, filterBySearchBox);
    }
}

$(".submit-new-wallet").click((event) => {
  event.preventDefault();
  const walletID = uuidv4();
  const wallet = {
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

renderWallets();
