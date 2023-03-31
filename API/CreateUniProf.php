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
		$name = mysqli_real_escape_string($conn, $inData["name"]);
		$description = mysqli_real_escape_string($conn, $inData["description"]);
		$image_path = mysqli_real_escape_string($conn, $inData["image_path"]);
		$location = mysqli_real_escape_string($conn, $inData["location"]);
		$email = mysqli_real_escape_string($conn, $inData["email"]);
		$len = strlen($email);
		$at_index = strpos($email, '@') + 1;
		$email_ending = substr($email, $at_index, $len);
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
					$stmt->close();
					$conn->close();
					return;
				}
				else
				{
					$stmt->close();

					$stmt = $conn->prepare("INSERT INTO Uni_Profs (name, description, image_path, location, email_ending, super_id) VALUES (?, ?, ?, ?, ?, ?)");
					$stmt->bind_param("ssssss", $name,  $description,  $image_path, $location, $email_ending, $email);
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
					$stmt = $conn->prepare("UPDATE Users SET university_name = ? WHERE user_id = ?");
					$stmt->bind_param("ss", $name, $email);
					if(!$stmt->execute())
					{
						throw new Exception($stmt->error);
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
