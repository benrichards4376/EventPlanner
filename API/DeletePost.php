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
        $post_id = mysqli_real_escape_string($conn, $inData["post_id"]);

        
		try
        {
            $stmt = $conn->prepare("DELETE FROM Posts WHERE post_id = ?");
			$stmt->bind_param("i", $post_id);
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
