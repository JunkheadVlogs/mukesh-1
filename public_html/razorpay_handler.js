/**
 * Mukesh Saree Centre - Razorpay standard frontend payment handler
 * File: razorpay_handler.js
 * Path: public_html/razorpay_handler.js
 * 
 * Instructions:
 * 1. Add this script tag inside your HTML pages: 
 *    <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
 *    <script src="/razorpay_handler.js"></script>
 * 
 * 2. Add an elegant error display element in your HTML:
 *    <div id="payment-error-container" style="display: none;"></div>
 * 
 * 3. Bind your "Pay Now" or checkout submit button:
 *    <button id="pay-now-btn" type="button" onclick="startRazorpayCheckout()">Pay Online</button>
 */

/**
 * Initiates the complete Razorpay checkout sequence
 * @param {Object} orderDetails - Object containing product and customer details
 */
async function triggerOnlinePayment(orderDetails) {
    const payBtn = document.getElementById("pay-now-btn");
    
    // Disable double-submissions and show loading state
    if (payBtn) {
        payBtn.disabled = true;
        payBtn.dataset.originalText = payBtn.innerText || payBtn.value;
        setButtonText(payBtn, "Creating Order...");
    }
    
    // Reset any previous checkout failures on the UI
    hidePaymentError();

    try {
        // Step 1: Call Backend to Create Razorpay Order
        const orderResponse = await fetch("/create_order.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                amount: orderDetails.amount, // Input Amount (in Rupees)
                notes: {
                    customer_name: orderDetails.customerName || "Customer",
                    customer_phone: orderDetails.customerPhone || "N/A",
                    product_id: orderDetails.productId || "N/A",
                    product_name: orderDetails.productName || "Product",
                    product_size: orderDetails.productSize || "Standard"
                }
            })
        });

        if (!orderResponse.ok) {
            const errorText = await orderResponse.text();
            let parsedErr;
            try { parsedErr = JSON.parse(errorText); } catch(e) {}
            throw new Error(parsedErr?.error || `Order generation server status: ${orderResponse.status}`);
        }

        const data = await orderResponse.json();
        
        if (!data.success || !data.order_id) {
            throw new Error(data.error || "Server failed to return a valid Razorpay Order ID.");
        }

        if (payBtn) {
            setButtonText(payBtn, "Opening Secure Checkout...");
        }

        // Step 2: Configure Razorpay Checkout Standard Options
        const options = {
            key: data.key, // Dynamically loaded Key ID from your create_order.php (starts with rzp_live_)
            amount: data.amount, // Exact amount returned from server in Paise
            currency: data.currency || "INR",
            name: "Mukesh Saree Centre",
            description: orderDetails.productName || "E-commerce Purchase",
            image: "https://mukeshsarees.com/images/logo.png", // Replace with your actual store logo
            order_id: data.order_id, // Dynamically generated token
            prefill: {
                name: orderDetails.customerName || "",
                email: orderDetails.customerEmail || "",
                contact: orderDetails.customerPhone || ""
            },
            theme: {
                color: "#C8A96E" // Mukesh Saree Centre Signature Gold Accent Dark Mode / Brand color
            },
            handler: async function (response) {
                // This handler initiates ONLY after a secure authorization from Razorpay
                try {
                    if (payBtn) {
                        setButtonText(payBtn, "Verifying Payment Integrity...");
                    }

                    // Step 3: Trigger Signature verification API
                    const verifyResponse = await fetch("/verify_payment.php", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Accept": "application/json"
                        },
                        body: JSON.stringify({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        })
                    });

                    if (!verifyResponse.ok) {
                        const verifyErrText = await verifyResponse.text();
                        let parsedVerifyErr;
                        try { parsedVerifyErr = JSON.parse(verifyErrText); } catch(e) {}
                        throw new Error(parsedVerifyErr?.error || "Signature verification failed on the server side.");
                    }

                    const verificationResult = await verifyResponse.json();

                    if (verificationResult.success) {
                        // Success Redirect! Secure and clean redirection
                        window.location.href = `/thank-you?order_id=${response.razorpay_order_id}&payment_id=${response.razorpay_payment_id}`;
                    } else {
                        throw new Error(verificationResult.error || "Payment signature mismatch.");
                    }

                } catch (verificationError) {
                    showPaymentError("Verification Error: " + verificationError.message);
                    resetPayButton(payBtn);
                }
            },
            modal: {
                ondismiss: function () {
                    // Triggers when user voluntarily exits the popup without paying
                    console.log("Razorpay popup closed by customer.");
                    resetPayButton(payBtn);
                },
                escape: true,
                backdropclose: false
            }
        };

        // Step 4: Open standard checkout window
        const rzp = new Razorpay(options);

        rzp.on("payment.failed", function (response) {
            console.error("Popup Payment Failure Callback Hook:", response.error);
            showPaymentError(`Payment Failed: ${response.error.description || "The card was declined or transaction cancelled."}`);
            resetPayButton(payBtn);
        });

        rzp.open();

    } catch (checkoutError) {
        console.error("General payment process failure:", checkoutError);
        showPaymentError(checkoutError.message || "An error occurred while setting up the payment gateway. Please try Cash on Delivery or reload the page.");
        resetPayButton(payBtn);
    }
}

/**
 * Reset Pay Now button to active styling
 */
function resetPayButton(button) {
    if (button) {
        button.disabled = false;
        button.innerText = button.dataset.originalText || "Pay Online";
        if (button.tagName === 'INPUT') {
            button.value = button.dataset.originalText || "Pay Online";
        }
    }
}

/**
 * Re-label button/input elements smoothly
 */
function setButtonText(button, text) {
    if (button.tagName === 'INPUT') {
        button.value = text;
    } else {
        button.innerText = text;
    }
}

/**
 * Display layout-safe error notices on the page
 */
function showPaymentError(message) {
    const errorBox = document.getElementById("payment-error-container");
    if (errorBox) {
        errorBox.style.display = "block";
        errorBox.className = "payment-error-alert text-red-600 bg-red-50 border border-red-200 p-4 rounded-xl text-sm my-3 text-center font-medium shadow-sm transition-all";
        errorBox.innerHTML = `⚠️ <b>Payment Interrupted</b><br/>${message}`;
        
        // Scroll error box into view
        errorBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else {
        // Fallback banner if container is absent (highly accessible fallback)
        alert("Payment Error: " + message);
    }
}

/**
 * Clear existing error notices
 */
function hidePaymentError() {
    const errorBox = document.getElementById("payment-error-container");
    if (errorBox) {
        errorBox.style.display = "none";
        errorBox.innerHTML = "";
    }
}
