function getEvents(page, limit)
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
                button.addEventListener("click", function() {
                getEvents(i, limit);
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
    
} // end getEvents function
