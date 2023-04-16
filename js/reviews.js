const urlBase = 'http://first-web.xyz/API';
const extension = 'php';

function createPost()
{
    // get the incoming values
	let user_Id = document.getElementById("reviewUser").value;
	let event_Id = document.getElementById("reviewEventId").value;
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