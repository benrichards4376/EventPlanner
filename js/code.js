const urlBase = 'http://first-web.xyz/API';
const extension = 'php';

let email = "";
let firstName = "";
let lastName = "";
let email_ending = "";

function doLogin()
{
	email = "";
	firstName = "";
	lastName = "";

	// get the incoming values
	let login = document.getElementById("email").value;
	let password = document.getElementById("password").value;
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
				email_ending = jsonObject.email_ending;
				if (email == "")
				{
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}
				console.log("made it");
				firstName = jsonObject.first_name;
				lastName = jsonObject.last_name;

				saveCookie();

				window.location.href = "create.html";
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

function doRegister(){

	// get the incoming values
	let firstName = document.getElementById("firstName").value;
	let lastName = document.getElementById("lastName").value;
	let login = document.getElementById("userName").value;
	let password = document.getElementById("password").value;

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
    let url = urlBase + '/Register.' + extension;

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
				moveTologin();
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

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",email=" + email + ",university=" + email_ending + ";expires=" + date.toGMTString();
} // end of saveCookie function

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++)
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	} // end for loop

	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
} // end function readCookie

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
} // end function doLogout