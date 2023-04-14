
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
} // end of doRegister function

function moveToEvent()
{
    let studentHeader = document.getElementById("studentHeader");
    let studentCreate = document.getElementById("student-create-dropdown");
    let adminHeader = document.getElementById("adminHeader");
    let adminCreate = document.getElementById("admin-create-dropdown");
    let superHeader = document.getElementById("superHeader");
    let superCreate = document.getElementById("super-create-dropdown");

    let role = getCookie("role");
    if (role === "student")
    {
        studentHeader.style.visibility = "visible";
        studentCreate.style.visibility = "visible";
    }
    if (role === "admin")
    {
        adminHeader.style.visibility = "visible";
        adminCreate.style.visibility = "visible";
    }
    if (role === "super")
    {
        superHeader.style.visibility = "visible";
        superCreate.style.visibility = "visible";
    }

    window.location.href = 'events.html';
}

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

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
} // end function doLogout

