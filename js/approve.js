function viewApprovableEvents(page, limit)
{
    const xhr = new XMLHttpRequest();
    const url = "/API/ViewApprovableEvents.php";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function ()
    {
        
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200)
        {
            let response = JSON.parse(xhr.responseText)
            console.log(xhr.responseText);
            const approveContainer = document.getElementById('approveDiv');
            if (response.length === 0)
            {
                const approveTempDiv = document.createElement('div');
                approveTempDiv.innerHTML = `<h1>There are no Events at this time</h1>`
                approveContainer.appendChild(approveTempDiv);
                return;
            }
            approveContainer.innerHTML = ""; // clear previous content
            let start = (page - 1) * limit;
            let end = start + limit;
            for (let i = start; i < Math.min(end, response.length); i++)
            {
                let approveTempDiv = document.createElement('div');
                approveTempDiv.className = 'thisEvent';
                approveTempDiv.innerHTML = `<div class="eventInfo" id="eventName">Name: ${response[i].name}</div>
                                    <div class="eventInfo">Description: ${response[i].description}</div>
                                    <div class="eventInfo">Date/Time: ${response[i].time}</div>
                                    <div class="eventInfo">Location: ${response[i].location}</div>
                                    <div class="eventInfo">Longitude: ${response[i].longitude}</div>
                                    <div class="eventInfo">Latitude: ${response[i].latitude}</div>
                                    <div class="eventInfo">Phone: ${response[i].contactPhone}</div>
                                    <div class="eventInfo">Email: ${response[i].contactEmail}</div>
                                    <button class="reviews-button" id="reviews-button ${i}" onclick="approveEvent(${response[i].event_id})">Approve</button>`
                approveContainer.appendChild(approveTempDiv);
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
    let tmp = {university:localStorage.getItem("email_ending")};
    xhr.send(JSON.stringify(tmp));
    
} // end viewEvents function

function approveEvent(event_id)
{
    const xhr = new XMLHttpRequest();
    const url = "/API/ApproveEvents.php";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function ()
    {
        
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200)
        {
            let response = JSON.parse(xhr.responseText)
            console.log(xhr.responseText);
            
        if (response.error)
        {
            console.error(xhr.responseText);
            return;
        }
    }
    };
    let tmp = {event_id:event_id};
    xhr.send(JSON.stringify(tmp));
}
