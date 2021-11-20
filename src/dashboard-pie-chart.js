let myChart;

firebase.auth().onAuthStateChanged(() => {
  this.currentUser = firebase.auth().currentUser.uid;
  let transactionsPie = [];
  let transactionAmount = [];
  let transactionCategory = [];
  db.collection("wallets")
    .where("userID", "==", currentUser)
    .get()
    .then((snapshots) => {
      snapshots.docs.forEach((doc) => {
        console.log(doc.data());
        var walletID = doc.data().walletID;
        function renderPieChart() {
          db.collection("transaction")
            .where("walletID", "==", walletID)
            .get()
            .then((snapshots) => {
              snapshots.docs.forEach((doc) => {
                const singleTrans = doc.data();
                //console.log(singleWallet);
                transactionsPie.push(singleTrans);
              });
              let transactionsPieFilter = transactionsPie.filter(function (type){
                return(type.type == "expense")
          })
              for (let i = 0; i < transactionsPieFilter.length; ++i) {
                transactionAmount.push(Number(transactionsPieFilter[i].amount));
                transactionCategory.push(transactionsPieFilter[i].category);
              }
              transactionCategory = [...new Set(transactionCategory)];
              console.log(transactionCategory);

              if (myChart) {
                myChart.destroy();
              }

              let transactionSet = [];
              for (let category of transactionCategory) {
                transactionSet.push(
                  // {
                  // category: category,
                  // amount:
                  transactionsPieFilter
                    .filter((o) => o.category == category)
                    .reduce((a, o) => a + parseInt(o.amount), 0)
                  // }
                );
              }
              console.log(transactionSet);
              myChart = new Chart(ctx, {
                type: "pie",
                data: {
                  labels: transactionCategory,
                  datasets: [
                    {
                      data: transactionSet,
                      backgroundColor: [
                        "#267278",
                        "#65338d",
                        "#4770b3",
                        "#d21f75",
                        "#3b3689",
                        "#50aed3",
                        "#48b24f",
                        "#e57438",
                        "#569dd2",
                        "#569d79",
                        "#58595b",
                        "#e4b031",
                        "#84d2f4",
                        "#cad93f",
                        "#f5c8af",
                        "#9ac483",
                        "#9e9ea2",
                      ],
                    },
                  ],
                },
                options: {
                  responsive: true,
                  legend: {
                    position: "bottom",
                  },
                },
              });
            });
        }
        renderPieChart();
      });
    });
});

// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily =
  '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = "#292b2c";

// Pie Chart Example
var ctx = document.getElementById("myPieChart");
