const urlBase = 'http://first-web.xyz/API';
const extension = 'php';

function hello()
{
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
} // end hello function

function createPost()
{
    // get the incoming values
	let userId = document.getElementById("reviewUser").value;
	let eventId = document.getElementById("reviewEventId").value;
	let comment = document.getElementById("reviewCom").value;

	// set the temp variables
	let tmp = {user_id:userId, event_id:eventId, comment:comment};
	let jsonPayload = JSON.stringify(tmp);

    const xhr = new XMLHttpRequest();
    const url = "/API/createPost.php";
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
                document.getElementById("reviewUser").value = "";
	            document.getElementById("reviewEventId").value = "";
	            document.getElementById("reviewCom").value = "";
            }
        }; // end onreadystatechange

		// send everything to server
        xhr.send(jsonPayload);
		
    } // end try
	catch (err)
	{
        console.log(err);
    } // end catch
} // end createPost function

function deletePost()
{
	let tmp = {user_id:userId, post_id:postId};
    let jsonPayload = JSON.stringify(tmp);

	const xhr = new XMLHttpRequest();
    const url = "/API/DeletePost.php";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try{
		xhr.onreadystatechange = function ()
        {
            if (xhr.readyState == 4 && xhr.status == 200) {
                canDelete();
				viewPosts();
            }
        };
        xhr.send(jsonPayload);
	}
	catch(err){
		console.log(err);
	}
} // end deletePost function

function viewPosts()
{
	let tmp = {event_id:eventId};
    let jsonPayload = JSON.stringify(tmp);

    const xhr = new XMLHttpRequest();
    const url = "/API/ViewPosts.php";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function ()
        {
            if (xhr.readyState == 4 && xhr.status == 200)
            {
                let jsonObject = JSON.parse(xhr.responseText);
                if (jsonObject.error)
                {
                    console.log(jsonObject.error);
                    return;
                }
				console.log(jsonObject);
				const reviewsDiv = document.getElementById("reviewsDiv");
				console.log(reviewsDiv);
				let html = "";
				for(let i = 0; i < jsonObject.results.length; i++){
					html += '<div class="thisReview" id="'+ jsonObject.results[i].ID + 'Name">'+ jsonObject.results[i].name +'</div>';
                    html += '<div class="thisReview" id="'+ jsonObject.results[i].ID + 'Com">'+ jsonObject.results[i].comment +'</div> </div>';
				}
				reviewsDiv.innerHTML = html;
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        console.log(err.message);
    }
} // end viewPosts function