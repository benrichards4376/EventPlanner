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
		$university = mysqli_real_escape_string($conn, $inData["university"]);
        
		try
        {
            $stmt = $conn->prepare("SELECT * FROM Events WHERE (uni_id = ? AND approved = FALSE)");
			$stmt->bind_param("s", $university);
			if(!$stmt->execute())
            {
				throw new Exception($stmt->error);
			}
            else
            {
                $result = $stmt->get_result();
                if ($result->num_rows == 0)
                {
                    throw new Exception("There are no events needing approval at this time");
                    $stmt->close();
					$conn->close();
                    return;
                }
            }
            $data = array();
            while ($row = $result->fetch_assoc())
            {
                $data[] = $row;
            }
            $json = json_encode($data);
            sendResultInfoAsJson($json);
            
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
