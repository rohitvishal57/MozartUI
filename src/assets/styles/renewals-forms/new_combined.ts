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
            "name": "proposerName",
            "label": "Name",
            "visibleLabel": true,
            "type": "text",
            "value": "",
            "disabled": true,
            "visible": true,
            "class": "col-12 col-md-6 col-lg-4"
          },
          {
            "name": "firstName",
            "label": "First Name",
            "visibleLabel": true,
            "type": "text",
            "value": "",
            "disabled": true,
            "visible": false,
            "class": "col-12 col-md-6 col-lg-4",
          },
          {
            "name": "middleName",
            "label": "Middle Name",
            "visibleLabel": true,
            "type": "text",
            "value": "",
            "visible": false,
            "disabled": false,
            "class": "col-12 col-md-6 col-lg-4"
          },
          {
            "name": "lastName",
            "label": "Last Name",
            "visibleLabel": true,
            "type": "text",
            "value": "",
            "visible": false,
            "disabled": false,
            "class": "col-12 col-md-6 col-lg-4"
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
                  "type": "select",
                  "disabled": false,
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
                      "value": "Mx.",
                      "name": "Mx"
                    },
                    {
                      "value": "Miss.",
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
                  "disabled": false,
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
                  "disabled": false,
                  "class": "col-12 col-md-6 col-lg-3"
                },
                {
                  "name": "lastName",
                  "label": "Last Name",
                  "visibleLabel": true,
                  "visible": true,
                  "type": "text",
                  "value": "",
                  "disabled": false,
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
                  "label": "Height(cm)",
                  "visibleLabel": true,
                  "type": "number",
                  "disabled": false,
                  "visible": true,
                  "value": "",
                  "class": "col-12 col-md-6 col-lg-4",
                  "validators": [
                    {
                      "validatorName": "required",
                      "required": true,
                      "message": "Height(ft) is required field"
                    }
                  ]
                },
                // {
                //   "name": "heightInches",
                //   "disabled": false,
                //   "label": "Enter Height in",
                //   "visibleLabel": true,
                //   "visible": false,
                //   "type": "number",
                //   "value": "",
                //   "class": "col-12 col-md-6 col-lg-4",
                //   "validators": [
                //     {
                //       "validatorName": "required",
                //       "required": true,
                //       "message": "Height(Inch) is required field"
                //     },
                //     {
                //       "validatorName": "pattern",
                //       "pattern": "^(?:[0-9]|1[0-1])$",
                //       "message": "Only values between 0-11 are allowed."
                //     }
                //   ]
                // },
                {
                  "name": "weight",
                  "label": "Weight(In Kgs)",
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
                  "disabled": false
                },
                {
                  "name": "emailId",
                  "label": "Email Address",
                  "visible": true,
                  "visibleLabel": true,
                  "type": "email",
                  "value": "",
                  "disabled": false,
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
                  "disabled": false,
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
                  "name": "designation",
                  "label": "Designation",
                  "visibleLabel": true,
                  "type": "select",
                  "visible": true,
                  "getAllOption": "getAllProposerOccupation",
                  "value": "",
                  "options": [],
                  "disabled": false,
                  "class": "col-12 col-md-6 col-lg-4"
                },
                {
                  "name": "natureOfDuty",
                  "label": "Nature of Work",
                  "visibleLabel": true,
                  "visible": true,
                  "getAllOption": "getNatureOfDuty",
                  "type": "select",
                  "value": "",
                  "options": [],
                  "disabled": false,
                  "class": "col-12 col-md-6 col-lg-4"
                },
                {
                  "name": "occupation",
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
            "dependentControls":['appointeeName','appointeeAge'],
            "methodName": "checkNomineeAge",
            "onChangeMethod": "checkNomineeAge",
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
            "name": "proposerName",
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



export const new_combinedForms_renewals ={
  "formTitle": "Policy Details",
  "saveBtnTitle": "Save",
  "prevBtnTitle": "",
  "resetBtnTitle": "",
  "calculateBtnTitle": "",
  "saveBtnFunction": "",
  "themeFile": "ABHI.css",
  "formSections": [
    {
      "sectionTitle": "Policy Details",
      "visibleLabel": true,
      "visible": true,
      "class": "col-md-12 section-title",
      "formControls": [
        {
          "name": "isPep",
          "label": "Are you a PEP (Politically Exposed Person) or relative of PEP?",
          "visibleLabel": true,
          "class": "radio-button",
          "toolTipMessage": "*Politically Exposed Persons* (PEPs) are individual who have been entrusted with prominent public functions by a foreign country, including the heads of States of Governments, senior politicians, senior government or judicial or military officers, senior executives of state-owned corporation and important political party officials.",
          "value": "N",
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
          "value": "Max Plus",
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
          "name": "leadNumber",
          "label": "Lead No",
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
          "name": "memberPlan",
          "label": "Activ One Max",
          "visibleLabel": true,
          "type": "text",
          "visible": false,
          "value": "Max Plus",
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
          "name": "productType",
          "label": "Product Type",
          "visibleLabel": false,
          "type": "text",
          "value": "AO",
          "class": "",
          "visible": false
        },
        {
          "name": "productName",
          "label": "Product Name",
          "visibleLabel": false,
          "type": "text",
          "value": "Activ One Max+",
          "class": "",
          "visible": false
        },
        {
          "name": "planCode",
          "label": "Product Code",
          "visibleLabel": false,
          "type": "text",
          "value": "MASSMARKET_PLUS",
          "class": "",
          "visible": false
        },
        {
          "name": "productId",
          "label": "Product Id",
          "visibleLabel": false,
          "type": "text",
          "value": "7200",
          "class": "",
          "visible": false
        },
        {
          "name": "preFix",
          "label": "Salutation",
          "visibleLabel": true,
          "methodName": "updatePrefixBasedOnGender",
          "onChangeMethod": "setForSelfMember",
          "otherControlName": "preFix",
          "visible": true,
          "value": "",
          "type": "select",
		      "disabled": true,
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
              "value": "Mx.",
              "name": "Mx"
            },
            {
              "value": "Miss.",
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
          "onChangeMethod": "setForSelfMember",
          "otherControlName": "firstName",
          "type": "text",
          "value": "",
          "visible": true,
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
              "pattern": "^[a-zA-Z ]{1,50}$",
              "message": "Only alphabets, maxLength 50"
            }
          ]
        },
        {
          "name": "middleName",
          "label": "Middle Name",
          "visibleLabel": true,
          "type": "text",
          "onChangeMethod": "setForSelfMember",
          "otherControlName": "middleName",
          "value": "",
          "visible": true,
		      "disabled": true,
          "class": "col-12 col-md-6 col-lg-3"
        },
        {
          "name": "lastName",
          "label": "Last Name",
          "visibleLabel": true,
          "onChangeMethod": "setForSelfMember",
          "otherControlName": "lastName",
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
              "pattern": "^[a-zA-Z ]{1,50}$",
              "message": "Only alphabets, maxLength 50"
            }
          ]
        },
        {
          "name": "proposerGender",
          "label": "Gender",
          "visibleLabel": true,
          "onChangeMethod": "setForSelfMember",
          "otherControlName": "memberGender",
          "type": "select",
          "value": "",
          "class": "col-12 col-md-6 col-lg-4",
          "visible": true,
		      "disabled": true,
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
          "onChangeMethod": "setForSelfMember",
          "otherControlName": "emailId",
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
          "onChangeMethod": "setForSelfMember",
          "otherControlName": "mobileNumber",
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
          "name": "idProof",
          "label": "ID Type",
          "visibleLabel": true,
          "visible": false,
          "onChangeMethod": "changeMainFormDependentControls",
          "type": "select",
          "value": "",
          "class": "col-12 col-md-6 col-lg-4",
          "options": [
            {
              "id": "2",
              "value": "Aadhar Card",
              "name": "Aadhar Card",
              "dependentControls": [
                {
                  "name": "aadharIdNo",
                  "visibility": true
                },
                {
                  "name": "passportIdNo",
                  "visibility": false
                },
                {
                  "name": "licenseIdNo",
                  "visibility": false
                },
                {
                  "name": "voterIdNo",
                  "visibility": false
                },
                {
                  "name": "marksheetIdNo",
                  "visibility": false
                }
              ]
            },
            {
              "id": "3",
              "value": "Passport",
              "name": "Passport",
              "dependentControls": [
                {
                  "name": "aadharIdNo",
                  "visibility": false
                },
                {
                  "name": "passportIdNo",
                  "visibility": true
                },
                {
                  "name": "licenseIdNo",
                  "visibility": false
                },
                {
                  "name": "voterIdNo",
                  "visibility": false
                },
                {
                  "name": "marksheetIdNo",
                  "visibility": false
                }
              ]
            },
            {
              "id": "4",
              "value": "Driving License",
              "name": "Driving License",
              "dependentControls": [
                {
                  "name": "aadharIdNo",
                  "visibility": false
                },
                {
                  "name": "passportIdNo",
                  "visibility": false
                },
                {
                  "name": "licenseIdNo",
                  "visibility": true
                },
                {
                  "name": "voterIdNo",
                  "visibility": false
                },
                {
                  "name": "marksheetIdNo",
                  "visibility": false
                }
              ]
            },
            {
              "id": "5",
              "value": "Voter ID",
              "name": "Voter ID",
              "dependentControls": [
                {
                  "name": "aadharIdNo",
                  "visibility": false
                },
                {
                  "name": "passportIdNo",
                  "visibility": false
                },
                {
                  "name": "licenseIdNo",
                  "visibility": false
                },
                {
                  "name": "voterIdNo",
                  "visibility": true
                },
                {
                  "name": "marksheetIdNo",
                  "visibility": false
                }
              ]
            },
            {
              "id": "6",
              "value": "10th (SSC) Mark sheet",
              "name": "10th (SSC) Mark sheet",
              "dependentControls": [
                {
                  "name": "aadharIdNo",
                  "visibility": false
                },
                {
                  "name": "passportIdNo",
                  "visibility": false
                },
                {
                  "name": "licenseIdNo",
                  "visibility": false
                },
                {
                  "name": "voterIdNo",
                  "visibility": false
                },
                {
                  "name": "marksheetIdNo",
                  "visibility": true
                }
              ]
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
          "name": "aadharIdNo",
          "label": "Aadhar last 4 digits",
          "visibleLabel": true,
          "type": "number",
          "maxLength": "4",
          "toolTipMessage": "Please enter the last 4 digits of your Aadhar ID.",
          "visible": false,
          "value": "",
          "class": "col-12 col-md-6 col-lg-4",
          "validators": [
            {
              "validatorName": "required",
              "required": true,
              "message": "Aadhar Number is required field"
            },
            {
              "validatorName": "pattern",
              "pattern": "[0-9]{4}",
              "message": "Aadhar ID must be exactly last 4 digits."
            }
          ]
        },
        {
          "name": "passportIdNo",
          "label": "Passport Id",
          "visibleLabel": true,
          "type": "idnumber",
          "toolTipMessage": "Please specify Passport Number in the format: First character from (A-Z), followed by 2 numbers, an optional space, and 5 numbers.",
          "visible": false,
          "value": "",
          "class": "col-12 col-md-6 col-lg-4",
          "validators": [
            {
              "validatorName": "required",
              "required": true,
              "message": "Passport Id is required field"
            },
            {
              "validatorName": "pattern",
              "pattern": "^[A-Z][0-9]{2}(?: [0-9]{5}|[0-9]{5})$",
              "message": "Passport Number must follow the format: First letter (A-Z), 2 numbers, optional space and 5 numbers."
            }
          ]
        },
        {
          "name": "licenseIdNo",
          "label": "Driving License Number",
          "visibleLabel": true,
          "type": "idnumber",
          "toolTipMessage": "The first two characters should be upper-case alphabets representing the state code, followed by two digits representing the RTO code, four digits for the year, and seven digits.",
          "visible": false,
          "value": "",
          "class": "col-12 col-md-6 col-lg-4",
          "validators": [
            {
              "validatorName": "required",
              "required": true,
              "message": "Driving License is required field"
            },
            {
              "validatorName": "pattern",
              "pattern": "^[A-Z]{2}[0-9]{2}[0-9]{4}[0-9]{7}$",
              "message": "Driving License must follow the format: 2 uppercase letters, 2 digits, 4 digits, 7 digits."
            }
          ]
        },
        {
          "name": "voterIdNo",
          "label": "EID Number",
          "visibleLabel": true,
          "type": "idnumber",
          "visible": false,
          "toolTipMessage": "Please enter a valid Voter ID, e.g., WED1234567.",
          "value": "",
          "class": "col-12 col-md-6 col-lg-4",
          "validators": [
            {
              "validatorName": "required",
              "required": true,
              "message": "Voter Id is required field"
            },
            {
              "validatorName": "pattern",
              "pattern": "^[A-Z]{3}[0-9]{7}$",
              "message": "Voter ID must follow the format: 3 uppercase letters followed by 7 digits."
            }
          ]
        },
        {
          "name": "marksheetIdNo",
          "label": "Marksheet Id",
          "visibleLabel": true,
          "type": "idnumber",
          "visible": false,
          "toolTipMessage": "Please enter a valid SSC Marksheet number with 7 digits.",
          "value": "",
          "class": "col-12 col-md-6 col-lg-4",
          "validators": [
            {
              "validatorName": "required",
              "required": true,
              "message": "Marksheet No is required field"
            },
            {
              "validatorName": "pattern",
              "pattern": "^[0-9]{7}$",
              "message": "SSC Marksheet number must be exactly 7 digits."
            }
          ]
        },
        {
          "name": "annualIncome",
          "label": "Annual Income",
          "visibleLabel": true,
          "onChangeMethod": "setForSelfMember",
          "otherControlName": "annualIncome",
          "type": "select",
          "visible": true,
          "value": "",
	    	  "disabled": true,
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
              "name": "10L to 20L",
              "value": "2000000"
            },
            {
              "name": "&gt; 20L",
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
          "onChangeMethod": "setForSelfMember",
          "otherControlName": "productMemberDesignation",
          "type": "select",
          "visible": true,
          "value": "",
    		  "disabled": true,
          "class": "col-12 col-md-6 col-lg-4",
          "options": [],
          "validators": [
            {
              "validatorName": "required",
              "required": true,
              "message": "Occupation is required field"
            }
          ]
        },
        {
          "name": "maritalStatus",
          "label": "Marital Status",
          "visibleLabel": true,
          "type": "select",
          "visible": true,
          "value": "",
    		  "disabled": true,
          "class": "col-12 col-md-6 col-lg-4",
          "options": [
            {
              "id": "Married",
              "value": "Married",
              "name": "Married"
            },
            {
              "id": "Single",
              "value": "Single",
              "name": "Single"
            },
            {
              "id": "Widow(er)",
              "value": "Widow(er)",
              "name": "Widow(er)"
            },
            {
              "id": "Separated",
              "value": "Separated",
              "name": "Separated"
            },
            {
              "id": "Divorced",
              "value": "Divorced",
              "name": "Divorced"
            },
            {
              "id": "Live In",
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
          "onChangeMethod": "changeMainFormDependentControls",
          "visible": true,
          "value": "",
	    	  "disabled": true,
          "class": "col-12 col-md-6 col-lg-4",
          "options": [
            {
              "id": "1",
              "value": "Consumers",
              "name": "Consumers",
              "selected": true,
              "dependentControls": [
                {
                  "name": "gstIn",
                  "visibility": false
                }
              ]
            },
            {
              "id": "2",
              "value": "Registered",
              "name": "Registered",
              "selected": false,
              "dependentControls": [
                {
                  "name": "gstIn",
                  "visibility": true
                }
              ]
            },
            {
              "id": "3",
              "value": "Compounding Dealers",
              "name": "Compounding Dealers",
              "selected": false,
              "dependentControls": [
                {
                  "name": "gstIn",
                  "visibility": true
                }
              ]
            }
          ]
        },
        {
          "name": "gstIn",
          "label": "GSTIN",
          "visibleLabel": true,
          "type": "text",
          "toolTipMessage": "The GSTIN must be 15 characters long. The first two characters should be digits representing the state code, followed by five uppercase alphabets, four digits, one alphabet, and ending with three alphanumeric characters.",
          "visible": false,
          "value": "",
          "class": "col-12 col-md-6 col-lg-4",
          "validators": [
            {
              "validatorName": "required",
              "required": true,
              "message": "GSTIN is required field"
            },
            {
              "validatorName": "pattern",
              "pattern": "^\\d{2}[a-zA-Z]{5}\\d{4}[a-zA-Z]{1}[a-zA-Z0-9]{3}$",
              "message": "Invalid GSTIN format."
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
          "name": "typeOfBusiness",
          "label": "Business Type",
          "visibleLabel": true,
          "visible": true,
          "onChangeMethod": "changeChronicCondition",
          "methodName":"changeChronicCondition",
          "otherControlName": "isChronicCare",
          "type": "select",
          "value": "REN",
          "options": [
            {
              "value": "REN",
              "name": "Renewal"
            },
            {
              "value": "Roll Over",
              "name": "Portability"
            }
          ],
          "class": "col-12 col-md-6 col-lg-4"
        },
        {
          "name": "memberPolicyType",
          "label": "Select Policy Type",
          "visibleLabel": true,
          "visible": true,
          "type": "select",
          "dependentControls": [
            "sumInsured",
            "zoneValue"
          ],
          "onChangeMethod": "handlePolicyTypeChange",
          "methodName": "handlePolicyTypeChange",
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
          "name": "isChronicCare",
          "label": "Does any member has Chronic condition?",
          "visibleLabel": true,
          "type": "radio",
          "value": "",
          "visible": true,
          "class": "radio-button",
          "radioOptions": [
            {
              "name": "yes",
              "label": "Yes",
              "value": "Y",
              "selected": false
            },
            {
              "name": "no",
              "label": "No",
              "value": "N",
              "selected": true
            }
          ]
        },
        {
          "name": "horizontalLine",
          "type": "line",
          "visible": true,
          "class": "custom-line"
        },
        {
          "name": "addressTitle",
          "label": "Permanent Address Details",
          "type": "paragraph",
          "visibleLabel": true,
          "visible": true,
          "class": "col-12 col-md-6 col-lg-4 addMember"
        },
        {
          "name": "proposerAddress1",
          "label": "Permanent Address 1",
          "visibleLabel": true,
          "type": "text",
          "value": "",
          "visible": true,
          "class": "col-12 col-md-6 col-lg-6 col-xl-4",
          "validators": [
            {
              "validatorName": "required",
              "message": "Address1 is Required"
            },
            {
              "validatorName": "pattern",
              "pattern": "^[a-zA-Z0-9,:/ -]{1,50}$",
              "message": "Maxmium Length is 50"
            }
          ]
        },
        {
          "name": "proposerAddress2",
          "label": "Permanent Address 2",
          "visibleLabel": true,
          "type": "text",
          "value": "",
          "visible": true,
          "class": "col-12 col-md-6 col-lg-6 col-xl-4",
          "validators": [
            {
              "validatorName": "required",
              "message": "Address2 is Required"
            },
            {
              "validatorName": "pattern",
              "pattern": "^[a-zA-Z0-9,:/ -]{1,50}$",
              "message": "Maxmium Length is 50"
            }
          ]
        },
        {
          "name": "proposerAddress3",
          "label": "Permanent Address 3",
          "visibleLabel": true,
          "type": "text",
          "value": "",
          "visible": true,
          "class": "col-12 col-md-6 col-lg-6 col-xl-4"
        },
        {
          "name": "proposerPincode",
          "label": "Pincode",
          "visibleLabel": true,
          "visible": true,
          "type": "number",
          "value": "",
          "class": "col-12 col-md-6 col-lg-4",
          "methodName": "getCityStateByPin",
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
          "class": "col-12 col-md-4 col-lg-4",
          "disabled": true,
          "visible": true,
          "visibleLabel": true,
          "value": "",
          "type": "text"
        },
        {
          "name": "state",
          "label": "State",
          "class": "col-12 col-md-6 col-lg-4",
          "visibleLabel": true,
          "disabled": true,
          "visible": true,
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
          "name": "sumInsured",
          "label": "Select Sum Insured for Family",
          "visibleLabel": true,
          "visible": false,
          "type": "select",
          "value": "",
          "class": "col-12 col-md-6 col-lg-4",
          "options": [],
          "validators": [
            {
              "validatorName": "required",
              "required": true,
              "message": "Sum Insured is required field"
            }
          ]
        },
        {
          "name": "zone",
          "label": "Zone",
          "class": "col-12 col-md-6 col-lg-4",
          "visible": false,
          "visibleLabel": true,
          "disabled": true,
          "value": "",
          "type": "text"
        },
        {
          "name": "zoneValue",
          "label": "Zone",
          "class": "col-12 col-md-6 col-lg-4",
          "visibleLabel": true,
          "visible": false,
          "disabled":true,
          "value": "",
          "type": "select",
          "options": []
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
          "type": "tabview",
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
                "class": "col-12 col-md-2",
                "type": "text",
                "visible": false
              },
	      		  {
                "name": "memberType",
                "label": "Member Type",
                "visibleLabel": false,
                "class": "col-12 col-md-3",
                "disabled": true,
                "type": "select",
                "visible": false,
                "value": "",
                "methodName": "memberDetailsOption",
                "options": []
              },
              {
                "name": "relation",
                "visibleLabel": false,
                "label": "Relation",
                "value": "",
                "class": "col-12 col-md-2",
                "type": "text",
                "visible": false,
                "disabled": true,
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
                "name": "relationshipType",
                "visibleLabel": false,
                "label": "Relationship Type",
                "value": "",
                "methodName": "getAllRelationship",
                "class": "col-md-2 acceptTermsCheck",
                "type": "select",
                "visible": false,
                "selectCheckboxOptions": [
                ]
              },
              {
                "name": "memberId",
                "label": "MemmberID",
                "visibleLabel": false,
                "class": "col-12 col-md-3",
                "type": "test",
                "visible": false,
                "value": "",
              },
		      	  {
                "name": "Member Details",
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
                "methodName": "updateSalutationsBasedOnGender",
                "value": "",
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
                    "value": "Mx.",
                    "name": "Mx"
                  },
                  {
                    "value": "Miss.",
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
		        		"disabled": false,
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
		        		"disabled": false,
                "class": "col-12 col-md-6 col-lg-3"
              },
              {
                "name": "lastName",
                "label": "Last Name",
                "visibleLabel": true,
                "visible": true,
                "type": "text",
                "value": "",
		        		"disabled": false,
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
                "label": "Enter Height (cm)",
                "visibleLabel": true,
                "type": "number",
                "visible": true,
                "value": "",
		        		"disabled": false,
                "class": "col-12 col-md-6 col-lg-4",
                "validators": [
                  {
                    "validatorName": "required",
                    "required": true,
                    "message": "Height(ft) is required field"
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
		        		"disabled": false,
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
                "disabled": false,
                "class": "col-12 col-md-6 col-lg-3",
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
                "name": "memberDob",
                "label": "Date of Birth",
                "visible": true,
                "visibleLabel": true,
                "type": "date",
                "value": "",
			        	"disabled": false,
                "class": "col-12 col-md-6 col-lg-4",
              },	  
			  {
                "name": "annualIncome",
                "label": "Annual Income",
                "visibleLabel": true,
                "type": "select",
                "visible": true,
                "value": "",
                "disabled": false,
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
                    "name": "10L to 20L",
                    "value": "2000000"
                  },
                  {
                    "name": "&gt; 20L",
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
                "name": "mobileNumber",
                "label": "Mobile Number",
                "visibleLabel": true,
                "visible": true,
                "type": "phonenumber",
                "value": "",
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
                "name": "emailId",
                "label": "Email Address",
                "visible": true,
                "visibleLabel": true,
                "type": "email",
                "value": "",
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
                "name": "occupation",
                "label": "Occupation",
                "visibleLabel": true,
                "type": "select",
                "visible": true,
                "getAllOption": "getAllProposerOccupation",
                "value": "",
	        			"disabled": false,
                "options": [],
                "class": "col-12 col-md-6 col-lg-4",
                "validators": [
                  {
                    "validatorName": "required",
                    "required": true,
                    "message": "Occupation Required"
                  }
                ]
              },
              {
                "name": "natureOfDuty",
                "label": "Nature of Work",
                "visibleLabel": true,
                "visible": true,
		        		"disabled": false,
                "getAllOption": "getNatureOfDuty",
                "type": "select",
                "value": "",
                "options": [],
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
                "name": "designation",
                "label": "Designation",
                "visible": true,
                "visibleLabel": true,
		        		"disabled": false,
                "getAllOption": "getInsuredOccupation",
                "type": "select",
                "class": "col-12 col-md-6 col-lg-4",
                "value": "",
                "options": [],
                "validators": [
                  {
                    "validatorName": "required",
                    "required": true,
                    "message": "Designation is Required"
                  }
                ]
              },
			  {
                "name": "nationality",
                "label": "Nationality",
                "visibleLabel": true,
                "type": "select",
                "visible": true,
                "value": "",
		        		"disabled": false,
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
              }
            ]
          ]
        },
        {
          "name": "insuredMemberDetails",
          "label": "Insured Member Details",
          "visibleLabel": false,
          "type": "tabview",
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
                "class": "col-12 col-md-2",
                "type": "text",
                "visible": false
              },
		      	  {
                "name": "memberType",
                "label": "Member Type",
                "visibleLabel": false,
                "class": "col-12 col-md-3",
                "disabled": true,
                "type": "select",
                "visible": false,
                "value": "",
                "methodName": "memberDetailsOption",
                "options": []
              },
              {
                "name": "relation",
                "visibleLabel": false,
                "label": "Relation",
                "value": "",
                "class": "col-12 col-md-2",
                "type": "text",
                "visible": false,
                "disabled": true,
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
                "name": "relationshipType",
                "visibleLabel": false,
                "label": "Relationship Type",
                "value": "",
                "methodName": "getAllRelationship",
                "class": "col-md-2 acceptTermsCheck",
                "type": "select",
                "visible": false,
                "selectCheckboxOptions": [
                ]
              },
              {
                "name": "memberId",
                "label": "MemmberID",
                "visibleLabel": false,
                "class": "col-12 col-md-3",
                "type": "test",
                "visible": false,
                "value": "",
              },
		      	  {
                "name": "Member Details",
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
                "methodName": "updateSalutationsBasedOnGender",
                "value": "",
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
                    "value": "Mx.",
                    "name": "Mx"
                  },
                  {
                    "value": "Miss.",
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
		        		"disabled": false,
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
		        		"disabled": false,
                "class": "col-12 col-md-6 col-lg-3"
              },
              {
                "name": "lastName",
                "label": "Last Name",
                "visibleLabel": true,
                "visible": true,
                "type": "text",
                "value": "",
		        		"disabled": false,
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
                "label": "Enter Height (cm)",
                "visibleLabel": true,
                "type": "number",
                "visible": true,
                "value": "",
		        		"disabled": false,
                "class": "col-12 col-md-6 col-lg-4",
                "validators": [
                  {
                    "validatorName": "required",
                    "required": true,
                    "message": "Height(ft) is required field"
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
		        		"disabled": false,
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
                "disabled": false,
                "class": "col-12 col-md-6 col-lg-3",
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
                "name": "memberDob",
                "label": "Date of Birth",
                "visible": true,
                "visibleLabel": true,
                "type": "date",
                "value": "",
		        		"disabled": false,
                "class": "col-12 col-md-6 col-lg-4",
              },	  
		      	  {
                "name": "annualIncome",
                "label": "Annual Income",
                "visibleLabel": true,
                "type": "select",
                "visible": true,
                "value": "",
                "disabled": false,
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
                    "name": "10L to 20L",
                    "value": "2000000"
                  },
                  {
                    "name": "&gt; 20L",
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
                "name": "mobileNumber",
                "label": "Mobile Number",
                "visibleLabel": true,
                "visible": true,
                "type": "phonenumber",
                "value": "",
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
                "name": "emailId",
                "label": "Email Address",
                "visible": true,
                "visibleLabel": true,
                "type": "email",
                "value": "",
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
                "name": "occupation",
                "label": "Occupation",
                "visibleLabel": true,
                "type": "select",
                "visible": true,
                "getAllOption": "getAllProposerOccupation",
                "value": "",
		        		"disabled": false,
                "options": [],
                "class": "col-12 col-md-6 col-lg-4",
                "validators": [
                  {
                    "validatorName": "required",
                    "required": true,
                    "message": "Occupation Required"
                  }
                ]
              },
              {
                "name": "natureOfDuty",
                "label": "Nature of Work",
                "visibleLabel": true,
                "visible": true,
		        		"disabled": false,
                "getAllOption": "getNatureOfDuty",
                "type": "select",
                "value": "",
                "options": [],
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
                "name": "designation",
                "label": "Designation",
                "visible": true,
                "visibleLabel": true,
		        		"disabled": false,
                "getAllOption": "getInsuredOccupation",
                "type": "select",
                "class": "col-12 col-md-6 col-lg-4",
                "value": "",
                "options": [],
                "validators": [
                  {
                    "validatorName": "required",
                    "required": true,
                    "message": "Designation is Required"
                  }
                ]
              },
		      	  {
                "name": "nationality",
                "label": "Nationality",
                "visibleLabel": true,
                "type": "select",
                "visible": true,
                "value": "",
		        		"disabled": false,
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
          "name": "recalculate",
          "label": "Calculate",
          "visibleLabel": false,
          "visible": false,
          "type": "button",
          "class": "col-12 col-md-6 col-lg-2 next-btn",
          "methodName": "calculatePremium"
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