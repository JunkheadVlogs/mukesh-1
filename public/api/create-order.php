<?php
/**
 * Mukesh Saree Centre - Razorpay Order Creation API Endpoint (Standard Clean Path)
 * File: create-order.php
 * Path: public/api/create-order.php
 */

// 1. Include the API credentials config file
require_once __DIR__ . '/config.php';

// Check if credentials are defined
if (!defined('RAZORPAY_KEY_ID') || !defined('RAZORPAY_KEY_SECRET')) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => "Razorpay API configuration constants are missing in config."
    ]);
    exit();
}

// 2. Enable standard CORS headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

// Handle OPTIONS preflight request gracefully
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Ensure the request method is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        "success" => false,
        "error" => "Request method not allowed. Use POST."
    ]);
    exit();
}

// 3. Read and decode raw JSON request body
$raw_input = file_get_contents("php://input");
$data = json_decode($raw_input, true);

if (!$data) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "error" => "Malformed or empty request payload. Ensure 'Content-Type: application/json' is sent."
    ]);
    exit();
}

// 4. Retrieve amount and convert to Paise (paise = rupees * 100)
$amount_rupees = isset($data['amount']) ? floatval($data['amount']) : 0;

if ($amount_rupees <= 0) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "error" => "Invalid product amount. Amount must be greater than zero."
    ]);
    exit();
}

// Convert rupees to paise safely
$amount_paise = round($amount_rupees * 100);

// Extract options or receipt ID if provided
$receipt = isset($data['receipt']) ? trim($data['receipt']) : ("rcpt_" . time() . "_" . rand(1000, 9999));
$notes = isset($data['notes']) ? $data['notes'] : [];

if (!is_array($notes)) {
    $notes = ["raw_notes" => strval($notes)];
}
$notes['source'] = 'Mukesh Saree Centre Hostinger API';

// 5. Prepare Razorpay Orders API Payload
$payload = [
    "amount" => $amount_paise,
    "currency" => "INR",
    "receipt" => $receipt,
    "notes" => $notes
];

// 6. Execute PHP cURL to construct API order instance
$ch = curl_init();

curl_setopt($ch, CURLOPT_URL, "https://api.razorpay.com/v1/orders");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
curl_setopt($ch, CURLOPT_USERPWD, RAZORPAY_KEY_ID . ":" . RAZORPAY_KEY_SECRET);
curl_setopt($ch, CURLOPT_TIMEOUT, 35);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Content-Type: application/json",
    "Accept: application/json"
]);

$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curl_error = curl_error($ch);

curl_close($ch);

// 7. Render dynamic response back to client
if ($curl_error) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => "cURL failure initiating Razorpay channel: " . $curl_error
    ]);
    exit();
}

$decoded_response = json_decode($response, true);

if ($http_code === 200 && isset($decoded_response['id'])) {
    echo json_encode([
        "success" => true,
        "id" => $decoded_response['id'],
        "orderId" => $decoded_response['id'],
        "order_id" => $decoded_response['id'],
        "amount" => $amount_paise,
        "currency" => "INR",
        "key" => RAZORPAY_KEY_ID
    ]);
} else {
    $error_msg = isset($decoded_response['error']['description']) 
        ? $decoded_response['error']['description'] 
        : "Razorpay order generation returned HTTP status: " . $http_code;
        
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "error" => $error_msg,
        "raw_response" => $decoded_response
    ]);
}
?>
