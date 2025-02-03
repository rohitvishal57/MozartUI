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