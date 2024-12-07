export const new_combinedForms = {
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
                "value": "Mr.",
                "name": "Mr"
              },
              {
                "value": "Mrs.",
                "name": "Mrs"
              },
              {
                "value": "Ms.",
                "name": "Ms"
              },
              {
                "value": "Dr.",
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
        //   {
        //     "name": "proposerName",
        //     "label": "Name",
        //     "visibleLabel": true,
        //     "type": "text",
        //     "value": "",
        //     "disabled": true,
        //     "visible": true,
        //     "class": "col-12 col-md-6 col-lg-3"
        //   },
          {
            "name": "firstName",
            "label": "First Name",
            "visibleLabel": true,
            "type": "text",
            "value": "",
            "disabled": true,
            "visible": true,
            "class": "col-12 col-md-6 col-lg-4",
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
            "disabled": false,
            "class": "col-12 col-md-6 col-lg-4"
          },
          {
            "name": "lastName",
            "label": "Last Name",
            "visibleLabel": true,
            "type": "text",
            "value": "",
            "visible": true,
            "disabled": false,
            "class": "col-12 col-md-6 col-lg-4",
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
            "name": "memberDobProposer",
            "label": "D.O.B",
            "visible": true,
            "visibleLabel": true,
            "type": "date",
            "value": "",
            "class": "col-12 col-md-6 col-lg-4",
            "disabled": true,
          },
          {
            "name": "idNo",
            "label": "ID Number",
            "visibleLabel": true,
            "type": "idnumber",
            "disabled": true,
            "visible": false,
            "value": "",
            "class": "col-12 col-md-6 col-lg-3",
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
            "visible": true,
            "visibleLabel": true,
            "type": "email",
            "value": "",
            "disabled": true,
            "class": "col-12 col-md-6 col-lg-4"
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
            ]
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
            "value": 0
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
                  "methodName": "memberDetailsOption",
                  "options": []
                },
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
                  "name": "Personal Details",
                  "visibleLabel": true,
                  "label": "Personal Details",
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
                  "type": "select",
                  "disabled": false,
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
                  "visible": true,
                  "visibleLabel": true,
                  "type": "text",
                  "value": "",
                  "disabled": true,
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
                  "name": "height",
                  "label": "Enter Height(cm)",
                  "visibleLabel": true,
                  "type": "number",
                  "disabled": true,
                  "visible": true,
                  "value": "",
                  "class": "col-12 col-md-6 col-lg-4",
                  "validators": [
                    {
                      "validatorName": "required",
                      "required": true,
                      "message": "Height(cm) is required field"
                    }
                  ]
                },
                {
                  "name": "weight",
                  "label": "Weight(In Kgs)",
                  "visible": true,
                  "visibleLabel": true,
                  "type": "number",
                  "value": "",
                  "disabled": true,
                  "class": "col-12 col-md-6 col-lg-4",
                  "validators": [
                    {
                      "validatorName": "required",
                      "required": true,
                      "message": "Weight is required field"
                    },
                    {
                      "validatorName": "pattern",
                      "pattern": "^(1[0-4][0-9]|150|[1-9][0-9]?)$",
                      "message": "Weight must be between 1 and 150."
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
                  "name": "mobileNumber",
                  "label": "Mobile Number",
                  "visibleLabel": true,
                  "visible": true,
                  "type": "phonenumber",
                  "value": "",
                  "disabled": true,
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
                  "name": "sumInsured",
                  "label": "Sum Insured",
                  "visibleLabel": true,
                  "type": "select",
                  "value": "",
                  "class": "col-12 col-md-6 col-lg-4",
                  "visible": true,
                  "disabled": false,
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
          "name": "annualIncome",
          "label": "Annual Income",
          "visibleLabel": true,
          "type": "select",
          "visible": true,
          "disabled": false,
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
                  "name": "productMemberDesignation",
                  "label": "Designation",
                  "visibleLabel": true,
                  "type": "select",
                  "visible": true,
                  "getAllOption": "getAllProposerOccupation",
                  "value": "",
                  "options": [],
                  "disabled": false,
                  "class": "col-12 col-md-6 col-lg-4",
                  "validators": [
                    {
                      "validatorName": "required",
                      "required": true,
                      "message": "Designation Required"
                    }
                  ]
                },
                {
                  "name": "productMemberNatureWork",
                  "label": "Nature of Work",
                  "visibleLabel": true,
                  "visible": true,
                  "getAllOption": "getNatureOfDuty",
                  "type": "select",
                  "value": "",
                  "options": [],
                  "disabled": false,
                  "class": "col-12 col-md-6 col-lg-4",
                  "validators": [
                    {
                      "validatorName": "required",
                      "required": true,
                      "message": "Nature Of Work is Required"
                    }
                  ]
                },
                {
                  "name": "productMemberOccupation",
                  "label": "Occupation",
                  "visible": true,
                  "visibleLabel": true,
                  "getAllOption": "getInsuredOccupation",
                  "type": "select",
                  "class": "col-12 col-md-6 col-lg-4",
                  "value": "",
                  "disabled": false,
                  "options": []
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
            "name": "gender",
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
            "name": "gender",
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