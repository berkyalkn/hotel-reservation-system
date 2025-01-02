document.getElementById("login-form").addEventListener("submit", async function(e) {
    e.preventDefault();  
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const errorMessage = document.getElementById("error-message");
    const successMessage = document.getElementById("success-message");

    const clearMessages = () => {
        errorMessage.style.display = "none";
        successMessage.style.display = "none";
    };

    clearMessages();


    try {
    const response = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();
    console.log("Response Data:", data); 

    const errorMessageDiv = document.getElementById("error-message");


    if (response.ok) {
        successMessage.style.display = 'block';
            successMessage.textContent = 'Login successful! Redirecting...';

            setTimeout(() => {
                clearMessages();
                window.location.href = '/dashboard';
            }, 2000);
    } else {
        errorMessage.style.display = 'block';
            errorMessage.textContent = data.message;

            setTimeout(clearMessages, 3000);
    }
} catch(error) {
    console.error(error);

    errorMessage.style.display = 'block';
    errorMessage.textContent = 'An error occurred. Please try again.';

    setTimeout(clearMessages, 3000);
}

});