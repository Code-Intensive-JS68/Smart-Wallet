 export const renderTransaction = async (doc) => {
    let TransUI = document.querySelector(".transaction-history");
    let data = doc.data()
    //Tạo thẻ

    let transaction = document.createElement("user-transaction");

    transaction.setAttribute("id", doc.id);
    transaction.setAttribute("walletID", data.walletID)
    transaction.setAttribute("category", data.category);
    transaction.setAttribute("date", data.date.seconds);
    transaction.setAttribute("note", data.note);
    transaction.setAttribute("amount",data.amount);
    //Chèn vào DOM
    TransUI.appendChild(transaction);
}







