const urlBase = 'http://first-web.xyz/API';
const extension = 'php';

let email = "";
let firstName = "";
let lastName = "";
let email_ending = "";

function createPublicEvent(){

	// get the incoming values
	let eventName = document.getElementById("public-event-name").value;
	let description = document.getElementById("public-event-description").value;
	let dateTime = document.getElementById("public-event-date-time").value;
	let location = document.getElementById("public_map").value;
    let phone = document.getElementById("public-event-phone").value;
    let email = document.getElementById("public-event-email").value;

    // split dateTime into date & time
    const [dateString, timeString] = dateTimeString.split(" ");

    // Convert the time to 24-hour format
    const timeParts = timeString.split(":");
    let hours = parseInt(timeParts[0]);
    const minutes = parseInt(timeParts[1]);

    if (hours === 12) {
    hours = 0; // 12 AM is 0 hours in 24-hour format
    }

    if (timeString.endsWith("PM")) {
    hours += 12; // add 12 hours to convert to 24-hour format
    }

    // Create a new Date object with the date and time parts
    const date = new Date(`${dateString} ${hours}:${minutes}`);
    date.toISOString

	// set the temp variables
	let tmp = {
        name: eventName,
        description: description,
        date: dateTime,
        time: dateTime,
        location: location,
        contactPhone: phone,
        contactEmail: email
    };

	// set values as a JSON string
	let jsonPayload = JSON.stringify(tmp);
    let url = urlBase + '/CreatePublicEvent.' + extension;

	let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try {
        xhr.onreadystatechange = function ()
		{
			// check state of API
            if (this.readyState != 4)
			{
                return;
            }

            if (this.status == 409)
			{
                return;
            }

			// if no error retrieve values
            if (this.status == 200)
			{
				document.getElementById("firstName").value = "";
				document.getElementById("lastName").value = "";
				document.getElementById("register-username").value = "";
				document.getElementById("register-password").value = "";

				saveCookie();
            }
        }; // end onreadystatechange

		// send everything to server
        xhr.send(jsonPayload);
		
    } // end try
	catch (err)
	{
        document.getElementById("registerResult").innerHTML = err.message;
    } // end catch

} // end of doRegister function