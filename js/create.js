
function moveToCreate(category){

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

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
} // end function doLogout

