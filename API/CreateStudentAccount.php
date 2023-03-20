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

		try {
			$stmt = $conn->prepare("INSERT INTO Users (first_name, last_name, email, login, password) VALUES (?, ?, ?, ?, ?)");
			$stmt->bind_param("sssss", $firstName,  $lastName,  $email, $login, $password);
			if(!$stmt->execute()){
				throw new Exception($stmt->error);
			} else {
				$stmt->close();
				$conn->close();
				returnWithError("");
			}
		} catch (Exception $e) {
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
