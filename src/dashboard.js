import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.1/firebase-app.js";
    // import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.4.1/firebase-auth.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.4.1/firebase-auth.js";
    // TODO: Add SDKs for Firebase products that you want to use
    // https://firebase.google.com/docs/web/setup#available-libraries
          
    // Your web app's Firebase configuration
    const firebaseConfig = {
        apiKey: "AIzaSyAhQb16UMv471Z4PPB5UedpdecQ3qYEChM",
        authDomain: "smartwallet-4f238.firebaseapp.com",
        projectId: "smartwallet-4f238",
        storageBucket: "smartwallet-4f238.appspot.com",
        messagingSenderId: "906540826080",
        appId: "1:906540826080:web:55fcafdaa8c32900afff85"
        };
          
        // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const loginUser = document.getElementById('loginUser');
    
    //Get current signed in user
    onAuthStateChanged(auth, (user) => {
            if (user) {
            // User is signed in, see docs for a list of available properties
            // https://firebase.google.com/docs/reference/js/firebase.User
                var uid = user.uid;
                var email = user.email;
                console.log(uid);
                loginUser.innerHTML = `${email}`            
                } 
            });
    
    let logoutBtn = document.getElementById("logout");
    logoutBtn.addEventListener('click', logout);
    

    //signOut fucntion
    function logout() {
      signOut(auth).then(() => {
        location.href = "login.html";
     }).catch((error) => {
    // An error happened.
     alert(error); 
      });
    }

//render Barchart

function renderBarchart()  {
    db.collection("transaction").get().then((snapshots) => {
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
              if(type === "expense" && yearData === 2021 && month === 1) {
                Jan += amount;         
              }
              if(type === "expense" && yearData === 2021 && month === 2) {
                Feb += amount;         
              }
              if(type === "expense" && yearData === 2021 && month === 3) {
                Mar += amount;         
                }
              if(type === "expense" && yearData === 2021 && month === 4) {
                Apr += amount;         
              }
              if(type === "expense" && yearData === 2021 && month === 5) {
                May += amount;         
              }
              if(type === "expense" && yearData === 2021 && month === 6) {
                Jun += amount;         
              }
              if(type === "expense" && yearData === 2021 && month === 7) {
                Jul += amount;         
              } 
              if(type === "expense" && yearData === 2021 && month === 8) {
                Aug += amount;         
              } 
              if(type === "expense" && yearData === 2021 && month === 9) {
                Sep += amount;         
              } 
              if(type === "expense" && yearData === 2021 && month === 10) {
                Oct += amount;         
              }
              if(type === "expense" && yearData === 2021 && month === 11) {
                Nov += amount;         
              }
              if(type === "expense" && yearData === 2021 && month === 12) {
                Dec += amount;         
              }   
          }           
       )
       function renderChart() {
        var ctx = document.getElementById("BarChart");
        var myLineChart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: [`1/2021`, `2/2021`, `3/2021`, `4/2021`, `5/2021`, `6/2021`, `7/2021`, `8/2021`, `9/2021`, `10/2021`, `11/2021`, `12/2021`],
            datasets: [{
              label: "Expense",
              backgroundColor: "rgba(2,117,216,1)",
              borderColor: "rgba(2,117,216,1)",
              data: [Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec],
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
                  max: 150000,
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
renderBarchart();

// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#292b2c';





