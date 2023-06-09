const urlBase = 'http://first-web.xyz/API';
const extension = 'php';

function moveToJoin(category)
{
	if (category == "join-rso")
    {
        window.location.href = "join.html";
    }
    if (category == "leave-rso")
    {
        window.location.href = "leave.html";
    }
} // end moveToCreate function

function searchRSO()
{
    let searchInput = document.getElementById("search-club-result").value;
    if (searchInput === "")
        searchInput = localStorage.getItem("email_ending");
    const xhr = new XMLHttpRequest();
    const url = "/API/SearchRso.php";
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
                                    <button id="join-rso-button" onclick="joinRSO('${response[i].name}')">Join</button>`
                joinContainer.appendChild(joinDiv);
            }
        }
        else 
        {
            console.error("Error searching RSOs: " + xhr.responseText);
        }
    };

    let tmp = {university:searchInput};
    xhr.send(JSON.stringify(tmp));
}

function joinRSO(rso_name)
{
    let user_id = localStorage.getItem("email");
    let university_name = localStorage.getItem("university_name");
    const xhr = new XMLHttpRequest();
    const url = "/API/JoinRso.php";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    
    // Define the onreadystatechange callback function
    xhr.onreadystatechange = function()
    {
        if (xhr.readyState !== XMLHttpRequest.DONE || xhr.status === 200)
        {
            console.error(xhr.responseText);
            document.getElementById("joinResult").innerHTML = JSON.parse(xhr.responseText).error;
            setTimeout(() => {location.reload();}, 2000);
        }
    };

    let tmp = {rso_name:rso_name, user_id:user_id, university_name:university_name};
    xhr.send(JSON.stringify(tmp));
}
