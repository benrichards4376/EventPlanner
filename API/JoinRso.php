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
		
		$rso_name = mysqli_real_escape_string($conn, $inData["rso_name"]);
        $student_id = mysqli_real_escape_string($conn, $inData["user_id"]);
		$student_uni = mysqli_real_escape_string($conn, $inData["university_name"]);
		try
        {
			$stmt = $conn->prepare("SELECT * FROM RSO WHERE name = ?");
			$stmt->bind_param("s", $rso_name);
			if(!$stmt->execute())
            {
				throw new Exception($stmt->error);
			}
			else
			{
				$result = $stmt->get_result();
				$row = $result->fetch_assoc();
				if ($student_uni != $row['university_name'])
				{
					returnWithError("You must be a student of " . $row['university_name'] . " to join this RSO");
					$stmt->close();
					$conn->close();
					return;
				}
			}
			$stmt = $conn->prepare("SELECT * FROM Student_RSOS WHERE (rso_name = ? AND student_id = ?)");
			$stmt->bind_param("ss", $rso_name, $student_id);
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
					returnWithError("You are already a member of " . $rso_name);
					$stmt->close();
					$conn->close();
					return;
				}
			}
			$stmt = $conn->prepare("INSERT INTO Student_RSOS (rso_name, student_id) VALUES (?, ?)");
			$stmt->bind_param("ss", $rso_name, $student_id);
			if(!$stmt->execute())
            {
				throw new Exception($stmt->error);
			}

			$stmt = $conn->prepare("SELECT * FROM Student_RSOS WHERE rso_name = ?");
			$stmt->bind_param("s", $rso_name);
			if(!$stmt->execute())
            {
				throw new Exception($stmt->error);
			}
            else
            {
                $result = $stmt->get_result();
                if ($result->num_rows == 5)
                {
                    $stmt = $conn->prepare("UPDATE RSO SET active = TRUE WHERE name = ?");
			        $stmt->bind_param("s", $rso_name);
                    if(!$stmt->execute())
                    {
                        throw new Exception($stmt->error);
                    }
                }
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
