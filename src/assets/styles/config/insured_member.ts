export const insured_member= {
    "formTitle": "INSURED MEMBERS",
    "saveBtnTitle": "Save",
    "prevBtnTitle": "",
    "resetBtnTitle": "",
    "calculateBtnTitle": "",
    "themeFile": "ABHI.css",
    "formSections": [
        {
            "sectionTitle": "Activ Health Plan",
            "visible": false,
            "class": "section-title",
            "formControls": [
                {
                    "name": "productVariant",
                    "label": "Product Variant",
                    "visibleLabel": true,
                    "type": "select",
                    "value": "",
                    "subType": "",
                    "class": "col-md-4",
                    "options": [
                        {
                            "name": "Platinum",
                            "value": "Platinum"
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
                    "name": "memberPlan",
                    "label": "Activ Health Plan",
                    "visibleLabel": true,
                    "type": "select",
                    "value": "",
                    "subType": "",
                    "class": "col-md-4",
                    "options": [
                        {
                            "name": "ENHANCED",
                            "value": "Enhanced Plan"
                        },
                        {
                            "name": "ESSENTIAL",
                            "value": "Essential Plan"
                        },
                        {
                            "name": "PREMIER",
                            "value": "Premier Plan"
                        }
                    ],
                    "validators": [
                        {
                            "validatorName": "required",
                            "required": true,
                            "message": "Plan is required field."
                        }
                    ]
                },
                {
                    "name": "productType",
                    "label": "Product Type",
                    "visibleLabel": false,
                    "type": "text",
                    "value": "AH",
                    "class": "",
                    "visible": false
                },
                {
                    "name": "productName",
                    "label": "Product Name",
                    "visibleLabel": false,
                    "type": "text",
                    "value": "Active Health",
                    "class": "",
                    "visible": false
                },
                {
                    "name": "productId",
                    "label": "Product Id",
                    "visibleLabel": false,
                    "type": "text",
                    "value": "6212",
                    "class": "",
                    "visible": false
                },
                {
                    "name": "planCode",
                    "label": "Product Code",
                    "visibleLabel": false,
                    "type": "text",
                    "value": "6212100003",
                    "class": "",
                    "visible": false

                },
                {
                    "name": "memberPlanPolicy",
                    "label": "Policy Type",
                    "visibleLabel": true,
                    "type": "select",
                    "value": "",
                    "subType": "",
                    "class": "col-md-4",
                    "options": [
                        {
                            "name": "New Business",
                            "value": "New Business"
                        },
                        {
                            "name": "Portability",
                            "value": "Portability"
                        }
                    ],
                    "validators": [
                        {
                            "validatorName": "required",
                            "required": true,
                            "message": "Policy Type is required field."
                        }
                    ]
                }
            ]
        },
        {
            "sectionTitle": "Enter Proposer Details",
            "visible": true,
            "class": "section-title",
            "formControls": [
                {
                    "name": "memberDobProposer",
                    "label": "Date of Birth",
                    "visibleLabel": true,
                    "type": "date",
                    "value": "",
                    "class": "col-md-4",
                    "visible": true,
                    "validators": [
                        {
                            "validatorName": "required",
                            "required": true,
                            "message": "DOB is required field."
                        }
                    ]
                },
                {
                    "name": "memberAgeProposer",
                    "label": "Age",
                    "visibleLabel": true,
                    "type": "text",
                    "value": "",
                    "visible": true,
                    "class": "col-md-4",
                    "validators": [
                        {
                            "validatorName": "required",
                            "required": true,
                            "message": "Age is required field."
                        },
                        {
                            "validatorName": "pattern",
                            "pattern":"^(1[8-9]|[2-9][0-9]|1[0-1][0-9]|120)$",
                            "message": "Age should be greater than 18 and lesser than 120."
                        }
                    ]
                },
                {
                    "name": "proposerGender",
                    "label": "Gender",
                    "visibleLabel": true,
                    "type": "select",
                    "value": "",
                    "class": "col-md-4",
                    "visible": true,
                    "options":[
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
                        "name": "memberPolicyType",
                        "label": "Select Policy Type",
                        "visibleLabel": true,
                        "visible":true,
                        "type": "select",
                        "value": "",
                        "class": "col-md-6",
                        "options": [
                            {
                                "name": "FAMILY FLOATER",
                                "value": "Family Floater"
                            },
                            {
                                "name": "MULTI INDIVIDUAL",
                                "value": "Multi Individual"
                            }
                        ],
                        "validators": [
                            {
                                "validatorName": "required",
                                "required": true,
                                "message": "Polcy Type is required field."
                            }
                        ]
                    },
                    {
                        "name": "memberSumInsured",
                        "label": "Select Sum Insured for Family",
                        "visibleLabel": true,
                        "visible":true,
                        "type": "select",
                        "value": "",
                        "class": "col-md-3",
                        "conditionalVisibility": {
                            "dependsOn": "memberPolicyType",
                            "values": ["MULTI INDIVIDUAL"]
                        },
                        "options": [
                            {
                                "name": "500000",
                                "value": 500000
                            },
                            {
                                "name": "600000",
                                "value": 600000
                            },
                            {
                                "name": "700000",
                                "value": 700000
                            },
                            {
                                "name": "800000",
                                "value": 800000
                            },
                            {
                                "name": "900000",
                                "value": 900000
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
                                "name": "3000000",
                                "value": 3000000
                            },
                            {
                                "name": "4000000",
                                "value": 4000000
                            },
                            {
                                "name": "5000000",
                                "value": 5000000
                            },
                            {
                                "name": "10000000",
                                "value": 10000000
                            },
                            {
                                "name": "150000000",
                                "value": 150000000
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
                                "message": "Polcy Type is required field."
                            }
                        ]
                    },
                    {
                        "name": "pincode",
                        "label": "Pincode",
                        "visibleLabel": true,
                        "visible":true,
                        "type": "text",
                        "value": "",
                        "class": "col-md-3",
                        "conditionalVisibility": {
                            "dependsOn": "memberPolicyType",
                            "values": ["MULTI INDIVIDUAL"]
                        },
                        "validators": [
                            {
                                "validatorName": "required",
                                "required": true,
                                "message": "Pincode is required field."
                            }
                        ]
                    }
            ]
        },
        {
            "sectionTitle": "Insured Member Details",
            "visible": true,
            "class": "section-title",
            "formControls": [
                {
                    "name": "numberOfInsuredMembers",
                    "label": "Number of Insured Members",
                    "text": "insuredMemberDetails",
                    "visibleLabel": true,
                    "type": "increment",
                    "visible": false,
                    "value": 1,
                    "class": "col-md-12",
                    "validators": [
                      {
                        "validatorName": "required",
                        "required": true,
                        "message": "Number of Adults is required field."
                      }
                    ]
                  },
                {
                    "name": "insuredMemberDetails",
                    "label": "Insured Member Details",
                    "visibleLabel": false,
                    "type": "details",
                    "value": 1,
                    "visible": false,
                    "class": "col-md-12",
                    "dynamicControls":[
                        [
                            {
                                "name": "relationshipType",
                                "visibleLabel": true,
                                "label": "Relationship Type",
                                "value": "",
                                "methodName": "getAllRelationship",
                                "class": "col-md-2 acceptTermsCheck",
                                "type": "select",
                                "visible": true,
                                "options": [
                                ]
                            },
                            {
                                "name": "memberdob",
                                "label": "Date of Birth",
                                "visibleLabel": true,
                                "type": "date",
                                "value": "",
                                "class": "col-md-2",
                                "validators": [
                                    {
                                        "validatorName": "required",
                                        "required": true,
                                        "message": "DOB is required field."
                                    }
                                ]
                            },
                            {
                                "name": "memberAge",
                                "label": "Age",
                                "visibleLabel": true,
                                "type": "text",
                                "value": "",
                                "class": "col-md-2",
                                "validators": [
                                    {
                                        "validatorName": "required",
                                        "required": true,
                                        "message": "Age is required field."
                                    }
                                ]
                            },
                            {
                                "name": "memberGender",
                                "label": "Gender",
                                "visibleLabel": true,
                                "type": "select",
                                "value": "",
                                "class": "col-md-4",
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
                                "class": "col-md-2",
                                "visible": true,
                                "options": 
                                    [
                                        {
                                            
                                            "name": "500000",
                                            "value": 500000
                                        },
                                        {
                                            
                                            "name": "600000",
                                            "value": 600000
                                        },
                                        {
                                            
                                            "name": "700000",
                                            "value": 700000
                                        },
                                        {
                                            
                                            "name": "800000",
                                            "value": 800000
                                        },
                                        {
                                            
                                            "name": "900000",
                                            "value": 900000
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
                                            
                                            "name": "3000000",
                                            "value": 3000000
                                        },
                                        {
                                            
                                            "name": "4000000",
                                            "value": 4000000
                                        },
                                        {
                                            
                                            "name": "5000000",
                                            "value": 5000000
                                        },
                                        {
                                            
                                            "name": "10000000",
                                            "value": 10000000
                                        },
                                        {
                                            
                                            "name": "150000000",
                                            "value": 150000000
                                        },
                                        {
                                            
                                            "name": "20000000",
                                            "value": 20000000
                                        }
                                    ]

                            },
                            {
                                "name": "pincode",
                                "label": "Pincode",
                                "visibleLabel": true,
                                "type": "text",
                                "value": "",
                                "class": "col-md-2"
                            },
                            {
                                "name": "preExistingDisease",
                                "label": "Pre Existing Disease?",
                                "visibleLabel": true,
                                "type": "radio",
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
                                "name": "planType",
                                "label": "Plan Type",
                                "visibleLabel": false,
                                "type": "text",
                                "value": "mi",
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
                                "class": "col-md-2",
                                "disabled": true,
                                "visibleLabel": true,
                                "value": "",
                                "type": "text"
                            },
                            {
                                "name": "zone",
                                "label": "Zone",
                                "class": "col-md-2",
                                "visibleLabel": true,
                                "disabled": true,
                                "value": "",
                                "type": "text"
                            },
                            {
                                "name": "state",
                                "label": "State",
                                "class": "col-md-2",
                                "visibleLabel": true,
                                "visible": false,
                                "value": "",
                                "type": "text"
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
                    "class": "col-md-12",
                    "dynamicControls":[
                        [
                            {
                                "name": "relationshipType",
                                "visibleLabel": true,
                                "label": "Relationship Type",
                                "value": "",
                                "methodName": "getAllRelationship",
                                "class": "col-md-3 acceptTermsCheck",
                                "type": "select",
                                "visible": true,
                                "options": [
                                ]
                            },
                            {
                                "name": "memberdob",
                                "label": "Date of Birth",
                                "visibleLabel": true,
                                "type": "date",
                                "value": "",
                                "class": "col-md-3",
                                "validators": [
                                    {
                                        "validatorName": "required",
                                        "required": true,
                                        "message": "DOB is required field."
                                    }
                                ]
                            },
                            {
                                "name": "memberAge",
                                "label": "Age",
                                "visibleLabel": true,
                                "type": "text",
                                "value": "",
                                "class": "col-md-3",
                                "validators": [
                                    {
                                        "validatorName": "required",
                                        "required": true,
                                        "message": "Age is required field."
                                    }
                                ]
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
                                "name": "planType",
                                "label": "Plan Type",
                                "visibleLabel": false,
                                "type": "text",
                                "value": "ff",
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
                            }
                        ]
                    ]
                }
            ]
        }
    ]
}
// export const insured_member={
//     "formTitle": "INSURED MEMBERS",
//     "saveBtnTitle": "Save",
//     "prevBtnTitle": "",
//     "resetBtnTitle": "",
//     "calculateBtnTitle": "",
//     "themeFile": "ABHI.css",
//     "formSections": [
//         {
//             "sectionTitle": "Activ Health Plan",
//             "visible": false,
//             "class": "section-title",
//             "formControls": [
//                 {
//                     "name": "productVariant",
//                     "label": "Product Variant",
//                     "visibleLabel": true,
//                     "type": "select",
//                     "value": "",
//                     "subType": "",
//                     "class": "col-md-4",
//                     "options": [
//                         {
//                             "id": 1,
//                             "name": "Platinum",
//                             "value": "Platinum"
//                         }
//                     ],
//                     "validators": [
//                         {
//                             "validatorName": "required",
//                             "required": true,
//                             "message": "Policy Type is required field."
//                         }
//                     ]
//                 },
//                 {
//                     "name": "memberPlan",
//                     "label": "Activ Health Plan",
//                     "visibleLabel": true,
//                     "type": "select",
//                     "value": "",
//                     "subType": "",
//                     "class": "col-md-4",
//                     "options": [
//                         {
//                             "id": 1,
//                             "name": "ENHANCED",
//                             "value": "Enhanced Plan"
//                         },
//                         {
//                             "id": 2,
//                             "name": "ESSENTIAL",
//                             "value": "Essential Plan"
//                         },
//                         {
//                             "id": 3,
//                             "name": "PREMIER",
//                             "value": "Premier Plan"
//                         }
//                     ],
//                     "validators": [
//                         {
//                             "validatorName": "required",
//                             "required": true,
//                             "message": "Plan is required field."
//                         }
//                     ]
//                 },
//                 {
//                     "name": "productType",
//                     "label": "Product Type",
//                     "visibleLabel": false,
//                     "type": "text",
//                     "value": "AH",
//                     "class": "",
//                     "visible": false
//                 },
//                 {
//                     "name": "productName",
//                     "label": "Product Name",
//                     "visibleLabel": false,
//                     "type": "text",
//                     "value": "Active Health",
//                     "class": "",
//                     "visible": false
//                 },
//                 {
//                     "name": "memberPlanPolicy",
//                     "label": "Policy Type",
//                     "visibleLabel": true,
//                     "type": "select",
//                     "value": "",
//                     "subType": "",
//                     "class": "col-md-4",
//                     "options": [
//                         {
//                             "id": 1,
//                             "name": "New Business",
//                             "value": "New Business"
//                         },
//                         {
//                             "id": 2,
//                             "name": "Portability",
//                             "value": "Portability"
//                         }
//                     ],
//                     "validators": [
//                         {
//                             "validatorName": "required",
//                             "required": true,
//                             "message": "Policy Type is required field."
//                         }
//                     ]
//                 }
//             ]
//         },
//         {
//             "sectionTitle": "Enter Proposer Details",
//             "visible": true,
//             "class": "section-title",
//             "formControls": [
//                 {
//                     "name": "proposerDob",
//                     "label": "Date of Birth",
//                     "visibleLabel": true,
//                     "type": "date",
//                     "value": "",
//                     "class": "col-md-4",
//                     "visible": true,
//                     "validators": [
//                         {
//                             "validatorName": "required",
//                             "required": true,
//                             "message": "DOB is required field."
//                         }
//                     ]
//                 },
//                 {
//                     "name": "proposerAge",
//                     "label": "Age",
//                     "visibleLabel": true,
//                     "type": "text",
//                     "value": "",
//                     "visible": true,
//                     "class": "col-md-4",
//                     "validators": [
//                         {
//                             "validatorName": "required",
//                             "required": true,
//                             "message": "Age is required field."
//                         },
//                         {
//                             "validatorName": "pattern",
//                             "pattern":"^(1[8-9]|[2-9][0-9]|1[0-1][0-9]|120)$",
//                             "message": "Age should be greater than 18 and lesser than 120."
//                         }
//                     ]
//                 },
//                 {
//                     "name": "proposerGender",
//                     "label": "Gender",
//                     "visibleLabel": true,
//                     "type": "select",
//                     "value": "",
//                     "class": "col-md-4",
//                     "visible": true,
//                     "options":[
//                         {
//                             "id": 1,
//                             "name": "Male",
//                             "value": "M"
//                         },
//                         {
//                             "id": 2,
//                             "name": "Female",
//                             "value": "F"
//                         },
//                         {
//                             "id": 3,
//                             "name": "Others",
//                             "value": "O"
//                         }
//                     ],
//                     "validators": [
//                         {
//                             "validatorName": "required",
//                             "required": true,
//                             "message": "Gender is required field."
//                         }
//                     ]
//                 },
//                 {
//                         "name": "proposerPolicyType",
//                         "label": "Select Policy Type",
//                         "visibleLabel": true,
//                         "visible":true,
//                         "type": "select",
//                         "value": "",
//                         "class": "col-md-6",
//                         "options": [
//                             {
//                                 "id": 1,
//                                 "name": "FAMILY FLOATER",
//                                 "value": "Family Floater"
//                             },
//                             {
//                                 "id": 2,
//                                 "name": "MULTI INDIVIDUAL",
//                                 "value": "Multi Individual"
//                             }
//                         ],
//                         "validators": [
//                             {
//                                 "validatorName": "required",
//                                 "required": true,
//                                 "message": "Polcy Type is required field."
//                             }
//                         ]
//                     },
//                     {
//                         "name": "proposerSumInsured",
//                         "label": "Select Sum Insured for Family",
//                         "visibleLabel": true,
//                         "visible":true,
//                         "type": "select",
//                         "value": "",
//                         "class": "col-md-3",
//                         "conditionalVisibility": {
//                             "dependsOn": "memberPolicyType",
//                             "values": ["MULTI INDIVIDUAL"]
//                         },
//                         "options": [
//                             {
//                                 "id": 1,
//                                 "name": "500000",
//                                 "value": 500000
//                             },
//                             {
//                                 "id": 2,
//                                 "name": "600000",
//                                 "value": 600000
//                             },
//                             {
//                                 "id": 3,
//                                 "name": "700000",
//                                 "value": 700000
//                             },
//                             {
//                                 "id": 4,
//                                 "name": "800000",
//                                 "value": 800000
//                             },
//                             {
//                                 "id": 5,
//                                 "name": "900000",
//                                 "value": 900000
//                             },
//                             {
//                                 "id": 6,
//                                 "name": "1000000",
//                                 "value": 1000000
//                             },
//                             {
//                                 "id": 7,
//                                 "name": "1500000",
//                                 "value": 1500000
//                             },
//                             {
//                                 "id": 8,
//                                 "name": "2000000",
//                                 "value": 2000000
//                             },
//                             {
//                                 "id": 9,
//                                 "name": "2500000",
//                                 "value": 2500000
//                             },
//                             {
//                                 "id": 10,
//                                 "name": "3000000",
//                                 "value": 3000000
//                             },
//                             {
//                                 "id": 11,
//                                 "name": "4000000",
//                                 "value": 4000000
//                             },
//                             {
//                                 "id": 12,
//                                 "name": "5000000",
//                                 "value": 5000000
//                             },
//                             {
//                                 "id": 13,
//                                 "name": "10000000",
//                                 "value": 10000000
//                             },
//                             {
//                                 "id": 14,
//                                 "name": "150000000",
//                                 "value": 150000000
//                             },
//                             {
//                                 "id": 15,
//                                 "name": "20000000",
//                                 "value": 20000000
//                             }
//                         ],
//                         "validators": [
//                             {
//                                 "validatorName": "required",
//                                 "required": true,
//                                 "message": "Polcy Type is required field."
//                             }
//                         ]
//                     },
//                     {
//                         "name": "pincode",
//                         "label": "Pincode",
//                         "visibleLabel": true,
//                         "visible":true,
//                         "type": "text",
//                         "value": "",
//                         "class": "col-md-3",
//                         "conditionalVisibility": {
//                             "dependsOn": "memberPolicyType",
//                             "values": ["MULTI INDIVIDUAL"]
//                         },
//                         "validators": [
//                             {
//                                 "validatorName": "required",
//                                 "required": true,
//                                 "message": "Pincode is required field."
//                             }
//                         ]
//                     }
//             ]
//         },
//         {
//             "sectionTitle": "Insured Member Details",
//             "visible": true,
//             "class": "section-title",
//             "formControls": [
//                 {
//                     "name": "numberOfInsuredMembers",
//                     "label": "Number of Insured Members",
//                     "text": "insuredMemberDetails",
//                     "visibleLabel": true,
//                     "type": "increment",
//                     "visible": false,
//                     "value": 1,
//                     "class": "col-md-12",
//                     "validators": [
//                       {
//                         "validatorName": "required",
//                         "required": true,
//                         "message": "Number of Adults is required field."
//                       }
//                     ]
//                   },
//                 {
//                     "name": "insuredMemberDetails",
//                     "label": "Insured Member Details",
//                     "visibleLabel": false,
//                     "type": "details",
//                     "value": 1,
//                     "visible": false,
//                     "class": "col-md-12",
//                     "dynamicControls":[
//                         [
//                             {
//                                 "name": "relationshipType",
//                                 "visibleLabel": true,
//                                 "label": "Relationship Type",
//                                 "value": "",
//                                 "methodName": "getAllRelationship",
//                                 "class": "col-md-2 acceptTermsCheck",
//                                 "type": "select",
//                                 "visible": true,
//                                 "options": [
//                                 ]
//                             },
//                             {
//                                 "name": "memberdob",
//                                 "label": "Date of Birth",
//                                 "visibleLabel": true,
//                                 "type": "date",
//                                 "value": "",
//                                 "class": "col-md-2",
//                                 "validators": [
//                                     {
//                                         "validatorName": "required",
//                                         "required": true,
//                                         "message": "DOB is required field."
//                                     }
//                                 ]
//                             },
//                             {
//                                 "name": "memberAge",
//                                 "label": "Age",
//                                 "visibleLabel": true,
//                                 "type": "text",
//                                 "value": "",
//                                 "class": "col-md-2",
//                                 "validators": [
//                                     {
//                                         "validatorName": "required",
//                                         "required": true,
//                                         "message": "Age is required field."
//                                     }
//                                 ]
//                             },
//                             {
//                                 "name": "memberGender",
//                                 "label": "Gender",
//                                 "visibleLabel": true,
//                                 "type": "select",
//                                 "value": "",
//                                 "class": "col-md-4",
//                                 "options": [
//                                     {
                                        
//                                         "name": "Male",
//                                         "value": "M"
//                                     },
//                                     {
                                        
//                                         "name": "Female",
//                                         "value": "F"
//                                     },
//                                     {
                                        
//                                         "name": "Others",
//                                         "value": "O"
//                                     }
//                                 ],
//                                 "validators": [
//                                     {
//                                         "validatorName": "required",
//                                         "required": true,
//                                         "message": "Gender is required field."
//                                     }
//                                 ]
//                             },
//                             {
//                                 "name": "sumInsured",
//                                 "label": "Sum Insured",
//                                 "visibleLabel": true,
//                                 "type": "select",
//                                 "value": "",
//                                 "class": "col-md-2",
//                                 "visible": true,
//                                 "options": 
//                                     [
//                                         {
                                            
//                                             "name": "500000",
//                                             "value": 500000
//                                         },
//                                         {
                                            
//                                             "name": "600000",
//                                             "value": 600000
//                                         },
//                                         {
                                            
//                                             "name": "700000",
//                                             "value": 700000
//                                         },
//                                         {
                                            
//                                             "name": "800000",
//                                             "value": 800000
//                                         },
//                                         {
                                            
//                                             "name": "900000",
//                                             "value": 900000
//                                         },
//                                         {
                                            
//                                             "name": "1000000",
//                                             "value": 1000000
//                                         },
//                                         {
                                            
//                                             "name": "1500000",
//                                             "value": 1500000
//                                         },
//                                         {
                                            
//                                             "name": "2000000",
//                                             "value": 2000000
//                                         },
//                                         {
                                            
//                                             "name": "2500000",
//                                             "value": 2500000
//                                         },
//                                         {
                                            
//                                             "name": "3000000",
//                                             "value": 3000000
//                                         },
//                                         {
                                            
//                                             "name": "4000000",
//                                             "value": 4000000
//                                         },
//                                         {
                                            
//                                             "name": "5000000",
//                                             "value": 5000000
//                                         },
//                                         {
                                            
//                                             "name": "10000000",
//                                             "value": 10000000
//                                         },
//                                         {
                                            
//                                             "name": "150000000",
//                                             "value": 150000000
//                                         },
//                                         {
                                            
//                                             "name": "20000000",
//                                             "value": 20000000
//                                         }
//                                     ]

//                             },
//                             {
//                                 "name": "pincode",
//                                 "label": "Pincode",
//                                 "visibleLabel": true,
//                                 "type": "text",
//                                 "value": "",
//                                 "class": "col-md-2"
//                             },
//                             {
//                                 "name": "preExistingDisease",
//                                 "label": "Pre Existing Disease?",
//                                 "visibleLabel": true,
//                                 "type": "radio",
//                                 "class": "radio-button",
//                                 "radioOptions": [
//                                     {
//                                         "name": "yes",
//                                         "label": "Yes",
//                                         "value": "yes",
//                                         "selected": false
//                                     },
//                                     {
//                                         "name": "no",
//                                         "label": "No",
//                                         "value": "no",
//                                         "selected": true
//                                     }
//                                 ]
//                             },
//                             {
//                                 "name": "planType",
//                                 "label": "Plan Type",
//                                 "visibleLabel": false,
//                                 "type": "text",
//                                 "value": "mi",
//                                 "class": "",
//                                 "visible": false
//                             },
//                             {
//                                 "name": "memberIndex",
//                                 "label": "Member Index",
//                                 "visibleLabel": false,
//                                 "type": "text",
//                                 "value": "",
//                                 "class": "",
//                                 "visible": false
//                             },
//                             {
//                                 "name": "city",
//                                 "label": "City",
//                                 "class": "col-md-2",
//                                 "disabled": true,
//                                 "visibleLabel": true,
//                                 "value": "",
//                                 "type": "text"
//                             },
//                             {
//                                 "name": "zone",
//                                 "label": "Zone",
//                                 "class": "col-md-2",
//                                 "visibleLabel": true,
//                                 "disabled": true,
//                                 "value": "",
//                                 "type": "text"
//                             },
//                             {
//                                 "name": "state",
//                                 "label": "State",
//                                 "class": "col-md-2",
//                                 "visibleLabel": true,
//                                 "visible": false,
//                                 "value": "",
//                                 "type": "text"
//                             }
//                         ]
//                     ]
//                 },
//                 {
//                     "name": "insuredMemberDetails",
//                     "label": "Insured Member Details",
//                     "visibleLabel": false,
//                     "type": "details",
//                     "value": 1,
//                     "visible": false,
//                     "class": "col-md-12",
//                     "dynamicControls":[
//                         [
//                             {
//                                 "name": "relationshipType",
//                                 "visibleLabel": true,
//                                 "label": "Relationship Type",
//                                 "value": "",
//                                 "methodName": "getAllRelationship",
//                                 "class": "col-md-3 acceptTermsCheck",
//                                 "type": "select",
//                                 "visible": true,
//                                 "options": [
//                                 ]
//                             },
//                             {
//                                 "name": "memberdob",
//                                 "label": "Date of Birth",
//                                 "visibleLabel": true,
//                                 "type": "date",
//                                 "value": "",
//                                 "class": "col-md-3",
//                                 "validators": [
//                                     {
//                                         "validatorName": "required",
//                                         "required": true,
//                                         "message": "DOB is required field."
//                                     }
//                                 ]
//                             },
//                             {
//                                 "name": "memberAge",
//                                 "label": "Age",
//                                 "visibleLabel": true,
//                                 "type": "text",
//                                 "value": "",
//                                 "class": "col-md-3",
//                                 "validators": [
//                                     {
//                                         "validatorName": "required",
//                                         "required": true,
//                                         "message": "Age is required field."
//                                     }
//                                 ]
//                             },
//                             {
//                                 "name": "memberGender",
//                                 "label": "Gender",
//                                 "visibleLabel": true,
//                                 "type": "select",
//                                 "value": "",
//                                 "class": "col-md-3",
//                                 "options": [
//                                     {
                                        
//                                         "name": "Male",
//                                         "value": "M"
//                                     },
//                                     {
                                        
//                                         "name": "Female",
//                                         "value": "F"
//                                     },
//                                     {
                                        
//                                         "name": "Others",
//                                         "value": "O"
//                                     }
//                                 ],
//                                 "validators": [
//                                     {
//                                         "validatorName": "required",
//                                         "required": true,
//                                         "message": "Gender is required field."
//                                     }
//                                 ]
//                             },
//                             {
//                                 "name": "planType",
//                                 "label": "Plan Type",
//                                 "visibleLabel": false,
//                                 "type": "text",
//                                 "value": "ff",
//                                 "class": "",
//                                 "visible": false
//                             },
//                             {
//                                 "name": "memberIndex",
//                                 "label": "Member Index",
//                                 "visibleLabel": false,
//                                 "type": "text",
//                                 "value": "",
//                                 "class": "",
//                                 "visible": false
//                             }
//                         ]
//                     ]
//                 }
//             ]
//         }
//     ]
// }