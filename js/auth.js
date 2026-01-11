const ADMIN = {
  email: "admin@hopiso.com",
  password: "******"
};

function login(e) {
  e.preventDefault();

  // Select input values correctly
  const emailInput = document.getElementById("email").value.trim();
  const passwordInput = document.getElementById("password").value.trim();

  if (emailInput === ADMIN.email && passwordInput === ADMIN.password) {
    localStorage.setItem("loggedIn", "true"); // store login session
    location.href = "admin.html"; // redirect to admin
  } else {
    alert("Invalid login credentials!");
  }
}

// Protect admin page from unauthorized access
function protect() {
  if (!localStorage.getItem("loggedIn")) {
    location.href = "login.html";
  }
}

// Logout function (optional)
function logout() {
  localStorage.removeItem("loggedIn");
  location.href = "login.html";
}
