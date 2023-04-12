function initMap(id, btn, name, time, description)
{

    const input = document.getElementById(id);
    const searchBox = new google.maps.places.Autocomplete(input);


    const createEventButton = document.getElementById(btn);
    createEventButton.addEventListener("click", (event) => 
    {
        event.preventDefault();

        const name = document.getElementById(name).value;
        const time = document.getElementById(time).value;
        const description = document.getElementById(description).value;
        const locationName = searchBox.getPlace().name;
        const longitude = searchBox.getPlace().geometry.location.lng();
        const latitude = searchBox.getPlace().geometry.location.lat();
        console.log(name)
        console.log(time)
        console.log(description)
        console.log(locationName)
        console.log(longitude)
        console.log(latitude)
        const xhr = new XMLHttpRequest();
        const url = "create_event.php";
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = function ()
        {
            if (xhr.readyState === 4 && xhr.status === 200)
            {
                console.log(xhr.responseText);
            }
        };
        xhr.send(
            "name=" +
            name +
            "&time=" +
            time +
            "&description=" +
            description +
            "&location_name=" +
            locationName +
            "&longitude=" +
            longitude +
            "&latitude=" +
            latitude
        );
        
        document.getElementById(name).value = "";
        document.getElementById(time).value = "";
        document.getElementById(description).value = "";
        document.getElementById(id).value = "";
        markers = null;
    });
} // end function initMap