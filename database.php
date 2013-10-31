<?php
// Create connection
$mysqli = new mysqli($host, $user, $pass, $database);


$arial18pt = $_POST['arial18pt'];
$arial20px = $_POST['arial20px'];
$webfont12pt = $_POST['webfont12pt'];
$webfont15px = $_POST['webfont15px'];
$userDefault = $_POST['userDefault'];
$webgl = $_POST['webgl'];
$userAgent = $_SERVER['HTTP_USER_AGENT'];

// First, check if we have stored a cookie on the users computer.
// If we have, we don't want the to put any data in the database.
if(!isset($_COOKIE['canvasTests'])){
	// Prepare for an insert
	$stmt = $mysqli->prepare("INSERT INTO `testdata`(`arial18pt` , `arial20px` , `webfont12pt` , `webfont15px` , `userDefault` , `webgl` , `userAgent`)
		VALUES (?, ?, ?, ?, ?, ?, ?)
		");
	// Define what our input values are
	$stmt->bind_param('sssssss', $arial18pt, $arial20px, $webfont12pt, $webfont15px, $userDefault, $webgl, $userAgent);
	// Execute the query.
	$stmt->execute();

	// Set a cookie so the user can't submit their data again (which would mess up our calculations for entropy)
	setCookie("canvasTests", "You've done the test. Do NOT remove this!", time()+60*60*24*30, "/");
}


// Create an empty string
// We will then populate the string so we can send it back to the user.
$str = "";


// Get total number of entries
$i = 1;
$info = $mysqli->prepare("SELECT COUNT(*) AS number FROM `testdata` WHERE 1 = ?");
$info->bind_param('i', $i);
$info->execute();
$result = $info->get_result();
while($row = $result->fetch_array(MYSQLI_ASSOC)){
	$str .= $row['number'];
	$str .= ",";
}

// Get how many that match on the first test
$info = $mysqli->prepare("SELECT COUNT(*) AS number FROM `testdata` WHERE `arial18pt` = ?");
$info->bind_param('s', $arial18pt);
$info->execute();
$result = $info->get_result();
while($row = $result->fetch_array(MYSQLI_ASSOC)){
	$str .= $row['number'];
	$str .= ",";
}

// Get how many that match on the second test
$info = $mysqli->prepare("SELECT COUNT(*) AS number FROM `testdata` WHERE `arial20px` = ?");
$info->bind_param('s', $arial20px);
$info->execute();
$result = $info->get_result();
while($row = $result->fetch_array(MYSQLI_ASSOC)){
	$str .= $row['number'];
	$str .= ",";
}

// Get how many that match on the third test
$info = $mysqli->prepare("SELECT COUNT(*) AS number FROM `testdata` WHERE `webfont12pt` = ?");
$info->bind_param('s', $webfont12pt);
$info->execute();
$result = $info->get_result();
while($row = $result->fetch_array(MYSQLI_ASSOC)){
	$str .= $row['number'];
	$str .= ",";
}

// Get how many that match on the forth test
$info = $mysqli->prepare("SELECT COUNT(*) AS number FROM `testdata` WHERE `webfont15px` = ?");
$info->bind_param('s', $webfont15px);
$info->execute();
$result = $info->get_result();
while($row = $result->fetch_array(MYSQLI_ASSOC)){
	$str .= $row['number'];
	$str .= ",";
}

// Get how many that match on the fifth test
$info = $mysqli->prepare("SELECT COUNT(*) AS number FROM `testdata` WHERE `userDefault` = ?");
$info->bind_param('s', $userDefault);
$info->execute();
$result = $info->get_result();
while($row = $result->fetch_array(MYSQLI_ASSOC)){
	$str .= $row['number'];
	$str .= ",";
}

// Get how many that match on the sixth test
$info = $mysqli->prepare("SELECT COUNT(*) AS number FROM `testdata` WHERE `webgl` = ?");
$info->bind_param('s', $webgl);
$info->execute();
$result = $info->get_result();
while($row = $result->fetch_array(MYSQLI_ASSOC)){
	$str .= $row['number'];
	$str .= ",";
}

// clean up
$result->close();
$info->close();

// Get value for all the fields
$all = $mysqli->prepare("SELECT COUNT(*) AS number 
			 FROM `testdata` 
			 WHERE `arial18pt` = ? AND `arial20px` = ? AND `webfont12pt` = ? AND `webfont15px` = ? AND `userDefault` = ? AND `webgl` = ?");
$all->bind_param('ssssss', $arial18pt, $arial20px, $webfont12pt, $webfont15px, $userDefault, $webgl);
$all->execute();
$resultAll = $all->get_result();
while($row = $resultAll->fetch_array(MYSQLI_ASSOC)){
	$str .= $row['number'];
	$str .= ",";
}
$resultAll->free();
$all->close();

// Print our results
echo $str;

// Close the connection
$mysqli->close();
?>
