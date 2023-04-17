const urlBase = 'http://first-web.xyz/API';
const extension = 'php';
const urlParams = new URLSearchParams(window.location.search);
const event_id = urlParams.get('event_id');

function createPost()
{
    // get the incoming values
	let user_id = localStorage.getItem("email");
	
	let comment = document.getElementById("write-comment").value;
    let rating = document.getElementById("write-rating").value;

	// set the temp variables
	let tmp = {user_id:user_id, event_id:event_id, comment:comment, rating:rating};
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

			// if no error retrieve values
            if (this.status == 200)
			{
	            document.getElementById("write-comment").value = "";
                document.getElementById("write-rating").value = "";
                location.reload();
            }
            else
            {
                console.log(JSON.parse(xhr.responseText).error);
            }
        }; // end onreadystatechange

		// send everything to server
        xhr.send(jsonPayload);
        
		
    } // end try
	catch (err)
	{
        console.log(err);
        document.getElementById("create-result").innerHTML = err;
    } // end catch
} // end createPost function

async function deletePost(post_id) {
    console.log(post_id);
    let user_id = localStorage.getItem("email");
    let tmp = { user_id: user_id, post_id: post_id };
    let jsonPayload = JSON.stringify(tmp);
    let canDeleteResponse = await canDelete(jsonPayload);
    if (canDeleteResponse === "true") {
        const xhr = new XMLHttpRequest();
        const url = "/API/DeletePost.php";
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

        try {
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    viewPosts();
                    location.reload();
                }
                else
                {
                    console.log(JSON.parse(xhr.responseText).error);
                }
            };
            xhr.send(jsonPayload);
            
        }
        catch (err) {
            console.log(err);
            document.getElementById("delete-result").innerHTML = err;
        }
    }
    else {
        let err = "Error: You can only delete posts you have made";
        console.log(err);
        document.getElementById("delete-result").innerHTML = err;
    }
}

async function editPost(post_id, comment, rating) {
    console.log(post_id);
    let user_id = localStorage.getItem("email");
    let tmp = {user_id: user_id, post_id: post_id, comment: comment, rating: rating};
    let jsonPayload = JSON.stringify(tmp);
    let canDeleteResponse = await canDelete(jsonPayload);

    if (canDeleteResponse === "true") {
        const xhr = new XMLHttpRequest();
        const url = "/API/EditPost.php";
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

        try {
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    viewPosts();
                    location.reload();
                }
                else
                {
                    console.log(JSON.parse(xhr.responseText).error);
                }
            };
            xhr.send(jsonPayload);
            
        }
        catch (err) {
            console.log(err);
            document.getElementById("delete-result").innerHTML = err;
        }
    }
    else {
        let err = "Error: You can only edit posts you have made";
        console.log(err);
        document.getElementById("edit-result").innerHTML = err;
    }
}
function canDelete(jsonPayload) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        const url = "/API/CanDelete.php";
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

        try {
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    let response = JSON.parse(xhr.responseText);
                    console.log(response.error);
                    resolve(response.error);
                }
            };
            xhr.send(jsonPayload);
        }
        catch (err) {
            console.log(err);
            reject(err);
        }
    });
}

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
            for (let i = 0; i < response.length; i++)
            {
                const reviewsDiv = document.createElement('div');
                reviewsDiv.id = `post-${response[i].post_id}`;
                reviewsDiv.className = 'thisReview';
                reviewsDiv.innerHTML = `<div class="reviewInfo">User: ${response[i].student_id}</div>
                                    <div class="reviewInfo">Comment: ${response[i].comment}</div>
                                    <div class="reviewInfo">Rating: ${response[i].rating}</div>
                                    <button class="button" id="edit-button" onclick="showEditForm(${response[i].post_id}, '${response[i].comment}', ${response[i].rating})">Edit</button>
                                    <button class="button" id="delete-button" onclick="deletePost(${response[i].post_id})">Delete</button>`
                reviewsContainer.appendChild(reviewsDiv);
            }
        }
        else
        {
            console.log("No Posts currently available");
        }
    };
    xhr.send(JSON.stringify(tmp));
} // end viewPosts function

function showEditForm(post_id)
{
    const reviewDiv = document.getElementById(`post-${post_id}`);
    // Create form element
    const div = document.createElement('div');
    div.className = "editReview";
    div.innerHTML = `
    <span id="edit-title">Edit a Review</span>
    <label for="comment" id="edit-comment-label">Comment:</label><br>
    <textarea id="edit-comment" cols="70" rows="3" placeholder="Edit the review..." required></textarea>
    <br>
    <label for="rating" id="edit-rating-label">Rating:</label><br>
    <input type="number" id="edit-rating" min="1" max="5" required><br>
    <br>
    <span id="edit-result"></span>

    <!-- SAVE BUTTON -->
    <button class="button" id="save-button">Save</button>

    <!-- CANCEL BUTTON -->
    <button class="button" id="cancel-button">Cancel</button>`;

    reviewDiv.appendChild(div);
    document.getElementById("save-button").addEventListener("click", () => {
        editPost(post_id, document.getElementById("edit-comment").value, document.getElementById("edit-rating").value);
        reviewDiv.removeChild(div);
    })

    document.getElementById("cancel-button").addEventListener("click", () => {
        reviewDiv.removeChild(div);
    })


  }
  