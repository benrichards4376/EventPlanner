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
        $user_id = mysqli_real_escape_string($conn, $inData["user_id"]);
        $public = array();
        $private = array();
        $rso = array();
		try
        {
            $stmt = $conn->prepare("SELECT * FROM Events WHERE category = 'public'");
			if(!$stmt->execute())
            {
				throw new Exception($stmt->error);
			}
            else
            {
                $result = $stmt->get_result();
                while ($row = $result->fetch_assoc())
                {
                    $public[] = $row;
                }
            }
            $stmt = $conn->prepare("SELECT * FROM Events WHERE (category = 'private' AND uni_id = ?)");
            $stmt->bind_param("s", $university);
			if(!$stmt->execute())
            {
				throw new Exception($stmt->error);
			}
            else
            {
                $result = $stmt->get_result();
                while ($row = $result->fetch_assoc())
                {
                    $private[] = $row;
                }
            }

            $stmt = $conn->prepare("SELECT * FROM Events WHERE event_id IN 
                                   (SELECT event_id FROM RSO_Events WHERE rso_name IN 
                                   (SELECT rso_name FROM Student_RSOS WHERE student_id = ?))");
            $stmt->bind_param("s", $user_id);
			if(!$stmt->execute())
            {
				throw new Exception($stmt->error);
			}
            else
            {
                $result = $stmt->get_result();
                while ($row = $result->fetch_assoc())
                {
                    $rso[] = $row;
                }
            }
            $combined = array_merge($public, $private, $rso);
            $json = json_encode($combined);
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
