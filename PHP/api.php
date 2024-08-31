<?php
require 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['query'])) {
    $query = $_GET['query'];

    $stmt = $pdo->prepare("SELECT * FROM bots WHERE name LIKE ?");
    $stmt->execute(["%$query%"]);

    $bots = $stmt->fetchAll(PDO::FETCH_ASSOC);

    header('Content-Type: application/json');
    echo json_encode($bots);
}
?>
