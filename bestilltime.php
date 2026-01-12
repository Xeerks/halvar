<?php
declare(strict_types=1);

$DB_HOST = '127.0.0.1';
$DB_NAME = 'skolehelse';
$DB_USER = 'skolehelse_user';
$DB_PASS = 'dawid12321';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  exit;
}

$name  = trim($_POST['name'] ?? '');
$class = trim($_POST['class_name'] ?? '');
$email = trim($_POST['email'] ?? '');
$date  = trim($_POST['requested_date'] ?? '');
$topic = trim($_POST['topic'] ?? '');
$message = trim($_POST['message'] ?? '');

$allowedTopics = ['Psykisk helse','Fysisk helse','Seksualitet','Annet'];
$errors = [];

if ($name === '' || mb_strlen($name) > 120) $errors[] = 1;
if ($class === '' || mb_strlen($class) > 30) $errors[] = 1;
if (!filter_var($email, FILTER_VALIDATE_EMAIL) || mb_strlen($email) > 190) $errors[] = 1;

$dt = DateTime::createFromFormat('Y-m-d', $date);
if (!$dt || $dt->format('Y-m-d') !== $date) $errors[] = 1;

if (!in_array($topic, $allowedTopics, true)) $errors[] = 1;

$message = ($message === '') ? null : $message;

if ($errors) {
  http_response_code(400);
  exit;
}

$dsn = "mysql:host=$DB_HOST;dbname=$DB_NAME;charset=utf8mb4";
$options = [
  PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
  PDO::ATTR_EMULATE_PREPARES => false,
];

$pdo = new PDO($dsn, $DB_USER, $DB_PASS, $options);

$sql = "INSERT INTO appointments (name, class_name, email, requested_date, topic, message)
        VALUES (:name, :class_name, :email, :requested_date, :topic, :message)";

$stmt = $pdo->prepare($sql);
$stmt->execute([
  ':name' => $name,
  ':class_name' => $class,
  ':email' => $email,
  ':requested_date' => $date,
  ':topic' => $topic,
  ':message' => $message
]);

header('Location: bestill.html?sent=1');
exit;
