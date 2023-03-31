<?php
// EXPECTS rso_name AND user_id (email)
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
        $admin_flag = FALSE;

		try
        {
            // Get the admin_id of the RSO of the student
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
                // Is the person leaving the admin of the RSO?
                if ($row['admin_id'] == $student_id)
                {
                    $admin_flag = TRUE;
                }
            }
            $stmt = $conn->prepare("DELETE FROM Student_RSOS WHERE (rso_name = ? AND student_id = ?)");
			$stmt->bind_param("ss", $rso_name, $student_id);
			if(!$stmt->execute())
            {
				throw new Exception($stmt->error);
			}

            // Get the total number of members left
			$stmt = $conn->prepare("SELECT * FROM Student_RSOS WHERE rso_name = ?");
			$stmt->bind_param("s", $rso_name);
			if(!$stmt->execute())
            {
				throw new Exception($stmt->error);
			}
            else
            {
                $result = $stmt->get_result();
                $row = $result->fetch_assoc();
                // If not enough, set the RSO to inactive
                if ($result->num_rows < 5)
                {
                    $stmt = $conn->prepare("UPDATE RSO SET active = FALSE WHERE name = ?");
			        $stmt->bind_param("s", $rso_name);
                    if(!$stmt->execute())
                    {
                        throw new Exception($stmt->error);
                    }
                }
                
            }
            // If we deleted the admin
            if ($admin_flag == TRUE)
            {
                // Creates a new admin
                $stmt = $conn->prepare("SELECT * FROM Student_RSOS WHERE rso_name = ? LIMIT 1");
                $stmt->bind_param("s", $rso_name);
                if(!$stmt->execute())
                {
                    throw new Exception($stmt->error);
                }
                else
                {
                    $result = $stmt->get_result();
                    // If there are no students left in the RSO, delete the RSO
                    if ($result->num_rows == 0)
                    {
                        $stmt = $conn->prepare("DELETE FROM RSO WHERE name = ?");
                        $stmt->bind_param("s", $rso_name);
                        if(!$stmt->execute())
                        {
                            throw new Exception($stmt->error);
                        }
                        $stmt = $conn->prepare("DELETE FROM Student_RSOS WHERE rso_name = ?");
                        $stmt->bind_param("s", $rso_name);
                        if(!$stmt->execute())
                        {
                            throw new Exception($stmt->error);
                        }
                    }
                    $row = $result->fetch_assoc();
                    $new_admin = $row['student_id'];

                    // Sets the new admin in both tables
                    $stmt = $conn->prepare("UPDATE RSO SET admin_id = ? WHERE name = ? LIMIT 1");
                    $stmt->bind_param("ss", $new_admin, $rso_name);
                    if(!$stmt->execute())
                    {
                        throw new Exception($stmt->error);
                    }

                    $stmt = $conn->prepare("UPDATE Users SET role = 'admin' WHERE email = ? LIMIT 1");
                    $stmt->bind_param("s", $new_admin);
                    if(!$stmt->execute())
                    {
                        throw new Exception($stmt->error);
                    }

                    $stmt = $conn->prepare("SELECT * FROM RSO WHERE admin_id = ?");
                    $stmt->bind_param("s", $student_id);
                    if(!$stmt->execute())
                    {
                        throw new Exception($stmt->error);
                    }
                    else
                    {
                        $result = $stmt->get_result();
                        // If the leaving admin isn't an admin anywhere else, update the role
                        if ($result->num_rows == 0)
                        {
                            $stmt = $conn->prepare("UPDATE Users SET role = 'student' WHERE email = ?");
                            $stmt->bind_param("s", $student_id);
                            if(!$stmt->execute())
                            {
                                throw new Exception($stmt->error);
                            }
                        }
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
