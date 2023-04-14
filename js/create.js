const urlBase = 'http://first-web.xyz/API';
const extension = 'php';

function moveToCreate(category)
{
	if (category == "create-rso-club")
    {
        window.location.href = "rso-club.html";
    }
    if (category == "create-rso-event")
    {
        window.location.href = "rso-event.html";
    }
    if (category == "create-public-event")
    {
        window.location.href = "public-event.html";
    }
    if (category == "create-private-event")
    {
        window.location.href = "private-event.html";
    }
} // end moveToCreate function

function createRSOClub(btn, name)
{
    const createEventButton = document.getElementById(btn);
    createEventButton.addEventListener("click", (event) => 
    {
        event.preventDefault();
        const name = document.getElementById('rso-club-name').value;
        const email_ending = localStorage.getItem("email_ending");
        const user_id = localStorage.getItem("email");
        console.log(user_id);
        const leader = document.getElementById('leader').value;
        const email1 = document.getElementById('member1').value;
        const email2 = document.getElementById('member2').value;
        const email3 = document.getElementById('member3').value;
        const email4 = document.getElementById('member4').value;
        console.log(name)
        console.log(leader)
        console.log(email1)
        console.log(email2)
        console.log(email3)
        console.log(email4)
        const xhr = new XMLHttpRequest();
        const url = "/API/CreateRso.php";
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = function ()
        {
            if (xhr.readyState === 4 && xhr.status === 200)
            {
                console.log(xhr.responseText);
            }
            else
            {
                document.getElementById("createRSOClubResult").innerHTML = JSON.parse(xhr.responseText).error;
            }
        };
        let tmp = {name:name,email_ending:email_ending,user_id:user_id,admin_email:leader,
            email1:email1,email2:email2,email3:email3,email4:email4};
        xhr.send(JSON.stringify(tmp));
        
        document.getElementById('rso-club-name').value = "";
        markers = null;
    });
} // end createRSOClub function

function createPublicEvent(id, btn, name, time, description)
{
    const input = document.getElementById(id);
    const searchBox = new google.maps.places.Autocomplete(input);


    const createEventButton = document.getElementById(btn);
    createEventButton.addEventListener("click", (event) => 
    {
        event.preventDefault();
        const name = document.getElementById('public-event-name').value;
        const email_ending = localStorage.getItem("email_ending");
        const user_id = localStorage.getItem("email");
        console.log(user_id);
        const description = document.getElementById('public-event-description').value;
        const time = document.getElementById('public-event-date-time').value;
        const contactPhone = document.getElementById('public-event-phone').value;
        const contactEmail = document.getElementById('public-event-email').value;
        const location = searchBox.getPlace().name;
        const longitude = searchBox.getPlace().geometry.location.lng();
        const latitude = searchBox.getPlace().geometry.location.lat();
        console.log(name)
        console.log(time)
        console.log(description)
        console.log(location)
        console.log(longitude)
        console.log(latitude)
        const xhr = new XMLHttpRequest();
        const url = "/API/CreatePublicEvent.php";
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = function ()
        {
            if (xhr.readyState === 4 && xhr.status === 200)
            {
                console.log(xhr.responseText);
            }
            else
            {
                document.getElementById("createPublicEventResult").innerHTML = JSON.parse(xhr.responseText).error;
            }
        };
        let tmp = {name:name,email_ending:email_ending,user_id:user_id,description:description,
            time:time,contactPhone:contactPhone,contactEmail:contactEmail,
            location:location,longitude:longitude,latitude:latitude};
        xhr.send(JSON.stringify(tmp));
        
        document.getElementById('public-event-name').value = "";
        document.getElementById('public-event-date-time').value = "";
        document.getElementById('public-event-description').value = "";
        markers = null;
    });
} // end createPublicEvent function

function createPrivateEvent(id, btn, name, time, description)
{
    const input = document.getElementById(id);
    const searchBox = new google.maps.places.Autocomplete(input);


    const createEventButton = document.getElementById(btn);
    createEventButton.addEventListener("click", (event) => 
    {
        event.preventDefault();
        const name = document.getElementById('private-event-name').value;
        const email_ending = localStorage.getItem("email_ending");
        const user_id = localStorage.getItem("email");
        console.log(user_id);
        const description = document.getElementById('private-event-description').value;
        const time = document.getElementById('private-event-date-time').value;
        const contactPhone = document.getElementById('private-event-phone').value;
        const contactEmail = document.getElementById('private-event-email').value;
        const location = searchBox.getPlace().name;
        const longitude = searchBox.getPlace().geometry.location.lng();
        const latitude = searchBox.getPlace().geometry.location.lat();
        console.log(name)
        console.log(time)
        console.log(description)
        console.log(location)
        console.log(longitude)
        console.log(latitude)
        const xhr = new XMLHttpRequest();
        const url = "/API/CreatePrivateEvent.php";
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = function ()
        {
            if (xhr.readyState === 4 && xhr.status === 200)
            {
                console.log(xhr.responseText);
            }
            else
            {
                document.getElementById("createPrivateEventResult").innerHTML = JSON.parse(xhr.responseText).error;
            }
        };
        let tmp = {name:name,email_ending:email_ending,user_id:user_id,description:description,
            time:time,contactPhone:contactPhone,contactEmail:contactEmail,
            location:location,longitude:longitude,latitude:latitude};
        xhr.send(JSON.stringify(tmp));
        
        document.getElementById('private-event-name').value = "";
        document.getElementById('private-event-date-time').value = "";
        document.getElementById('private-event-description').value = "";
        markers = null;
    });
} // end createPrivateEvent function