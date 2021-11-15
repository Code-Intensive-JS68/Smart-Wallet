//Get login user info
const loginUserEmail = localStorage.getItem('email');
const loginUserID = localStorage.getItem('userUID');
console.log(loginUserEmail);
const loginUser = document.getElementById('loginUser');
loginUser.innerHTML = `${loginUserEmail}`