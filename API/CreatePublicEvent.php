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
		$uni_id = mysqli_real_escape_string($conn, $inData["email_ending"]);
		$admin_id = mysqli_real_escape_string($conn, $inData["user_id"]);
		$description = mysqli_real_escape_string($conn, $inData["description"]);
        $dateTimeObject = new DateTime(mysqli_real_escape_string($conn, $inData["time"]));
        $formattedDateTime = $dateTimeObject->format('Y-m-d H:i:s');
        $contactPhone = mysqli_real_escape_string($conn, $inData["contactPhone"]);
        $contactEmail = mysqli_real_escape_string($conn, $inData["contactEmail"]);
        $location = mysqli_real_escape_string($conn, $inData["location"]);
        $longitude = mysqli_real_escape_string($conn, $inData["longitude"]);
        $latitude = mysqli_real_escape_string($conn, $inData["latitude"]);
        // Get the current date and time as a DateTime object
        $currentDateTime = new DateTime();
        $currentDateTime = $currentDateTime->format('Y-m-d H:i:s');
        
        // Check if the event is in the future or in the past
        if ($currentDateTime > $formattedDateTime)
        {
            http_response_code(400);
            returnWithError("Event date and time must be in the future");
            return;
        }


		try {
            $stmt = $conn->prepare("SELECT * FROM Events WHERE (location = ? AND time = ?)");
			$stmt->bind_param("ss", $location, $formattedDateTime);
			if(!$stmt->execute())
            {
				throw new Exception($stmt->error);
			}
            else
            {
                $result = $stmt->get_result();
                $row = $result->fetch_assoc();
                if ($result->num_rows != 0)
                {
                    http_response_code(400);
                    throw new Exception('Location ' . $location . ' is already being used by ' . $row['name'] . ' at the time ' . $formattedDateTime);
                    $stmt->close();
					$conn->close();
                    return;
                }
				
                $stmt = $conn->prepare("INSERT INTO Events (name, uni_id, admin_id, category, description, time, contact_phone, contact_email, location, longitude, latitude, approved)
                                        VALUES (?, ?, ?, 'public', ?, ?, ?, ?, ?, ?, ?, FALSE)");
                $stmt->bind_param("ssssssssss", $name, $uni_id, $admin_id, $description, $formattedDateTime, $contactPhone, $contactEmail, $location, $longitude, $latitude);
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
