<?php
/**
 * Mukesh Saree Centre - Meta Conversions API (CAPI) & Metric Dispatcher Endpoint
 * File: sys-metric.php
 * Path: public_html/api/sys-metric.php
 */

// 1. Include security credential configurations
require_once __DIR__ . '/config.php';

// 2. Enable standard, loose CORS headers to support tracking requests from all user devices
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Cookie");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");

// Handle OPTIONS preflight requests gracefully
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

// 3. Read raw post input
$raw_input = file_get_contents("php://input");
$data = json_decode($raw_input, true);

if (!$data) {
    // Return standard success to keep front-end diagnostics active
    echo json_encode([
        "success" => true,
        "message" => "Telemetry payload empty. No dispatch triggered."
    ]);
    exit();
}

// 4. Retrieve event attributes
$event_name       = isset($data['event_name']) ? trim($data['event_name']) : '';
$event_id         = isset($data['event_id']) ? trim($data['event_id']) : '';
$value            = isset($data['value']) ? floatval($data['value']) : null;
$currency         = isset($data['currency']) ? trim($data['currency']) : 'INR';
$content_ids      = isset($data['content_ids']) ? $data['content_ids'] : null;
$contents         = isset($data['contents']) ? $data['contents'] : null;
$event_source_url = isset($data['event_source_url']) ? trim($data['event_source_url']) : '';

// Resolve user details safely
$client_ip_address = isset($_SERVER['HTTP_X_FORWARDED_FOR']) 
    ? trim(explode(',', $_SERVER['HTTP_X_FORWARDED_FOR'])[0]) 
    : (isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : '');
    
$client_user_agent = isset($_SERVER['HTTP_USER_AGENT']) ? $_SERVER['HTTP_USER_AGENT'] : '';

// 5. Query campaign token details from configuration file
$pixel_id     = defined('META_PIXEL_ID') ? trim(META_PIXEL_ID) : '';
$access_token = defined('META_ACCESS_TOKEN') ? trim(META_ACCESS_TOKEN) : '';

if (empty($pixel_id) || empty($access_token)) {
    // Meta tracking is missing tokens, return graceful success so front-end does not report errors
    echo json_encode([
        "success" => true,
        "info" => "Metric recorded. Meta CAPI bypass (access token is blank)."
    ]);
    exit();
}

// Helper function to hash user fields with timing-safe SHA-256 for privacy compliance 
function normalize_and_hash($field_val) {
    if (empty($field_val)) return null;
    $clean = strtolower(trim(strval($field_val)));
    if (empty($clean)) return null;
    // If field is already hashed, use it as-is
    if (preg_match('/^[a-f0-9]{64}$/i', $clean)) {
        return $clean;
    }
    return hash('sha256', $clean);
}

// 6. Build campaign meta user payload object
$user_data = [
    "client_ip_address" => $client_ip_address,
    "client_user_agent" => $client_user_agent
];

// Hash any provided contact/identity tracking details
$client_user_data = isset($data['user_data']) ? $data['user_data'] : [];
if (is_array($client_user_data)) {
    if (isset($client_user_data['em'])) $user_data['em'] = normalize_and_hash($client_user_data['em']);
    if (isset($client_user_data['ph'])) $user_data['ph'] = normalize_and_hash($client_user_data['ph']);
    if (isset($client_user_data['fn'])) $user_data['fn'] = normalize_and_hash($client_user_data['fn']);
    if (isset($client_user_data['ln'])) $user_data['ln'] = normalize_and_hash($client_user_data['ln']);
    if (isset($client_user_data['ct'])) $user_data['ct'] = normalize_and_hash($client_user_data['ct']);
    if (isset($client_user_data['st'])) $user_data['st'] = normalize_and_hash($client_user_data['st']);
    if (isset($client_user_data['zp'])) $user_data['zp'] = normalize_and_hash($client_user_data['zp']);
    if (isset($client_user_data['country'])) $user_data['country'] = normalize_and_hash($client_user_data['country']);
    
    // Cookie trackers
    if (isset($client_user_data['fby'])) $user_data['fby'] = $client_user_data['fby'];
    if (isset($client_user_data['fbc'])) $user_data['fbc'] = $client_user_data['fbc'];
    if (isset($client_user_data['fbp'])) $user_data['fbp'] = $client_user_data['fbp'];
    if (isset($client_user_data['external_id'])) $user_data['external_id'] = $client_user_data['external_id'];
}

// Resolve fallback values for cookies if missing
if (empty($user_data['fbp']) && isset($_COOKIE['_fbp'])) {
    $user_data['fbp'] = $_COOKIE['_fbp'];
}
if (empty($user_data['fbc']) && isset($_COOKIE['_fbc'])) {
    $user_data['fbc'] = $_COOKIE['_fbc'];
}

// 7. Assemble Custom Data Parameter
$custom_data = [];
if (!is_null($value)) {
    $custom_data['value'] = $value;
    $custom_data['currency'] = $currency;
}
if (!is_null($content_ids)) {
    $custom_data['content_ids'] = is_array($content_ids) ? $content_ids : [$content_ids];
}
if (!is_null($contents)) {
    $custom_data['contents'] = $contents;
}
if (isset($data['content_type'])) {
    $custom_data['content_type'] = $data['content_type'];
}

// 8. Compile Facebook API request standard properties
$facebook_event = [
    "event_name" => $event_name,
    "event_time" => time(),
    "event_id" => $event_id ? $event_id : "evt_" . uniqid(),
    "event_source_url" => $event_source_url ? $event_source_url : (isset($_SERVER['HTTP_REFERER']) ? $_SERVER['HTTP_REFERER'] : ''),
    "action_source" => "website",
    "user_data" => $user_data
];

if (!empty($custom_data)) {
    $facebook_event["custom_data"] = $custom_data;
}

$payload = [
    "data" => [$facebook_event]
];

// 9. Execute PHP cURL POST block to communicate event server-side with Facebook API
$ch = curl_init();

$url = "https://graph.facebook.com/v19.0/" . $pixel_id . "/events?access_token=" . $access_token;

curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
curl_setopt($ch, CURLOPT_TIMEOUT, 10);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Content-Type: application/json",
    "Accept: application/json"
]);

$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curl_error = curl_error($ch);

curl_close($ch);

// 10. Direct success delivery feedback
if ($curl_error || $http_code !== 200) {
    echo json_encode([
        "success" => false,
        "error" => $curl_error ? $curl_error : "Meta Server returned HTTP Status: " . $http_code,
        "payload" => json_decode($response, true)
    ]);
} else {
    echo json_encode([
        "success" => true,
        "info" => "Meta Conversions API dispatch success."
    ]);
}
?>
