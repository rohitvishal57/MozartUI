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
            "type": "text",
            "value": "",
            "disabled": true,
            "visible": true,
            "class": "col-12 col-md-6 col-lg-4"
          },
          {
            "name": "policyNumber",
            "label": "Policy NO",
            "visibleLabel": true,
            "type": "text",
            "value": "",
            "disabled": true,
            "visible": true,
            "class": "col-12 col-md-6 col-lg-4",
          },
          {
            "name": "productName",
            "label": "Product",
            "visibleLabel": true,
            "type": "text",
            "value": "",
            "visible": true,
            "disabled": true,
            "class": "col-12 col-md-6 col-lg-4"
          },
          {
            "name": "sumInsured",
            "label": "Sum Insured",
            "visibleLabel": true,
            "type": "text",
            "value": "",
            "visible": true,
            "disabled": true,
            "class": "col-12 col-md-6 col-lg-4"
          },
          {
            "name": "panNo",
            "label": "Pan Card Number",
            "visibleLabel": true,
            "type": "text",
            "disabled": true,
            "visible": true,
            "value": "",
            "class": "col-12 col-md-6 col-lg-4",
          },
          {
            "name": "proposerAddress1",
            "label": "Correspondence Address 1",
            "visibleLabel": true,
            "type": "text",
            "value": "",
            "visible": true,
            "disabled": true,
            "class": "col-12 col-md-6 col-lg-4",
          },
          {
            "name": "proposerAddress2",
            "label": "Correspondence Address 2",
            "visibleLabel": true,
            "type": "text",
            "value": "",
            "visible": true,
            "disabled": true,
            "class": "col-12 col-md-6 col-lg-4"
          },
          {
            "name": "proposerPincode",
            "label": "Pincode",
            "visibleLabel": true,
            "visible": true,
            "type": "number",
            "value": "",
            "disabled": true,
            "class": "col-12 col-md-6 col-lg-4",
          },
          {
            "name": "country",
            "label": "Country",
            "visibleLabel": true,
            "type": "text",
            "value": "",
            "visible": false,
            "class": "col-12 col-md-6 col-lg-4"
          },
          {
            "name": "city",
            "label": "City",
            "class": "col-12 col-md-6 col-lg-4",
            "disabled": true,
            "visible": true,
            "visibleLabel": true,
            "value": "",
            "type": "text"
          },
          {
            "name": "state",
            "label": "State",
            "visibleLabel": true,
            "type": "text",
            "value": "",
            "visible": true,
            "disabled": true,
            "class": "col-12 col-md-6 col-lg-4"
          },
          {
            "name": "memberPolicyType",
            "label": "Select Policy Type",
            "visibleLabel": true,
            "visible": false,
            "type": "text",
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
                  "type": "text",
                  "visible": false,
                  "value": ""
                },
                {
                  "name": "Sum Insured",
                  "visibleLabel": true,
                  "label": "Sum Insured",
                  "class": "col-12 col-md-6 col-lg-12",
                  "type": "paragraph",
                  "visible": true
                },
                {
                  "name": "sumInsured",
                  "label": "Sum Insured",
                  "visibleLabel": true,
                  "type": "text",
                  "value": "",
                  "class": "col-12 col-md-6 col-lg-4",
                  "visible": true,
                  "disabled": true,
                },
                {
                  "name": "Personal Details",
                  "visibleLabel": true,
                  "label": "Member Details",
                  "class": "col-12 col-md-6 col-lg-12",
                  "type": "paragraph",
                  "visible": true
                },
                {
                  "name": "preFix",
                  "label": "Salutation",
                  "visibleLabel": true,
                  "visible": true,
                  "value": "",
                  "type": "text",
                  "disabled": true,
                  "class": "col-12 col-md-6 col-lg-3"
                },
                {
                  "name": "firstName",
                  "label": "First Name",
                  "visible": true,
                  "visibleLabel": true,
                  "type": "text",
                  "value": "",
                  "disabled": true,
                  "class": "col-12 col-md-6 col-lg-3",
                },
                {
                  "name": "middleName",
                  "label": "Middle Name",
                  "visible": true,
                  "visibleLabel": true,
                  "type": "text",
                  "value": "",
                  "disabled": true,
                  "class": "col-12 col-md-6 col-lg-3"
                },
                {
                  "name": "lastName",
                  "label": "Last Name",
                  "visibleLabel": true,
                  "visible": true,
                  "type": "text",
                  "value": "",
                  "disabled": true,
                  "class": "col-12 col-md-6 col-lg-3",
                },
                {
                  "name": "height",
                  "label": "Height(cm)",
                  "visibleLabel": true,
                  "type": "text",
                  "disabled": true,
                  "visible": true,
                  "value": "",
                  "class": "col-12 col-md-6 col-lg-4",
                },
                {
                  "name": "weight",
                  "label": "Weight(In Kgs)",
                  "visible": true,
                  "visibleLabel": true,
                  "type": "text",
                  "value": "",
                  "disabled": true,
                  "class": "col-12 col-md-6 col-lg-4",
                },
                {
                  "name": "memberGender",
                  "label": "Gender",
                  "visibleLabel": true,
                  "type": "text",
                  "value": "",
                  "visible": true,
                  "disabled": true,
                  "class": "col-12 col-md-6 col-lg-4",
                },
                {
                  "name": "memberDob",
                  "label": "Date of Birth",
                  "visible": true,
                  "visibleLabel": true,
                  "type": "date",
                  "value": "",
                  "class": "col-12 col-md-6 col-lg-4",
                  "disabled": true
                },
                {
                  "name": "emailId",
                  "label": "Email Address",
                  "visible": true,
                  "visibleLabel": true,
                  "type": "text",
                  "value": "",
                  "disabled": true,
                  "class": "col-12 col-md-6 col-lg-4",
                },
                {
                  "name": "mobileNumber",
                  "label": "Mobile Number",
                  "visibleLabel": true,
                  "visible": true,
                  "type": "text",
                  "value": "",
                  "disabled": true,
                  "class": "col-12 col-md-6 col-lg-4",
                },
                {
                  "name": "designation",
                  "label": "Designation",
                  "visibleLabel": true,
                  "type": "text",
                  "visible": true,
                  "value": "",
                  "disabled": true,
                  "class": "col-12 col-md-6 col-lg-4"
                }
              ]
            ]
          }
        ]
      },
      {
        "sectionTitle": "Declaration",
        "visible": true,
        "visibleLabel": true,
        "class": "section-title",
        "formControls": [
          {
            "name": "consentCheck",
            "visible": true,
            "value": false,
            "visibleLabel": true,
            "label": "I agree to receive the policy document and supporting documents and communications on my registered email or Mobile number shared with the Company, I shall specifically request the company in need of physical copy of policy document",
            "class": "col-md-12 acceptTermsCheck",
            "type": "checkbox",
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