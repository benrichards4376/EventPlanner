const urlBase = 'http://first-web.xyz/API';
const extension = 'php';
let email_ending = localStorage.getItem("email_ending");

function viewPosts()
{
	let tmp = {university:email_ending};
    let jsonPayload = JSON.stringify(tmp);

    const xhr = new XMLHttpRequest();
    const url = "/API/SearchRso.php";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.onreadystatechange = function()
    {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200)
        {
            let response = JSON.parse(xhr.responseText);
            if (response.error)
            {
                console.log(xhr.responseText);
                return;
            }

            const reviewsContainer = document.getElementById('reviewsDiv');
            for (let i = 0; i < response.data.length; i++)
            {
                const reviewsDiv = document.createElement('div');
                reviewsDiv.className = 'thisReview';
                reviewsDiv.innerHTML = `<div class="reviewInfo">User: ${response[i].student_id}</div>
                                    <div class="reviewInfo">Comment: ${response[i].comment}</div>
                                    <div class="reviewInfo">Rating: ${response[i].rating}</div>
                                    <button class="button" id="edit-button" onclick="editPost(${response[i].post_id})">Edit</button>
                                    <button class="button" id="delete-button" onclick="deletePost(${response[i].post_id})">Delete</button>`
                reviewsContainer.appendChild(reviewsDiv);
            }
        }
        else
        {
            console.log("No Posts currently available");
        }
    };
    xhr.send(JSON.stringify(tmp));
} // end viewPosts function

function viewEvents(page, limit)
{
    const xhr = new XMLHttpRequest();
    const url = "/API/ViewEvents.php";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function ()
    {
        
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200)
        {
            let response = JSON.parse(xhr.responseText)
            console.log(xhr.responseText);
            const eventsContainer = document.getElementById('eventDiv');
            if (response.length === 0)
            {
                const eventDiv = document.createElement('div');
                eventDiv.innerHTML = `<h1>There are no Events at this time</h1>`
                eventsContainer.appendChild(eventDiv);
                return;
            }
            eventsContainer.innerHTML = ""; // clear previous content
            let start = (page - 1) * limit;
            let end = start + limit;
            for (let i = start; i < Math.min(end, response.length); i++)
            {
                const eventDiv = document.createElement('div');
                eventDiv.className = 'thisEvent';
                eventDiv.innerHTML = `<div class="eventInfo" id="eventName">Name: ${response[i].name}</div>
                                    <div class="eventInfo">Description: ${response[i].description}</div>
                                    <div class="eventInfo">Date/Time: ${response[i].time}</div>
                                    <div class="eventInfo">Location: ${response[i].location}</div>
                                    <div class="eventInfo">Longitude: ${response[i].longitude}</div>
                                    <div class="eventInfo">Latitude: ${response[i].latitude}</div>
                                    <div class="eventInfo">Phone: ${response[i].contactPhone}</div>
                                    <div class="eventInfo">Email: ${response[i].contactEmail}</div>
                                    <button class="reviews-button" id="reviews-button ${i}" onclick="window.location.href = 'reviews.html?event_id=${response[i].event_id}';">Reviews</button>`
                eventsContainer.appendChild(eventDiv);
            }
        
            const numPages = Math.ceil(response.length / limit);
            const navContainer = document.getElementById("navDiv");
            navContainer.innerHTML = ""; // clear previous content
            for (let i = 1; i <= numPages; i++) {
                const button = document.createElement("button");
                button.classList.add("page-btn");
                button.innerText = i;
                if (i === page)
                {
                    button.classList.add("active");
                }
                else
                {
                    button.addEventListener("click", function()
                    {
                    viewEvents(i, limit);
                    });
                }
                navContainer.appendChild(button);
            }
        if (response.error)
        {
            console.log(xhr.responseText);
            return;
        }
    }
    };
    let tmp = {user_id: localStorage.getItem("email"), university:localStorage.getItem("email_ending")};
    xhr.send(JSON.stringify(tmp));
    
} // end viewEvents function


// search.js
// Function to search RSOs in the database
function searchRSO() {
    // Get the search input value
    var searchInput = document.getElementById("search-club-result").value;
    
    // Create a new XMLHttpRequest object
    var xhr = new XMLHttpRequest();
    
    // Define the onreadystatechange callback function
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                // Request is successful
                var response = JSON.parse(xhr.responseText);
                
                // Handle the response data, e.g. update the UI with search results
                // Assuming the response is an array of RSO objects with properties such as RSOName, RSOTime, RSOLong, RSOLat, RSODesc
                
                // Example code for updating UI with search results
                var rsoNameElement = document.getElementById("RSOName");
                var rsoTimeElement = document.getElementById("RSOTime");
                var rsoLongElement = document.getElementById("RSOLong");
                var rsoLatElement = document.getElementById("RSOLat");
                var rsoDescElement = document.getElementById("RSODesc");
                
                // Clear previous search results
                rsoNameElement.innerText = "";
                rsoTimeElement.innerText = "";
                rsoLongElement.innerText = "";
                rsoLatElement.innerText = "";
                rsoDescElement.innerText = "";
                
                // Loop through the response data and update UI with search results
                for (var i = 0; i < response.length; i++) {
                    var rso = response[i];
                    rsoNameElement.innerText += rso.RSOName + "\n";
                    rsoTimeElement.innerText += rso.RSOTime + "\n";
                    rsoLongElement.innerText += rso.RSOLong + "\n";
                    rsoLatElement.innerText += rso.RSOLat + "\n";
                    rsoDescElement.innerText += rso.RSODesc + "\n";
                }
            } else {
                // Request encountered an error
                console.error("Error searching RSOs: " + xhr.responseText);
            }
        }
    };
    
    // Set up the HTTP GET request to the server-side PHP script
    xhr.open("GET", "searchRso.php?searchInput=" + encodeURIComponent(searchInput), true);
    xhr.send();
}
