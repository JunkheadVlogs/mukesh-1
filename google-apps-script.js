// -------------------------------------------------------------
// PLEASE COPY THIS CODE AND PASTE IT IN YOUR GOOGLE APPS SCRIPT
// -------------------------------------------------------------

function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // Parse the JSON data sent from our website
    var data;
    try {
      data = JSON.parse(e.postData.contents);
    } catch (parseError) {
      // Fallback in case format is weird
      data = JSON.parse(e.postData.getDataAsString());
    }

    // Check if this is an Exit Intent Lead
    if (data["Action"] === "ExitLead" || data["leadSource"] === "Exit Intent Popup") {
      var sheetName = "Exit Leads";
      var leadSheet = ss.getSheetByName(sheetName);
      // Create the sheet if it doesn't exist
      if (!leadSheet) {
        leadSheet = ss.insertSheet(sheetName);
        leadSheet.appendRow(["Full Name", "Mobile Number", "Current Page URL", "Date & Time", "Device Type", "Source"]);
      }
      
      var leadRowData = [
        data["Full Name"] || data.firstName || data.name || "",
        data["Mobile Number"] || data.mobileNumber || data.mobile || "",
        data["Current Page URL"] || "",
        data["Date & Time"] || new Date().toLocaleString(),
        data["Device Type"] || "",
        data["Source"] || data.leadSource || "Exit Popup"
      ];
      
      leadSheet.appendRow(leadRowData);
      
      return ContentService.createTextOutput(JSON.stringify({
        "status": "success", 
        "message": "Lead data successfully captured"
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Otherwise, treat as regular Order
    var sheet = ss.getSheetByName("Orders") || ss.getActiveSheet();
    
    // Exactly extract data based on the explicit names we send from Checkout.tsx
    // The keys map exactly to the camelCase properties in our React component
    var rowData = [
      data.firstName || data["First Name"] || "",         // Column A
      data.mobileNumber || data["Mobile Number"] || "",   // Column B
      data.email || data["Email"] || "",                  // Column C
      data.streetAddress || data["Street Address"] || "", // Column D
      data.city || data["City"] || "",                    // Column E
      data.zipCode || data["Zip Code"] || "",             // Column F
      data.productName || data["Product Name"] || "",     // Column G
      data.totalAmount || data["Total Amount"] || "",     // Column H
      data["Date & Time"] || new Date().toLocaleString(), // Column I
      data.size || data["Size"] || "",                    // Column J
      data.sku || data["SKU"] || data["SKU ID"] || "",     // Column K
      data.color || data["Color"] || ""                   // Column L
    ];
    
    // Append the completely organized row
    sheet.appendRow(rowData);
    
    // Send Success Response Back
    return ContentService.createTextOutput(JSON.stringify({
      "status": "success", 
      "message": "Order data successfully captured"
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // If anything fails, return error logs
    return ContentService.createTextOutput(JSON.stringify({
      "status": "error", 
      "message": error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

