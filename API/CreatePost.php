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
		$student_id = mysqli_real_escape_string($conn, $inData["user_id"]);
        $event_id = mysqli_real_escape_string($conn, $inData["event_id"]);
        $comment = mysqli_real_escape_string($conn, $inData["comment"]);
        $rating = mysqli_real_escape_string($conn, $inData["rating"]);
        $currentDateTime = new DateTime();
        $date = $currentDateTime->format('Y-m-d H:i:s');
        
		try
        {
            $stmt = $conn->prepare("SELECT * FROM Posts WHERE (student_id = ? AND event_id = ?)");
			$stmt->bind_param("si", $student_id, $event_id);
			if(!$stmt->execute())
            {
				throw new Exception($stmt->error);
			}
            else
            {
                $result = $stmt->get_result();
                if ($result->num_rows != 0)
                {
					http_response_code(400);
                    throw new Exception("You have already given a comment and rating on this event");
                }
            }
            $stmt = $conn->prepare("INSERT INTO Posts (student_id, event_id, comment, rating, date)
                                    VALUES (?, ?, ?, ?, ?)");
			$stmt->bind_param("sisis", $student_id, $event_id, $comment, $rating, $date);
			if(!$stmt->execute())
            {
				throw new Exception($stmt->error);
			}
            $stmt->close();
            $conn->close();
            returnWithError("");           
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
