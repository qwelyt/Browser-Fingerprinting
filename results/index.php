<!DOCTYPE html>
<html>
	<head>
		<title>
			Browser fingerprinting with HTML5
		</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<link rel="stylesheet" type="text/css" href="../style.css">
	</head>
	<body>
	<?php
	// Create connection
	$mysqli = new mysqli($host, $user, $pass, $database);

	// gent = (nrInGroup / sampleSize) * log2(nrInGroup/sampleSize)


	// Arial 18pt
	$nr = $mysqli->prepare("SELECT COUNT(`arial18pt`) AS number FROM `testdata` WHERE 1=1");
	$nr->execute();
	$result = $nr->get_result();
	$number = $result->fetch_array(MYSQLI_NUM)[0];
	
	
	//$info = $mysqli->prepare("SELECT COUNT(*) AS number FROM `testdata` WHERE 1 = ?");
	$info = $mysqli->prepare("SELECT `arial18pt`, COUNT(*) AS nrInGroup FROM `testdata` WHERE 1 = 1 GROUP BY arial18pt ORDER BY nrInGroup DESC");
	$info->execute();
	$result = $info->get_result();
	$ent18 = 0;
	while($row = $result->fetch_array(MYSQLI_ASSOC)){
//		echo "Arial18pt: ";
//		echo $row['nrInGroup'];
		//		echo "<br>";
		$nrInGroup = $row['nrInGroup'];
		$gent = -(($nrInGroup / $number) * log(($nrInGroup / $number), 2));
		$ent18 += $gent;
//		echo $gent;
//		echo "<br>";
	}
//	echo "Entropy for Arial: " . $ent18 . "<br>";



	// Arial 20px
	$nr = $mysqli->prepare("SELECT COUNT(`arial20px`) AS number FROM `testdata` WHERE 1=1");
	$nr->execute();
	$result = $nr->get_result();
	$number = $result->fetch_array(MYSQLI_NUM)[0];

	
	$info = $mysqli->prepare("SELECT `arial20px`, COUNT(*) AS nrInGroup FROM `testdata` WHERE 1 = 1 GROUP BY arial20px ORDER BY nrInGroup DESC");
	$info->execute();
	$result = $info->get_result();
	$ent20 = 0;
	while($row = $result->fetch_array(MYSQLI_ASSOC)){
		$nrInGroup = $row['nrInGroup'];
		$gent = -(($nrInGroup / $number) * log(($nrInGroup / $number), 2));
		$ent20 += $gent;
	}
//	echo "Entropy for Arial Px: " . $ent20 . "<br>";

	// Webfont 12pt
	$nr = $mysqli->prepare("SELECT COUNT(`webfont12pt`) AS number FROM `testdata` WHERE 1=1");
	$nr->execute();
	$result = $nr->get_result();
	$number = $result->fetch_array(MYSQLI_NUM)[0];

	
	$info = $mysqli->prepare("SELECT `webfont12pt`, COUNT(*) AS nrInGroup FROM `testdata` WHERE 1 = 1 GROUP BY webfont12pt ORDER BY nrInGroup DESC");
	$info->execute();
	$result = $info->get_result();
	$ent12 = 0;
	while($row = $result->fetch_array(MYSQLI_ASSOC)){
		$nrInGroup = $row['nrInGroup'];
		$gent = -(($nrInGroup / $number) * log(($nrInGroup / $number), 2));
		$ent12 += $gent;
	}
//	echo "Entropy for WebFont: " . $ent12 . "<br>";


	// Webfont 15px
	$nr = $mysqli->prepare("SELECT COUNT(`webfont15px`) AS number FROM `testdata` WHERE 1=1");
	$nr->execute();
	$result = $nr->get_result();
	$number = $result->fetch_array(MYSQLI_NUM)[0];

	
	$info = $mysqli->prepare("SELECT `webfont15px`, COUNT(*) AS nrInGroup FROM `testdata` WHERE 1 = 1 GROUP BY webfont15px ORDER BY nrInGroup DESC");
	$info->execute();
	$result = $info->get_result();
	$ent15 = 0;
	while($row = $result->fetch_array(MYSQLI_ASSOC)){
		$nrInGroup = $row['nrInGroup'];
		$gent = -(($nrInGroup / $number) * log(($nrInGroup / $number), 2));
		$ent15 += $gent;
	}
//	echo "Entropy for WebFont Px: " . $ent15 . "<br>";


	// Nonsense
	$nr = $mysqli->prepare("SELECT COUNT(`userDefault`) AS number FROM `testdata` WHERE 1=1");
	$nr->execute();
	$result = $nr->get_result();
	$number = $result->fetch_array(MYSQLI_NUM)[0];

	
	$info = $mysqli->prepare("SELECT `userDefault`, COUNT(*) AS nrInGroup FROM `testdata` WHERE 1 = 1 GROUP BY userDefault ORDER BY nrInGroup DESC");
	$info->execute();
	$result = $info->get_result();
	$entNo = 0;
	while($row = $result->fetch_array(MYSQLI_ASSOC)){
		$nrInGroup = $row['nrInGroup'];
		$gent = -(($nrInGroup / $number) * log(($nrInGroup / $number), 2));
		$entNo += $gent;
	}


	// WebGL
	$nr = $mysqli->prepare("SELECT COUNT(`webgl`) AS number FROM `testdata` WHERE 1=1");
	$nr->execute();
	$result = $nr->get_result();
	$number = $result->fetch_array(MYSQLI_NUM)[0];

	
	$info = $mysqli->prepare("SELECT `webgl`, COUNT(*) AS nrInGroup FROM `testdata` WHERE 1 = 1 GROUP BY webgl ORDER BY nrInGroup DESC");
	$info->execute();
	$result = $info->get_result();
	$entgl = 0;
	while($row = $result->fetch_array(MYSQLI_ASSOC)){
		$nrInGroup = $row['nrInGroup'];
		$gent = -(($nrInGroup / $number) * log(($nrInGroup / $number), 2));
		$entgl += $gent;
	}
//	echo "Entropy for WebGL: " . $entgl . "<br>";




	// Total entropy for all tests
	$nr = $mysqli->prepare("SELECT COUNT(*) AS number FROM `testdata` WHERE 1=1");
	$nr->execute();
	$result = $nr->get_result();
	$number = $result->fetch_array(MYSQLI_NUM)[0];

	$all = $mysqli->prepare("SELECT `arial18pt` , `arial20px` , `webfont12pt` , `webfont15px` , `userDefault` , `webgl`,
				COUNT(*) AS nrInGroup
				FROM `testdata`
				WHERE 1=1
				GROUP BY arial18pt , arial20px , webfont12pt , webfont15px , userDefault , webgl 
				ORDER BY nrInGroup DESC");
	$all->execute();
	$result = $all->get_result();
	$entAll = 0;
	while($row = $result->fetch_array(MYSQLI_ASSOC)){
		$nrInGroup = $row['nrInGroup'];
		//echo $nrInGroup . "<br>";
		$gent = -(($nrInGroup / $number) * log(($nrInGroup / $number), 2));
		$entAll += $gent;
	}
//	echo "Possible entropy for all the tests: " . $entAll;

	?>

<table>
	<thead>
		<th>Test</th>
		<th>Entropy</th>
	</thead>
	<tbody>
		<tr>
			<td><b>Arial</b></td>
			<td><?php echo $ent18; ?></td>
		</tr>
		<tr>
			<td><b>Arial Px</b></td>
			<td><?php echo $ent20; ?></td>
		</tr>
		<tr>
			<td><b>Webfont</b></td>
			<td><?php echo $ent12; ?></td>
		</tr>
		<tr>
			<td><b>Webfont Px</b></td>
			<td><?php echo $ent15; ?></td>
		</tr>
		<tr>
			<td><b>Nonsense</b></td>
			<td><?php echo $entNo; ?></td>
		</tr>
		<tr>
			<td><b>WebGL</b></td>
			<td><?php echo $entgl; ?></td>
		</tr>
	</tbody>
	<tfoot>
		<tr>
			<td><b><i>All test</i></b></td>
			<td><?php echo $entAll; ?></td>
		</tr>
	</tfoot>
					</table>

	

	<?php /*
	$info = $mysqli->prepare("SELECT `userAgent`, COUNT(*) AS nrInGroup FROM `testdata` WHERE 1 = 1 GROUP BY userAgent ORDER BY nrInGroup DESC");
	$info->execute();
	$result = $info->get_result();
	while($row = $result->fetch_array(MYSQLI_ASSOC)){
		echo $row['nrInGroup'];
		echo " ------- ";
		echo $row['userAgent'];
		echo "<br>";
	}
	 */
// Close the connection
$mysqli->close();
	?>
	</body>
</html>
