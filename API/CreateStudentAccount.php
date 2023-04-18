<?php

	$conn = new mysqli("localhost", "SigmaUser", "ILoveFullStackProjects", "COP4710");

	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		$inData = getRequestInfo();
		$firstName = mysqli_real_escape_string($conn, $inData["first_name"]);
		$lastName = mysqli_real_escape_string($conn, $inData["last_name"]);
		$password = mysqli_real_escape_string($conn, $inData["password"]);
		$email = mysqli_real_escape_string($conn, $inData["email"]);
		$len = strlen($email);
		$at_index = strpos($email, '@') + 1;
		$email_ending = substr($email, $at_index, $len);
		$university_name = '';

		try {
			$stmt = $conn->prepare("SELECT * FROM Uni_Profs WHERE email_ending = ?");
			$stmt->bind_param("s", $email_ending);
			if(!$stmt->execute())
            {
				throw new Exception($stmt->error);
			}
			else
			{
				$result = $stmt->get_result();
				$row = $result->fetch_assoc();
				if ($result->num_rows == 0)
				{
					throw new Exception("No university exists with the domain " . $email_ending);
					return;
				}
				else
				{
					$university_name = $row['name'];
				}
			}
			$stmt = $conn->prepare("SELECT * FROM Users WHERE email = ?");
			$stmt->bind_param("s", $email);
			if(!$stmt->execute())
            {
				throw new Exception($stmt->error);
			}
			else
			{
				$result = $stmt->get_result();
				if ($result->num_rows != 0)
				{
					throw new Exception("Student already exists with the email " . $email);
					return;
				}
			}
			$stmt = $conn->prepare("INSERT INTO Users (first_name, last_name, email, password, university, university_name) VALUES (?, ?, ?, ?, ?, ?)");
			$stmt->bind_param("ssssss", $firstName,  $lastName,  $email, $password, $email_ending, $university_name);
			if(!$stmt->execute())
			{
				throw new Exception($stmt->error);
			}
			else
			{
				$stmt->close();
				$conn->close();
				returnWithError("");
			}
		}
		catch (Exception $e)
		{
			returnWithError($e->getMessage());
		}
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
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

?>
