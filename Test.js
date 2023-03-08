//Testing the JS script

const form = document.querySelector('form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('login-btn');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = emailInput.value;
    const password = passwordInput.value;
    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })
        .then(response => response.json())
        .then(data => {
            // check if login was successful or not
            if (data.success) {
                // redirect to the game app
                window.location.href = '/game';
            } else {
                alert('Invalid email/password. Please try again.');
            }
        })
        .catch(error => console.error(error));
});
