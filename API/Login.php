
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
		$stmt = $conn->prepare("SELECT email,first_name,last_name, university, university_name FROM Users WHERE email=? AND password =?");
		$stmt->bind_param("ss", $email, $password);
		$stmt->execute();
		$result = $stmt->get_result();

		if($result->num_rows != 0)
		{
			$data = array();
            while ($row = $result->fetch_assoc())
            {
                $data[] = $row;
            }
            $json = json_encode($data);
            sendResultInfoAsJson($json);
		}
		else
		{
			returnWithError("No Records Found");
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

	function returnWithInfo( $email, $first_name, $last_name, $university, $university_name )
	{
		$retValue = '{"email":' . $email . ',"first_name":"' . $first_name . '","last_name":"' . $last_name . ',"university":"' . $university . ',"university_name":"' . $university_name . ',"error":""}';
		sendResultInfoAsJson( $retValue );
	}

?>
