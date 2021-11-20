let transactionsPie = [];
let transactionAmount = [];
let transactionCategory = [];
let filterBtn = document.getElementById("filter-btn");

filterBtn.addEventListener("click", renderResult);
function renderResult() {
let walletSelect = $("#list-wallet").val();
db.collection("transaction").where("walletID","==", walletSelect)
    .get()
    .then((data) => {
      data.docs.forEach((element) => {
        
        const singleTrans = element.data();
        //console.log(singleWallet);
        transactionsPie.push(singleTrans);
       
      });
      for (let i =0; i < transactionsPie.length; ++i) {
        transactionAmount.push(Number(transactionsPie[i].amount));
        transactionCategory.push(transactionsPie[i].category);
      }
      transactionCategory = [...new Set(transactionCategory)]
      console.log(transactionCategory)

      let transactionSet =[]
      for (let category of transactionCategory) {
        transactionSet.push(
          // {
            // category: category,
            // amount:
             transactionsPie.filter((o)=> o.category == category).reduce((a,o)=>a+parseInt(o.amount),0)
          // }
        )
      }
      console.log(transactionSet)

      new Chart(ctx, {
        type: 'pie',
        data: {
          labels: transactionCategory ,
          datasets: [{
            data: transactionSet,
            backgroundColor: ['#007bff', '#dc3545', '#ffc107', '#28a745', '#2fb8c4', '#d26bb9', '#ff9d05', '#794c05'],
          }],
        },
      });
    });
  console.log(walletSelect);
}



  


// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#292b2c';

// Pie Chart Example
var ctx = document.getElementById("myPieChart");



