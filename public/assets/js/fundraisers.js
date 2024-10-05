// fundraisers.js
const apiUrl = "http://localhost:3000/api/fundraisers"; // Replace with actual API URL

async function getActiveFundraisers() {
  try {
    const response = await fetch(apiUrl);
    const fundraisers = await response.json();
    displayFundraisers(fundraisers);
  } catch (error) {
    console.error("Error fetching the fundraisers:", error);
  }
}
function displayFundraisers(fundraisers) {
  const fundraiserList = document.getElementById("fundraiser-list");
  fundraiserList.innerHTML = ""; // Clear any existing content

  fundraisers.forEach((fundraiser) => {
    const fundraiserDiv = document.createElement("div");
    fundraiserDiv.classList.add("team-setup");

    // Check if the fundraiser has an associated Category
    const categoryName = fundraiser.categoryName;

    fundraiserDiv.innerHTML = `
            <div class="team-items">
                <div class="team-user">
                    <img src="${fundraiser.IMAGE_URL}" alt="${fundraiser.CAPTION}">
                </div>
                <div class="team-user-social">
                    <ol>
                        <li><i class="fab fa-facebook-f"></i></li>
                        <li><i class="fab fa-twitter"></i></li>
                        <li><i class="fab fa-google"></i></li>
                        <li><i class="fab fa-skype"></i></li>
                    </ol>
                </div>
                <div class="team-name">
                    <h2>${fundraiser.ORGANIZER}</h2>
                    <b>${fundraiser.CAPTION}</b>
                    <p>Target: ${fundraiser.TARGET_FUNDING} AUD</p>
                    <p>Current: ${fundraiser.CURRENT_FUNDING} AUD</p>
                    <p>City: ${fundraiser.CITY}</p>
                    <p>Category: ${categoryName}</p> <!-- Display category name or fallback -->
                </div>
            </div>
        `;
    fundraiserList.appendChild(fundraiserDiv);
  });
}

getActiveFundraisers();