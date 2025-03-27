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
            "label": "E-Mandate",
            "visibleLabel": false,
            "visible": true,
            "type": "button",
            "dependentControls": [
              "nextOnline",
              "emandateConsent",
              "emandateTerms"
            ],
            "class": "col-12 col-md-6 col-lg-2 paymentBtn btn-ENach",
            "methodName": "onButtonClick"
          },
            {
              "name": "autoDebit",
            "label": "Auto Debit",
            "visibleLabel": false,
            "visible": true,
            "type": "button",
            "dependentControls": [
              "nextOnline",
              "autoDebitConsent",
              "autoDebitTerms"
            ],
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
            "name": "autoDebitConsent",
            "visibleLabel": true,
            "visible": false,
            "label": "I hereby give my unconditional consent to debit my mentioned account for the premiums for Aditya Birla Health Insurance Policies",
            "class": "col-md-12 acceptTermsCheck",
            "type": "checkbox",
            "value": false,
            "validators": [
              {
                "validatorName": "requiredTrue",
                "message": "Please tick this condition to proceed"
              }
            ]
          },
          {
            "name": "autoDebitTerms",
            "visibleLabel": true,
            "visible": false,
            "label": "I hereby declared that the premium paid under this transaction is being paid by me end/or my family through a bank account or Credit/Debit card registered in his/ her name or through a prepaid payment instrument (wallet) held by me in their name and it is not third party payment made by any other person",
            "class": "col-md-12 acceptTermsCheck",
            "type": "checkbox",
            "value": false,
            "validators": [
              {
                "validatorName": "requiredTrue",
                "message": "Please tick this condition to proceed"
              }
            ]
          },
          {
            "name": "emandateConsent",
            "visibleLabel": true,
            "visible": false,
            "label": "I hereby give my unconditional consent to debit my mentioned account for the premiums for Aditya Birla Health Insurance Policies",
            "class": "col-md-12 acceptTermsCheck",
            "type": "checkbox",
            "value": false,
            "validators": [
              {
                "validatorName": "requiredTrue",
                "message": "Please tick this condition to proceed"
              }
            ]
          },
          {
            "name": "emandateTerms",
            "visibleLabel": true,
            "visible": false,
            "label": "I hereby declared that the premium paid under this transaction is being paid by me end/or my family through a bank account or Credit/Debit card registered in his/ her name or through a prepaid payment instrument (wallet) held by me in their name and it is not third party payment made by any other person",
            "class": "col-md-12 acceptTermsCheck",
            "type": "checkbox",
            "value": false,
            "validators": [
              {
                "validatorName": "requiredTrue",
                "message": "Please tick this condition to proceed"
              }
            ]
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

  export const detailsForms = {
    "formTitle": "Leads",
    "saveBtnTitle": "Save",
    "prevBtnTitle": "",
    "resetBtnTitle": "",
    "calculateBtnTitle": "",
    "saveBtnFunction": "getPremiumAmount",
    "themeFile": "ABHI.css",
    "formSections": [
      {
        "sectionTitle": "Policy Details",
        "visibleLabel": true,
        "visible": true,
        "class": "col-md-12 section-title",
        "formControls": [
          {
            "name": "memberPolicyType",
            "label": "Cover Type",
            "visibleLabel": true,
            "type": "word",
            "value": "",
            "disabled": true,
            "visible": true,
            "class": "col-12 col-md-6 col-lg-3 col-xl-3"
          },
          {
            "name": "policyNumber",
            "label": "Policy NO",
            "visibleLabel": true,
            "type": "word",
            "value": "",
            "disabled": true,
            "visible": true,
            "class": "col-12 col-md-6 col-lg-3 col-xl-3",
          },
          {
            "name": "productName",
            "label": "Product",
            "visibleLabel": true,
            "type": "word",
            "value": "",
            "visible": true,
            "disabled": true,
            "class": "col-12 col-md-6 col-lg-3 col-xl-3"
          },
          {
            "name": "sumInsured",
            "label": "Sum Insured",
            "visibleLabel": true,
            "type": "word",
            "value": "",
            "visible": true,
            "disabled": true,
            "class": "col-12 col-md-6 col-lg-3 col-xl-3"
          },
          // {
          //   "name": "panNo",
          //   "label": "Pan Card Number",
          //   "visibleLabel": true,
          //   "type": "word",
          //   "disabled": true,
          //   "visible": true,
          //   "value": "",
          //   "class": "col-12 col-md-6 col-lg-3 col-xl-3",
          // },
          // {
          //   "name": "panNo",
          //   "label": "Pan Card Number",
          //   "visibleLabel": true,
          //   "type": "text",
          //   "disabled": false,
          //   "visible": true,
          //   "methodName":"",
          //   "value": "",
          //   "class": "col-12 col-md-6 col-lg-3 col-xl-3",
          // },
          {
            "name": "proposerAddress1",
            "label": "Correspondence Address 1",
            "visibleLabel": true,
            "type": "word",
            "value": "",
            "visible": true,
            "disabled": true,
            "class": "col-12 col-md-6 col-lg-3 col-xl-3",
          },
          {
            "name": "proposerAddress2",
            "label": "Correspondence Address 2",
            "visibleLabel": true,
            "type": "word",
            "value": "",
            "visible": true,
            "disabled": true,
            "class": "col-12 col-md-6 col-lg-3 col-xl-3"
          },
          {
            "name": "proposerPincode",
            "label": "Pincode",
            "visibleLabel": true,
            "visible": true,
            "type": "word",
            "value": "",
            "disabled": true,
            "class": "col-12 col-md-6 col-lg-3 col-xl-3",
          },
          {
            "name": "country",
            "label": "Country",
            "visibleLabel": true,
            "type": "word",
            "value": "",
            "visible": false,
            "class": "col-12 col-md-6 col-lg-3 col-xl-3"
          },
          {
            "name": "city",
            "label": "City",
            "class": "col-12 col-md-6 col-lg-3 col-xl-3",
            "disabled": true,
            "visible": true,
            "visibleLabel": true,
            "value": "",
            "type": "word"
          },
          {
            "name": "state",
            "label": "State",
            "visibleLabel": true,
            "type": "word",
            "value": "",
            "visible": true,
            "disabled": true,
            "class": "col-12 col-md-6 col-lg-3 col-xl-3"
          },
          {
            "name": "memberPolicyType",
            "label": "Select Policy Type",
            "visibleLabel": true,
            "visible": false,
            "type": "word",
            "methodName": "handlePolicyTypeChange",
            "disabled": true,
            "value": "",
            "class": "col-12 col-md-6 col-lg-4"
          },
          {
            "name": "insuredMembers",
            "label": "Number of Insured Members",
            "visibleLabel": false,
            "visible": false,
            "methodName": "getProposerRelationship",
            "class": "",
            "value": "",
          }
        ]
      },
      {
        "sectionTitle": "Insured Member",
        "visibleLabel": true,
        "visible": true,
        "class": "section-title",
        "formControls": [
          {
            "name": "insuredMemberDetails",
            "label": "Insured",
            "visibleLabel": true,
            "type": "tabview",
            "value": 1,
            "visible": true,
            "class": "col-md-12 ",
            "dynamicControls": [
              [
                {
                  "name": "relationshipType",
                  "label": "Member Type",
                  "visibleLabel": false,
                  "class": "col-12 col-md-6 col-lg-3",
                  "disabled": true,
                  "type": "select",
                  "visible": false,
                  "value": "",
                },
                {
                  "name": "relation",
                  "label": "Relation",
                  "disabled": true,
                  "visibleLabel": false,
                  "class": "col-12 col-md-6 col-lg-3",
                  "type": "word",
                  "visible": false,
                  "value": ""
                },
                // {
                //   "name": "Sum Insured",
                //   "visibleLabel": true,
                //   "label": "Sum Insured",
                //   "class": "col-12 col-md-6 col-lg-12",
                //   "type": "paragraph",
                //   "visible": true
                // },
                {
                  "name": "sumInsured",
                  "label": "Sum Insured",
                  "visibleLabel": true,
                  "type": "word",
                  "value": "",
                  "class": "col-12 col-md-6 col-lg-4",
                  "visible": true,
                  "disabled": true,
                },
                {
                  "name": "Personal Details",
                  "visibleLabel": true,
                  "label": "Member Details",
                  "class": "col-12 col-md-6 col-lg-12 addMember",
                  "type": "paragraph",
                  "visible": true
                },
                {
                  "name": "preFix",
                  "label": "Salutation",
                  "visibleLabel": true,
                  "visible": true,
                  "value": "",
                  "type": "word",
                  "disabled": true,
                  "class": "col-12 col-md-6 col-lg-3"
                },
                {
                  "name": "firstName",
                  "label": "First Name",
                  "visible": true,
                  "visibleLabel": true,
                  "type": "word",
                  "value": "",
                  "disabled": true,
                  "class": "col-12 col-md-6 col-lg-3",
                },
                {
                  "name": "middleName",
                  "label": "Middle Name",
                  "visible": true,
                  "visibleLabel": true,
                  "type": "word",
                  "value": "",
                  "disabled": true,
                  "class": "col-12 col-md-6 col-lg-3"
                },
                {
                  "name": "lastName",
                  "label": "Last Name",
                  "visibleLabel": true,
                  "visible": true,
                  "type": "word",
                  "value": "",
                  "disabled": true,
                  "class": "col-12 col-md-6 col-lg-3",
                },
                {
                  "name": "height",
                  "label": "Height(cm)",
                  "visibleLabel": true,
                  "type": "word",
                  "disabled": true,
                  "visible": true,
                  "value": "",
                  "class": "col-12 col-md-6 col-lg-3",
                },
                {
                  "name": "weight",
                  "label": "Weight(In Kgs)",
                  "visible": true,
                  "visibleLabel": true,
                  "type": "word",
                  "value": "",
                  "disabled": true,
                  "class": "col-12 col-md-6 col-lg-3",
                },
                {
                  "name": "memberGender",
                  "label": "Gender",
                  "visibleLabel": true,
                  "type": "word",
                  "value": "",
                  "visible": true,
                  "disabled": true,
                  "class": "col-12 col-md-6 col-lg-3",
                },
                {
                  "name": "memberDob",
                  "label": "Date of Birth",
                  "visible": true,
                  "visibleLabel": true,
                  "type": "word",
                  "value": "",
                  "class": "col-12 col-md-6 col-lg-3",
                  "disabled": true
                },
                {
                  "name": "mobileNumber",
                  "label": "Mobile Number",
                  "visibleLabel": true,
                  "visible": true,
                  "type": "word",
                  "value": "",
                  "disabled": true,
                  "class": "col-12 col-md-6 col-lg-3",
                },
                {
                  "name": "designation",
                  "label": "Designation",
                  "visibleLabel": true,
                  "type": "word",
                  "visible": true,
                  "value": "",
                  "disabled": true,
                  "class": "col-12 col-md-6 col-lg-3"
                },
                {
                  "name": "emailId",
                  "label": "Email Address",
                  "visible": true,
                  "visibleLabel": true,
                  "type": "word",
                  "value": "",
                  "disabled": true,
                  "class": "col-12 col-md-6 col-lg-6",
                },
                // {
                //   "name": "GHDApplicable",
                //   "label": "GHD Applicable",
                //   "visibleLabel": true,
                //   "class": "radio-button",
                //   "value": "N",
                //   "visible": true,
                //   "disabled": false,
                //   "methodName": "",
                //   "radioOptions": [
                //     {
                //       "name": "Y",
                //       "label": "Yes",
                //       "value": "Y",
                //       "selected": false
                //     },
                //     {
                //       "name": "N",
                //       "label": "No",
                //       "value": "N",
                //       "selected": true
                //     }
                //   ],
                //   "type": "radio"
                // },
                // {
                //   "name": "GHDRemarks",
                //   "label": "GHD Remarks",
                //   "visibleLabel": true,
                //   "type": "word",
                //   "value": "",
                //   "visible": true,
                //   "disabled": false,
                //   "class": "col-12 col-md-6 col-lg-6",
                //   "validators": [
                //     {
                //       "validatorName": "required",
                //       "required": true,
                //       "message": "GHDRemark is required field"
                //     }
                //   ]
                // },

              ]
            ]
          }
        ]
      },
      {
        "sectionTitle": "Update Pan Card Number ",
        "visible": true,
        "visibleLabel": true,
        "class": "section-title",
        "formControls": [
          {
            "name": "panNo",
            "label": "Pan Card Number",
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
                "message": "PAN Card is a required field"
              },
              {
                "validatorName": "pattern",
                "pattern": "^[A-Z]{5}[0-9]{4}[A-Z]{1}$",
                "message": "PAN Card must follow the format: 5 uppercase letters, 4 digits, and 1 uppercase letter."
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
            "name": "next",
            "label": "Next",
            "visibleLabel": false,
            "visible": true,
            "type": "button",
            "class": "col-12 col-md-6 col-lg-2 next-btn",
            "methodName": "onSubmit"
          }
        ]
      }
    ]
  }