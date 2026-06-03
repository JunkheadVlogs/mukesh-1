<?php
/**
 * Mukesh Saree Centre - Razorpay Payment Verification API
 * File: verify_payment.php
 * Path: public_html/verify_payment.php
 */

// 1. Enable secure, restricted CORS headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

// Handle OPTIONS preflight requests gracefully
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// 2. Razorpay API Credentials (LIVE Secret for signature verification)
$key_secret = "gswtW1QzFFe7fxP1YJ0EhqRG";

// 3. Read raw post input
$raw_input = file_get_contents("php://input");
$data = json_decode($raw_input, true);

if (!$data) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "error" => "Malformed or empty verification request. Ensure 'Content-Type: application/json' is sent."
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
        "error" => "Incomplete verification parameters. Order ID, Payment ID and Signature token must be supplied."
    ]);
    exit();
}

// 5. Compute the hash signature (Standard Razorpay Web SDK verification payload format)
$payload = $razorpay_order_id . "|" . $razorpay_payment_id;
$generated_signature = hash_hmac("sha256", $payload, $key_secret);

// 6. Security comparison using timing-attack safe comparison (hash_equals)
if (hash_equals($generated_signature, $razorpay_signature)) {
    // Payment verified successfully
    // OPTIONAL: Integrate your order processing logic here (like sending to Google Sheets or emailing)
    
    echo json_encode([
        "success" => true,
        "message" => "Payment verified successfully. Transaction completed."
    ]);
} else {
    // Verification Failed
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "error" => "Signature mismatch detection. Payment verification failed or was tampered."
    ]);
}
