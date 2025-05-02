// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize password toggle
    var togglePasswordBtns = document.querySelectorAll('[id^="toggle"]');
    togglePasswordBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            var inputId = this.id.replace('toggle', '').toLowerCase() + 'Password';
            var input = document.getElementById(inputId);
            
            if (input.type === 'password') {
                input.type = 'text';
                this.innerHTML = '<i class="fas fa-eye-slash"></i>';
            } else {
                input.type = 'password';
                this.innerHTML = '<i class="fas fa-eye"></i>';
            }
        });
    });
    
    // Form submissions
    if (document.getElementById('loginForm')) {
        document.getElementById('loginForm').addEventListener('submit', handleLogin);
    }
    
    if (document.getElementById('registerForm')) {
        document.getElementById('registerForm').addEventListener('submit', handleRegistration);
    }
    
    // Logout links
    var logoutLinks = document.querySelectorAll('[id$="Logout"], #sidebarLogout');
    logoutLinks.forEach(function(link) {
        link.addEventListener('click', handleLogout);
    });
    
    // Forgot password link
    if (document.getElementById('forgotPasswordLink')) {
        document.getElementById('forgotPasswordLink').addEventListener('click', handleForgotPassword);
    }
});

// Handle login form submission
function handleLogin(e) {
    e.preventDefault();
    
    var email = document.getElementById('loginEmail').value;
    var password = document.getElementById('loginPassword').value;
    var rememberMe = document.getElementById('rememberMe').checked;
    
    // In a real app, you would validate the inputs and send to your backend
    console.log('Login attempt with:', { email, password, rememberMe });
    
    // Simulate successful login
    simulateLogin();
}

// Handle registration form submission
function handleRegistration(e) {
    e.preventDefault();
    
    var firstName = document.getElementById('firstName').value;
    var lastName = document.getElementById('lastName').value;
    var email = document.getElementById('registerEmail').value;
    var password = document.getElementById('registerPassword').value;
    var confirmPassword = document.getElementById('confirmPassword').value;
    
    // Validate passwords match
    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }
    
    // In a real app, you would validate all inputs and send to your backend
    console.log('Registration attempt with:', { firstName, lastName, email, password });
    
    // Simulate successful registration and login
    simulateLogin();
}

// Handle logout
function handleLogout(e) {
    e.preventDefault();
    
    // In a real app, you would send a request to your backend to invalidate the session
    console.log('Logging out...');
    
    // Redirect to home page
    window.location.href = 'index.html';
}

// Handle forgot password
function handleForgotPassword(e) {
    e.preventDefault();
    
    var email = prompt('Please enter your email address to reset your password:');
    if (email) {
        // In a real app, you would send this to your backend
        console.log('Password reset requested for:', email);
        alert('If an account exists with that email, you will receive a password reset link.');
    }
}

// Simulate successful login (for demo purposes)
function simulateLogin() {
    // In a real app, you would store the JWT token and user data
    localStorage.setItem('isLoggedIn', 'true');
    
    // Redirect to dashboard or previous page
    window.location.href = 'dashboard.html';
}

// Check if user is logged in (for page load)
function checkAuthStatus() {
    if (localStorage.getItem('isLoggedIn') === 'true') {
        // User is logged in
        if (window.location.pathname.includes('login.html') || 
            window.location.pathname.includes('register.html')) {
            window.location.href = 'dashboard.html';
        }
    } else {
        // User is not logged in
        if (window.location.pathname.includes('dashboard.html') || 
            window.location.pathname.includes('profile.html')) {
            window.location.href = 'login.html';
        }
    }
}

// Run auth check when page loads
checkAuthStatus();