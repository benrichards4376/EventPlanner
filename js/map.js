function initMap(id, btn, name, time, description)
{

    const input = document.getElementById(id);
    const searchBox = new google.maps.places.Autocomplete(input);


    const createEventButton = document.getElementById(btn);
    createEventButton.addEventListener("click", (event) => 
    {
        event.preventDefault();
        const name = document.getElementById('public-event-name').value;
        const email_ending = getCookie("email_ending");
        const user_id = getCookie("email");

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
        console.log(locationName)
        console.log(longitude)
        console.log(latitude)
        const xhr = new XMLHttpRequest();
        const url = "first-web.xyz/API/CreatePublicEvent.php";
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
                document.getElementById("createPublicEventResult").innerHTML = xhr.responseText;
            }
        };
        let tmp = {name:name,email_ending:email_ending,user_id:user_id,description:description,
            time:time,contactPhone:contactPhone,contactEmail:contactEmail,
            location:location,longitude:longitude,latitude:latitude};
        xhr.send(JSON.stringify(tmp));
        
        document.getElementById(name).value = "";
        document.getElementById(time).value = "";
        document.getElementById(description).value = "";
        document.getElementById(id).value = "";
        markers = null;
    });
} // end function initMap

function getCookie(name)
{
    let cookieArr = document.cookie.split("; ");
    for(let i = 0; i < cookieArr.length; i++)
    {
      let cookiePair = cookieArr[i].split("=");
      if(name == cookiePair[0])
      {
        return cookiePair[1];
      }
    }
    return null;
}