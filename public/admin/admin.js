document.addEventListener("DOMContentLoaded", function () {
    const apiUrl = "http://localhost:3000/api"; // base API URL
    
    // Load all fundraisers on page load
  loadFundraisers();

  // Function to load and display all fundraisers
  function loadFundraisers() {
    fetch(`${apiUrl}/allfundraisers`)
      .then((response) => response.json())
      .then((data) => {
        const fundraiserList = document.getElementById("fundraiserList");
        fundraiserList.innerHTML = ""; // Clear existing list

        data.forEach((fundraiser) => {
            fundraiserList.innerHTML += `
              <tr>
                <td>${fundraiser.FUNDRAISER_ID}</td>
                <td>${fundraiser.CAPTION}</td>
                <td>${fundraiser.ORGANIZER}</td>
                <td>${fundraiser.TARGET_FUNDING}</td>
                <td>${fundraiser.CURRENT_FUNDING}</td>
                <td>${fundraiser.CITY}</td>
                <td>${fundraiser.ACTIVE === 1 ? "Active" : "Inactive"}</td>
                <td>
                <button class="btn btn-sm btn-warning" onclick="editFundraiser(${
                    fundraiser.FUNDRAISER_ID
                  })">Edit</button>
                  <button class="btn btn-sm btn-danger" onclick="deleteFundraiser(${
                    fundraiser.FUNDRAISER_ID
                  })">Delete</button>
                </td>
              </tr>
            `;
          });
        })
        .catch((error) => {
          console.error("Error fetching fundraisers:", error);
        });
    }
  
