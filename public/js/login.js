document.getElementById("login-form").addEventListener("submit", async function(e) {
    e.preventDefault();  // Formun varsayılan gönderimini engelle
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const errorMessage = document.getElementById("error-message");
    const successMessage = document.getElementById("success-message");

    // Mesajları temizleme işlevi
    const clearMessages = () => {
        errorMessage.style.display = "none";
        successMessage.style.display = "none";
    };

    // Önceki mesajları temizle
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
    console.log("Response Data:", data);  // Yanıtı kontrol et

    const errorMessageDiv = document.getElementById("error-message");


    if (response.ok) {
        successMessage.style.display = 'block';
            successMessage.textContent = 'Login successful! Redirecting...';

            // Başarı mesajını 2 saniye sonra temizle ve yönlendirme yap
            setTimeout(() => {
                clearMessages();
                window.location.href = '/dashboard';
            }, 2000); // 2 saniye sonra yönlendirme
    } else {
        errorMessage.style.display = 'block';
            errorMessage.textContent = data.message;

            // Hata mesajını 3 saniye sonra temizle
            setTimeout(clearMessages, 3000);
    }
} catch(error) {
    console.error(error);

    errorMessage.style.display = 'block';
    errorMessage.textContent = 'An error occurred. Please try again.';

    // Hata mesajını 3 saniye sonra temizle
    setTimeout(clearMessages, 3000);
}

});