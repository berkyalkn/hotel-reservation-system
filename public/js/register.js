document.getElementById('register-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm_password').value;

    const errorMessage = document.getElementById('error-message');
    const successMessage = document.getElementById('success-message');

    // Mesajları temizleme işlevi
    const clearMessages = () => {
        errorMessage.style.display = 'none';
        successMessage.style.display = 'none';
    };

    // Form validation
    if (password !== confirmPassword) {
        errorMessage.style.display = 'block';
        errorMessage.textContent = 'Passwords do not match!';
        
        // Hata mesajını 3 saniye sonra temizle
        setTimeout(clearMessages, 3000);
        return;
    }

   // Önceki mesajları temizle
   clearMessages();

    const userData = {
        username: username,
        email: email,
        password: password
    };

    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        });

        const result = await response.json();

        if (response.ok) {
            successMessage.style.display = 'block';
            successMessage.textContent = 'Registration successful! Redirecting...';

            // Başarı mesajını 3 saniye sonra temizle ve yönlendirme yap
            setTimeout(() => {
                clearMessages();
                window.location.href = 'login.html';
            }, 3000);
        } else {
            errorMessage.style.display = 'block';
            errorMessage.textContent = result.message;

             // Hata mesajını 3 saniye sonra temizle
             setTimeout(clearMessages, 3000);
        }
    } catch (error) {
        errorMessage.style.display = 'block';
        errorMessage.textContent = 'An error occurred. Please try again.';

        // Hata mesajını 3 saniye sonra temizle
        setTimeout(clearMessages, 3000);
    }
});