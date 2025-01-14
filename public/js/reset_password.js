document.getElementById("reset-form").addEventListener("submit", async function(e) {
    e.preventDefault(); 
    const email = document.getElementById("email").value;

    const errorMessage = document.getElementById("error-message");
    const successMessage = document.getElementById("success-message");

    const clearMessages = () => {
        errorMessage.style.display = "none";
        successMessage.style.display = "none";
    };

    clearMessages();

    try {
        const response = await fetch('/reset-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });

        const data = await response.json();
        console.log("Response Data:", data); 

        if (response.ok) {
            successMessage.style.display = 'block';
            successMessage.textContent = 'Password reset link sent to your email.';

            setTimeout(() => {
                clearMessages();
                window.location.href = '/login';
            }, 3000);
        } else {
            errorMessage.style.display = 'block';
            errorMessage.textContent = data.message;

            setTimeout(clearMessages, 3000);
        }
    } catch (error) {
        console.error(error);

        errorMessage.style.display = 'block';
        errorMessage.textContent = 'An error occurred. Please try again.';

        setTimeout(clearMessages, 3000);
    }
});
