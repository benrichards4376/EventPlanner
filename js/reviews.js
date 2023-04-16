const urlBase = 'http://first-web.xyz/API';
const extension = 'php';
const urlParams = new URLSearchParams(window.location.search);
const event_id = urlParams.get('event_id');

function createPost()
{
    // get the incoming values
	let user_Id = document.getElementById("reviewUser").value;
	
	let comment = document.getElementById("reviewCom").value;
    let rating = document.getElementById("reviewRating").value;

	// set the temp variables
	let tmp = {user_id:user_Id, event_id:event_Id, comment:comment, rating:rating};
	let jsonPayload = JSON.stringify(tmp);

    const xhr = new XMLHttpRequest();
    const url = "/API/CreatePost.php";
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
                document.getElementById("reviewRating").value = "";
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
	let tmp = {event_id:event_id};
    let jsonPayload = JSON.stringify(tmp);

    const xhr = new XMLHttpRequest();
    const url = "/API/ViewPosts.php";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    xhr.onreadystatechange = function()
    {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200)
        {
            let response = JSON.parse(xhr.responseText);
            if (response.error)
            {
                console.log(xhr.responseText);
                return;
            }

            const reviewsContainer = document.getElementById('reviewsDiv');
            for (let i = 0; i < response.data.length; i++)
            {
                const reviewsDiv = document.createElement('div');
                reviewsDiv.className = 'thisReview';
                reviewsDiv.innerHTML = `<div class="reviewInfo">User: ${response[i].user}</div>
                                    <div class="reviewInfo">Comment: ${response[i].comment}</div>
                                    <div class="reviewInfo">Rating: ${response[i].rating}</div>
                                    <button class="button" id="edit-button" onclick="editPost(${response[i].post_id})">Edit</button>
                                    <button class="button" id="delete-button" onclick="deletePost(${response[i].post_id})">Delete</button>`
                reviewsContainer.appendChild(reviewsDiv);
            }
        }
        else
        {
            console.log("No events currently available");
        }
    };
    xhr.send(JSON.stringify(tmp));
} // end viewPosts function