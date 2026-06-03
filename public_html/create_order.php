<?php
/**
 * Mukesh Saree Centre - Razorpay Order Creation API
 * File: create_order.php
 * Path: public_html/create_order.php
 */

// 1. Enable secure, restricted CORS headers for frontend interaction
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

// Handle OPTIONS preflight requests gracefully
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// 2. Razorpay API Credentials (LIVE Key Pair)
$key_id = "rzp_live_Sw0OjZoidQe04p";
$key_secret = "gswtW1QzFFe7fxP1YJ0EhqRG";

// 3. Read raw post input
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

// Double-checks that paise conversion is rounded correctly
$amount_paise = round($amount_rupees * 100);

// Extract optional notes
$notes = isset($data['notes']) ? $data['notes'] : [];
if (!is_array($notes)) {
    $notes = ["raw_notes" => strval($notes)];
}

// Attach default branding metadata to notes
$notes['source'] = 'Mukesh Saree Centre PHP Website';

// 5. Prepare Razorpay Orders API Payload
$payload = [
    "amount" => $amount_paise,
    "currency" => "INR",
    "receipt" => "rcpt_" . time() . "_" . rand(1000, 9999),
    "notes" => $notes
];

// 6. Use robust cURL to connect to Razorpay (handles file_get_contents restriction on Hostinger)
$ch = curl_init();

curl_setopt($ch, CURLOPT_URL, "https://api.razorpay.com/v1/orders");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
curl_setopt($ch, CURLOPT_USERPWD, $key_id . ":" . $key_secret);
curl_setopt($ch, CURLOPT_TIMEOUT, 30);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Content-Type: application/json",
    "Accept: application/json"
]);

$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curl_error = curl_error($ch);

curl_close($ch);

// 7. Process API Response
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
    // Standard successful Order created
    echo json_encode([
        "success" => true,
        "order_id" => $decoded_response['id'],
        "amount" => $amount_paise,
        "currency" => "INR",
        "key" => $key_id
    ]);
} else {
    // Razorpay returned an error response
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
