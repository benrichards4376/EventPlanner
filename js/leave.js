function searchMyRSO() {
    const urlBase = 'http://first-web.xyz/API';
    const extension = 'php';
    const user_id = localStorage.getItem("email")
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

            const leaveContainer = document.getElementById('leaveDiv');
            for (let i = 0; i < response.length; i++)
            {
                const leaveDiv = document.createElement('div');
                leaveDiv.className = 'thisRSO';
                leaveDiv.innerHTML = `<div class="reviewInfo">Name: ${response[i].name}</div>
                                    <div class="reviewInfo">Leader: ${response[i].admin_id}</div>
                                    <div class="reviewInfo">Active: ${(response[i].active == 1) ? "YES" : "NO"}</div>
                                    <button id="leave-rso-button" onclick="leaveRSO('${response[i].name}', '${user_id}')">Leave</button>`
                leaveContainer.appendChild(leaveDiv);
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
            console.log(JSON.parse(xhr.responseText));

        }
        else 
        {
            console.error(xhr.responseText);
        }
    };

    let tmp = {rso_name:rso_name, user_id:user_id};
    xhr.send(JSON.stringify(tmp));
}
