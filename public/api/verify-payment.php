<?php
/**
 * Mukesh Saree Centre - Razorpay Payment Verification API Endpoint (Standard Clean Path)
 * File: verify-payment.php
 * Path: public/api/verify-payment.php
 */

// 1. Include the API credentials config file
require_once __DIR__ . '/config.php';

// Check if credentials are defined
if (!defined('RAZORPAY_KEY_SECRET')) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => "Razorpay Key Secret constant is not configured."
    ]);
    exit();
}

// 2. Enable standard secure CORS headers
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
        "error" => "Malformed or empty verification payload. Ensure 'Content-Type: application/json' is sent."
    ]);
    exit();
}

$razorpay_order_id = isset($data['razorpay_order_id']) ? trim($data['razorpay_order_id']) : '';
$razorpay_payment_id = isset($data['razorpay_payment_id']) ? trim($data['razorpay_payment_id']) : '';
$razorpay_signature = isset($data['razorpay_signature']) ? trim($data['razorpay_signature']) : '';

// 4. Validate parameters presence
if (empty($razorpay_order_id) || empty($razorpay_payment_id) || empty($razorpay_signature)) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "error" => "Incomplete verification parameters. Order ID, Payment ID, and Signature token must be supplied."
    ]);
    exit();
}

// 5. Compute the hash signature (Standard Razorpay HMAC verification)
$payload = $razorpay_order_id . "|" . $razorpay_payment_id;
$generated_signature = hash_hmac("sha256", $payload, RAZORPAY_KEY_SECRET);

// 6. Security comparison using timing-attack safe comparison (hash_equals)
if (hash_equals($generated_signature, $razorpay_signature)) {
    // Payment verified successfully!
    echo json_encode([
        "success" => true,
        "message" => "Payment verified successfully. Transaction completed."
    ]);
} else {
    // Cryptographic validation failed
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "error" => "Signature mismatch detection. Payment verification failed or has been tampered."
    ]);
}
?>
