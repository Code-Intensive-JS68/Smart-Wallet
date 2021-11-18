var filterBtn = document.getElementById("filter-btn");

filterBtn.addEventListener("click", renderResult);
function renderResult() {
let walletSelect = $("#list-wallet").val();

  console.log(walletSelect);
}

let transactionsPie = [];
let transactionAmount = [];
let transactionCategory = [];

  db.collection("transaction").where("walletID","==", 1)
    .get()
    .then((data) => {
      data.docs.forEach((element) => {
        var myPieChart = new Chart(ctx, {
  type: 'pie',
  data: {
    labels: transactionCategory ,
    datasets: [{
      data: transactionAmount,
      backgroundColor: ['#007bff', '#dc3545', '#ffc107', '#28a745', '#007bff', '#dc3545', '#ffc107', '#28a745'],
    }],
  },
});
        const singleTrans = element.data();
        //console.log(singleWallet);
        transactionsPie.push(singleTrans);
       for (let i =0; i < transactionsPie.length; ++i) {
         transactionAmount.push(Number(transactionsPie[i].amount));
         transactionCategory.push(transactionsPie[i].category);
       }
      });
    });
console.log(transactionsPie);
console.log(transactionAmount)
console.log(transactionCategory)

let data = [10, 20, 40, 80, 80];
let labels = ["food", "cafe", "travel", "shopping", "shopping"];
// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#292b2c';

// Pie Chart Example
var ctx = document.getElementById("myPieChart");

// var myPieChart = new Chart(ctx, {
//   type: 'pie',
//   data: {
//     labels: transactionCategory ,
//     datasets: [{
//       data: transactionAmount,
//       backgroundColor: ['#007bff', '#dc3545', '#ffc107', '#28a745', '#007bff', '#dc3545', '#ffc107', '#28a745'],
//     }],
//   },
// });


