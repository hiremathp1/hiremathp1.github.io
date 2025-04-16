<?php
header('Content-Type: application/json');
$input = json_decode(file_get_contents('php://input'), true);

$mysqli = new mysqli(
    'localhost',        // or your host
    'u920644983_lgwmp',
    'Vgvs@2025',
    'u920644983_dDBVk'
);
if ($mysqli->connect_errno) {
    echo json_encode(['error' => 'Connect failed: '.$mysqli->connect_error]);
    exit;
}

$stmt = $mysqli->prepare("
  INSERT INTO vgvssurvey
    (survey_date, teacher_name, serial_number,
     parent_name, child_name1, child_age1,
     child_name2, child_age2, child_name3, child_age3,
     mobile_number, home_address, notes,
     family_income, anualIncome, home_image_url,
     latitude, longitude)
  VALUES
    (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
");
$stmt->bind_param(
  'sssssiiissi sssd d',   // types: s=string, i=int, d=double
  $input['survey_date'],
  $input['teacher_name'],
  $input['serial_number'],
  $input['parent_name'],
  $input['child_name1'],
  $input['child_age1'],
  $input['child_name2'],
  $input['child_age2'],
  $input['child_name3'],
  $input['child_age3'],
  $input['mobile_number'],
  $input['home_address'],
  $input['notes'],
  $input['family_income'],
  $input['anualIncome'],
  $input['home_image_url'],
  $input['latitude'],
  $input['longitude']
);

if ($stmt->execute()) {
    echo json_encode([
      'success' => true,
      'insert_id' => $stmt->insert_id
    ]);
} else {
    echo json_encode([
      'error' => 'Insert failed: '.$stmt->error
    ]);
}

$stmt->close();
$mysqli->close();
