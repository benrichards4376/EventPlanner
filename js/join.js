const urlBase = 'http://first-web.xyz/API';
const extension = 'php';
let email_ending = localStorage.getItem("email_ending");

function searchRSO() {
    let searchInput = document.getElementById("search-club-result").value;
    
    const xhr = new XMLHttpRequest();
    const url = "/API/SearchRso.php";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    
    // Define the onreadystatechange callback function
    xhr.onreadystatechange = function()
    {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200)
        {
            var response = JSON.parse(xhr.responseText);

            const joinContainer = document.getElementById('joinDiv');
            for (let i = 0; i < response.length; i++)
            {
                const joinDiv = document.createElement('div');
                joinDiv.className = 'thisRSO';
                joinDiv.innerHTML = `<div class="reviewInfo">Name: ${response[i].rso_name}</div>
                                    <div class="reviewInfo">Leader: ${response[i].admin_id}</div>
                                    <button id="join-rso-button" onclick="joinRso(${response[i].rso_name})">Join</button>`
                joinContainer.appendChild(joinDiv);
            }
        }
        else 
        {
            console.error("Error searching RSOs: " + xhr.responseText);
        }
    };

    let tmp = {university:email_ending};
    xhr.send(JSON.stringify(tmp));
}
