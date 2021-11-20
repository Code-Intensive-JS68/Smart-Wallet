let myChart
let filterBtn = document.getElementById("filter-btn");

filterBtn.addEventListener("click", renderResult);
function renderResult() {
let transactionsPie = [];
let transactionAmount = [];
let transactionCategory = [];
let walletSelect = $("#list-wallet").val();
db.collection("transaction").where("walletID","==", walletSelect)
    .get()
    .then((data) => {
      data.docs.forEach((element) => {
        
        const singleTrans = element.data();
        //console.log(singleWallet);
        transactionsPie.push(singleTrans);
      });
      let transactionsPieFilter = transactionsPie.filter(function (type){
            return(type.type == "expense")
      })
      console.log(transactionsPieFilter)
      for (let i =0; i < transactionsPieFilter.length; ++i) {
        transactionAmount.push(Number(transactionsPieFilter[i].amount));
        transactionCategory.push(transactionsPieFilter[i].category);
      }
      transactionCategory = [...new Set(transactionCategory)]
      console.log(transactionCategory)

      let transactionSet =[]
      for (let category of transactionCategory) {
        transactionSet.push(
          // {
            // category: category,
            // amount:
            transactionsPieFilter.filter((o)=> o.category == category).reduce((a,o)=>a+parseInt(o.amount),0)
          // }
        )
      }
      console.log(transactionSet)
      if (myChart) {
        myChart.destroy();
      }
      myChart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: transactionCategory ,
          datasets: [{
            data: transactionSet,
            backgroundColor: ['#267278', '#65338d', '#4770b3', '#d21f75', '#3b3689', '#50aed3', '#48b24f', '#e57438', '#569dd2', '#569d79', '#58595b', '#e4b031', '#84d2f4', '#cad93f', '#f5c8af', '#9ac483', '#9e9ea2'],
          }],
        },
        options: {
          responsive: true,
          legend: {
            position: 'bottom'
          },
          
        }
      });
      
    });
//   console.log(walletSelect);
}



  


// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#292b2c';

// Pie Chart Example
var ctx = document.getElementById("myPieChart");



