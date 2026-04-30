// -------------------------------------------------------------
// PLEASE COPY THIS CODE AND PASTE IT IN YOUR GOOGLE APPS SCRIPT
// -------------------------------------------------------------

function doPost(e) {
  try {
    // Open your active spreadsheet
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Parse the JSON data sent from our website
    var data;
    try {
      data = JSON.parse(e.postData.contents);
    } catch (parseError) {
      // Fallback in case format is weird
      data = JSON.parse(e.postData.getDataAsString());
    }
    
    // Exactly extract data based on the explicit names we send from Checkout.tsx
    // The keys map exactly to the updated payload
    var rowData = [
      data["First Name"] || "",         // Column A
      data["Mobile Number"] || "",      // Column B
      data["Email"] || "",              // Column C
      data["Street Address"] || "",     // Column D
      data["City"] || "",               // Column E
      data["Zip Code"] || "",           // Column F
      data["Product Name"] || "",       // Column G
      data["Total Amount"] || "",       // Column H
      data["Date & Time"] || "",        // Column I
      data["Size"] || "",               // Column J (Size)
      data["SKU ID"] || ""              // Column K (SKU ID)
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
