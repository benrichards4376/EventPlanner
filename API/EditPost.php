<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$conn = new mysqli("localhost", "SigmaUser", "ILoveFullStackProjects", "COP4710");

if ($conn->connect_error) {
    returnWithError($conn->connect_error);
} else {
    $inData = getRequestInfo();
    $post_id = mysqli_real_escape_string($conn, $inData["post_id"]);
    $comment = mysqli_real_escape_string($conn, $inData["comment"]);
    $rating = mysqli_real_escape_string($conn, $inData["rating"]);
    $currentDateTime = new DateTime();
    $date = $currentDateTime->format('Y-m-d H:i:s');

    try {
        $stmt = $conn->prepare("SELECT * FROM Posts WHERE post_id = ?");
        $stmt->bind_param("i", $post_id);
        if (!$stmt->execute()) {
            throw new Exception($stmt->error);
        }
        $stmt->free_result();
        $stmt = $conn->prepare("UPDATE Posts SET comment = ?, rating = ?, date = ? WHERE post_id = ?");
        $stmt->bind_param("sisi", $comment, $rating, $date, $post_id);
        if (!$stmt->execute()) {
            throw new Exception($stmt->error);
        }

        $stmt->close();

        // Retrieve the updated comment from the database and remove any backslashes
        $stmt = $conn->prepare("SELECT comment FROM Posts WHERE post_id = ?");
        $stmt->bind_param("i", $post_id);
        if (!$stmt->execute()) {
            throw new Exception($stmt->error);
        }
        $stmt->bind_result($comment);
        $stmt->fetch();
        $stmt->close();
        $conn->close();

        // Remove any backslashes added by mysqli_real_escape_string

        returnWithError("");
    } catch (Exception $e) {
        returnWithError($e->getMessage());
    }
}

function getRequestInfo()
{
    return json_decode(stripslashes(file_get_contents('php://input')), true);
}

function sendResultInfoAsJson($obj)
{
    header('Content-type: application/json');
    echo $obj;
}

function returnWithError($err)
{
    $retValue = '{"error":"' . $err . '"}';
    sendResultInfoAsJson($retValue);
}

?>
