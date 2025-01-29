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
      "sectionTitle": "Nominee Details",
      "visible": true,
      "visibleLabel": true,
      "class": "section-title",
      "formControls": [
        {
          "name": "personalDetails",
          "label": "Nominee Personal Details",
          "visibleLabel": true,
          "visible": true,
          "value": "",
          "type": "paragraph",
          "methodName": "checkNomineeDetail",
          "class": "col-12 col-md-6 col-lg-12 section-paragraph"
        },
        {
          "name": "nomineeFirstName",
          "label": "First Name",
          "visibleLabel": true,
          "type": "text",
          "value": "",
          "visible": true,
          "class": "col-12 col-md-6 col-lg-4",
          "disabled": false,
          "validators": [
            {
              "validatorName": "required",
              "required": true,
              "message": "First Name is required field"
            },
            {
              "validatorName": "pattern",
              "pattern": "^[a-zA-Z ]{1,15}$",
              "message": "Maxmium Length for FirstName is 15"
            }
          ]
        },
        {
          "name": "nomineeMiddleName",
          "label": "Middle Name",
          "visibleLabel": true,
          "visible": true,
          "type": "text",
          "value": "",
          "disabled": false,
          "class": "col-12 col-md-6 col-lg-4"
        },
        {
          "name": "nomineeLastName",
          "label": "Last Name",
          "visibleLabel": true,
          "visible": true,
          "type": "text",
          "value": "",
          "disabled": false,
          "class": "col-12 col-md-6 col-lg-4",
          "validators": [
            {
              "validatorName": "required",
              "required": true,
              "message": "Last Name is required field"
            },
            {
              "validatorName": "pattern",
              "pattern": "^[a-zA-Z ]{1,15}$",
              "message": "Maxmium Length for LastName is 15"
            }
          ]
        },
        // {
        //   "name": "nomineeDob",
        //   "label": "Date of Birth",
        //   "visibleLabel": true,
        //   "visible": true,
        //   "type": "date",
        //   "dependentControls":['appointeeName','appointeeAge'],
        //   "methodName": "checkNomineeAge",
        //   "onChangeMethod": "checkNomineeAge",
        //   "value": "",
        //   "class": "col-12 col-md-6 col-lg-4",
        //   "validators": [
        //     {
        //       "validatorName": "required",
        //       "required": true,
        //       "message": "DOB is required field"
        //     }
        //   ]
        // },
        {
          "name": "nomineeDob",
          "label": "Date of Birth",
          "visibleLabel": true,
          "visible": true,
          "type": "date",
          "disabled": false,
          "onChangeMethod": "checkNomineeAge",
          "dependentControls": [
            "appointeeName",
            "appointeeContactNo",
            "appointeeRelationWithNominee"
          ],
          "value": "",
          "class": "col-12 col-md-6 col-lg-4",
          "validators": [
            {
              "validatorName": "required",
              "required": true,
              "message": "DOB is required field"
            }
          ]
        },
        {
          "name": "nomineeRelationWithProposer",
          "label": "Relation with Proposer",
          "visibleLabel": true,
          "type": "select",
          "visible": true,
          "getAllOption": "getNomineeRelationShip",
          "value": "",
          "disabled": false,
          "class": "col-12 col-md-6 col-lg-4",
          "options": [],
          "validators": [
            {
              "validatorName": "required",
              "required": true,
              "message": "Nominee Relationship is required field"
            }
          ]
        },
        {
          "name": "gender",
          "label": "Gender",
          "visibleLabel": true,
          "type": "select",
          "class": "col-md-4 control",
          "value": "",
          "disabled": false,
          "visible": false,
          "options": [
            {
              "id": 1,
              "name": "Male",
              "value": "M"
            },
            {
              "id": 2,
              "name": "Female",
              "value": "F"
            }
          ]
        },
        {
          "name": "nomineeAddress",
          "label": "Nominee Address",
          "visibleLabel": true,
          "visible": true,
          "type": "text",
          "value": "",
          "disabled": false,
          "class": "col-12 col-md-6 col-lg-4",
          "validators": [
            {
              "validatorName": "required",
              "required": true,
              "message": "Nominee Address is a required field"
            },
            {
              "validatorName": "pattern",
              "pattern": "^[a-zA-Z0-9/, ]{1,50}$",
              "message": "Address only contains alphabets, digits, (/), (,), and up to 50 characters"
            }
          ]
        },
        {
          "name": "nomineeContactNo",
          "label": "Nominee Contact Details",
          "visibleLabel": true,
          "visible": true,
          "value": "",
          "disabled": false,
          "type": "phonenumber",
          "class": "col-12 col-md-6 col-lg-4",
          "validators": [
            {
              "validatorName": "required",
              "required": true,
              "message": "Nominee number is required field"
            },
            {
              "validatorName": "pattern",
              "pattern": "^[6-9]\\d{9}$",
              "message": "Mobile No is not valid"
            }
          ]
        },
        {
          "name": "appointeeName",
          "label": "Appointee Name",
          "visibleLabel": true,
          "type": "text",
          "value": "",
          "visible": false,
          "disabled": false,
          "class": "col-12 col-md-6 col-lg-4",
          "validators": [
            {
              "validatorName": "required",
              "required": true,
              "message": "Appointee Name is required field"
            },
            {
              "validatorName": "pattern",
              "pattern": "^[a-zA-Z ]{1,25}$",
              "message": "Maxmium Length for AppointeeName is 25"
            }
          ]
        },
        {
          "name": "appointeeContactNo",
          "label": "Appointee Contact Number",
          "visibleLabel": true,
          "visible": false,
          "type": "phonenumber",
          "value": "",
          "disabled": false,
          "class": "col-12 col-md-6 col-lg-4",
          // "validators": [
          //   {
          //     "validatorName": "required",
          //     "required": true,
          //     "message": "Mobile No is required field"
          //   },
          //   {
          //     "validatorName": "pattern",
          //     "pattern": "^[6-9]\\d{9}$",
          //     "message": "Mobile No is not valid"
          //   }
          // ]
        },
        {
          "name": "appointeeRelationWithNominee",
          "label": "Relation With Proposer",
          "visible": false,
          "visibleLabel": true,
          "value": "",
          "type": "select",
          "getAllOption": "getNomineeRelationShip",
          "options": [],
          "disabled": false,
          "class": "col-12 col-md-6 col-lg-4",
          "validators": [
            {
              "validatorName": "required",
              "required": true,
              "message": "Appointee Relationship is required field"
            }
          ]
        },
        {
          "name": "emailId",
          "label": "Email Id",
          "visibleLabel": true,
          "visible": false,
          "type": "email",
          "value": "",
          "disabled": false,
          "class": "col-12 col-md-6 col-lg-4",
        },
        {
          "name": "gender",
          "label": "Gender",
          "visibleLabel": true,
          "type": "",
          "class": "col-md-4 control",
          "value": "",
          "methodName": "",
          "subType": "",
          "disabled": false,
          "otherControlName": "",
          "visible": true,
          "options": [
            {
              "id": 1,
              "name": "Male",
              "value": "M"
            },
            {
              "id": 2,
              "name": "Female",
              "value": "F"
            }
          ],
          "validators": [
            {
              "validatorName": "required",
              "required": true,
              "message": "Select is a required field."
            }
          ]
        },
        {
          "name": "updateNominee",
          "label": "Save",
          "visibleLabel": false,
          "visible": true,
          "type": "button",
          "disabled": false,
          "class": " col-12 send-link-btn send-btn",
          "methodName": "updateNomineeDetails"
        },
      ]
    },
    {
      "sectionTitle": "Bank Account Details",
      "visible": true,
      "visibleLabel": true,
      "class": "section-title",
      "formControls": [
        {
          "name": "proposerName",
          "label": "Account Holder Name",
          "visibleLabel": true,
          "type": "text",
          "visible": true,
          "value": "",
          "class": "col-12 col-md-6 col-lg-4",
          "methodName":"checkBankDetail",
          "validators": [
            {
              "validatorName": "required",
              "required": true,
              "message": "Account Holder name is required field"
            },
            {
              "validatorName": "pattern",
              "pattern": "^[a-zA-Z ]{1,25}$",
              "message": "Maxmium Length for Name is 25"
            }
          ]
        },
        {
          "name": "accountNumber",
          "label": "Account No",
          "visible": true,
          "visibleLabel": true,
          "type": "number",
          "value": "",
          "disabled": false,
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
              "message": "Account Number should be between 9 to 18 digits"
            }
          ]
        },
        {
          "name": "accountType",
          "label": "Account Type",
          "visible": true,
          "visibleLabel": true,
          "type": "select",
          "value": "",
          "disabled": false,
          "class": "col-12 col-md-6 col-lg-4",
          "options": [
            {
              "name": "Savings",
              "value": "02",
              "selected": true
            },
            {
              "name": "Current",
              "value": "01",
              "selected": false
            }
          ],
          "validators": [
            {
              "validatorName": "required",
              "required": true,
              "message": "Account Type is required field"
            }
          ]
        },
        {
          "name": "bankName",
          "label": "Bank Name",
          "visible": true,
          "visibleLabel": true,
          "getAllOption": "getAllBankDetails",
          "onChangeMethod": "getBankCity",
          "otherControlName": "bankCity",
          "type": "select",
          "value": "",
          "disabled": false,
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
          "name": "bankCity",
          "label": "Bank City",
          "visible": true,
          "visibleLabel": true,
          "onChangeMethod": "getBranchDetails",
          "otherControlName": "bankBranch",
          "type": "select",
          "value": "",
          "disabled": false,
          "class": "col-12 col-md-6 col-lg-4",
          "options": [],
          // "validators": [
          //   {
          //     "validatorName": "required",
          //     "required": true,
          //     "message": "Bank City is required field"
          //   }
          // ]
        },
        {
          "name": "bankBranch",
          "label": "Bank Branch",
          "visible": true,
          "visibleLabel": true,
          "type": "select",
          "onChangeMethod": "setIfscCode",
          "otherControlName": "ifscCode",
          "value": "",
          "class": "col-12 col-md-6 col-lg-4",
          "options": [],
          "disabled": false,
          // "validators": [
          //   {
          //     "validatorName": "required",
          //     "required": true,
          //     "message": "Bank Branch is required field"
          //   }
          // ]
        },
        {
          "name": "updateBank",
          "label": "Save",
          "visibleLabel": false,
          "visible": true,
          "type": "button",
          "class": "col-12 send-link-btn send-btn",
          "methodName": "updateBankDetails"
        },
      ]
    },
    {
      "sectionTitle": "Share Payment Link",
      "visible": false,
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
          "disabled": true,
          "methodName": "currentDateValue",
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
        // {
        //   "name": "nextnominee",
        //   "label": "Next",
        //   "visibleLabel": false,
        //   "visible": false,
        //   "type": "button",
        //   "class": "col-12 col-md-6 col-lg-2 next-btn",
        //   "methodName": "nomineeUpdate"
        // },
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