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
            $stmt = $conn->prepare("SELECT * FROM Posts WHERE (post_id = ? AND student_id = ?)");
			$stmt->bind_param("is", $post_id, $student_id);
			if(!$stmt->execute())
            {
				
				throw new Exception($stmt->error);
			}
            else
            {
                $result = $stmt->get_result();
                if ($result->num_rows == 0)
                {
                    returnWithError("false");
                }
				else
				{
					returnWithError("true");
				}
				$stmt->close();
            	$conn->close();
				return;
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
