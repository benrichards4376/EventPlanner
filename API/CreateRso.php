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
		
		$email1 = mysqli_real_escape_string($conn, $inData["email1"]);
        $email2 = mysqli_real_escape_string($conn, $inData["email2"]);
        $email3 = mysqli_real_escape_string($conn, $inData["email3"]);
        $email4 = mysqli_real_escape_string($conn, $inData["email4"]);
        $admin_email = mysqli_real_escape_string($conn, $inData["admin_email"]);
		$emails = array($admin_email, $email1, $email2, $email3, $email4);
        $name = mysqli_real_escape_string($conn, $inData["name"]);
        $temp_domain = substr($admin_email, strpos($admin_email, '@') + 1, strlen($admin_email));
		$university_name = '';
		try
        {
			$len = count($emails);
			$stmt = $conn->prepare("SELECT * FROM RSO WHERE name = ?");
			$stmt->bind_param("s", $name);
			if(!$stmt->execute())
            {
				throw new Exception($stmt->error);
			}
			else
			{
				$result = $stmt->get_result();
				if ($result->num_rows != 0)
				{
					returnWithError("RSO already exists with that name");
					return;
				}
			}
			for ($i = 0; $i < $len; $i += 1)
			{
				$stmt = $conn->prepare("SELECT * FROM Users WHERE email = ?");
				$stmt->bind_param("s", $emails[$i]);
				if(!$stmt->execute())
				{
					throw new Exception($stmt->error);
				}
				else
				{
					$result = $stmt->get_result();
					if ($result->num_rows == 0)
					{
						throw new Exception('No student exists with email ' . $emails[$i]);
						$stmt->close();
						$conn->close();
						return;
					}
					$row = $result->fetch_assoc();
					if ($row['university'] != $temp_domain)
					{
						throw new Exception('Students in the RSO must be from the same university');
						return;
					}
					$temp_domain = $row['university'];
				}
			}
			$university_name = $row['university_name'];
            $stmt = $conn->prepare("INSERT INTO RSO (admin_id, name, university, university_name, active) VALUES (?, ?, ?, ?, TRUE)");
			$stmt->bind_param("ssss", $admin_email, $name, $temp_domain, $university_name);
			if(!$stmt->execute())
            {
				throw new Exception($stmt->error);
			}

			$stmt = $conn->prepare("UPDATE Users SET role = 'admin' WHERE email = ?");
			$stmt->bind_param("s", $admin_email);
			if(!$stmt->execute())
            {
				throw new Exception($stmt->error);
			}
			
			for ($i = 0; $i < $len; $i += 1)
			{
				$stmt = $conn->prepare("INSERT INTO Student_RSOS (rso_name, student_id) VALUES (?, ?)");
				$stmt->bind_param("ss", $name, $emails[$i]);
				if(!$stmt->execute())
            	{
					throw new Exception($stmt->error);
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
