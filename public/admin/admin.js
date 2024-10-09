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

    // Fetch and populate the categories dropdown
  function loadCategories() {
    fetch(`${apiUrl}/categories`)
      .then((response) => response.json())
      .then((data) => {
        const categoryDropdown = document.getElementById("newCategoryId");
        categoryDropdown.innerHTML =
          '<option value="" disabled selected>Select a category</option>'; // Reset dropdown options
          
    
      // Populate dropdown with categories
        data.forEach((category) => {
            categoryDropdown.innerHTML += `
              <option value="${category.CATEGORY_ID}">${category.NAME}</option>
            `;
          });
        })
        .catch((error) => {
          console.error("Error fetching categories:", error);
        });
    }
    // Call the loadCategories function when the page loads
  loadCategories();

  // New Fundraiser Form Submission with Validation
  document
    .getElementById("newFundraiserForm")
    .addEventListener("submit", function (e) {
      e.preventDefault(); // Prevent form from submitting the default way

      // Get the form values
      const targetFunding = parseFloat(
        document.getElementById("newTargetFunding").value
      );

      // Validation: Ensure target funding is greater than 0
      if (targetFunding <= 0) {
        alert("Target funding must be greater than 0.");
        return;
      }

      const newFundraiser = {
        caption: document.getElementById("newCaption").value,
        organizer: document.getElementById("newOrganizer").value,
        targetFunding: targetFunding,
        city: document.getElementById("newCity").value,
        categoryId: document.getElementById("newCategoryId").value,
        imageUrl: document.getElementById("newImageUrl").value,
      };

      // Make a POST request to add the fundraiser
      fetch(`${apiUrl}/fundraisers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newFundraiser), // Send the form data as JSON
      })
        .then((response) => {
          if (response.ok) {
            return response.json(); // Parse the JSON response
          } else {
            throw new Error("Error creating fundraiser");
          }
        })
        .then((data) => {
          alert(`New fundraiser created with ID: ${data.fundraiserId}`);
          // Optionally clear the form after submission
          document.getElementById("newFundraiserForm").reset();



  
