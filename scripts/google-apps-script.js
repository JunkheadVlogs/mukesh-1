// ==========================================
// GOOGLE SHEETS APPS SCRIPT CONFIGURATION
// ==========================================
// 
// HOW TO INSTALL:
// 1. Open your Google Sheet.
// 2. Go to "Extensions" -> "Apps Script" (recommended: container-bound script).
//    - Note: If you create a "Standalone Script" directly from script.google.com, 
//      you MUST define your SPREADSHEET_ID below.
// 3. Paste this code into Code.gs (replace any existing code).
// 4. Click the "Save" (floppy disk) icon.
// 5. Click "Deploy" -> "New deployment".
// 6. Select type: "Web app" (click gear icon if not selected).
//    - Execute as: "Me" (your email)
//    - Who has access: "Anyone" (crucial for API proxy submissions)
// 7. Click "Deploy" and authorize the requested permissions.
// 8. Copy the Web App URL and set it in your .env as VITE_SHEETS_WEBHOOK_URL.

// STANDALONE SCRIPT FALLBACK:
// If your script is NOT created via Sheet -> Extensions, put your Google Sheet ID here:
// Example: var SPREADSHEET_ID = "1A2B3C4D5E6F7G8H9I0J...";
var SPREADSHEET_ID = "";

function getSpreadsheet() {
  if (SPREADSHEET_ID && SPREADSHEET_ID.trim() !== "") {
    return SpreadsheetApp.openById(SPREADSHEET_ID.trim());
  }
  
  var ss = null;
  try {
    ss = SpreadsheetApp.getActiveSpreadsheet();
  } catch (err) {
    // Gracefully handle if not container-bound
  }
  
  if (!ss) {
    throw new Error(
      "SPREADSHEET_ERROR: Apps Script is running standalone and no SPREADSHEET_ID was defined in Code.gs! " +
      "Please either: " +
      "1) Open your Google Sheet -> go to Extensions -> Apps Script, and paste this code there, OR " +
      "2) Copy the ID from your Sheet URL (the part between /d/ and /edit) and assign it to the SPREADSHEET_ID variable at the top of this script."
    );
  }
  return ss;
}

function doOptions(e) {
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.TEXT);
}

function doPost(e) {
  try {
    var ss = getSpreadsheet();
    var data = JSON.parse(e.postData.contents);
    
    // Handle Exit Intent Popup Leads
    if (data.leadSource === "Exit Intent Popup") {
      var leadSheet = ss.getSheetByName("ExitIntentLeads") || ss.insertSheet("ExitIntentLeads");
      if (leadSheet.getLastRow() === 0) {
        leadSheet.appendRow(["Name", "Mobile", "Product Viewed", "Page URL", "Date", "Time", "Device Type", "Source"]);
      }
      var leadRow = [
        data.firstName || '',
        data.mobileNumber || '',
        data.productViewed || '',
        data.pageUrl || '',
        data.date || Utilities.formatDate(new Date(), "Asia/Kolkata", "dd/MM/yyyy"),
        data.time || Utilities.formatDate(new Date(), "Asia/Kolkata", "hh:mm:ss a"),
        data.deviceType || '',
        data.source || 'Popup'
      ];
      leadSheet.appendRow(leadRow);
      return ContentService.createTextOutput(JSON.stringify({ status: 'success' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Handle Checkout Orders
    var sheet = ss.getSheetByName('Orders') || ss.insertSheet('Orders');
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Order ID", "Name", "Mobile Number", "Email", "Address", "City", "PIN Code", "Product Name", "Amount", "Size", "SKU", "Color", "Payment Method", "Order Status", "Payment ID", "Date & Time", "Lead Source"]);
    }
    
    var row = [
      data.orderId || '',
      data.firstName || '',
      data.mobileNumber || '',
      data.email || '',
      data.streetAddress || '',
      data.city || '',
      data.zipCode || '',
      data.productName || '',
      data.totalAmount || '',
      data.size || '',
      data.sku || '',
      data.color || '',
      data.paymentStatus === 'Cash on Delivery' ? 'COD' : (data.paymentMethod || data.paymentStatus || ''),
      data.orderStatus || 'Pending',
      data.paymentId || 'N/A',
      data.timestamp || Utilities.formatDate(new Date(), "Asia/Kolkata", "dd/MM/yyyy hh:mm:ss a"),
      data.leadSource || ''
    ];

    sheet.appendRow(row);

    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'success',
        message: 'Order placed successfully'
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  try {
    var ss = getSpreadsheet();
    return ContentService.createTextOutput("Google Sheets Webhook is active and listening for POST requests. Target Spreadsheet: " + ss.getName() + " - URL: " + ss.getUrl());
  } catch (err) {
    return ContentService.createTextOutput("Google Sheets Webhook is configured, but: " + err.message);
  }
}
