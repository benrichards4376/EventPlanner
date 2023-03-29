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
		$name = mysqli_real_escape_string($conn, $inData["first_name"]);
		$description = mysqli_real_escape_string($conn, $inData["last_name"]);
		$image_path = mysqli_real_escape_string($conn, $inData["login"]);
		$location = mysqli_real_escape_string($conn, $inData["password"]);
		$email = mysqli_real_escape_string($conn, $inData["email"]);
		$user_id = mysqli_real_escape_string($conn, $inData["user_id"]);
		$len = strlen($email);
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
			$stmt = $conn->prepare("SELECT * FROM Uni_Profs WHERE email_ending = ?");
			$stmt->bind_param("s", $email_ending);
			if(!$stmt->execute())
			{
				throw new Exception($stmt->error);
			}
			else
			{
				$result = $stmt->get_result();

				if ($result->num_rows != 0)
				{
					returnWithError("Cannot Create Profile (University Profile Already Exists)");
				}
				else
				{
					$stmt->close();

					$stmt = $conn->prepare("INSERT INTO Uni_Profs (name, description, image_path, location, email_ending, super_id) VALUES (?, ?, ?, ?, ?)");
					$stmt->bind_param("sssssi", $name,  $description,  $image_path, $location, $email_ending, $user_id);
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
