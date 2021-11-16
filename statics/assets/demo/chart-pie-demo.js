
const logTransactions = async () => {
  let transactionsRef = db.collection('transaction');
  let allTransactions = await transactionsRef.get();
  for (const doc of allTransactions.docs) {

     console.log(doc.data());
  }
}
logTransactions();

let data = [10, 20, 40, 80, 80];
let labels = ["food", "cafe", "travel", "shopping", "shopping"];
// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#292b2c';

// Pie Chart Example
var ctx = document.getElementById("myPieChart");
var myPieChart = new Chart(ctx, {
  type: 'pie',
  data: {
    labels: labels ,
    datasets: [{
      data: data,
      backgroundColor: ['#007bff', '#dc3545', '#ffc107', '#28a745'],
    }],
  },
});


