export const customer_payment={
    "formTitle": "Payment",
    "saveBtnTitle": "Next",
    "prevBtnTitle": "Back",
    "resetBtnTitle": "",
    "calculateBtnTitle": "",
    "saveBtnFunction": "",
    "themeFile": "ABHI.css",
    "formSections": [
      {
        "sectionTitle": "Online Payment Modes",
        "visible": true,
        "visibleLabel": true,
        "class": "payment-container",
        "formControls": [
          {
            "name": "paymentLabel",
            "label": "Make payment online",
            "class": "col-12 col-md-6 col-lg-6 paymentLabel",
            "visibleLabel": true,
            "visible": true,
            "type": "paragraph"
          },
          {
            "name": "paymentMode",
            "label": "Payment Mode",
            "class": "col-12 col-md-6 col-lg-6",
            "visibleLabel": false,
            "visible": false,
            "type": "text"
          },
          {
            "name": "emandate_payment",
            "label": "E-Nach",
            "visibleLabel": false,
            "visible": true,
            "type": "button",
            "dependentControls": ["nextOnline"],
            "class": "col-12 col-md-6 col-lg-2 paymentBtn btn-ENach",
            "methodName": "onButtonClick"
          },
            {
              "name": "autoDebit",
            "label": "Auto Debit",
            "visibleLabel": false,
            "visible": true,
            "type": "button",
            "dependentControls": ["nextOnline"],
            "class": "col-12 col-md-6 col-lg-2 paymentBtn btn-AutoDebit",
            "methodName": "onButtonClick"
          },
          {
            "name": "online",
            "label": "Online",
            "visibleLabel": false,
            "visible": true,
            "type": "button",
            "dependentControls": ["nextOnline"],
            "class": "col-12 col-md-6 col-lg-2 paymentBtn btn-EMandate",
            "methodName": "onButtonClick"
          },
        ]
      },
      {
        "sectionTitle": "Bottom Section",
        "visible": true,
        "class": "section-title bottom-section",
        "formControls": [
          {
            "name": "plandetails",
            "label": "Plan Details",
            "visibleLabel": true,
            "type": "summary",
            "value": "",
            "class": "col-md-12",
            "visible": true,
            "disabled": true
          },
          {
            "name": "productName",
            "label": "Product Name",
            "visibleLabel": false,
            "visible": true,
            "disabled": true,
            "type": "boldtext",
            "class": "col-12 col-md-6 col-lg-3 bottom-product",
            "value": "",
            "text": "Aditya Birla Health Insurance"
          },
          {
            "name": "totalPremium",
            "label": "Total Premium/Incl tax",
            "visibleLabel": true,
            "visible": true,
            "type": "boldtext",
            "class": "col-12 col-md-6 col-lg-3 bottom-total-premium",
            "value": "",
            "disabled": true
          },
          {
            "name": "nextOnline",
            "label": "Next",
            "visibleLabel": false,
            "visible": false,
            "type": "button",
            "class": "col-12 col-md-6 col-lg-2 next-btn",
            "methodName": "redirectToJustPay"
          },
        ]
      }
    ]
  }