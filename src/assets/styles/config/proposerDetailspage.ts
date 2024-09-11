export const proposerDetailspage = {
    "formTitle": "PROPOSER DETAILS",
    "saveBtnTitle": "Save",
    "saveBtnFunction": "commonDraftProposerSave",
    "prevBtnTitle": "",
    "resetBtnTitle": "Reset",
    "themeFile": "ABHI.css",
    "formSections": [
        {
            "sectionTitle": "",
            "visible": false,
            "class": "section-title",
            "formControls": [
                
            ]
        },
        {
            "sectionTitle": "Product Information",
            "visible": true,
            "class": "section-title",
            "formControls": [
                {
                    "name": "proposerTitle",
                    "label": "Proposer Salutation",
                    "visibleLabel": true,
                    "type": "select",
                    "value": "",
                    "methodName": "getSalutation",
                    "options": [
                       
                    ],
                    "class": "col-md-3",
                    "validators": [
                        {
                            "validatorName": "required",
                            "message": "Salutation Required"
                        }
                    ]
                },
                {
                    "name": "leadFirstName",
                    "label": "First Name",
                    "visibleLabel": true,
                    "type": "text",
                    "value": "",
                    "class": "col-md-3",
                    "visible": true,
                    "validators": [
                        {
                            "validatorName": "required",
                            "message": "Name Required"
                        }
                    ]
                },
                {
                    "name": "leadMiddleName",
                    "label": "Middle Name",
                    "visibleLabel": true,
                    "type": "text",
                    "visible": true,
                    "value": "",
                    "class": "col-md-3",
                    "validators": [
                        {
                            "validatorName": "required",
                            "message": "Middle Name Required"
                        }
                    ]
                },
                {
                    "name": "leadLastName",
                    "label": "Last Name",
                    "visibleLabel": true,
                    "type": "text",
                    "value": "",
                    "visible": true,
                    "class": "col-md-3",
                    "validators": [
                        {
                            "validatorName": "required",
                            "message": "Last Name Required"
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
                    "class": "col-md-6",
                    "validators": [
                        {
                            "validatorName": "required",
                            "message": "Address 1 Required"
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
                    "class": "col-md-6",
                    "validators": [
                        {
                            "validatorName": "required",
                            "message": "Address 2 Required"
                        }
                    ]
                },
                {
                    "name": "insuredMemberDetails.0.pincode",
                    "label": "Pincode",
                    "visibleLabel": true,
                    "type": "text",
                    "visible": true,
                    "controlName": "pincode",
                    "value": "",
                    "class": "col-md-4",
                    "validators": [
                        {
                            "validatorName": "required",
                            "required": true,
                            "message": "Pincode is required field."
                        }
                    ]
                },
                {
                    "name": "insuredMemberDetails.0.city",
                    "label": "City",
                    "visibleLabel": true,
                    "type": "text",
                    "value": "",
                    "visible": true,
                    "class": "col-md-4",
                    "validators": [
                        {
                            "validatorName": "required",
                            "required": true,
                            "message": "City is a required."
                        }
                    ]
                },
                {
                    "name": "insuredMemberDetails.0.state",
                    "label": "State",
                    "visibleLabel": true,
                    "type": "text",
                    "value": "",
                    "visible": true,
                    "class": "col-md-4",
                    "validators": [
                        {
                            "validatorName": "required",
                            "required": true,
                            "message": "State is required field."
                        }
                    ]
                },
                {
                    "name": "insuredMemberDetails.0.memberdob",
                    "label": "Date of Birth",
                    "visibleLabel": true,
                    "type": "date",
                    "visible": true,
                    "value": "",
                    "class": "col-md-6",
                    "validators": [
                        {
                            "validatorName": "required",
                            "required": true,
                            "message": "DOB is required field."
                        }
                    ]
                },
                {
                    "name": "annualIncome",
                    "label": "Annual Income",
                    "visibleLabel": true,
                    "type": "select",
                    "value": "",
                    "class": "col-md-6",
                    "options": [
                        {
                            "id": 1,
                            "name": "Upto 5L",
                            "value": "Upto 5L"
                        },
                        {
                            "id": 2,
                            "name": "5L to 10L",
                            "value": "5L to 10L"
                        },
                        {
                            "id": 3,
                            "name": "10L to 15L",
                            "value": "10L to 15L"
                        },
                        {
                            "id": 4,
                            "name": "15L to 20L",
                            "value": "15L to 20L"
                        },
                        {
                            "id": 5,
                            "name": ">20L",
                            "value": ">20L"
                        }
                    ],
                    "validators": [
                        {
                            "validatorName": "required",
                            "required": true,
                            "message": "Annual Income is required field."
                        }
                    ]
                }
            ]
        },
        {
            "sectionTitle": "Contact Details",
            "visible": true,
            "class": "section-title",
            "formControls": [
                {
                    "name": "leadEmailId",
                    "label": "Email Id",
                    "visibleLabel": true,
                    "type": "text",
                    "value": "",
                    "visible": true,
                    "class": "col-md-6",
                    "validators": [
                        {
                            "validatorName": "required",
                            "required": true,
                            "message": "Email Id is required field."
                        }
                    ]
                },
                {
                    "name": "stdCode",
                    "label": "Std. Code",
                    "visibleLabel": true,
                    "type": "text",
                    "value": "",
                    "visible": true,
                    "class": "col-md-2",
                    "validators": [
                        {
                            "validatorName": "required",
                            "required": true,
                            "message": "Contact No is required field."
                        }
                    ]
                },
                {
                    "name": "landLineNo",
                    "label": "Contact No.",
                    "visibleLabel": true,
                    "type": "text",
                    "value": "",
                    "visible": true,
                    "class": "col-md-4",
                    "validators": [
                        {
                            "validatorName": "required",
                            "required": true,
                            "message": "Contact No is required field."
                        }
                    ]
                },
                {
                    "name": "leadMobileNo",
                    "label": "Mobile Number",
                    "visibleLabel": true,
                    "type": "text",
                    "value": "",
                    "visible": true,
                    "class": "col-md-6",
                    "validators": [
                        {
                            "validatorName": "required",
                            "required": true,
                            "message": "Mobile No is required field."
                        }
                    ]
                },
                {
                    "name": "whatsAppNumber",
                    "label": "WhatsApp Mobile Number(If different from Mobile Number)",
                    "visibleLabel": true,
                    "visible": true,
                    "type": "text",
                    "value": "",
                    "class": "col-md-6"
                }
            ]
        },
        {
            "sectionTitle": "Identity Details",
            "visible": true,
            "class": "section-title",
            "formControls": [
                {
                    "name": "gstDetails",
                    "label": "GST Type",
                    "visibleLabel": true,
                    "type": "select",
                    "value": "",
                    "methodName": "getGstRegistrationStatus",
                    "class": "col-md-6",
                    "validators": [
                        {
                            "validatorName": "required",
                            "required": true,
                            "message": "GST Type is required field."
                        }
                    ],
                    "options": [
                        
                    ]
                },
                {
                    "name": "idProof",
                    "label": "ID Type",
                    "visibleLabel": true,
                    "type": "select",
                    "value": "",
                    "methodName": "getIdentityProof",
                    "class": "col-md-6",
                    "options": [
                    ],
                    "validators": [
                        {
                            "validatorName": "required",
                            "required": true,
                            "message": "Id is required field."
                        }
                    ]
                },
                {
                    "name": "idNo",
                    "label": "ID Number",
                    "visibleLabel": true,
                    "type": "text",
                    "visible": true,
                    "value": "",
                    "class": "col-md-4",
                    "validators": [
                        {
                            "validatorName": "required",
                            "required": true,
                            "message": "ID No is required field."
                        }
                    ]
                },
                {
                    "name": "panNo",
                    "label": "PAN Card Number",
                    "visibleLabel": true,
                    "type": "text",
                    "value": "",
                    "visible": true,
                    "class": "col-md-4",
                    "validators": [
                        {
                            "validatorName": "required",
                            "required": true,
                            "message": "PAN No is required field."
                        }
                    ]
                },
                {
                    "name": "upi",
                    "label": "UPI Handle",
                    "visibleLabel": true,
                    "type": "text",
                    "visible": true,
                    "value": "",
                    "class": "col-md-4",
                    "validators": [
                        {
                            "validatorName": "required",
                            "required": true,
                            "message": "UPI is required field."
                        }
                    ]
                },
                {
                    "name": "maritalStatus",
                    "label": "Marital Status",
                    "visibleLabel": true,
                    "type": "select",
                    "value": "",
                    "methodName": "getMaritalStatus",
                    "class": "col-md-4",
                    "options": [
                    ],
                    "validators": [
                        {
                            "validatorName": "required",
                            "required": true,
                            "message": "Marital Status is required field."
                        }
                    ]
                },
                {
                    "name": "educationDetails",
                    "label": "Education",
                    "visibleLabel": true,
                    "type": "select",
                    "value": "",
                    "methodName": "getEducationType",
                    "class": "col-md-4",
                    "options": [
                       
                    ],
                    "validators": [
                        {
                            "validatorName": "required",
                            "required": true,
                            "message": "Education is required field."
                        }
                    ]
                },
                {
                    "name": "ifPEP",
                    "label": "Are you a PEP(Politically Exposed Person) or relative of PEP",
                    "visibleLabel": true,
                    "type": "radio",
                    "class": "radio-button",
                    "radioOptions": [
                        {
                            "name": "no",
                            "label": "No",
                            "value": "no",
                            "selected": false
                        },
                        {
                            "name": "yes",
                            "label": "Yes",
                            "value": "yes",
                            "selected": false
                        }
                    ]
                },
                {
                    "name": "nationality",
                    "label": "Nationality",
                    "visibleLabel": true,
                    "type": "select",
                    "methodName": "getNationality",
                    "value": "",
                    "class": "col-md-4",
                    "options": [
                    ],
                    "validators": [
                        {
                            "validatorName": "required",
                            "required": true,
                            "message": "Nationality is required field."
                        }
                    ]
                }
            ]
        }
    ]
}

// {
//     "formTitle": "PROPOSER DETAILS",
//     "saveBtnTitle": "Save",
//     "saveBtnFunction": "commonDraftProposerSave",
//     "prevBtnTitle": "",
//     "resetBtnTitle": "Reset",
//     "themeFile": "ABHI.css",
//     "formSections": [
//         {
//             "sectionTitle": "Product Information",
//             "visible": true,
//             "class": "section-title",
//             "formControls": [
//                 {
//                     "name": "proposerTitle",
//                     "label": "Proposer Salutation",
//                     "visibleLabel": true,
//                     "type": "select",
//                     "value": "",
//                     "methodName": "getSalutation",
//                     "options": [
                       
//                     ],
//                     "class": "col-md-3",
//                     "validators": [
//                         {
//                             "validatorName": "required",
//                             "message": "Salutation Required"
//                         }
//                     ]
//                 },
//                 {
//                     "name": "leadFirstName",
//                     "label": "First Name",
//                     "visibleLabel": true,
//                     "type": "text",
//                     "value": "",
//                     "class": "col-md-3",
//                     "visible": true,
//                     "validators": [
//                         {
//                             "validatorName": "required",
//                             "message": "Name Required"
//                         }
//                     ]
//                 },
//                 {
//                     "name": "leadMiddleName",
//                     "label": "Middle Name",
//                     "visibleLabel": true,
//                     "type": "text",
//                     "visible": true,
//                     "value": "",
//                     "class": "col-md-3",
//                     "validators": [
//                         {
//                             "validatorName": "required",
//                             "message": "Middle Name Required"
//                         }
//                     ]
//                 },
//                 {
//                     "name": "leadLastName",
//                     "label": "Last Name",
//                     "visibleLabel": true,
//                     "type": "text",
//                     "value": "",
//                     "visible": true,
//                     "class": "col-md-3",
//                     "validators": [
//                         {
//                             "validatorName": "required",
//                             "message": "Last Name Required"
//                         }
//                     ]
//                 },
//                 {
//                     "name": "proposerAddress1",
//                     "label": "Correspondence Address 1",
//                     "visibleLabel": true,
//                     "type": "text",
//                     "value": "",
//                     "visible": true,
//                     "class": "col-md-6",
//                     "validators": [
//                         {
//                             "validatorName": "required",
//                             "message": "Address 1 Required"
//                         }
//                     ]
//                 },
//                 {
//                     "name": "proposerAddress2",
//                     "label": "Correspondence Address 2",
//                     "visibleLabel": true,
//                     "type": "text",
//                     "value": "",
//                     "visible": true,
//                     "class": "col-md-6",
//                     "validators": [
//                         {
//                             "validatorName": "required",
//                             "message": "Address 2 Required"
//                         }
//                     ]
//                 },
//                 {
//                     "name": "insuredMemberDetails.0.pincode",
//                     "label": "Pincode",
//                     "visibleLabel": true,
//                     "type": "text",
//                     "visible": true,
//                     "controlName": "pincode",
//                     "value": "",
//                     "class": "col-md-4",
//                     "validators": [
//                         {
//                             "validatorName": "required",
//                             "required": true,
//                             "message": "Pincode is required field."
//                         }
//                     ]
//                 },
//                 {
//                     "name": "insuredMemberDetails.0.city",
//                     "label": "City",
//                     "visibleLabel": true,
//                     "type": "text",
//                     "value": "",
//                     "visible": true,
//                     "class": "col-md-4",
//                     "validators": [
//                         {
//                             "validatorName": "required",
//                             "required": true,
//                             "message": "City is a required."
//                         }
//                     ]
//                 },
//                 {
//                     "name": "insuredMemberDetails.0.state",
//                     "label": "State",
//                     "visibleLabel": true,
//                     "type": "text",
//                     "value": "",
//                     "visible": true,
//                     "class": "col-md-4",
//                     "validators": [
//                         {
//                             "validatorName": "required",
//                             "required": true,
//                             "message": "State is required field."
//                         }
//                     ]
//                 },
//                 {
//                     "name": "insuredMemberDetails.0.memberdob",
//                     "label": "Date of Birth",
//                     "visibleLabel": true,
//                     "type": "date",
//                     "visible": true,
//                     "value": "",
//                     "class": "col-md-6",
//                     "validators": [
//                         {
//                             "validatorName": "required",
//                             "required": true,
//                             "message": "DOB is required field."
//                         }
//                     ]
//                 },
//                 {
//                     "name": "annualIncome",
//                     "label": "Annual Income",
//                     "visibleLabel": true,
//                     "type": "select",
//                     "value": "",
//                     "class": "col-md-6",
//                     "options": [
//                         {
//                             "id": 1,
//                             "name": "Upto 5L",
//                             "value": "Upto 5L"
//                         },
//                         {
//                             "id": 2,
//                             "name": "5L to 10L",
//                             "value": "5L to 10L"
//                         },
//                         {
//                             "id": 3,
//                             "name": "10L to 15L",
//                             "value": "10L to 15L"
//                         },
//                         {
//                             "id": 4,
//                             "name": "15L to 20L",
//                             "value": "15L to 20L"
//                         },
//                         {
//                             "id": 5,
//                             "name": ">20L",
//                             "value": ">20L"
//                         }
//                     ],
//                     "validators": [
//                         {
//                             "validatorName": "required",
//                             "required": true,
//                             "message": "Annual Income is required field."
//                         }
//                     ]
//                 }
//             ]
//         },
//         {
//             "sectionTitle": "Contact Details",
//             "visible": true,
//             "class": "section-title",
//             "formControls": [
//                 {
//                     "name": "leadEmailId",
//                     "label": "Email Id",
//                     "visibleLabel": true,
//                     "type": "text",
//                     "value": "",
//                     "visible": true,
//                     "class": "col-md-6",
//                     "validators": [
//                         {
//                             "validatorName": "required",
//                             "required": true,
//                             "message": "Email Id is required field."
//                         }
//                     ]
//                 },
//                 {
//                     "name": "stdCode",
//                     "label": "Std. Code",
//                     "visibleLabel": true,
//                     "type": "text",
//                     "value": "",
//                     "visible": true,
//                     "class": "col-md-2",
//                     "validators": [
//                         {
//                             "validatorName": "required",
//                             "required": true,
//                             "message": "Contact No is required field."
//                         }
//                     ]
//                 },
//                 {
//                     "name": "landLineNo",
//                     "label": "Contact No.",
//                     "visibleLabel": true,
//                     "type": "text",
//                     "value": "",
//                     "visible": true,
//                     "class": "col-md-4",
//                     "validators": [
//                         {
//                             "validatorName": "required",
//                             "required": true,
//                             "message": "Contact No is required field."
//                         }
//                     ]
//                 },
//                 {
//                     "name": "leadMobileNo",
//                     "label": "Mobile Number",
//                     "visibleLabel": true,
//                     "type": "text",
//                     "value": "",
//                     "visible": true,
//                     "class": "col-md-6",
//                     "validators": [
//                         {
//                             "validatorName": "required",
//                             "required": true,
//                             "message": "Mobile No is required field."
//                         }
//                     ]
//                 },
//                 {
//                     "name": "whatsAppNumber",
//                     "label": "WhatsApp Mobile Number(If different from Mobile Number)",
//                     "visibleLabel": true,
//                     "visible": true,
//                     "type": "text",
//                     "value": "",
//                     "class": "col-md-6"
//                 }
//             ]
//         },
//         {
//             "sectionTitle": "Identity Details",
//             "visible": true,
//             "class": "section-title",
//             "formControls": [
//                 {
//                     "name": "gstDetails",
//                     "label": "GST Type",
//                     "visibleLabel": true,
//                     "type": "select",
//                     "value": "",
//                     "methodName": "getGstRegistrationStatus",
//                     "class": "col-md-6",
//                     "validators": [
//                         {
//                             "validatorName": "required",
//                             "required": true,
//                             "message": "GST Type is required field."
//                         }
//                     ],
//                     "options": [
                        
//                     ]
//                 },
//                 {
//                     "name": "idProof",
//                     "label": "ID Type",
//                     "visibleLabel": true,
//                     "type": "select",
//                     "value": "",
//                     "methodName": "getIdentityProof",
//                     "class": "col-md-6",
//                     "options": [
//                     ],
//                     "validators": [
//                         {
//                             "validatorName": "required",
//                             "required": true,
//                             "message": "Id is required field."
//                         }
//                     ]
//                 },
//                 {
//                     "name": "idNo",
//                     "label": "ID Number",
//                     "visibleLabel": true,
//                     "type": "text",
//                     "visible": true,
//                     "value": "",
//                     "class": "col-md-4",
//                     "validators": [
//                         {
//                             "validatorName": "required",
//                             "required": true,
//                             "message": "ID No is required field."
//                         }
//                     ]
//                 },
//                 {
//                     "name": "panNo",
//                     "label": "PAN Card Number",
//                     "visibleLabel": true,
//                     "type": "text",
//                     "value": "",
//                     "visible": true,
//                     "class": "col-md-4",
//                     "validators": [
//                         {
//                             "validatorName": "required",
//                             "required": true,
//                             "message": "PAN No is required field."
//                         }
//                     ]
//                 },
//                 {
//                     "name": "upi",
//                     "label": "UPI Handle",
//                     "visibleLabel": true,
//                     "type": "text",
//                     "visible": true,
//                     "value": "",
//                     "class": "col-md-4",
//                     "validators": [
//                         {
//                             "validatorName": "required",
//                             "required": true,
//                             "message": "UPI is required field."
//                         }
//                     ]
//                 },
//                 {
//                     "name": "maritalStatus",
//                     "label": "Marital Status",
//                     "visibleLabel": true,
//                     "type": "select",
//                     "value": "",
//                     "methodName": "getMaritalStatus",
//                     "class": "col-md-4",
//                     "options": [
//                     ],
//                     "validators": [
//                         {
//                             "validatorName": "required",
//                             "required": true,
//                             "message": "Marital Status is required field."
//                         }
//                     ]
//                 },
//                 {
//                     "name": "educationDetails",
//                     "label": "Education",
//                     "visibleLabel": true,
//                     "type": "select",
//                     "value": "",
//                     "methodName": "getEducationType",
//                     "class": "col-md-4",
//                     "options": [
                       
//                     ],
//                     "validators": [
//                         {
//                             "validatorName": "required",
//                             "required": true,
//                             "message": "Education is required field."
//                         }
//                     ]
//                 },
//                 {
//                     "name": "ifPEP",
//                     "label": "Are you a PEP(Politically Exposed Person) or relative of PEP",
//                     "visibleLabel": true,
//                     "type": "radio",
//                     "class": "radio-button",
//                     "radioOptions": [
//                         {
//                             "name": "no",
//                             "label": "No",
//                             "value": "no",
//                             "selected": false
//                         },
//                         {
//                             "name": "yes",
//                             "label": "Yes",
//                             "value": "yes",
//                             "selected": false
//                         }
//                     ]
//                 },
//                 {
//                     "name": "nationality",
//                     "label": "Nationality",
//                     "visibleLabel": true,
//                     "type": "select",
//                     "methodName": "getNationality",
//                     "value": "",
//                     "class": "col-md-4",
//                     "options": [
//                     ],
//                     "validators": [
//                         {
//                             "validatorName": "required",
//                             "required": true,
//                             "message": "Nationality is required field."
//                         }
//                     ]
//                 }
//             ]
//         }
//     ]
// }