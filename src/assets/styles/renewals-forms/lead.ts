export const renewals_lead = {
    "formTitle": "Leads",
    "saveBtnTitle": "Save",
    "prevBtnTitle": "",
    "resetBtnTitle": "",
    "calculateBtnTitle": "",
    "saveBtnFunction": "getPremiumAmount",
    "themeFile": "ABHI.css",
    "formSections": [
      {
        "sectionTitle": "Personal Details",
        "visibleLabel": true,
        "visible": true,
        "class": "col-md-12 section-title",
        "formControls": [
          {
            "name": "isPep",
            "label": "Are you a PEP (Politically Exposed Person) or relative of PEP?",
            "visibleLabel": true,
            "class": "radio-button",
            "value": "N",
            "disabled": true,
            "visible": true,
            "radioOptions": [
              {
                "name": "N",
                "label": "No",
                "value": "N",
                "selected": true
              },
              {
                "name": "Y",
                "label": "Yes",
                "value": "Y",
                "selected": false
              }
            ],
            "type": "radio"
          },
          {
            "name": "productVariant",
            "label": "Product Variant",
            "visibleLabel": true,
            "visible": false,
            "type": "text",
            "value": "",
            "class": "col-12 col-md-6 col-lg-4"
          },
          {
            "name": "tenureAmount",
            "label": "Tenure Amount",
            "visible": false,
            "visibleLabel": false,
            "type": "text",
            "value": "",
            "class": "col-12 col-md-6 col-lg-2"
          },
          {
            "name": "displayTaxList",
            "label": "Display Tax List",
            "visible": false,
            "visibleLabel": false,
            "type": "text",
            "value": "",
            "class": "col-12 col-md-6 col-lg-2"
          },
          {
            "name": "ckycNo",
            "label": "Customer KYC",
            "visible": false,
            "visibleLabel": false,
            "type": "text",
            "value": "",
            "class": "col-12 col-md-6 col-lg-2"
          },
          {
            "name": "isEmployee",
            "label": "Is Employee",
            "visibleLabel": true,
            "visible": false,
            "type": "text",
            "value": false,
            "class": "col-12 col-md-6 col-lg-4"
          },
          {
            "name": "typeOfBusiness",
            "label": "Business Type",
            "visibleLabel": true,
            "visible": false,
            "type": "text",
            "value": "REN",
            "class": "col-12 col-md-6 col-lg-4"
          },
          {
            "name": "memberPlan",
            "label": "Activ One Max",
            "visibleLabel": true,
            "type": "text",
            "visible": false,
            "value": "",
            "class": "col-12 col-md-6 col-lg-4"
          },
          {
            "name": "productName",
            "label": "Product Name",
            "visibleLabel": false,
            "type": "text",
            "value": "Activ One Max",
            "class": "",
            "visible": false
          },
          {
            "name": "planCode",
            "label": "Product Code",
            "visibleLabel": false,
            "type": "text",
            "value": "",
            "class": "",
            "visible": false
          },
          {
            "name": "productId",
            "label": "Product Id",
            "visibleLabel": false,
            "type": "text",
            "value": "",
            "class": "",
            "visible": false
          },
          {
            "name": "preFix",
            "label": "Salutation",
            "visibleLabel": true,
            "visible": true,
            "value": "",
            "disabled": true,
            "type": "select",
            "options": [
              {
                "value": "Mr",
                "name": "Mr"
              },
              {
                "value": "Mrs",
                "name": "Mrs"
              },
              {
                "value": "Ms",
                "name": "Ms"
              },
              {
                "value": "Dr",
                "name": "Dr"
              },
              {
                "value": "Mx",
                "name": "Mx"
              },
              {
                "value": "Miss",
                "name": "Miss"
              },
              {
                "value": "Others",
                "name": "Others"
              }
            ],
            "class": "col-12 col-md-6 col-lg-3"
          },
          {
            "name": "firstName",
            "label": "First Name",
            "visibleLabel": true,
            "type": "text",
            "value": "",
            "disabled": true,
            "visible": true,
            "class": "col-12 col-md-6 col-lg-3",
            "validators": [
              {
                "validatorName": "required",
                "required": true,
                "message": "First Name is required"
              },
              {
                "validatorName": "pattern",
                "pattern": "^[a-zA-Z ]*$",
                "message": "Name should contain only alphabets"
              }
            ]
          },
          {
            "name": "middleName",
            "label": "Middle Name",
            "visibleLabel": true,
            "type": "text",
            "value": "",
            "visible": true,
            "disabled": true,
            "class": "col-12 col-md-6 col-lg-3"
          },
          {
            "name": "lastName",
            "label": "Last Name",
            "visibleLabel": true,
            "type": "text",
            "value": "",
            "visible": true,
            "disabled": true,
            "class": "col-12 col-md-6 col-lg-3",
            "validators": [
              {
                "validatorName": "required",
                "required": true,
                "message": "Last Name is required"
              },
              {
                "validatorName": "pattern",
                "pattern": "^[a-zA-Z ]*$",
                "message": "Name should contain only alphabets"
              }
            ]
          },
          {
            "name": "proposerGender",
            "label": "Gender",
            "visibleLabel": true,
            "type": "select",
            "value": "",
            "disabled": true,
            "class": "col-12 col-md-6 col-lg-4",
            "visible": true,
            "options": [
              {
                "name": "Male",
                "value": "M"
              },
              {
                "name": "Female",
                "value": "F"
              },
              {
                "name": "Others",
                "value": "O"
              }
            ],
            "validators": [
              {
                "validatorName": "required",
                "required": true,
                "message": "Gender is required field."
              }
            ]
          },
          {
            "name": "emailId",
            "label": "Email Address",
            "visible": true,
            "visibleLabel": true,
            "type": "email",
            "value": "",
            "disabled": true,
            "class": "col-12 col-md-6 col-lg-4",
            "validators": [
              {
                "validatorName": "required",
                "required": true,
                "message": "Email Id is required field"
              },
              {
                "validatorName": "pattern",
                "pattern": "^(?!.*[._-]{2})[a-zA-Z0-9]+([._-][a-zA-Z0-9]+)*@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$",
                "message": "Email Id is not valid"
              }
            ]
          },
          {
            "name": "proposerAddress1",
            "label": "Correspondence Address 1",
            "visibleLabel": true,
            "type": "text",
            "value": "",
            "visible": true,
            "class": "col-12 col-md-6 col-lg-4",
            "validators": [
              {
                "validatorName": "required",
                "message": "Address1 is Required"
              }
            ]
          },
          {
            "name": "proposerAddress2",
            "label": "Correspondence Address 2",
            "visibleLabel": true,
            "type": "text",
            "value": "",
            "visible": true,
            "class": "col-12 col-md-6 col-lg-4"
          },
          {
            "name": "permanentAddress1",
            "label": "Permanent Address 1",
            "visibleLabel": true,
            "type": "text",
            "value": "",
            "visible": true,
            "class": "col-12 col-md-6 col-lg-4",
            "validators": [
              {
                "validatorName": "required",
                "message": "Address1 is Required"
              }
            ]
          },
          {
            "name": "permanentAddress2",
            "label": "Permanent Address 2",
            "visibleLabel": true,
            "type": "text",
            "value": "",
            "visible": true,
            "class": "col-12 col-md-6 col-lg-4",
            "validators": [
              {
                "validatorName": "required",
                "message": "Address2 is Required"
              }
            ]
          },
          {
            "name": "permanentAddress3",
            "label": "Permanent Address 3",
            "visibleLabel": true,
            "type": "text",
            "value": "",
            "visible": true,
            "class": "col-12 col-md-6 col-lg-4",
            "validators": [
              {
                "validatorName": "required",
                "message": "Address3 is Required"
              }
            ]
          },
          {
            "name": "city",
            "label": "City",
            "visibleLabel": true,
            "type": "text",
            "value": "",
            "visible": false,
            "class": "col-12 col-md-6 col-lg-4"
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
            "name": "state",
            "label": "State",
            "visibleLabel": true,
            "type": "text",
            "value": "",
            "visible": false,
            "class": "col-12 col-md-6 col-lg-4"
          },
          {
            "name": "mobileNumber",
            "label": "Mobile Number",
            "visibleLabel": true,
            "visible": true,
            "type": "phonenumber",
            "value": "",
            "disabled": true,
            "maxLength": 10,
            "class": "col-12 col-md-6 col-lg-4",
            "validators": [
              {
                "validatorName": "required",
                "required": true,
                "message": "Mobile No is required field"
              },
              {
                "validatorName": "pattern",
                "pattern": "^[6-9]\\d{9}$",
                "message": "Mobile No is not valid"
              }
            ]
          },
          {
            "name": "idProof",
            "label": "ID Type",
            "visibleLabel": true,
            "visible": true,
            "type": "select",
            "disabled": true,
            "value": "",
            "class": "col-12 col-md-6 col-lg-4",
            "options": [
              {
                "id": "2",
                "value": "Aadhar Card",
                "name": "Aadhar Card"
              },
              {
                "id": "3",
                "value": "Passport",
                "name": "Passport"
              },
              {
                "id": "4",
                "value": "Driving License",
                "name": "Driving License"
              },
              {
                "id": "5",
                "value": "Voter ID",
                "name": "Voter ID"
              },
              {
                "id": "6",
                "value": "10th (SSC) Mark sheet",
                "name": "10th (SSC) Mark sheet"
              }
            ],
            "validators": [
              {
                "validatorName": "required",
                "required": true,
                "message": "Id is required field"
              }
            ]
          },
          {
            "name": "idNo",
            "label": "ID Number",
            "visibleLabel": true,
            "type": "idnumber",
            "disabled": true,
            "visible": true,
            "value": "",
            "class": "col-12 col-md-6 col-lg-4",
            "validators": [
              {
                "validatorName": "required",
                "required": true,
                "message": "ID No is required field"
              }
            ]
          },
          {
            "name": "annualIncome",
            "label": "Annual Income",
            "visibleLabel": true,
            "type": "select",
            "visible": true,
            "disabled": true,
            "value": "",
            "class": "col-12 col-md-6 col-lg-4",
            "options": [
              {
                "name": "Upto 5L",
                "value": "500000"
              },
              {
                "name": "5L to 10L",
                "value": "1000000"
              },
              {
                "name": "10L to 15L",
                "value": "1500000"
              },
              {
                "name": "15L to 20L",
                "value": "2000000"
              },
              {
                "name": "20L",
                "value": "2500000"
              }
            ],
            "validators": [
              {
                "validatorName": "required",
                "required": true,
                "message": "Annual Income is required field"
              }
            ]
          },
          {
            "name": "occupation",
            "label": "Occupation",
            "visibleLabel": true,
            "getAllOption": "getAllProposerOccupation",
            "type": "select",
            "visible": true,
            "disabled": true,
            "value": "",
            "class": "col-12 col-md-6 col-lg-4",
            "options": []
          },
          {
            "name": "maritalStatus",
            "label": "Marital Status",
            "visibleLabel": true,
            "type": "select",
            "visible": true,
            "disabled": true,
            "value": "",
            "class": "col-12 col-md-6 col-lg-4",
            "options": [
              {
                "id": "M",
                "value": "Married",
                "name": "Married"
              },
              {
                "id": "S",
                "value": "Single",
                "name": "Single"
              },
              {
                "id": "W",
                "value": "Widow(er)",
                "name": "Widow(er)"
              },
              {
                "id": "PS",
                "value": "Separated",
                "name": "Separated"
              },
              {
                "id": "D",
                "value": "Divorced",
                "name": "Divorced"
              },
              {
                "id": "L",
                "value": "Live In",
                "name": "Live In"
              }
            ],
            "validators": [
              {
                "validatorName": "required",
                "required": true,
                "message": "Marital Status is required field"
              }
            ]
          },
          {
            "name": "gstDetails",
            "label": "GST Details",
            "visibleLabel": true,
            "type": "select",
            "visible": true,
            "value": "",
            "disabled": true,
            "class": "col-12 col-md-6 col-lg-4",
            "options": [
              {
                "value": "Consumers",
                "name": "Consumers",
                "selected": true
              },
              {
                "value": "Registered",
                "name": "Registered",
                "selected": false
              },
              {
                "value": "Compounding Dealers",
                "name": "Compounding Dealers",
                "selected": false
              }
            ],
            "validators": [
              {
                "validatorName": "required",
                "required": true,
                "message": "GST Details is required field"
              }
            ]
          },
          {
            "name": "educationDetails",
            "label": "Education",
            "visibleLabel": true,
            "visible": true,
            "disabled": true,
            "type": "select",
            "value": "",
            "class": "col-12 col-md-6 col-lg-4",
            "options": [
              {
                "id": "2",
                "value": "Below Metric",
                "name": "Below Metric"
              },
              {
                "id": "3",
                "value": "Metric",
                "name": "Metric"
              },
              {
                "id": "4",
                "value": "Under Graduate",
                "name": "Under Graduate"
              },
              {
                "id": "5",
                "value": "Graduate",
                "name": "Graduate"
              },
              {
                "id": "6",
                "value": "Post Graduate",
                "name": "Post Graduate"
              },
              {
                "id": "7",
                "value": "Diploma",
                "name": "Diploma"
              },
              {
                "id": "8",
                "value": "Professional",
                "name": "Professional"
              },
              {
                "id": "9",
                "value": "Other",
                "name": "Other"
              }
            ],
            "validators": [
              {
                "validatorName": "required",
                "required": true,
                "message": "Education is required field"
              }
            ]
          },
          {
            "name": "nationality",
            "label": "Nationality",
            "visibleLabel": true,
            "type": "select",
            "visible": true,
            "disabled": true,
            "value": "",
            "class": "col-12 col-md-6 col-lg-4",
            "options": [
              {
                "id": "1",
                "value": "Indian",
                "name": "Indian",
                "selected": true
              },
              {
                "id": "2",
                "value": "Non Resident Indian",
                "name": "Non Resident Indian",
                "selected": false
              },
              {
                "id": "3",
                "value": "Foreign National with Indian Origin",
                "name": "Foreign National with Indian Origin",
                "selected": false
              },
              {
                "id": "4",
                "value": "Person of Indian Origin",
                "name": "Person of Indian Origin",
                "selected": false
              }
            ],
            "validators": [
              {
                "validatorName": "required",
                "required": true,
                "message": "Nationality is required field"
              }
            ]
          },
          {
            "name": "memberPolicyType",
            "label": "Select Policy Type",
            "visibleLabel": true,
            "visible": true,
            "type": "select",
            "dependentControls": [
              "sumInsured",
              "zone"
            ],
            "onChangeMethod": "handlePolicyTypeChange",
            "methodName": "handlePolicyTypeChange",
            "disabled": true,
            "value": "",
            "class": "col-12 col-md-6 col-lg-4",
            "options": [
              {
                "name": "FAMILY FLOATER",
                "value": "Family Floater",
                "selected": false
              },
              {
                "name": "MULTI INDIVIDUAL",
                "value": "Multi Individual",
                "selected": false
              }
            ],
            "validators": [
              {
                "validatorName": "required",
                "required": true,
                "message": "Policy Type is required field."
              }
            ]
          },
          {
            "name": "proposerPincode",
            "label": "Pincode",
            "visibleLabel": true,
            "visible": true,
            "type": "number",
            "value": "",
            "class": "col-12 col-md-6 col-lg-4",
            "validators": [
              {
                "validatorName": "required",
                "required": true,
                "message": "Pincode is required field"
              },
              {
                "validatorName": "pattern",
                "pattern": "^[1-9][0-9]{5}$",
                "message": "Pincode is not valid"
              }
            ]
          },
          {
            "name": "city",
            "label": "City",
            "class": "col-12 col-md-6 col-lg-3",
            "disabled": true,
            "visible": false,
            "visibleLabel": true,
            "value": "",
            "type": "text"
          },
          {
            "name": "zoneValue",
            "label": "Zone Value",
            "class": "col-12 col-md-6 col-lg-3",
            "visible": false,
            "visibleLabel": true,
            "value": "",
            "type": "text"
          },
          {
            "name": "zone",
            "label": "Zone",
            "class": "col-12 col-md-6 col-lg-4",
            "visibleLabel": false,
            "disabled": true,
            "visible": false,
            "value": "",
            "type": "text"
          },
          {
            "name": "state",
            "label": "State",
            "class": "col-md-2",
            "visibleLabel": true,
            "disabled": true,
            "visible": false,
            "value": "",
            "type": "text"
          },
          {
            "name": "horizontalLine",
            "type": "line",
            "visible": true,
            "class": "custom-line"
          },
          {
            "name": "addMembers",
            "label": "Add Members",
            "type": "paragraph",
            "visibleLabel": true,
            "visible": true,
            "class": "col-12 col-md-6 col-lg-4 addMember"
          },
          {
            "name": "insureMem",
            "visibleLabel": true,
            "label": "Who do you want to insure?",
            "type": "paragraph",
            "visible": true,
            "class": "col-12 col-md-6 col-lg-6 insureMember"
          },
          {
            "name": "numberOfInsuredMembers",
            "label": "Number of Insured Members",
            "visibleLabel": false,
            "visible": false,
            "type": "text",
            "class": "",
            "value": 0,
            "validators": [
              {
                "validatorName": "required",
                "required": true,
                "message": "Select Relationhip"
              }
            ]
          },
          {
            "name": "insuredMembers",
            "label": "Number of Insured Members",
            "visibleLabel": false,
            "visible": true,
            "type": "multiSelectCheckbox",
            "class": "",
            "idProperty": "insuredMemberDetails",
            "text": "insuredMemberDetails",
            "value": "",
            "selectCheckboxOptions": [],
            "validators": [
              {
                "validatorName": "required",
                "required": true,
                "message": "Minimum number of selected member should be "
              }
            ]
          }
        ]
      },
      {
        "sectionTitle": "Insured Member Details",
        "visibleLabel": true,
        "visible": false,
        "class": "section-title",
        "formControls": [
          {
            "name": "insuredMemberDetails",
            "label": "Insured Member Details",
            "visibleLabel": false,
            "type": "details",
            "value": 1,
            "visible": false,
            "class": "col-md-12 ",
            "dynamicControls": [
              [
                {
                  "name": "relationshipType",
                  "visibleLabel": false,
                  "label": "Relationship Type",
                  "value": "",
                  "class": "col-md-2",
                  "type": "text",
                  "visible": false
                },
                {
                  "name": "relation",
                  "visibleLabel": true,
                  "label": "Relation",
                  "value": "",
                  "class": "col-md-2",
                  "type": "text",
                  "visible": true,
                  "disabled": true,
                  "otherControlName": "memberAge",
                  "methodName": "setupRelationshipTypeValidation",
                  "validationRules": [
                    {
                      "type": "adult",
                      "validatorName": "pattern",
                      "pattern": "^(1[8-9]|[2-9][0-9]|1[0-1][0-9]|120)$",
                      "message": "Age should be between 18 - 120."
                    },
                    {
                      "type": "child",
                      "validatorName": "pattern",
                      "pattern": "^(2[0-5]|1[0-9]|[5-9])$",
                      "message": "Age should be between 4 - 25 years."
                    }
                  ]
                },
                {
                  "name": "memberdob",
                  "label": "Date of Birth",
                  "visibleLabel": true,
                  "type": "date",
                  "visible": true,
                  "value": "",
                  "dependentControls": [
                    "memberAge"
                  ],
                  "class": "col-md-3",
                  "validators": [
                    {
                      "validatorName": "required",
                      "required": true,
                      "message": "DOB is required field."
                    },
                    {
                      "validatorName": "pattern",
                      "pattern": "^\\d{4}-\\d{2}-\\d{2}$",
                      "message": "DOB should be in dd/mm/yyyy format."
                    }
                  ]
                },
                {
                  "name": "memberAge",
                  "label": "Age",
                  "visibleLabel": true,
                  "disabled": true,
                  "visible": true,
                  "type": "text",
                  "value": "",
                  "class": "col-md-2",
                  "validators": [
                    {
                      "validatorName": "required",
                      "required": true,
                      "message": "Age is required field."
                    },
                    {
                      "validatorName": "pattern",
                      "pattern": "^(1[8-9]|[2-9][0-9]|1[0-1][0-9]|120)$",
                      "message": "Age should be between 18-120."
                    }
                  ]
                },
                {
                  "name": "firstName",
                  "label": "Last Name",
                  "visibleLabel": false,
                  "type": "text",
                  "value": "",
                  "visible": false,
                  "class": "col-12 col-md-6 col-lg-4"
                },
                {
                  "name": "lastName",
                  "label": "Last Name",
                  "visibleLabel": false,
                  "type": "text",
                  "value": "",
                  "visible": false,
                  "class": "col-12 col-md-6 col-lg-4"
                },
                {
                  "name": "middleName",
                  "label": "Middle Name",
                  "visibleLabel": true,
                  "type": "text",
                  "value": "",
                  "visible": false,
                  "class": "col-12 col-md-6 col-lg-3"
                },
                {
                  "name": "mobileNumber",
                  "label": "Mobile Number",
                  "visibleLabel": true,
                  "visible": false,
                  "type": "phonenumber",
                  "value": "",
                  "class": "col-12 col-md-6 col-lg-4"
                },
                {
                  "name": "weight",
                  "label": "Weight(In Kgs)",
                  "visible": false,
                  "visibleLabel": false,
                  "type": "text",
                  "value": "",
                  "class": "col-12 col-md-6 col-lg-4"
                },
                {
                  "name": "height",
                  "label": "Enter Height ft",
                  "visibleLabel": false,
                  "type": "text",
                  "visible": false,
                  "value": "",
                  "class": "col-12 col-md-6 col-lg-2"
                },
                {
                  "name": "memberRoomCategory",
                  "label": "Room Category",
                  "visibleLabel": false,
                  "type": "text",
                  "value": "UPTOSI",
                  "class": "",
                  "visible": false
                },
                {
                  "name": "heightInches",
                  "label": "Enter Height in",
                  "visibleLabel": false,
                  "visible": false,
                  "type": "text",
                  "value": "",
                  "class": "col-12 col-md-6 col-lg-2"
                },
                {
                  "name": "emailId",
                  "label": "Email Address",
                  "visible": false,
                  "visibleLabel": false,
                  "type": "text",
                  "value": "",
                  "class": "col-12 col-md-6 col-lg-4"
                },
                {
                  "name": "memberGender",
                  "label": "Gender",
                  "visibleLabel": true,
                  "type": "select",
                  "value": "",
                  "class": "col-md-3",
                  "options": [
                    {
                      "name": "Male",
                      "value": "M"
                    },
                    {
                      "name": "Female",
                      "value": "F"
                    },
                    {
                      "name": "Others",
                      "value": "O"
                    }
                  ],
                  "validators": [
                    {
                      "validatorName": "required",
                      "required": true,
                      "message": "Gender is required field."
                    }
                  ]
                },
                {
                  "name": "sumInsured",
                  "label": "Sum Insured",
                  "visibleLabel": true,
                  "type": "select",
                  "value": "",
                  "class": "col-12 col-md-6 col-lg-3",
                  "visible": true,
                  "options": [
                    {
                      "name": "500000",
                      "value": 500000
                    },
                    {
                      "name": "700000",
                      "value": 700000
                    },
                    {
                      "name": "1000000",
                      "value": 1000000
                    },
                    {
                      "name": "1500000",
                      "value": 1500000
                    },
                    {
                      "name": "2000000",
                      "value": 2000000
                    },
                    {
                      "name": "2500000",
                      "value": 2500000
                    },
                    {
                      "name": "5000000",
                      "value": 5000000
                    },
                    {
                      "name": "7500000",
                      "value": 7500000
                    },
                    {
                      "name": "10000000",
                      "value": 10000000
                    },
                    {
                      "name": "20000000",
                      "value": 20000000
                    }
                  ],
                  "validators": [
                    {
                      "validatorName": "required",
                      "required": true,
                      "message": "Sum Insured is required field"
                    }
                  ]
                },
                {
                  "name": "pincode",
                  "label": "Pincode",
                  "visibleLabel": true,
                  "type": "text",
                  "visible": true,
                  "value": "",
                  "class": "col-12 col-md-6 col-lg-3",
                  "validators": [
                    {
                      "validatorName": "required",
                      "required": true,
                      "message": "Pincode is required field."
                    },
                    {
                      "validatorName": "pattern",
                      "pattern": "^[1-9][0-9]{5}$",
                      "message": "Pincode is not valid only 6 digits accepted"
                    }
                  ]
                },
                {
                  "name": "planType",
                  "label": "Plan Type",
                  "visibleLabel": false,
                  "type": "text",
                  "value": "Multi Individual",
                  "class": "",
                  "visible": false
                },
                {
                  "name": "memberIndex",
                  "label": "Member Index",
                  "visibleLabel": false,
                  "type": "text",
                  "value": "",
                  "class": "",
                  "visible": false
                },
                {
                  "name": "city",
                  "label": "City",
                  "class": "col-12 col-md-6 col-lg-3",
                  "disabled": true,
                  "visibleLabel": true,
                  "visible": false,
                  "value": "",
                  "type": "text"
                },
                {
                  "name": "zoneValue",
                  "label": "Zone Value",
                  "class": "col-12 col-md-6 col-lg-3",
                  "visible": false,
                  "disabled": true,
                  "visibleLabel": false,
                  "value": "",
                  "type": "text"
                },
                {
                  "name": "zone",
                  "label": "Zone",
                  "class": "col-md-2",
                  "visibleLabel": true,
                  "visible": true,
                  "disabled": true,
                  "value": "",
                  "type": "text"
                },
                {
                  "name": "state",
                  "label": "State",
                  "class": "col-md-2",
                  "visibleLabel": false,
                  "visible": false,
                  "value": "",
                  "type": "text"
                },
                {
                  "name": "covers",
                  "label": "Add On Covers",
                  "visibleLabel": false,
                  "type": "text",
                  "value": "",
                  "subControls": [],
                  "class": "",
                  "visible": false
                },
                {
                  "name": "preFix",
                  "label": "Salutation",
                  "visibleLabel": false,
                  "visible": false,
                  "value": "",
                  "type": "select",
                  "options": [
                    {
                      "value": "Mr",
                      "name": "Mr"
                    },
                    {
                      "value": "Mrs",
                      "name": "Mrs"
                    },
                    {
                      "value": "Ms",
                      "name": "Ms"
                    },
                    {
                      "value": "Dr",
                      "name": "Dr"
                    },
                    {
                      "value": "Mx",
                      "name": "Mx"
                    },
                    {
                      "value": "Miss",
                      "name": "Miss"
                    },
                    {
                      "value": "Others",
                      "name": "Others"
                    }
                  ],
                  "class": "col-12 col-md-6 col-lg-3"
                },
                {
                  "name": "productMemberDesignation",
                  "label": "occupation",
                  "visibleLabel": false,
                  "visible": false,
                  "value": "",
                  "options": [],
                  "type": "select",
                  "class": "col-12 col-md-6 col-lg-3"
                }
              ]
            ]
          },
          {
            "name": "insuredMemberDetails",
            "label": "Insured Member Details",
            "visibleLabel": false,
            "type": "details",
            "value": 1,
            "visible": false,
            "class": "col-md-12 ",
            "dynamicControls": [
              [
                {
                  "name": "relationshipType",
                  "visibleLabel": false,
                  "label": "Relationship Type",
                  "value": "",
                  "class": "col-md-2",
                  "type": "text",
                  "visible": false,
                  "disabled": false
                },
                {
                  "name": "relation",
                  "visibleLabel": false,
                  "label": "Relation",
                  "value": "",
                  "class": "col-12 col-md-6 col-lg-2",
                  "type": "text",
                  "otherControlName": "memberAge",
                  "methodName": "setupRelationshipTypeValidation",
                  "visible": true,
                  "disabled": true,
                  "validationRules": [
                    {
                      "type": "adult",
                      "validatorName": "pattern",
                      "pattern": "^(1[8-9]|[2-9][0-9]|1[0-1][0-9]|120)$",
                      "message": "Age should be between 18 - 120years."
                    },
                    {
                      "type": "child",
                      "validatorName": "pattern",
                      "pattern": "^(9[1-9]|[1-2][0-9][0-9]|3[0-5][0-9]|36[0-4])days$|^([1-9]|1[0-9]|2[0-5])$",
                      "message": "Age should be between 91days - 25years."
                    }
                  ]
                },
                {
                  "name": "memberdob",
                  "label": "Date of Birth",
                  "visibleLabel": true,
                  "type": "date",
                  "value": "",
                  "visible": true,
                  "disabled": false,
                  "dependentControls": [
                    "memberAge"
                  ],
                  "class": "col-12 col-md-6 col-lg-3",
                  "validators": [
                    {
                      "validatorName": "required",
                      "required": true,
                      "message": "DOB is required field."
                    },
                    {
                      "validatorName": "pattern",
                      "pattern": "^\\d{4}-\\d{2}-\\d{2}$",
                      "message": "DOB should be in dd/mm/yyyy format."
                    }
                  ]
                },
                {
                  "name": "memberAge",
                  "label": "Age",
                  "visibleLabel": true,
                  "type": "text",
                  "value": "",
                  "disabled": false,
                  "visible": true,
                  "class": "col-12 col-md-6 col-lg-3",
                  "validators": [
                    {
                      "validatorName": "required",
                      "required": true,
                      "message": "Age is required field."
                    },
                    {
                      "validatorName": "pattern",
                      "pattern": "^(1[8-9]|[2-9][0-9]|1[0-1][0-9]|120)$",
                      "message": "Age should be between 18-120."
                    }
                  ]
                },
                {
                  "name": "memberGender",
                  "label": "Gender",
                  "visibleLabel": true,
                  "type": "select",
                  "value": "",
                  "visible": true,
                  "disabled": false,
                  "class": "col-12 col-md-6 col-lg-3",
                  "options": [
                    {
                      "name": "Male",
                      "value": "M"
                    },
                    {
                      "name": "Female",
                      "value": "F"
                    },
                    {
                      "name": "Others",
                      "value": "O"
                    }
                  ],
                  "validators": [
                    {
                      "validatorName": "required",
                      "required": true,
                      "message": "Gender is required field."
                    }
                  ]
                },
                {
                  "name": "planType",
                  "label": "Plan Type",
                  "visibleLabel": false,
                  "type": "text",
                  "value": "Family Floater",
                  "class": "",
                  "visible": false
                },
                {
                  "name": "memberIndex",
                  "label": "Member Index",
                  "visibleLabel": false,
                  "type": "text",
                  "value": "",
                  "class": "",
                  "visible": false
                },
                {
                  "name": "firstName",
                  "label": "Last Name",
                  "visibleLabel": false,
                  "type": "text",
                  "value": "",
                  "visible": false,
                  "class": "col-12 col-md-6 col-lg-4"
                },
                {
                  "name": "middleName",
                  "label": "Middle Name",
                  "visible": false,
                  "visibleLabel": false,
                  "type": "text",
                  "value": "",
                  "class": "col-12 col-md-6 col-lg-4"
                },
                {
                  "name": "lastName",
                  "label": "Last Name",
                  "visibleLabel": false,
                  "type": "text",
                  "value": "",
                  "visible": false,
                  "class": "col-12 col-md-6 col-lg-4"
                },
                {
                  "name": "weight",
                  "label": "Weight(In Kgs)",
                  "visible": false,
                  "visibleLabel": false,
                  "type": "text",
                  "value": "",
                  "class": "col-12 col-md-6 col-lg-4"
                },
                {
                  "name": "memberRoomCategory",
                  "label": "Room Category",
                  "visibleLabel": false,
                  "type": "text",
                  "value": "UPTOSI",
                  "class": "",
                  "visible": false
                },
                {
                  "name": "height",
                  "label": "Enter Height ft",
                  "visibleLabel": false,
                  "type": "text",
                  "visible": false,
                  "value": "",
                  "class": "col-12 col-md-6 col-lg-2"
                },
                {
                  "name": "heightInches",
                  "label": "Enter Height in",
                  "visibleLabel": false,
                  "visible": false,
                  "type": "text",
                  "value": "",
                  "class": "col-12 col-md-6 col-lg-2"
                },
                {
                  "name": "mobileNumber",
                  "label": "Mobile Number",
                  "visibleLabel": false,
                  "visible": false,
                  "type": "phonenumber",
                  "value": "",
                  "class": "col-12 col-md-6 col-lg-4"
                },
                {
                  "name": "emailId",
                  "label": "Email Address",
                  "visible": false,
                  "visibleLabel": false,
                  "type": "text",
                  "value": "",
                  "class": "col-12 col-md-6 col-lg-4"
                },
                {
                  "name": "memberGender",
                  "label": "Gender",
                  "visibleLabel": false,
                  "visible": false,
                  "type": "select",
                  "value": "",
                  "class": "col-md-3",
                  "options": [
                    {
                      "name": "Male",
                      "value": "M"
                    },
                    {
                      "name": "Female",
                      "value": "F"
                    },
                    {
                      "name": "Others",
                      "value": "O"
                    }
                  ]
                },
                {
                  "name": "sumInsured",
                  "label": "Sum Insured",
                  "visibleLabel": false,
                  "type": "select",
                  "value": "",
                  "class": "col-md-3",
                  "visible": false,
                  "options": [
                    {
                      "name": "500000",
                      "value": 500000
                    },
                    {
                      "name": "700000",
                      "value": 700000
                    },
                    {
                      "name": "1000000",
                      "value": 1000000
                    },
                    {
                      "name": "1500000",
                      "value": 1500000
                    },
                    {
                      "name": "2000000",
                      "value": 2000000
                    },
                    {
                      "name": "2500000",
                      "value": 2500000
                    },
                    {
                      "name": "5000000",
                      "value": 5000000
                    },
                    {
                      "name": "7500000",
                      "value": 7500000
                    },
                    {
                      "name": "10000000",
                      "value": 10000000
                    },
                    {
                      "name": "20000000",
                      "value": 20000000
                    }
                  ],
                  "validators": [
                    {
                      "validatorName": "required",
                      "required": true,
                      "message": "Sum Insured is required field."
                    }
                  ]
                },
                {
                  "name": "covers",
                  "label": "Add On Covers",
                  "visibleLabel": false,
                  "type": "text",
                  "value": "",
                  "subControls": [],
                  "class": "",
                  "visible": false
                },
                {
                  "name": "city",
                  "label": "City",
                  "class": "col-12 col-md-6 col-lg-3",
                  "disabled": true,
                  "visibleLabel": true,
                  "visible": false,
                  "value": "",
                  "type": "text"
                },
                {
                  "name": "zone",
                  "label": "Zone",
                  "class": "col-md-2",
                  "visibleLabel": false,
                  "visible": false,
                  "disabled": true,
                  "value": "",
                  "type": "text"
                },
                {
                  "name": "state",
                  "label": "State",
                  "class": "col-md-2",
                  "visibleLabel": false,
                  "visible": false,
                  "value": "",
                  "type": "text"
                },
                {
                  "name": "pincode",
                  "label": "Pincode",
                  "visibleLabel": true,
                  "visible": false,
                  "type": "number",
                  "value": "",
                  "class": "col-12 col-md-6 col-lg-4"
                },
                {
                  "name": "zoneValue",
                  "label": "Zone Value",
                  "class": "col-12 col-md-6 col-lg-3",
                  "visible": false,
                  "visibleLabel": false,
                  "value": "",
                  "type": "text"
                },
                {
                  "name": "preFix",
                  "label": "Salutation",
                  "visibleLabel": false,
                  "visible": false,
                  "value": "",
                  "type": "select",
                  "options": [
                    {
                      "value": "Mr",
                      "name": "Mr"
                    },
                    {
                      "value": "Mrs",
                      "name": "Mrs"
                    },
                    {
                      "value": "Ms",
                      "name": "Ms"
                    },
                    {
                      "value": "Dr",
                      "name": "Dr"
                    },
                    {
                      "value": "Mx",
                      "name": "Mx"
                    },
                    {
                      "value": "Miss",
                      "name": "Miss"
                    },
                    {
                      "value": "Others",
                      "name": "Others"
                    }
                  ],
                  "class": "col-12 col-md-6 col-lg-3"
                },
                {
                  "name": "productMemberDesignation",
                  "label": "occupation",
                  "visibleLabel": false,
                  "visible": false,
                  "value": "",
                  "options": [],
                  "type": "select",
                  "class": "col-12 col-md-6 col-lg-3"
                }
              ]
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
            "name": "proposalNumber",
            "label": "Proposal Number",
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

  export const policySummary = {
    "formTitle": "Policy Summary",
    "saveBtnTitle": "Save",
    "saveBtnFunction": "insertFullQuoteJson",
    "calculateBtnTitle": "",
    "themeFile": "ABHI.css",
    "formSections": [
      {
        "sectionTitle": "Policy Summary",
        "visible": true,
        "visibleLabel": true,
        "class": "section-title",
        "formControls": [
          {
            "name": "members",
            "label": "Members",
            "visibleLabel": true,
            "type": "summary",
            "value": "",
            "class": "col-6 col-md-2",
            "visible": true,
            "disabled": true,
            "methodName": "mergeMember"
          },
          {
            "name": "productName",
            "label": "Policy",
            "visibleLabel": true,
            "type": "summary",
            "value": "",
            "class": "col-md-3",
            "visible": true,
            "disabled": true
          },
          {
            "name": "totalPremium",
            "label": "Premium",
            "visibleLabel": true,
            "type": "summary",
            "value": "",
            "class": "col-md-2",
            "visible": true,
            "disabled": true
          },
          {
            "name": "sumInsured",
            "label": "Cover",
            "visibleLabel": true,
            "type": "summary",
            "value": "",
            "class": "col-md-2",
            "visible": true,
            "disabled": true
          },
          {
            "name": "tenure",
            "label": "Tenure",
            "visibleLabel": true,
            "type": "summary",
            "value": "",
            "class": "col-md-2",
            "visible": true,
            "disabled": true
          },
          {
            "name": "addons",
            "label": "Add ons",
            "visibleLabel": true,
            "type": "displaycovers",
            "value": "",
            "class": "col-12 col-md-12 typecss_summary_addon",
            "visible": true,
            "disabled": true,
            "methodName": "displaySelectedAddons"
          }
        ]
      },
      {
        "sectionTitle": "Member Details",
        "visible": true,
        "visibleLabel": true,
        "class": "section-title",
        "formControls": [
          {
            "name": "insuredMemberDetails",
            "label": "Insured",
            "visibleLabel": true,
            "class": "col-md-12",
            "visible": true,
            "value": 1,
            "placeholder": "",
            "type": "banner",
            "dynamicControls": [
              [
                {
                  "name": "relation",
                  "label": "Relation",
                  "disabled": false,
                  "visibleLabel": false,
                  "relationDisabled": true,
                  "class": "col-12 col-md-6 col-lg-3",
                  "type": "text",
                  "visible": false,
                  "value": ""
                },
                {
                  "name": "preFix",
                  "label": "Salutation",
                  "visibleLabel": false,
                  "visible": false,
                  "value": "",
                  "type": "select",
                  "options": [
                    {
                      "value": "Mr",
                      "name": "Mr"
                    },
                    {
                      "value": "Mrs",
                      "name": "Mrs"
                    },
                    {
                      "value": "Ms",
                      "name": "Ms"
                    },
                    {
                      "value": "Dr",
                      "name": "Dr"
                    },
                    {
                      "value": "Mx",
                      "name": "Mx"
                    },
                    {
                      "value": "Miss",
                      "name": "Miss"
                    },
                    {
                      "value": "Others",
                      "name": "Others"
                    }
                  ],
                  "class": "col-12 col-md-6 col-lg-3"
                },
                {
                  "name": "firstName",
                  "label": "Name",
                  "visible": true,
                  "visibleLabel": true,
                  "type": "text",
                  "value": "",
                  "class": "col-md-6 col-lg-4",
                  "disabled": true,
                  "questionCondition": false
                },
                {
                  "name": "lastName",
                  "label": "Last Name",
                  "visibleLabel": true,
                  "visible": true,
                  "type": "text",
                  "value": "",
                  "class": "col-md-6 col-lg-4",
                  "disabled": true,
                  "questionCondition": false
                },
                {
                  "name": "height",
                  "label": "Height(Ft)",
                  "visibleLabel": false,
                  "type": "text",
                  "visible": false,
                  "value": "",
                  "class": "col-md-6 col-lg-4",
                  "disabled": true,
                  "questionCondition": false
                },
                {
                  "name": "height",
                  "label": "Height(cm)",
                  "visibleLabel": true,
                  "visible": true,
                  "type": "text",
                  "disabled": true,
                  "value": "",
                  "class": "col-md-6 col-lg-4",
                  "questionCondition": false
                },
                {
                  "name": "weight",
                  "label": "Weight",
                  "visible": true,
                  "visibleLabel": true,
                  "type": "text",
                  "value": "",
                  "class": "col-md-6 col-lg-4",
                  "disabled": true,
                  "questionCondition": false
                },
                {
                  "name": "memberDob",
                  "label": "D.O.B",
                  "visible": true,
                  "visibleLabel": true,
                  "type": "date",
                  "value": "",
                  "class": "col-md-6 col-lg-4",
                  "disabled": true,
                  "questionCondition": false
                },
                {
                  "name": "healthCondition",
                  "label": "Health Conditions",
                  "visible": true,
                  "visibleLabel": true,
                  "type": "text",
                  "value": "",
                  "class": "col-md-6 col-lg-6",
                  "disabled": true,
                  "questionCondition": true
                },
                {
                  "name": "emailId",
                  "label": "Email Id",
                  "visible": false,
                  "visibleLabel": false,
                  "type": "text",
                  "value": "",
                  "class": "col-md-6 col-lg-4"
                },
                {
                  "name": "mobileNumber",
                  "label": "Mobile Number",
                  "visibleLabel": false,
                  "visible": false,
                  "type": "phonenumber",
                  "value": "",
                  "class": "col-12 col-md-6 col-lg-4"
                },
                {
                  "name": "relationshipType",
                  "visibleLabel": false,
                  "label": "Relationship Type",
                  "value": "",
                  "methodName": "getAllRelationship",
                  "class": "col-md-2 acceptTermsCheck",
                  "type": "select",
                  "visible": false,
                  "selectCheckboxOptions": [
                    {
                      "label": "Self",
                      "value": "self",
                      "button": false
                    },
                    {
                      "label": "Spouse",
                      "value": "spouse",
                      "button": false
                    },
                    {
                      "label": "Father",
                      "value": "father",
                      "button": false
                    },
                    {
                      "label": "Mother",
                      "value": "mother",
                      "button": false
                    },
                    {
                      "label": "Daughter",
                      "value": "daughter1",
                      "button": true
                    },
                    {
                      "label": "Son",
                      "value": "son1",
                      "button": true
                    }
                  ]
                },
                {
                  "name": "memberAge",
                  "label": "Age",
                  "visibleLabel": false,
                  "type": "text",
                  "value": "",
                  "visibe": false,
                  "class": "col-12 col-md-6 col-lg-2"
                },
                {
                  "name": "memberGender",
                  "label": "Gender",
                  "visibleLabel": false,
                  "type": "select",
                  "value": "",
                  "visible": false,
                  "class": "col-12 col-md-6 col-lg-4",
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
                    },
                    {
                      "id": 3,
                      "name": "Others",
                      "value": "O"
                    }
                  ]
                },
                {
                  "name": "pincode",
                  "label": "Pincode",
                  "visibleLabel": false,
                  "type": "text",
                  "value": "",
                  "class": "col-12 col-md-6 col-lg-2",
                  "visible": false
                },
                {
                  "name": "sumInsured",
                  "label": "Sum Insured",
                  "visibleLabel": false,
                  "type": "text",
                  "value": "",
                  "class": "col-12 col-md-6 col-lg-3",
                  "visible": false
                },
                {
                  "name": "upgradableSumInsured",
                  "label": "Upgradable Sum Insured",
                  "visibleLabel": false,
                  "type": "text",
                  "value": "",
                  "class": "col-12 col-md-6 col-lg-3",
                  "visible": false
                },
                {
                  "name": "preExistingDisease",
                  "label": "Pre Existing Disease?",
                  "visibleLabel": false,
                  "type": "radio",
                  "visible": false,
                  "class": "radio-button",
                  "radioOptions": [
                    {
                      "name": "yes",
                      "label": "Yes",
                      "value": "yes",
                      "selected": false
                    },
                    {
                      "name": "no",
                      "label": "No",
                      "value": "no",
                      "selected": true
                    }
                  ]
                },
                {
                  "name": "memberIndex",
                  "label": "Member Index",
                  "visibleLabel": false,
                  "type": "text",
                  "value": "",
                  "class": "",
                  "visible": false
                },
                {
                  "name": "zone",
                  "label": "Zone",
                  "class": "col-12 col-md-6 col-lg-2",
                  "visibleLabel": false,
                  "visibe": false,
                  "value": "",
                  "type": "text"
                },
                {
                  "name": "zoneValue",
                  "label": "Zone",
                  "class": "col-12 col-md-6 col-lg-4",
                  "visibleLabel": false,
                  "visible": false,
                  "value": "",
                  "type": "text"
                },
                {
                  "name": "state",
                  "label": "State",
                  "class": "col-12 col-md-6 col-lg-2",
                  "visibleLabel": false,
                  "visible": false,
                  "value": "",
                  "type": "text"
                },
                {
                  "name": "city",
                  "label": "City",
                  "class": "col-12 col-md-6 col-lg-2",
                  "visibleLabel": false,
                  "visible": false,
                  "value": "",
                  "type": "text"
                },
                {
                  "name": "memberType",
                  "label": "Member Type",
                  "visibleLabel": false,
                  "class": "col-12 col-md-6 col-lg-3",
                  "type": "select",
                  "visible": false,
                  "value": ""
                },
                {
                  "name": "memberIndex",
                  "label": "Member Index",
                  "visibleLabel": false,
                  "type": "text",
                  "value": "",
                  "class": "",
                  "visible": false
                },
                {
                  "name": "productMemberDesignation",
                  "label": "Designation",
                  "visibleLabel": false,
                  "type": "select",
                  "visible": false,
                  "value": ""
                },
                {
                  "name": "productMemberNatureWork",
                  "label": "Nature of Work",
                  "visibleLabel": false,
                  "visible": false,
                  "type": "select",
                  "value": ""
                },
                {
                  "name": "productMemberOccupation",
                  "label": "Occupation",
                  "visible": false,
                  "visibleLabel": false,
                  "type": "select",
                  "class": "col-12 col-md-6 col-lg-4",
                  "value": ""
                },
                {
                  "name": "covers",
                  "label": "Add On Covers",
                  "visibleLabel": false,
                  "type": "text",
                  "value": "",
                  "class": "",
                  "visible": false
                },
                {
                  "name": "memberRoomCategory",
                  "label": "Room Category",
                  "visibleLabel": false,
                  "type": "text",
                  "value": "UPTOSI",
                  "class": "",
                  "visible": false
                },
                {
                  "name": "productQuestionnaire",
                  "label": "Product Questionnaire",
                  "visibleLabel": false,
                  "type": "text",
                  "value": "",
                  "class": "",
                  "visible": false
                },
                {
                  "name": "memberRelationCode",
                  "label": "Relation Code",
                  "visibleLabel": false,
                  "visible": false,
                  "value": "",
                  "type": "text",
                  "class": "col-12 col-md-6 col-lg-3"
                },
                {
                  "name": "hospiCashCoverDetails",
                  "label": "Hospi Cash Cover",
                  "visibleLabel": false,
                  "type": "text",
                  "value": "",
                  "class": "",
                  "visible": false
                }
              ]
            ]
          }
        ]
      },
      {
        "sectionTitle": "Contact Details",
        "visible": true,
        "visibleLabel": true,
        "class": "section-title",
        "formControls": [
          {
            "name": "proposerAddress1",
            "label": "Address",
            "visibleLabel": true,
            "type": "text",
            "value": "",
            "class": "col-md-6",
            "visible": true,
            "disabled": true
          },
          {
            "name": "mobileNumber",
            "label": "Contact",
            "visibleLabel": true,
            "type": "text",
            "value": "",
            "class": "col-md-4",
            "visible": true,
            "disabled": true
          }
        ]
      },
      {
        "sectionTitle": "Bottom Section",
        "visible": true,
        "class": "section-title bottom-section-axis",
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
            "name": "proposalNumber",
            "label": "Proposal Number",
            "visibleLabel": true,
            "visible": true,
            "type": "boldtext",
            "class": "col-12 col-md-6 col-lg-3 bottom_proposalNumber",
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