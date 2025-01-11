export const payment = {
  "formTitle": "Payment",
  "saveBtnTitle": "Next",
  "prevBtnTitle": "Back",
  "resetBtnTitle": "",
  "calculateBtnTitle": "",
  "saveBtnFunction": "",
  "themeFile": "ABHI.css",
  "formSections": [
    {
      "sectionTitle": "Share KYC Link",
      "visible": true,
      "visibleLabel": true,
      "class": "kyc-container",
      "formControls": [
        {
          "name": "checkKycControl",
          "label": "Check KYC",
          "type": "text",
          "class": "",
          "disabled": false,
          "visible": false,
          "methodName": "checkKycDetail",
        },
        {
          "name": "shareKyc",
          "label": "Share KYC",
          "type": "button",
          "class": "send-link-btn send-btn",
          "disabled": false,
          "visible": true,
          "methodName": "shareKycURL",
          "dependentControls": [
            "kycCopyLink"
          ]
        },
        {
          "name": "initiateKyc",
          "label": "Initiate KYC",
          "type": "button",
          "class": "send-link-btn send-btn",
          "disabled": false,
          "visible": true,
          "methodName": "initiateKycURL",
          "onChangeMethod": "",
          // "dependentControls": [
          //   "copyLink"
          // ]
        },
        {
          "name": "skipKyc",
          "label": "Skip KYC",
          "value": "",
          "type": "button",
          "class": "send-link-btn send-btn",
          "disabled": false,
          "visible": true,
          "methodName": "skipKycURL"
        },
        {
          "name": "kycCopyLink",
          "label": "KYC Link",
          "visibleLabel": true,
          "value": "",
          "type": "editableInfo",
          "class": "col-12 col-lg-8 col-md-8",
          "disabled": true,
          "visible": false
        }
      ],
    },
    {
      "sectionTitle": "Share Payment Link",
      "visible": true,
      "visibleLabel": true,
      "class": "payment-container",
      "formControls": [
        {
          "name": "mobileNumber",
          "label": "Customer Mobile Number",
          "visibleLabel": true,
          "type": "text",
          "value": "",
          "class": "col-12 col-md-6 col-lg-6 detail-item",
          "visible": true,
          "disabled": true
        },
        {
          "name": "emailId",
          "label": "Email Address",
          "visibleLabel": true,
          "type": "text",
          "value": "",
          "class": "col-12 col-md-6 col-lg-6 detail-item",
          "visible": true,
          "disabled": true
        },
        {
          "name": "sendLinkButton",
          "label": "Send Link",
          "type": "button",
          "class": "send-link-btn send-btn",
          "disabled": false,
          "methodName": "sendPaymentLink",
          "visible": true,
          "dependentControls": [
            "copyLink"
          ]
        },
        {
          "name": "copyLink",
          "label": "Copy Link",
          "value": "",
          "type": "editableInfo",
          "class": "col-12 col-lg-8 col-md-8",
          "disabled": true,
          "visible": false
        },
        {
          "name": "horizontalLine",
          "type": "line",
          "visible": true,
          "class": "custom-line custom-line-or"
        },
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
        {
          "name": "offline",
          "label": "Offline",
          "visibleLabel": false,
          "visible": true,
          "type": "button",
          "class": "col-12 col-md-6 col-lg-2 paymentBtn btn-offLine",
          "methodName": "onButtonClick",
          "dependentControls": [
            "paymentOption",
            "totalPremium",
            "chequeNumber",
            "chequeDate",
            "accountNumber",
            "ifscCode",
            "paymentBankName",
            "chequeCopy",
            "documentProofUpload",
            "paymentBankCity",
            "paymentBankBranch",
            "micrCode",
            "nextOffline"
          ]
        },
        {
          "name": "resendLinkButton",
          "label": "Resend Link",
          "type": "button",
          "class": "resend-link-btn",
          "visible": false
        },
        {
          "name": "paymentOption",
          "label": "Payment Option",
          "visible": false,
          "visibleLabel": true,
          "onChangeMethod": "changeMainFormDependentControls",
          "class": "col-12 col-md-6 col-lg-4",
          "type": "select",
          "value": "",
          "options": [
            {
              "name": "Cheque",
              "value": "Cheque",
              "selected": true,
              "dependentControls": [
                {
                  "name": "totalPremium",
                  "visibility": true
                },
                {
                  "name": "chequeNumber",
                  "visibility": true
                },
                {
                  "name": "chequeDate",
                  "visibility": true
                },
                {
                  "name": "ifscCode",
                  "visibility": true
                },
                {
                  "name": "accountNumber",
                  "visibility": true
                },
                {
                  "name": "bankName",
                  "visibility": true
                },
                {
                  "name": "bankCity",
                  "visibility": true
                },
                {
                  "name": "bankBranch",
                  "visibility": true
                },
                {
                  "name": "micrCode",
                  "visibility": true
                },
                {
                  "name": "payOrderNumber",
                  "visibility": false
                },
                {
                  "name": "payOrderDate",
                  "visibility": false
                }
              ]
            },
            {
              "name": "Demand Draft",
              "value": "Demand Draft",
              "selected": false,
              "dependentControls": [
                {
                  "name": "totalPremium",
                  "visibility": true
                },
                {
                  "name": "demandDraftNumber",
                  "visibility": true
                },
                {
                  "name": "demandDraftDate",
                  "visibility": true
                },
                {
                  "name": "payOrderNumber",
                  "visibility": false
                },
                {
                  "name": "payOrderDate",
                  "visibility": false
                },
                {
                  "name": "ifscCode",
                  "visibility": true
                },
                {
                  "name": "bankName",
                  "visibility": true
                },
                {
                  "name": "chequeNumber",
                  "visibility": true
                },
                {
                  "name": "chequeDate",
                  "visibility": true
                },
                {
                  "name": "chequeNumber",
                  "visibility": false
                },
                {
                  "name": "chequeDate",
                  "visibility": false
                }
              ]
            },
            {
              "name": "Pay Order",
              "value": "Pay Order",
              "selected": false,
              "dependentControls": [
                {
                  "name": "totalPremium",
                  "visibility": true
                },
                {
                  "name": "payOrderNumber",
                  "visibility": true
                },
                {
                  "name": "payOrderDate",
                  "visibility": true
                },
                {
                  "name": "ifscCode",
                  "visibility": true
                },
                {
                  "name": "bankName",
                  "visibility": true
                },
                {
                  "name": "chequeNumber",
                  "visibility": false
                },
                {
                  "name": "chequeDate",
                  "visibility": false
                },
                {
                  "name": "demandDraftNumber",
                  "visibility": false
                },
                {
                  "name": "demandDraftDate",
                  "visibility": false
                }
              ]
            }
          ]
        },
        {
          "name": "totalPremium",
          "label": "Total Amount",
          "visible": false,
          "disabled": true,
          "visibleLabel": true,
          "type": "text",
          "value": "",
          "class": "col-12 col-md-6 col-lg-4"
        },
        {
          "name": "chequeNumber",
          "label": "Cheque Number",
          "visible": false,
          "visibleLabel": true,
          "type": "text",
          "value": "",
          "class": "col-12 col-md-6 col-lg-4",
          "validators": [
            {
              "validatorName": "required",
              "required": true,
              "message": "Enter 6 Digits Cheque Number it is a required field."
            },
            {
              "validatorName": "pattern",
              "pattern": "^(?!000000$|999999$)[0-9_-]{6}$",
              "message": "Only 6 digits are allowed, including optional - or _, excluding 000000 and 999999."
            },
            {
              "validatorName": "maxlength",
              "maxLength": 6,
              "message": "Invalid number, maximum length is 6 characters."
            },
            {
              "validatorName": "minlength",
              "minLength": 6,
              "message": "Invalid number, minimum length is 6 characters."
            }
          ]
        },
        {
          "name": "accountNumber",
          "label": "Account No",
          "visible": false,
          "visibleLabel": true,
          "type": "number",
          "value": "",
          "class": "col-12 col-md-6 col-lg-4",
          "validators": [
            {
              "validatorName": "required",
              "required": true,
              "message": "Account Number is required field"
            },
            {
              "validatorName": "pattern",
              "pattern": "^[0-9]{9,18}$",
              "message": "Provide between 9 to 18 digits"
            }
          ]
        },
        {
          "name": "demandDraftNumber",
          "label": "Demand Draft Number",
          "visible": false,
          "visibleLabel": true,
          "type": "number",
          "value": "",
          "class": "col-12 col-md-6 col-lg-4",
          "validators": [
            {
              "validatorName": "required",
              "required": true,
              "message": "Enter 6 Digits DD Number it is required field."
            },
            {
              "validatorName": "pattern",
              "pattern": "^(?!0{6})(?!1{6})(?!2{6})(?!3{6})(?!4{6})(?!5{6})(?!6{6})(?!7{6})(?!8{6})(?!9{6})(?!123456)(?!654321)[0-9]{6}$",
              "message": "Enter 6 Digits DD Number it is required field."
            }
          ]
        },
        {
          "name": "payOrderNumber",
          "label": "Pay Order Number",
          "visible": false,
          "visibleLabel": true,
          "type": "number",
          "value": "",
          "class": "col-12 col-md-6 col-lg-4",
          "validators": [
            {
              "validatorName": "required",
              "required": true,
              "message": "Enter 6 Digits PayOrder Number it is required field."
            },
            {
              "validatorName": "pattern",
              "pattern": "^(?!0{6})(?!1{6})(?!2{6})(?!3{6})(?!4{6})(?!5{6})(?!6{6})(?!7{6})(?!8{6})(?!9{6})(?!123456)(?!654321)[0-9]{6}$",
              "message": "Enter 6 Digits PayOrder Number it is required field."
            }
          ]
        },
        {
          "name": "chequeDate",
          "label": "Cheque Date",
          "visible": false,
          "visibleLabel": true,
          "minDateLength": "currentDate",
          "maxDateLength": "currentDate",
          "type": "date",
          "value": "",
          "class": "col-12 col-md-6 col-lg-4",
          "validators": [
            {
              "validatorName": "required",
              "required": true,
              "message": "Cheque Date is required field."
            }
          ]
        },
        {
          "name": "demandDraftDate",
          "label": "Demand Draft Date",
          "visible": false,
          "visibleLabel": true,
          "type": "date",
          "value": "",
          "class": "col-12 col-md-6 col-lg-4",
          "validators": [
            {
              "validatorName": "required",
              "required": true,
              "message": "Demand Draft Date is required field."
            }
          ]
        },
        {
          "name": "payOrderDate",
          "label": "Pay Order Date",
          "visible": false,
          "visibleLabel": true,
          "type": "date",
          "value": "",
          "class": "col-12 col-md-6 col-lg-4",
          "validators": [
            {
              "validatorName": "required",
              "required": true,
              "message": "Demand Draft Date is required field."
            }
          ]
        },
        {
          "name": "paymentBankName",
          "label": "Bank Name",
          "visible": false,
          "visibleLabel": true,
          "getAllOption": "getAllBankDetails",
          "onChangeMethod": "getBankCity",
          "otherControlName": "paymentBankCity",
          "type": "select",
          "value": "",
          "class": "col-12 col-md-6 col-lg-4",
          "options": [],
          "validators": [
            {
              "validatorName": "required",
              "required": true,
              "message": "Bank name is required field"
            }
          ]
        },
        {
          "name": "paymentBankCity",
          "label": "Bank City",
          "visible": false,
          "visibleLabel": true,
          "onChangeMethod": "getBranchDetails",
          "otherControlName": "paymentBankBranch",
          "type": "select",
          "value": "",
          "class": "col-12 col-md-6 col-lg-4",
          "options": [],
          "validators": [
            {
              "validatorName": "required",
              "required": true,
              "message": "Bank City is required field"
            }
          ]
        },
        {
          "name": "paymentBankBranch",
          "label": "Bank Branch",
          "visible": false,
          "visibleLabel": true,
          "type": "select",
          "onChangeMethod": "setIfscCode",
          "otherControlName": "ifscCode",
          "value": "",
          "class": "col-12 col-md-6 col-lg-4",
          "options": [],
          "validators": [
            {
              "validatorName": "required",
              "required": true,
              "message": "Bank Branch is required field"
            }
          ]
        },
        {
          "name": "ifscCode",
          "label": "IFSC Code",
          "visibleLabel": true,
          "visible": false,
          "type": "text",
          "disabled": true,
          "value": "",
          "class": "col-12 col-md-6 col-lg-4",
          "validators": [
            {
              "validatorName": "required",
              "required": true,
              "message": "IFSC is required field"
            }
          ]
        },
        {
          "name": "micrCode",
          "label": "MICR Code",
          "visibleLabel": true,
          "disabled": true,
          "type": "text",
          "value": "",
          "visible": false,
          "class": "col-12 col-md-6 col-lg-4"
        },
        {
          "name": "chequeCopy",
          "label": "UPLOAD CHQ/DD/NEFT COPY",
          "visibleLabel": true,
          "type": "paragraph",
          "class": "col-12 col-md-6 col-lg-6",
          "visible": false
        },
        {
          "name": "documentProofUpload",
          "label": "Upload Previous Policy",
          "visibleLabel": false,
          "value": "",
          "type": "fileupload",
          "class": "col-12 col-md-6 col-lg-4",
          "visible": false,
          "validators": [
            {
              "validatorName": "required",
              "required": true,
              "message": "UPLOAD CHQ/DD/NEFT COPY is required"
            }
          ]
        }
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
          "name": "policyNumber",
          "label": "Policy Number",
          "visibleLabel": true,
          "visible": true,
          "type": "boldtext",
          "class": "col-12 col-md-6 col-lg-3",
          "value": "",
          "disabled": true
        },
        {
          "name": "nextOffline",
          "label": "Next",
          "visibleLabel": false,
          "visible": false,
          "type": "button",
          "class": "col-12 col-md-6 col-lg-2 next-btn",
          "methodName": "onSubmit",
          "onClickMethod": "getFullQuoteViaOfflinePayment"
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
        {
          "name": "back",
          "label": "Back",
          "visibleLabel": false,
          "visible": true,
          "type": "button",
          "class": "col-12 col-md-6 col-lg-2 back-btn",
          "methodName": "onPrevious"
        }
      ]
    }
  ]
}