const loginUserEmail = localStorage.getItem('email');
const loginUserID = localStorage.getItem('userUID');
const loginUser = document.getElementById('loginUser');
loginUser.innerHTML = `${loginUserEmail}`