function doOptions(e) {
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.TEXT);
}

function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
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

