<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

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
		$login = mysqli_real_escape_string($conn, $inData["login"]);
		$password = mysqli_real_escape_string($conn, $inData["password"]);
		$email = mysqli_real_escape_string($conn, $inData["email"]);
		$len = strlen($email);
		$user_id = -1;
		$at_index = 0;
		for( $num = 0; $num < $len; $num += 1)
		{
			if ($email[$num] == '@')
			{
				$at_index = $num + 1;
				break;
			}
		}
		$email_ending = substr($email, $at_index, $len)

		try {
			$stmt->close();
			$stmt = $conn->prepare("SELECT * FROM Users WHERE (role = 'super' AND university = ?)");
			$stmt->bind_param("s", $email_ending);
			if(!$stmt->execute())
			{
				throw new Exception($stmt->error);
			}
			else
			{
				$result = $stmt->get_result();
				if ($result->num_rows != 0)
					returnWithError("University already has Super Admin");
			}
			$stmt = $conn->prepare("INSERT INTO Users (first_name, last_name, email, login, password, university, role) VALUES (?, ?, ?, ?, ?, ?, 'super')");
			$stmt->bind_param("ssssss", $firstName,  $lastName,  $email, $login, $password, $email_ending);
			if(!$stmt->execute()){
				throw new Exception($stmt->error);
			} else {
				$stmt->close();
				$stmt = $conn->prepare("SELECT * FROM Users WHERE (role = 'super' AND university = ?)");
				$stmt->bind_param("s", $email_ending);
				if(!$stmt->execute())
				{
					throw new Exception($stmt->error);
				}
				else
				{
					$result = $stmt->get_result();
					$row = $result->fetch_assoc();
					$user_id = $row['user_id'];
				}
				$stmt->close();

				$stmt = $conn->prepare("INSERT INTO Super_Admins (user_id, email_ending) VALUES (?, ?)");
				$stmt->bind_param("is", $user_id, $email_ending);
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
