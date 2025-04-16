<?php
// insert_test.php

// ---- CORS & preflight handling ----
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  // Preflight request; no body
  exit;
}
header('Content-Type: application/json');

// Only accept POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['error' => 'Method not allowed']);
  exit;
}

// Read incoming JSON
$payload = file_get_contents('php://input');
$data    = json_decode($payload, true);
if (!is_array($data)) {
  http_response_code(400);
  echo json_encode(['error' => 'Invalid JSON']);
  exit;
}

// --- Database credentials ---
$host   = 'localhost';
$user   = 'u920644983_lgwmp';
$pass   = 'Vgvs@2025';
$dbname = 'u920644983_dDBVk';

// Connect to MySQL
$mysqli = new mysqli($host, $user, $pass, $dbname);
if ($mysqli->connect_error) {
  http_response_code(500);
  echo json_encode(['error' => 'DB connection failed: '.$mysqli->connect_error]);
  exit;
}

// Prepare INSERT
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

// Bind parameters (types: s=string, i=int, d=double)
$stmt->bind_param(
  'sssssisisissssssd d',
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

// Execute and return JSON result
if ($stmt->execute()) {
  echo json_encode([
    'success'   => true,
    'insert_id' => $stmt->insert_id
  ]);
} else {
  http_response_code(500);
  echo json_encode(['error' => 'Insert failed: '.$stmt->error]);
}

$stmt->close();
$mysqli->close();
