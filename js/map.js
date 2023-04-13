function initMap(id, btn, name, time, description)
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
} // end function initMap