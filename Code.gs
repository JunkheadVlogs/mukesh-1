// =========================================================================
//                  GOOGLE SHEETS APPS SCRIPT CONFIGURATION
// =========================================================================
// File Name: Code.gs
// Description: Multi-tab lead capture and order sheet sync engine for mukeshsarees.com
//
// ━━━ STEP-BY-STEP SETUP & DEPLOYMENT INSTRUCTIONS ━━━
//
// 1. CREATE GOOGLE SHEETS TABS:
//    - Create a Google Sheet. Ensure your 1st tab (Orders) has columns A to P:
//      A: First Name
//      B: Mobile number
//      C: Email
//      D: Street Address
//      E: City
//      F: ZIP Code
//      G: Product Name
//      H: Total Amount
//      I: Date & Time
//      J: Size
//      K: SKU
//      L: Color
//      M: Coupon Used
//      N: Source
//      O: Payment Method
//      P: Order Status
//
//    - Your 2nd tab must be named "Exit Intent Leads", with columns:
//      A: Timestamp
//      B: Name
//      C: Phone
//      D: Coupon Code Shown
//      E: Page
//      F: Device
//      G: Converted to Order?
//
// 2. OPEN GOOGLE APPS SCRIPT:
//    - Inside Google Sheets, click "Extensions" -> "Apps Script".
//    - Replace all existing code with this script.
//    - Replace SHEET_ID below with '1gXj7GffWnC1smyrbP3ExeoqzFpdNHn8PMdcd_zGOH8I'
//    - Click Save.
//
// 3. DEPLOY AS WEB APP:
//    - Click "Deploy" (top right) -> "New deployment".
//    - Click Gear icon next to "Select type" and choose "Web app".
//    - Execute as: "Me"
//    - Who has access: "Anyone" (crucial for web access).
//    - Click Deploy, authorize script if prompted ("Advanced" -> "Go to project (unsafe)").
//
// =========================================================================

const SHEET_ID = '1gXj7GffWnC1smyrbP3ExeoqzFpdNHn8PMdcd_zGOH8I'; 
const SHEET_LEADS_TAB = 'Exit Intent Leads';

/**
 * Handles incoming POST requests from the React application
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.openById(SHEET_ID);
    
    if (data.type === 'exit_lead') {
      handleExitLead(ss, data);
    } else if (data.type === 'order') {
      handleOrder(ss, data);
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch(err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handles saving Lead data from the Exit Intent form (Tab 2)
 */
function handleExitLead(ss, data) {
  let sheet = ss.getSheetByName(SHEET_LEADS_TAB);
  
  // Create sheet + headers if first time
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_LEADS_TAB);
    sheet.appendRow([
      'Timestamp', 'Name', 'Phone', 'Coupon Code Shown', 'Page', 'Device', 'Converted to Order?'
    ]);
    sheet.getRange(1,1,1,7).setBackground('#1E3A5F').setFontColor('#FFFFFF').setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  
  sheet.appendRow([
    new Date().toLocaleString('en-IN', {timeZone: 'Asia/Kolkata'}),
    data.name || '',
    data.phone || '',
    data.couponCode || 'VIPCLUB60',
    data.page || '',
    data.device || 'Unknown',
    'No'
  ]);
}

/**
 * Handles saving Checkout/COD/Prepaid order data (Tab 1)
 */
function handleOrder(ss, data) {
  // The first tab (existing Orders tab)
  const sheet = ss.getSheets()[0];
  if (!sheet) return;
  
  const istTime = new Date().toLocaleString('en-IN', {timeZone: 'Asia/Kolkata'});
  
  // Map incoming attributes directly to columns A to P (highly resilient fallback cascade):
  // A: First Name
  // B: Mobile number
  // C: Email
  // D: Street Address
  // E: City
  // F: ZIP Code
  // G: Product Name
  // H: Total Amount
  // I: Date & Time
  // J: Size
  // K: SKU
  // L: Color
  // M: Coupon Used
  // N: Source
  // O: Payment Method
  // P: Order Status
  
  sheet.appendRow([
    data.firstName || data.customerName || data.fullName || data.name || '',
    data.phone || data.mobileNumber || data.contact || '',
    data.email || '',
    data.address || data.streetAddress || '',
    data.city || '',
    data.zip || data.zipCode || data.pincode || '',
    data.productName || '',
    data.amount || data.totalAmount || data.price || '',
    istTime,
    data.size || 'Standard',
    data.sku || 'N/A',
    data.color || 'N/A',
    data.couponUsed || data.coupon || data.appliedCoupon || 'None',
    data.source || 'Direct Order',
    data.paymentMethod || data.method || '',
    data.status || data.paymentStatus || 'Pending'
  ]);
  
  // Mark the exit_lead with the same phone number as converted!
  markLeadConverted(ss, data.phone || data.mobileNumber);
}

/**
 * Normalizes phone numbers to compare them accurately 
 */
function normalizePhone(ph) {
  if (!ph) return '';
  return String(ph).replace(/\D/g, '').slice(-10); // Match last 10 digits
}

/**
 * Scans the Leads sheet to mark any match as converted on successful orders
 */
function markLeadConverted(ss, phone) {
  const leadsSheet = ss.getSheetByName(SHEET_LEADS_TAB);
  if (!leadsSheet) return;
  
  const targetPhoneNorm = normalizePhone(phone);
  if (!targetPhoneNorm) return;
  
  const lastRow = leadsSheet.getLastRow();
  if (lastRow < 2) return;
  
  const data = leadsSheet.getRange(2, 1, lastRow - 1, 7).getValues();
  for (let i = 0; i < data.length; i++) {
    const sheetPhoneNorm = normalizePhone(data[i][2]); // Column C (0-indexed 2) = phone/Phone
    if (sheetPhoneNorm === targetPhoneNorm) {
      leadsSheet.getRange(i + 2, 7).setValue('Yes ✅'); // Column G (0-indexed 6) = Converted to Order?
    }
  }
}

/**
 * GET handler for simple API self-checks
 */
function doGet(e) {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    return ContentService.createTextOutput(JSON.stringify({ 
      active: true, 
      sheetName: ss.getName(),
      ordersTabName: ss.getSheets()[0].getName(),
      leadsTabExists: ss.getSheetByName(SHEET_LEADS_TAB) !== null
    })).setMimeType(ContentService.MimeType.JSON);
  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({ 
      active: false, 
      error: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
