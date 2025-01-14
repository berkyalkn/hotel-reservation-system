document.getElementById('update-password-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get('email');
    const newPassword = document.getElementById('newPassword').value;

    const errorMessage = document.getElementById("error-message");
    const successMessage = document.getElementById("success-message");

    const clearMessages = () => {
        errorMessage.style.display = "none";
        successMessage.style.display = "none";
    };

    clearMessages();



    try {
    const response = await fetch('/update-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword })
    });

    const data = await response.json();

    if(response.ok) {
        successMessage.style.display = 'block';
        successMessage.textContent = 'Password has been changed successfully';

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

