
import { renderTransaction } from "./uitransaction.js";

async function getTransaction() {
    await db.collection("transaction").onSnapshot((sn) => {
        let changes = sn.docChanges();
        changes.forEach((change) => {
            if (change.type === "removed") {
                return
            }
            renderTransaction(change.doc)
        });
    })
};

getTransaction();

export function insertTransaction(category, amount, date, note, type, walletID) {
    return db.collection("transaction").add(
        {
            category : category,
            amount : Number(amount),
            date: firebase.firestore.Timestamp.fromDate(new Date(date)),
            note: note,
            type: type,
            walletID: walletID,
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
        amount: Number(amount)
    })
}










