
<?php

	$inData = getRequestInfo();

	$conn = new mysqli("localhost", "SigmaUser", "ILoveFullStackProjects", "COP4710");
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		$email = mysqli_real_escape_string($conn, $inData["email"]);
		$password = mysqli_real_escape_string($conn, $inData["password"]);
		$stmt = $conn->prepare("SELECT email,first_name,last_name, university, university_name, role FROM Users WHERE (email=? AND password =?)");
		$stmt->bind_param("ss", $email, $password);
		$stmt->execute();
		$result = $stmt->get_result();

		if($result->num_rows != 0)
		{
			$row = $result->fetch_assoc();
            $json = json_encode($row);
            sendResultInfoAsJson($json);
		}
		else
		{
			http_response_code(400);
			throw new Exception("No Records Found");
		}

		$stmt->close();
		$conn->close();
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}

	function returnWithError( $err )
	{
		$retValue = '{"email":"","first_name":"","last_name":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

	function returnWithInfo( $email, $first_name, $last_name, $university, $university_name, $role)
	{
		$retValue = '{"email":' . $email . ',"first_name":"' . $first_name . '","last_name":"' . $last_name . ',"university":"' . $university . ',"university_name":"' . $university_name . ',"role":"' . $role . ',"error":""}';
		sendResultInfoAsJson( $retValue );
	}

?>
