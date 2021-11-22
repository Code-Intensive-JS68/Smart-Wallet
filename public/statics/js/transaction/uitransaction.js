export const renderTransaction = (doc) => {
    let data = doc.data()
    let TransUI = document.querySelector(".transaction-history");
    
    //Tạo thẻ

    let transaction = document.createElement("user-transaction");

    transaction.setAttribute("id", doc.id);
    transaction.setAttribute("walletID", data.walletID)
    transaction.setAttribute("category", data.category);
    transaction.setAttribute("date", data.date.seconds);
    transaction.setAttribute("note", data.note);
    transaction.setAttribute("amount",data.amount);

    //Chèn vào DOM

    TransUI.insertAdjacentElement("afterbegin",transaction)
}





