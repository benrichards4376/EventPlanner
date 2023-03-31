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
		$event_id = mysqli_real_escape_string($conn, $inData["event_id"]);
        
		try
        {
            $stmt = $conn->prepare("UPDATE Events SET approved = TRUE WHERE event_id = ?");
			$stmt->bind_param("i", $event_id);
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
