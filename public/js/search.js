document.querySelector('#search-form').addEventListener('submit', function(e) {
    e.preventDefault(); 

    const destination = document.querySelector('input[placeholder="Enter destination or hotel name"]').value;
    const checkin = document.querySelector('input[placeholder="Check-in"]').value;
    const checkout = document.querySelector('input[placeholder="Check-out"]').value;
    const guests = document.querySelector('input[placeholder="Guests and rooms"]').value;


    const queryParams = new URLSearchParams({
        destination: destination,
        checkin: checkin,
        checkout: checkout,
        guests: guests
    }).toString();

    fetch(`/search?${queryParams}`, {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        const resultsUrl = `/search-results?destination=${destination}&checkin=${checkin}&checkout=${checkout}&guests=${guests}`;
        window.location.href = resultsUrl;
    })
    .catch(error => console.error('Error:', error));
});