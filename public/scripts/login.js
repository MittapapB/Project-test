
const loginForm = document.getElementById("loginForm");
const registrationForm = document.getElementById("registrationForm");

const toLoginButton = document.getElementById("toLoginLink");
const toRegistrationButton = document.getElementById("toRegistrationLink");

const errorMessage = document.getElementById("errorMessage");
const errorMessageText = document.getElementById("errorMessageText");

const showError = (message) => {
    errorMessageText.textContent = message;
    errorMessage.classList.remove("hidden");
}

const attemptLogin = async (username, password, rememberMe) => {
    try {
        const response = await fetch("/auth/login", {
            method: "POST",
            include: "credentials",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password, rememberMe })
        });
        const data = await response.json();
        if (response.ok) {
            window.location.href = "/";
        } else {
            showError(data.message || "Login failed, please try again.");
        }
    } catch (error) {
        console.error("Login error:", error);
        showError("An error occurred during login. Please try again.");
    }
};

const attemptRegistration = async (username, password, rememberMe) => {
    try {
        const response = await fetch("/auth/register", {
            method: "POST",
            include: "credentials",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password, rememberMe })
        });
        const data = await response.json();
        if (response.ok) {
            window.location.href = "/";
        } else {
            showError(data.message || "Registration failed, please try again.");
        }
    } catch (error) {
        console.error("Registration error:", error);
        showError("An error occurred during registration. Please try again.");
    }
};

const handleLogin = (event) => {
    event.preventDefault();
    const username = loginForm.username.value;
    const password = loginForm.password.value;
    const rememberMe = loginForm.rememberMe.checked;
    attemptLogin(username, password, rememberMe);
};

const handleRegistration = (event) => {
    event.preventDefault();
    const username = registrationForm.username.value;
    const password = registrationForm.password.value;
    const rememberMe = registrationForm.rememberMe.checked;
    attemptRegistration(username, password, rememberMe);
};

const toLogin = () => {
    registrationForm.classList.add("hidden");
    loginForm.classList.remove("hidden");
    errorMessage.classList.add("hidden");
};

const toRegistration = () => {
    loginForm.classList.add("hidden");
    registrationForm.classList.remove("hidden");
    errorMessage.classList.add("hidden");
};

loginForm.addEventListener("submit", handleLogin);
registrationForm.addEventListener("submit", handleRegistration);

toLoginButton.addEventListener("click", toLogin);
toRegistrationButton.addEventListener("click", toRegistration);