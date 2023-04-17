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
		$admin_id = mysqli_real_escape_string($conn, $inData["user_id"]);
        
		try
        {
            $stmt = $conn->prepare("SELECT * FROM Student_RSOS WHERE student_id = ?");
			$stmt->bind_param("s", $admin_id);
			if(!$stmt->execute())
            {
				throw new Exception($stmt->error);
			}
            else
            {
                $result = $stmt->get_result();
                if ($result->num_rows == 0)
                {
                    returnWithError("No records found");
                    $stmt->close();
					$conn->close();
                    return;
                }
            }
            $data = array();
            while ($row = $result->fetch_assoc())
            {
                $rso = $row["rso_name"];
				$new_stmt = $conn->prepare("SELECT * FROM RSO WHERE name = ?");
				$new_stmt->bind_param("s", $rso);
				if(!$new_stmt->execute())
				{
					throw new Exception($new_stmt->error);
				}
				else
				{
					$new_result = $new_stmt->get_result();
					while ($new_row = $new_result->fetch_assoc())
					{
						$data[] = $new_row;
					}
					
				}
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
