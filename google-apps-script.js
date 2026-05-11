function doOptions(e) {
  return ContentService.createTextOutput("");
}

function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var data = JSON.parse(e.postData.contents);
    
    // Handle Exit Intent Popup Leads
    if (data.leadSource === "Exit Intent Popup") {
      var leadSheet = ss.getSheetByName("Exit Leads") || ss.insertSheet("Exit Leads");
      if (leadSheet.getLastRow() === 0) {
        leadSheet.appendRow(["First Name", "Mobile Number", "Lead Source", "Date"]);
      }
      var leadRow = [
        data.firstName || '',
        data.mobileNumber || '',
        data.leadSource || '',
        Utilities.formatDate(new Date(), "Asia/Kolkata", "dd/MM/yyyy hh:mm:ss a")
      ];
      leadSheet.appendRow(leadRow);
      return ContentService.createTextOutput(JSON.stringify({ status: 'success' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Handle Checkout Orders
    var sheet = ss.getSheetByName('Orders') || ss.insertSheet('Orders');
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["First Name", "Mobile Number", "Email", "Street Address", "City", "Zip Code", "Product Name", "Total Amount", "Date & Time", "Size", "SKU", "Color", "Lead Source"]);
    }
    
    var row = [
      data.firstName || '',
      data.mobileNumber || '',
      data.email || '',
      data.streetAddress || '',
      data.city || '',
      data.zipCode || '',
      data.productName || '',
      data.totalAmount || '',
      Utilities.formatDate(new Date(), "Asia/Kolkata", "dd/MM/yyyy hh:mm:ss a"),
      data.size || '',
      data.sku || '',
      data.color || '',
      data.leadSource || ''
    ];

    sheet.appendRow(row);

    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'success'
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

