const urlBase = 'http://first-web.xyz/API';
const extension = 'php';

function searchMyRSO()
{    
    const user_id = localStorage.getItem("user_id")
    let searchInput = document.getElementById("search-club-result").value;
    if (searchInput === "")
        searchInput = localStorage.getItem("email_ending");
    const xhr = new XMLHttpRequest();
    const url = "/API/ViewMyRso.php";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    
    // Define the onreadystatechange callback function
    xhr.onreadystatechange = function()
    {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200)
        {
            console.log(JSON.parse(xhr.responseText));
            let response = JSON.parse(xhr.responseText);

            const joinContainer = document.getElementById('joinDiv');
            for (let i = 0; i < response.length; i++)
            {
                const joinDiv = document.createElement('div');
                joinDiv.className = 'thisRSO';
                joinDiv.innerHTML = `<div class="reviewInfo">Name: ${response[i].name}</div>
                                    <div class="reviewInfo">Leader: ${response[i].admin_id}</div>
                                    <div class="reviewInfo">Active: ${(response[i].active == 1) ? "YES" : "NO"}</div>
                                    <button id="join-rso-button" onclick="leaveRSO('${response[i].name}', '${user_id}')">Leave</button>`
                joinContainer.appendChild(joinDiv);
            }
        }
        else 
        {
            console.error("Error searching RSOs: " + xhr.responseText);
        }
    };

    let tmp = {user_id:user_id};
    xhr.send(JSON.stringify(tmp));
}

function leaveRSO(rso_name, user_id)
{
    const xhr = new XMLHttpRequest();
    const url = "/API/LeaveRso.php";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    
    // Define the onreadystatechange callback function
    xhr.onreadystatechange = function()
    {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200)
        {
            let response = JSON.parse(xhr.responseText);

        }
        else 
        {
            console.error(xhr.responseText);
        }
    };

    let tmp = {rso_name:rso_name, user_id:user_id};
    xhr.send(JSON.stringify(tmp));
}
