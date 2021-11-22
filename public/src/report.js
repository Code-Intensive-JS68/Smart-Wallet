//Sign out etc...
const loginUser = document.getElementById('loginUser');
//Get current signed in user
firebase.auth().onAuthStateChanged((user) => {
if (user) {
// User is signed in, see docs for a list of available properties
// https://firebase.google.com/docs/reference/js/firebase.User
    const uid = user.uid;
    const email = user.email;
    console.log(uid);
    loginUser.innerHTML = `${email}`
    } else {
      location.href = "login.html";
    }
});
   
let logoutBtn = document.getElementById("logout");
logoutBtn.addEventListener('click', logout);

//signOut fucntion
function logout() {
  firebase.auth().signOut().then(() => {
    location.href = "login.html";
 }).catch((error) => {
// An error happened.
   alert(error); 
  });
}

function renderWallet() {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          var uid = user.uid;
          db.collection("wallets").get().then((snapshots) => {
            snapshots.docs.forEach(doc => {
                if(uid === doc.data().userID) {
                    walletSelect.insertAdjacentHTML('afterbegin', 
                    `<option value=${doc.data().walletID}>${doc.data().name}</option>`)
                }
            })
         })
        } 
      });
}
renderWallet()

var walletSelect = document.getElementById("list-wallet");
var yearSelect = document.getElementById("list-year");
var filterBtn = document.getElementById("filter-btn");
filterBtn.addEventListener("click", renderResult);

function renderResult() {
  let wallet = walletSelect.value;
  let year = Number(yearSelect.value);
  console.log(wallet);
  db.collection("transaction").where("walletID", "==", wallet).get().then((snapshots) => {
    var Jan = 0;
    var Feb = 0;
    var Mar = 0;
    var Apr = 0;
    var May = 0;
    var Jun = 0;
    var Jul = 0;
    var Aug = 0;
    var Sep = 0;
    var Oct = 0;
    var Nov = 0;
    var Dec = 0;
    snapshots.docs.forEach(doc => {
      let amount = doc.data().amount;
      let type = doc.data().type;
      let date = doc.data().date.toDate();
      var month = date.getMonth() + 1;  
      var yearData =  date.getFullYear();
          if(type === "expense" && yearData === year && month === 1) {
            Jan += amount;         
          }
          if(type === "expense" && yearData === year && month === 2) {
            Feb += amount;         
          }
          if(type === "expense" && yearData === year && month === 3) {
            Mar += amount;         
            }
          if(type === "expense" && yearData === year && month === 4) {
            Apr += amount;         
          }
          if(type === "expense" && yearData === year && month === 5) {
            May += amount;         
          }
          if(type === "expense" && yearData === year && month === 6) {
            Jun += amount;         
          }
          if(type === "expense" && yearData === year && month === 7) {
            Jul += amount;         
          } 
          if(type === "expense" && yearData === year && month === 8) {
            Aug += amount;         
          } 
          if(type === "expense" && yearData === year && month === 9) {
            Sep += amount;         
          } 
          if(type === "expense" && yearData === year && month === 10) {
            Oct += amount;         
          }
          if(type === "expense" && yearData === year && month === 11) {
            Nov += amount;         
          }
          if(type === "expense" && yearData === year && month === 12) {
            Dec += amount;         
          }   
      }           
   )
   function renderChart() {
    var expense = [Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec];
    var maxExpense = Math.max(...expense);
    console.log(maxExpense);
    var ctx = document.getElementById("myBarChart");
    var myLineChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: [`1/${year}`, `2/${year}`, `3/${year}`, `4/${year}`, `5/${year}`, `6/${year}`, `7/${year}`, `8/${year}`, `9/${year}`, `10/${year}`, `11/${year}`, `12/${year}`],
        datasets: [{
          label: "Expense",
          backgroundColor: "#219173",
          borderColor: "#219173",
          data: expense,
        }],
      },
      options: {
        scales: {
          xAxes: [{
            time: {
              unit: 'month'
            },
            gridLines: {
              display: false
            },
            ticks: {
              maxTicksLimit: 12
            }
          }],
          yAxes: [{
            ticks: {
              min: 0,
              max: maxExpense + 150000,
              maxTicksLimit: 5
            },
            gridLines: {
              display: true
            }
          }],
        },
        legend: {
          display: false
        }
      }
    });
    }
    renderChart();
});

}
 
// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#292b2c';


