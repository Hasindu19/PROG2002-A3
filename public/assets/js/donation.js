document.addEventListener("DOMContentLoaded", function () {
    // Get the query string parameter to identify the fundraiser
    const urlParams = new URLSearchParams(window.location.search);
    const fundraiserId = urlParams.get('fundraiserId');  // Extract the fundraiser ID from the URL
  
    // Fetch fundraiser details to display on the page
    fetch(`http://localhost:3000/api/fundraiser/${fundraiserId}`)
      .then(response => response.json())
      .then(data => {
        // Display fundraiser details
        document.getElementById('fundraiserName').textContent = data.organizer;
        document.getElementById('fundraiserCaption').textContent = data.caption;
        document.getElementById('fundraiserGoal').textContent = data.targetFunding;
        document.getElementById('fundraiserCurrentFunding').textContent = data.currentFunding;
      })
      .catch(error => {
        console.error("Error fetching fundraiser details:", error);
      });
  
    // Handle form submission
    document.getElementById('donationForm').addEventListener('submit', function (e) {
      e.preventDefault();
  
      const giver = document.getElementById('giver').value;
      const amount = parseFloat(document.getElementById('amount').value);
  
      // Validate minimum donation amount
      if (amount < 5) {
        alert('The minimum donation is 5 AUD.');
        return;
      }
  
      // Make a POST request to add the donation
      fetch('http://localhost:3000/api/donation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: new Date().toISOString().slice(0, 10),  // Format as YYYY-MM-DD
          amount: amount,
          giver: giver,
          fundraiserId: fundraiserId
        })
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        return response.json();
      })
      .then(() => {
        // Display a thank-you message and redirect to the fundraiser page
        alert(`Thank you for your donation to ${document.getElementById('fundraiserName').textContent}`);
        window.location.href = `fundraiser.html?id=${fundraiserId}`;  // Redirect back to the fundraiser page
      })
      .catch(error => {
        console.error('Error submitting donation:', error);
        alert('Error submitting donation. Please try again.');
      });
    });
  });
  