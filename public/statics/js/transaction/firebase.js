import { renderTransaction } from "./uitransaction.js";

async function getTransaction() {
    await db.collection("transaction").onSnapshot(sn => {
        let changes = sn.docChanges();
        changes.forEach((change) => {
            renderTransaction(change.doc)
            console.log(change.type);
        });
    })
}

getTransaction();

export function insertTransaction(category, amount, date, note) {
    return db.collection("transaction").add(
        {
            category : category,
            amount : amount,
            date: firebase.firestore.Timestamp.fromDate(new Date(date)),
            note: note,
            walletID: 1,
        }
    )
}

//Delete trans

export async function deleteTrans(id) {
    await db.collection("transaction").doc(id).delete();
} 

//Update trans 

export async function updateTrans(id, category, amount) {
    await db.collection("transaction").doc(id).update({
        category: category,
        amount: amount
    })
}

// updateTrans("DlJTfTjZ9snr5RTFj9OV", "ắp đết");










