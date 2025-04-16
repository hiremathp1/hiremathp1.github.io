<?php
// insert_test.php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // only needed if your HTML is on a different origin

// Only allow POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['error' => 'Method not allowed']);
  exit;
}

// Read and decode incoming JSON
$payload = file_get_contents('php://input');
$data = json_decode($payload, true);
if (!is_array($data)) {
  http_response_code(400);
  echo json_encode(['error' => 'Invalid JSON']);
  exit;
}

// Database credentials
$host     = 'your_mysql_host';      // e.g. 'localhost'
$user     = 'u920644983_lgwmp';
$pass     = 'Vgvs@2025';
$dbname   = 'u920644983_dDBVk';

// Connect
$mysqli = new mysqli($host, $user, $pass, $dbname);
if ($mysqli->connect_error) {
  http_response_code(500);
  echo json_encode(['error' => 'DB connection failed: '.$mysqli->connect_error]);
  exit;
}

// Prepare insert (only the columns you sent in testData)
$stmt = $mysqli->prepare("
  INSERT INTO `vgvssurvey` (
    `survey_date`,`teacher_name`,`serial_number`,`parent_name`,
    `child_name1`,`child_age1`,`child_name2`,`child_age2`,`child_name3`,`child_age3`,
    `mobile_number`,`home_address`,`notes`,`family_income`,`anualIncome`,
    `home_image_url`,`latitude`,`longitude`
  ) VALUES (
    ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?
  )
");
if (!$stmt) {
  http_response_code(500);
  echo json_encode(['error' => 'Prepare failed: '.$mysqli->error]);
  exit;
}

// Bind parameters in the correct order
$stmt->bind_param(
  'sssssisisiissssidd',
  $data['survey_date'],
  $data['teacher_name'],
  $data['serial_number'],
  $data['parent_name'],
  $data['child_name1'],
  $data['child_age1'],
  $data['child_name2'],
  $data['child_age2'],
  $data['child_name3'],
  $data['child_age3'],
  $data['mobile_number'],
  $data['home_address'],
  $data['notes'],
  $data['family_income'],
  $data['anualIncome'],
  $data['home_image_url'],
  $data['latitude'],
  $data['longitude']
);

// Execute
if ($stmt->execute()) {
  echo json_encode([
    'success' => true,
    'insert_id' => $stmt->insert_id
  ]);
} else {
  http_response_code(500);
  echo json_encode(['error' => 'Insert failed: '.$stmt->error]);
}

$stmt->close();
$mysqli->close();
