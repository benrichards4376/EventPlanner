

let email = "";
let firstName = "";
let lastName = "";
let email_ending = "";
let role="";

function doLogin()
{
	const urlBase = 'http://first-web.xyz/API';
	const extension = 'php';
	email = "";
	firstName = "";
	lastName = "";
	role = "";

	// get the incoming values
	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
	console.log(login);
	console.log(password);
	// get results from login
	document.getElementById("loginResult").innerHTML = "";

	// set values as a JSON string
	let tmp = {email:login,password:password};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			// check state of API
			if (this.readyState == 4 && this.status == 200)
			{
				let jsonObject = JSON.parse(xhr.responseText);
				console.log(xhr.responseText);
				email = jsonObject.email;
				email_ending = jsonObject.university;
				role = jsonObject.role;
				if (email == "")
				{
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}
				console.log("made it");
				firstName = jsonObject.first_name;
				lastName = jsonObject.last_name;

				saveCookie();

				window.location.href = "events.html";
			}
		}; // end onreadystatechange

		// send everything to server
		xhr.send(jsonPayload);
	} // end try
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	} // end catch

} // end function doLogin

function doRegister()
{
	const urlBase = 'http://first-web.xyz/API';
	const extension = 'php';
	// get the incoming values
	let firstName = document.getElementById("firstName").value;
	let lastName = document.getElementById("lastName").value;
	let login = document.getElementById("userName").value;
	let password = document.getElementById("password").value;
	role = "student";

	// get results from register & check for special characters
	if(hasSpecialChar(login)){
		document.getElementById("registerResult").innerHTML = "ERROR: YOU CAN'T HAVE SPECIAL CHARACTERS IN YOUR USERNAME";
		return;
	}
	else if(hasSpecialChar(firstName)){
		document.getElementById("registerResult").innerHTML = "ERROR: YOU CAN'T HAVE SPECIAL CHARACTERS IN YOUR FIRST NAME";
		return;
	}
	else if(hasSpecialChar(lastName)){
		document.getElementById("registerResult").innerHTML = "ERROR: YOU CAN'T HAVE SPECIAL CHARACTER IN YOUR LAST NAME";
		return;
	}
	else{
		document.getElementById("registerResult").innerHTML = "";
	}

	// set the temp variables
	let tmp = {
        FirstName: firstName,
        LastName: lastName,
        Login: login,
        Password: password
    };

	// set values as a JSON string
	let jsonPayload = JSON.stringify(tmp);
    let url = urlBase + '/CreateStudentAccount.' + extension;

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
				moveToLogin();
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

function moveToLogin()
{
	document.getElementById("loginDiv").style.visibility = "visible";
	document.getElementById("registerDiv").style.visibility = "hidden";
}

function moveToRegister()
{
	document.getElementById("loginDiv").style.visibility = "hidden";
	document.getElementById("registerDiv").style.visibility = "visible";
}

function saveCookie()
{
	localStorage.setItem("firstName", firstName);
	localStorage.setItem("lastName", lastName);
	localStorage.setItem("email", email);
	localStorage.setItem("email_ending", email_ending);
	localStorage.setItem("role", role);
} // end of saveCookie function

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

