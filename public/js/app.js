console.log('Loading app.js...');

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded');
    
    // Get search button
    const searchButton = document.getElementById('search-button');
    console.log('Search button found:', !!searchButton);

    if (searchButton) {
        // Handle search button click
        searchButton.addEventListener('click', async () => {
            console.log('Search button clicked');

            // Get input values
            const formData = {
                location: document.getElementById('location-input').value.trim(),
                hotelName: document.getElementById('hotel-name-input').value.trim(),
                checkIn: document.getElementById('check-in').value,
                checkOut: document.getElementById('check-out').value,
                guests: document.getElementById('guests').value
            };
            console.log('Form data:', formData);

            // Validate input
            if (!formData.location && !formData.hotelName) {
                alert('Please enter either a location or hotel name to search');
                return;
            }

            try {
                // Build search parameters
                const params = new URLSearchParams();
                if (formData.location) params.append('location', formData.location);
                if (formData.hotelName) params.append('hotelName', formData.hotelName);
                if (formData.guests) params.append('guests', formData.guests);

                const apiUrl = `http://localhost:3000/api/hotels?${params.toString()}`;
                console.log('Making API request to:', apiUrl);

                // Make API request
                const response = await fetch(apiUrl);
                const data = await response.json();
                console.log('API response:', data);

                if (data.success) {
                    // Bulunan otel sayısını göster
                    const message = `${data.hotels.length} hotel${data.hotels.length === 1 ? '' : 's'} found!`;
                    showMessage(message);

                    // Build results page URL
                    const resultsParams = new URLSearchParams();
                    Object.entries(formData).forEach(([key, value]) => {
                        if (value) resultsParams.append(key, value);
                    });
                    resultsParams.append('results', JSON.stringify(data.hotels));

                    // 1.5 saniye bekle ve sonra yönlendir
                    setTimeout(() => {
                        const resultsUrl = `search-results.html?${resultsParams.toString()}`;
                        console.log('Redirecting to:', resultsUrl);
                        window.location.href = resultsUrl;
                    }, 1500);
                } else {
                    alert(data.message || 'No hotels found');
                }
            } catch (error) {
                console.error('Search error:', error);
                alert('Error searching hotels. Please try again.');
            }
        });
    }

    // Set minimum dates for check-in and check-out
    const today = new Date().toISOString().split('T')[0];
    const checkIn = document.getElementById('check-in');
    if (checkIn) {
        checkIn.min = today;
        
        checkIn.addEventListener('change', () => {
            const checkOut = document.getElementById('check-out');
            if (checkOut) {
                checkOut.min = checkIn.value;
                if (checkOut.value && checkOut.value < checkIn.value) {
                    checkOut.value = checkIn.value;
                }
            }
        });
    }
});


// Utility function to show messages
function showMessage(message, isError = false) {
    // Önce varolan alertleri temizle
    const existingAlerts = document.querySelectorAll('.alert');
    existingAlerts.forEach(alert => alert.remove());

    // Yeni alert oluştur
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert ${isError ? 'alert-danger' : 'alert-success'} alert-dismissible fade show position-fixed`;
    alertDiv.role = 'alert';
    alertDiv.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 9999;
        min-width: 300px;
        text-align: center;
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    `;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    // Alert'i body'e ekle
    document.body.appendChild(alertDiv);
    
    // Fade in efekti
    setTimeout(() => {
        alertDiv.style.opacity = '1';
    }, 100);
    
    // 3 saniye sonra kaldır
    setTimeout(() => {
        alertDiv.style.opacity = '0';
        setTimeout(() => alertDiv.remove(), 300);
    }, 3000);
}