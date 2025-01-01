export const combinedForms = {
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
            "visible": false,
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
            "visible": false,
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
            "visible": false,
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
            "visible": true,
            "disabled": true,
            "class": "col-12 col-md-6 col-lg-4"
          },
          {
            "name": "mobileNumber",
            "label": "Mobile Number",
            "visibleLabel": true,
            "visible": false,
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
            "visible": false,
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
            "visible": false,
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
            "visible": false,
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
            "visible": false,
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
            "visible": false,
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
            "visible": false,
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
            "visible": false,
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
            "visible": false,
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
            "visible": false,
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
                "selected": true
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
            "name": "city",
            "label": "City",
            "class": "col-12 col-md-6 col-lg-3",
            "disabled": true,
            "visible": true,
            "visibleLabel": true,
            "value": "",
            "type": "text"
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
            "methodName": "getProposerRelationship",
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
            "visible": false,
            "type": "text",
            "value": "",
            "class": "col-12 col-md-6 col-lg-4"
          },
          {
            "name": "nomineeLastName",
            "label": "Last Name",
            "visibleLabel": true,
            "visible": true,
            "type": "text",
            "value": "",
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
          {
            "name": "nomineeDob",
            "label": "Date of Birth",
            "visibleLabel": true,
            "visible": true,
            "type": "date",
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
            "name": "appointeeName",
            "label": "Appointee Name",
            "visibleLabel": true,
            "type": "text",
            "value": "",
            "visible": false,
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
            "name": "appointeeAge",
            "label": "Appointee Age",
            "visibleLabel": true,
            "type": "number",
            "value": "",
            "visible": false,
            "class": "col-12 col-md-6 col-lg-4",
            "validators": [
              {
                "validatorName": "required",
                "required": true,
                "message": "Appointee Age is required field"
              },
              {
                "validatorName": "pattern",
                "pattern": "^[0-9 ]{1,3}$",
                "message": "only Number is required"
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
            "name": "Gender",
            "label": "Gender",
            "visibleLabel": true,
            "type": "select",
            "class": "col-md-4 control",
            "value": "",
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
            "name": "nomineeAddress",
            "label": "Nominee Address",
            "visibleLabel": true,
            "visible": true,
            "type": "text",
            "value": "",
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
            "name": "emailId",
            "label": "Email Id",
            "visibleLabel": true,
            "visible": false,
            "type": "email",
            "value": "",
            "class": "col-12 col-md-6 col-lg-4",
            "validators": [
              {
                "validatorName": "required",
                "required": true,
                "message": "Email Address is required field"
              },
              {
                "validatorName": "pattern",
                "pattern": "^(?!.*[._-]{2})[a-zA-Z0-9]+([._-][a-zA-Z0-9]+)*@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$",
                "message": "Enter Valid email Id."
              }
            ]
          },
          {
            "name": "Gender",
            "label": "Gender",
            "visibleLabel": true,
            "type": "",
            "class": "col-md-4 control",
            "value": "",
            "methodName": "",
            "subType": "",
            "otherControlName": "",
            "disabled": false,
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
          }
        ]
      },
      {
        "sectionTitle": "Bank Account Details",
        "visible": true,
        "visibleLabel": true,
        "class": "section-title",
        "formControls": [
          {
            "name": "firstName",
            "label": "Account Holder Name",
            "visibleLabel": true,
            "type": "text",
            "visible": true,
            "value": "",
            "class": "col-12 col-md-6 col-lg-4",
            "validators": [
              {
                "validatorName": "required",
                "required": true,
                "message": "Account Holder name is required field"
              },
              {
                "validatorName": "pattern",
                "pattern": "^[a-zA-Z ]{1,15}$",
                "message": "Maxmium Length for Name is 15"
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
            "visible": true,
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
            "visible": true,
            "class": "col-12 col-md-6 col-lg-4"
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

  export const renewals_summary = {
    "formTitle": "Policy Summary",
    "saveBtnTitle": "Save",
    "prevBtnTitle": "",
    "resetBtnTitle": "",
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
            "class": "col-md-2",
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
                  "class": "col-12 col-md-6 col-lg-3",
                  "type": "text",
                  "visible": false,
                  "value": ""
                },
                {
                  "name": "firstName",
                  "label": "Name",
                  "visible": true,
                  "visibleLabel": true,
                  "type": "text",
                  "value": "",
                  "class": "col-md-4",
                  "disabled": true
                },
                {
                  "name": "lastName",
                  "label": "Last Name",
                  "visibleLabel": true,
                  "visible": true,
                  "type": "text",
                  "value": "",
                  "class": "col-md-4",
                  "disabled": true
                },
                {
                  "name": "height",
                  "label": "Height(ft)",
                  "visibleLabel": true,
                  "type": "text",
                  "visible": true,
                  "value": "",
                  "class": "col-md-4",
                  "disabled": true
                },
                {
                  "name": "weight",
                  "label": "Weight",
                  "visible": true,
                  "visibleLabel": true,
                  "type": "text",
                  "value": "",
                  "class": "col-md-4",
                  "disabled": true
                },
                {
                  "name": "memberDob",
                  "label": "D.O.B",
                  "visible": true,
                  "visibleLabel": true,
                  "type": "date",
                  "value": "",
                  "class": "col-md-4",
                  "disabled": true
                },
                {
                  "name": "emailId",
                  "label": "Email Id",
                  "visible": false,
                  "visibleLabel": false,
                  "type": "text",
                  "value": "",
                  "class": "col-md-4"
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
                  "type": "select",
                  "value": "",
                  "class": "col-12 col-md-6 col-lg-3",
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
                }
              ]
            ]
          },
          {
            "name": "memberQuestion",
            "id": "I agree to Terms & Conditions",
            "visibleLabel": true,
            "visible": true,
            "label": "I agree to Terms & Conditions",
            "class": "col-12 col-md-6 col-lg-12 nomineeCheck",
            "type": "checkbox",
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
            "value": "7738030781",
            "class": "col-md-4",
            "visible": true,
            "disabled": true
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

    export const thankYou = {
      "formTitle": "thankYou",
      "saveBtnTitle": "Save",
      "prevBtnTitle": "Prev",
      "resetBtnTitle": "",
      "themeFile": "ABHI.css",
      "formSections": [
        {
          "sectionTitle": "",
          "visible": true,
          "class": "section-title col-md-12 thankyouSection",
          "formControls": [
            {
              "name": "confirmation",
              "label": "",
              "class": "col-12 col-md-6 col-lg-10 thankYou",
              "visibleLabel": false,
              "type": "image",
              "images": [
                {
                  "id": 1,
                  "src": "assets/Img/icon_success_green_tick.gif",
                  "alt": "confirmation image",
                  "width": "150",
                  "height": "150",
                  "label": "confirmation"
                }
              ]
            },
            {
              "name": "label1",
              "label": "Congratulations! Policy Application Renewed Successfully",
              "visibleLabel": true,
              "visible": true,
              "type": "paragraph",
              "methodName": "checkPaymentStatus",
              "class": "col-12 col-md-6 col-lg-8 section-paragraph1 button-container"
            },
            {
              "name": "label2",
              "label": "Thank You for choosing Aditya Birla Health Insurance as your insurance destination",
              "visibleLabel": true,
              "visible": true,
              "type": "paragraph",
              "class": "col-12 col-md-6 col-lg-8 section-paragraph2 button-container"
            },
            // {
            //   "name": "backToRenewalList",
            //   "label": "",
            //   "type": "paragraph",
            //   "class": "col-12 col-md-6 col-lg-8 section-paragraph2 button-container",
            //   "visible": false,
            // },
            {
              "name": "backToRenewalList",
              "label": "Back To Renewal List",
              "type": "button",
              "class": "col-12 col-md-6 col-lg-3 backToRen",
              "visible": false,
              "methodName": "backToRenewalList"
            },
            // {
            //   "name": "backToRenewalList",
            //   "label": "",
            //   "type": "paragraph",
            //   "class": "col-12 col-md-6 col-lg-8 section-paragraph2 button-container",
            //   "visible": false,
            // }
          ]
        },
        {
          "sectionTitle": "Details of Your Proposal",
          "visible": true,
          "visibleLabel": true,
          "class": "section-title proposalDetails",
          "formControls": [
            {
              "name": "policyNumber",
              "label": "Policy Number",
              "visibleLabel": true,
              "type": "summary",
              "value": "",
              "class": "col-md-3",
              "visible": true,
              "disabled": true
            },
            {
              "name": "productName",
              "label": "Product Name",
              "visibleLabel": true,
              "type": "summary",
              "value": "",
              "class": "col-md-3",
              "visible": true,
              "disabled": true
            },
            {
              "name": "premiumPaid",
              "label": "Premium Paid",
              "visibleLabel": true,
              "type": "summary",
              "value": "",
              "class": "col-md-3",
              "visible": true,
              "disabled": true
            },
            {
              "name": "policyStartDate",
              "label": "Policy Start Date",
              "visibleLabel": true,
              "type": "summary",
              "value": "",
              "class": "col-md-3",
              "visible": true,
              "disabled": true
            },
            {
              "name": "policyEndDate",
              "label": "Policy End Date",
              "visibleLabel": true,
              "type": "summary",
              "value": "",
              "class": "col-md-3",
              "visible": true,
              "disabled": true
            },
            {
              "name": "receiptID",
              "label": "Receipt ID",
              "visibleLabel": true,
              "type": "summary",
              "value": "",
              "class": "col-md-3",
              "visible": true,
              "disabled": true
            },
            {
              "name": "status",
              "label": "Policy Status",
              "visibleLabel": true,
              "type": "summary",
              "value": "",
              "class": "col-md-3",
              "visible": true,
              "disabled": true
            },
            {
              "name": "downloadWithParagraph",
              "label": "Share the Insurance Policy Kit with your customer",
              "visibleLabel": true,
              "type": "paragraphWithBtns",
              "value": "",
              "class": "col-12 col-md-12 mt-3",
              "visible": true,
              "disabled": true
            }
          ]
        },
        {
          "sectionTitle": "App Advertisement",
          "visible": true,
          "class": "section-title advertisementSection",
          "formControls": [
            {
              "name": "confirmation",
              "label": "",
              "class": "col-12 col-md-12 col-lg-4 mobileScreen",
              "visibleLabel": false,
              "visible": true,
              "type": "image",
              "images": [
                {
                  "id": 1,
                  "src": "assets/Img/mobileScreen.png",
                  "alt": "mobile image",
                  "width": "170",
                  "height": "170",
                  "label": "mobilephone"
                }
              ]
            },
            {
              "name": "scannerQR",
              "label": "",
              "class": "col-12 col-md-12 col-lg-4 QR-scanner",
              "visibleLabel": false,
              "visible": true,
              "type": "image",
              "images": [
                {
                  "id": 1,
                  "src": "assets/Img/ScannerQR.png",
                  "alt": "scanner image",
                  "width": "170",
                  "height": "170",
                  "label": "mobilephone"
                }
              ]
            },
            {
              "name": "appStoreButton",
              "label": "Download on the App Store",
              "visibleLabel": false,
              "visible": true,
              "type": "imageButton",
              "imageUrl": "assets/Img/apple.svg",
              "class": "col-12 col-md-6 col-lg-4 app-store-button",
              "methodName": "redirectToAppStore"
            },
            {
              "name": "googlePlayButton",
              "label": "Get it on Google Play",
              "visibleLabel": false,
              "visible": true,
              "type": "imageButton",
              "imageUrl": "assets/Img/google.svg",
              "class": "col-12 col-md-6 col-lg-4 google-play-button",
              "methodName": "redirectToGooglePlay"
            }
          ]
        },
        {
          "sectionTitle": "Setup Auto-debit Mandate",
          "visible": true,
          "class": "section-title autoDebitSection",
          "formControls": [
            {
              "name": "setup",
              "label": "Setup Auto-debit Mandate",
              "type": "paragraph",
              "visibleLabel": true,
              "visible": true,
              "class": "col-12 col-md-6 col-lg-6 autoDebitLabel1"
            },
            {
              "name": "autoDebit1",
              "label": "Setup Auto-debit mandate and worry less about remembering the installments.",
              "visibleLabel": true,
              "type": "paragraph",
              "class": "col-12 col-md-6 col-lg-12 autoDebitLabel2"
            },
            {
              "name": "declarationLabel2",
              "label": "I understand that the information provided by me will form the basis of the insurance policy, is subject to the Board approved underwriting policy of the insurer and that the policy will come into force only after full payment of the premium chargeable.",
              "visibleLabel": false,
              "type": "paragraph",
              "class": "col-12 col-md-6 col-lg-12 autoDebitLabel3"
            },
            {
              "name": "autoDebitImage",
              "label": "",
              "class": "col-12 col-md-6 col-lg-2 imageautodebit",
              "visibleLabel": false,
              "type": "image",
              "images": [
                {
                  "id": 1,
                  "src": "assets/Img/SetUp_AutoDebitImage.png",
                  "alt": "mobile image",
                  "width": "600",
                  "height": "70",
                  "label": "autodebit"
                }
              ]
            },
            {
              "name": "debitButton",
              "label": "Update to Auto-debit",
              "visibleLabel": false,
              "visible": true,
              "type": "button",
              "class": "col-12 col-md-6 col-lg-4 debitButton"
            }
          ]
        },
        {
          "sectionTitle": "abhaID",
          "visible": true,
          "class": "section-title abhaIDSection",
          "formControls": [
            {
              "name": "abhaLabel",
              "label": "#ABHIseABHA",
              "type": "paragraph",
              "visibleLabel": true,
              "value": "",
              "visible": true,
              "class": "col-12 col-md-6 col-lg-3 abhaLabel1"
            },
            {
              "name": "autoDebit1",
              "label": "Creating Your customers ABHA ID with ABHI.",
              "visibleLabel": true,
              "visible": true,
              "value": "",
              "type": "paragraph",
              "class": "col-12 col-md-6 col-lg-2 abhaLabel2"
            },
            {
              "name": "autoDebitLabel1",
              "label": "Simple, Fast & Easy",
              "visibleLabel": true,
              "type": "paragraph",
              "value": "",
              "visible": true,
              "class": "col-12 col-md-6 col-lg-4 simpleEasyStyle"
            },
            {
              "name": "autoDebitImage",
              "label": "",
              "class": "col-12 col-md-6 col-lg-6 abhaIDImage",
              "visibleLabel": false,
              "type": "image",
              "images": [
                {
                  "id": 1,
                  "src": "assets/Img/AbhaID_Image.png",
                  "alt": "mobile image",
                  "width": "420",
                  "height": "270",
                  "label": "autodebit"
                }
              ]
            },
            {
              "name": "autoDebitLabel2",
              "label": "Do you have few minutes? Because that is all it takes to create your ABHA ID on the Aditya Birla Health Insurance website",
              "visibleLabel": true,
              "visible": true,
              "value": "",
              "type": "paragraph",
              "class": "col-12 col-md-4 col-lg-6 abhaquestion"
            },
            {
              "name": "debitButton",
              "label": "Create ABHA ID",
              "visibleLabel": false,
              "visible": true,
              "type": "button",
              "methodName": "redirectToCreateABHAID",
              "class": "col-12 col-md-6 col-lg-4 abhaButton"
            }
          ]
        }
      ]
    }  

    export const kycThankYou = {
      "formTitle": "kycThankYou",
      "saveBtnTitle": "Save",
      "prevBtnTitle": "Prev",
      "resetBtnTitle": "",
      "themeFile": "ABHI.css",
      "formSections": [
        {
          "sectionTitle": "",
          "visible": true,
          "class": "section-title col-md-12 thankyouSection",
          "formControls": [
            {
              "name": "confirmation",
              "label": "",
              "class": "col-12 col-md-6 col-lg-10 thankYou",
              "visibleLabel": false,
              "type": "image",
              "methodName":"checkKycDetail",
              "images": [
                {
                  "id": 1,
                  "src": "assets/Img/icon_success_green_tick.gif",
                  "alt": "confirmation image",
                  "width": "150",
                  "height": "150",
                  "label": "confirmation"
                }
              ]
            },
            {
              "name": "label1",
              "label": "Congratulations! KYC Completed Successfully",
              "visibleLabel": true,
              "visible": true,
              "type": "paragraph",
              "class": "col-12 col-md-6 col-lg-8 section-paragraph1 button-container"
            },
            {
              "name": "label2",
              "label": "Thank You for choosing Aditya Birla Health Insurance as your insurance destination",
              "visibleLabel": true,
              "visible": true,
              "type": "paragraph",
              "class": "col-12 col-md-6 col-lg-8 section-paragraph2 button-container"
            }
          ]
        },
        {
          "sectionTitle": "",
          "visible": true,
          "class": "section-title col-md-12 thankyouSection",
          "formControls": [
            // {
            //   "name": "Failed",
            //   "label": "",
            //   "class": "col-12 col-md-6 col-lg-10 thankYou",
            //   "visibleLabel": false,
            //   "type": "image",
            //   "images": [
            //     {
            //       "id": 1,
            //       "src": "assets/Img/icon_success_green_tick.gif",
            //       "alt": "Failed image",
            //       "width": "150",
            //       "height": "150",
            //       "label": "Failed"
            //     }
            //   ]
            // },
            {
              "name": "label1",
              "label": "Sorry! KYC Failed",
              "visibleLabel": true,
              "visible": true,
              "type": "paragraph",
              "class": "col-12 col-md-6 col-lg-8 section-paragraph1 button-container"
            },
            // {
            //   "name": "label2",
            //   "label": "Thank You for choosing Aditya Birla Health Insurance as your insurance destination",
            //   "visibleLabel": true,
            //   "visible": true,
            //   "type": "paragraph",
            //   "class": "col-12 col-md-6 col-lg-8 section-paragraph2 button-container"
            // }
          ]
        }
      ]
    }  
    export const thankYouPending = {
      "formTitle": "thankYou",
      "saveBtnTitle": "Save",
      "prevBtnTitle": "Prev",
      "resetBtnTitle": "",
      "themeFile": "ABHI.css",
      "formSections": [
        {
          "sectionTitle": "",
          "visible": true,
          "class": "section-title col-md-12 thankyouSection",
          "formControls": [
            {
              "name": "confirmation",
              "label": "",
              "class": "col-12 col-md-6 col-lg-10 thankYou",
              "visibleLabel": false,
              "type": "image",
              "images": [
                {
                  "id": 1,
                  "src": "assets/Img/icon_success_green_tick.gif",
                  "alt": "confirmation image",
                  "width": "150",
                  "height": "150",
                  "label": "confirmation"
                }
              ]
            },
            {
              "name": "label1",
              "label": "Payment pending; please wait for processing",
              "visibleLabel": true,
              "visible": true,
              "type": "paragraph",
              "class": "col-12 col-md-6 col-lg-8 section-paragraph1 button-container"
            },
            {
              "name": "label2",
              "label": "Thank You for choosing Aditya Birla Health Insurance as your insurance destination",
              "visibleLabel": true,
              "visible": true,
              "type": "paragraph",
              "class": "col-12 col-md-6 col-lg-8 section-paragraph2 button-container"
            }
          ]
        }
      ]
    }
    export const thankYouFQFailed = {
      "formTitle": "thankYou",
      "saveBtnTitle": "Save",
      "prevBtnTitle": "Prev",
      "resetBtnTitle": "",
      "themeFile": "ABHI.css",
      "formSections": [
        {
          "sectionTitle": "",
          "visible": true,
          "class": "section-title col-md-12 thankyouSection",
          "formControls": [
            {
              "name": "confirmation",
              "label": "",
              "class": "col-12 col-md-6 col-lg-10 thankYou",
              "visibleLabel": false,
              "type": "image",
              "images": [
                {
                  "id": 1,
                  "src": "assets/Img/icon_success_green_tick.gif",
                  "alt": "confirmation image",
                  "width": "150",
                  "height": "150",
                  "label": "confirmation"
                }
              ]
            },
            {
              "name": "label1",
              "label": "Payment completed successfully; policy issuance pending",
              "visibleLabel": true,
              "visible": true,
              "type": "paragraph",
              "class": "col-12 col-md-6 col-lg-8 section-paragraph1 button-container"
            },
            {
              "name": "label2",
              "label": "Thank You for choosing Aditya Birla Health Insurance as your insurance destination",
              "visibleLabel": true,
              "visible": true,
              "type": "paragraph",
              "class": "col-12 col-md-6 col-lg-8 section-paragraph2 button-container"
            }
          ]
        }
      ]
    }
    