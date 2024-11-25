const COHORT = "2410-FTB-ET-WEB-FT";
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events`;

const state = {
  parties: [],
};

// JS elements for interacting with DOM (specifically the Party List <ul> element and Party Form <h2> element)
const partyList = document.querySelector("#partyList");
const partyForm = document.querySelector("#partyForm");
partyForm.addEventListener("submit", addParty);
partyList.addEventListener("click", deleteParty);

// Use fetch to get the party data from the API referenced at the top and then render it out. Use try/catch to pop error if needed. Response.JSON to convert response to JS. Update the state.parties array. Console log the data or error.
async function getParties() {
  try {
    const response = await fetch(API_URL);
    const json = await response.json();
    console.log(json.data);

    state.parties = json.data;
    console.log(json.data);
  } catch (error) {
    console.log(error);
  }
}

// Render function to display fetched data in the DOM.
// Await ensures UI is not rendered until data is fetched.
async function render() {
  await getParties();
  renderPartyList();
}
render();

// Handle form submission
async function addParty(event) {
  event.preventDefault();
  // Select input fields for IDs name, data, location and text area for ID Description to retrieve their values
  const name = document.querySelector("#name").value;
  const date = new Date(document.querySelector("#date").value);
  const location = document.querySelector("#location").value;
  const description = document.querySelector("#description").value;

  // Create a new party object using inputs from previous section to package it to be posted to API
  const newParty = {
    name,
    date,
    location,
    description,
  };

  // Send a POST request to add the new party
  // TRY block has code to attempt POST request to the API, CATCH block will log errors if it fails
  // Content-Type: application/json so server knows request body will contain data in JSON
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newParty),
    });
    // When server responds response.json() method is called to parse the response body as JSON
    const json = await response.json();
    console.log(json.data);

    // Add the new party to the party list by calling renderParty function and pass in newly created party stored in json.data
    renderParty(json.data);

    // Clear the form inputs
    partyForm.reset();
  } catch (error) {
    console.log(error);
  }
}

// Handle party deletion from API and UI
// Use if() to ensure deletion logic only runs when a delete button is clicked
async function deleteParty(event) {
  if (event.target.classList.contains("delete-button")) {
    // https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset
    const partyId = event.target.dataset.partyId;
    console.log(partyId);

    // Send a DELETE request to remove the party
    try {
      await fetch(`${API_URL}/${partyId}`, {
        method: "DELETE",
      });

      // Remove the deleted party from the party list
      event.target.parentElement.remove();
    } catch (error) {
      console.log(error);
    }
  }
}

// Render the party list
function renderPartyList() {
  state.parties.forEach((party) => {
    renderParty(party);
  });
}

// Render a party item
function renderParty(party) {
  const li = document.createElement("li");
  li.innerHTML = /* html */ `
        <strong>${party.name}</strong><br>
        Date: ${new Date(party.date).toLocaleDateString()}<br>
        Location: ${party.location}<br>
        Description: ${party.description}<br>
        <button class="delete-button" data-party-id="${
          party.id
        }">Delete</button>
      `;
  partyList.appendChild(li);
}
