
async function editPost() {
    const urlParams = new URLSearchParams(window.location.search);
    const post_id = urlParams.get('post_id');
    const event_id = urlParams.get('event_id');
    const user_id = localStorage.getItem("email");
    const urlBase = 'http://first-web.xyz/API';
    const extension = 'php';
    let temp = { user_id:user_id, post_id:post_id };
    let jsonPayload = JSON.stringify(temp);
    let comment = document.getElementById("edit-comment").value;
    let rating = document.getElementById("edit-rating").value;
    let tmp = {user_id:user_id, post_id:post_id, comment:comment, rating:rating};
    let canEditResponse = await canEdit(jsonPayload);

    if (canEditResponse === "true") {

        const xhr = new XMLHttpRequest();
        const url = "/API/EditPost.php";
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

        try {
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    document.getElementById("edit-result").innerHTML = "Post successfully edited";
                    document.getElementById("edit-comment").innerHTML = "";
                    document.getElementById("edit-rating").innerHTML ="";
                    setTimeout(() => {window.location.href = `reviews.html?post_id=${post_id}&event_id=${event_id}`;}, 1000);
                }
                else
                {
                    document.getElementById("edit-result").innerHTML = JSON.parse(xhr.responseText).error;
                    console.log(JSON.parse(xhr.responseText).error);
                }
            };
            xhr.send(JSON.stringify(tmp));           
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
        setTimeout(() => {window.location.href = `reviews.html?post_id=${post_id}&event_id=${event_id}`;}, 2000);
    }
}

function canEdit(jsonPayload) {
    const urlBase = 'http://first-web.xyz/API';
    const extension = 'php';
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
function moveToReview()
{
    const urlParams = new URLSearchParams(window.location.search);
    const post_id = urlParams.get('post_id');
    const event_id = urlParams.get('event_id');
    window.location.href = `reviews.html?post_id=${post_id}&event_id=${event_id}`;
}