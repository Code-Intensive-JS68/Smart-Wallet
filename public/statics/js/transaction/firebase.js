
import { renderTransaction } from "./uitransaction.js";

export async function getTransaction(userID) {
    await db.collection("transaction").onSnapshot((sn) => {
        let changes = sn.docChanges();
        changes.forEach((change) => {
            if (change.doc.data().userID == userID){
                if (change.type === "removed") {
                    return
                }
                renderTransaction(change.doc)
            }
        });
    })
};



export function insertTransaction(category, amount, date, note, type, walletID, userID) {
    return db.collection("transaction").add(
        {
            category : category,
            amount : Number(amount),
            date: firebase.firestore.Timestamp.fromDate(new Date(date)),
            note: note,
            type: type,
            walletID: walletID,
            userID: userID,
        }
    )
}

//Delete trans

export async function deleteTrans(id) {
    await db.collection("transaction").doc(id).delete();
} 

//Update trans 

export async function updateTrans(id, category, amount, type) {
    await db.collection("transaction").doc(id).update({
        category: category,
        amount: Number(amount),
        type: type,
    })
}










