export const totalpremium = {
    "formTitle": "Total Premium",
    "saveBtnTitle": "Save",
    "prevBtnTitle": "Summary",
    "resetBtnTitle": "",
    "calculateBtnTitle": "",
    "themeFile": "ABHI.css",
    "formSections": [
        {
            "sectionTitle": "Total Premium: Active Care - standard",
            "visible": true,
            "class": "section-title",
            "formControls": [
                {
                    "name": "totalPremium",
                    "label": "Total premium: ",
                    "visibleLabel": true,
                    "class": "radio-button",
                    "placeholder": "",
                    "method": "getPremiumAmount",
                    "radioOptions": [
                        {
                            "name": "1yrPremium",
                            "label": "1 Yr <b>Loading...</b>",
                            "value": "",
                            "selected": true
                        },
                        {
                            "name": "2yrPremium",
                            "label": "2 Yr <b>Loading...</b>",
                            "value": "",
                            "selected": false
                        },
                        {
                            "name": "3yrPremium",
                            "label": "3 Yr <b>Loading...</b>",
                            "value": "",
                            "selected": false
                        }
                    ],
                    "type": "radio"
                },
                {
                    "name": "employeeStatus",
                    "visibleLabel": true,
                    "label": "ABHG Employee",
                    "class": "col-md-6 acceptTermsCheck",
                    "type": "checkbox"
                },
                {
                    "name": "specificProductId",
                    "visibleLabel": false,
                    "visible": false,
                    "label": "Product Id",
                    "class": "col-md-6",
                    "type": "text",
                    "value": "6212"
                },
                {
                    "name": "planCode",
                    "visibleLabel": false,
                    "visible": false,
                    "label": "Plan Code",
                    "class": "col-md-6",
                    "type": "text",
                    "value": "6212100003"
                }
            ]
        },
        {
            "sectionTitle": "Multiply Riders",
            "visible": true,
            "class": "section-title",
            "formControls": [
                {
                    "name": "multiply",
                    "label": "Multiply",
                    "visibleLabel": false,
                    "class": "col-md-4 acceptTermsCheck",
                    "type": "combinedCheckbox",
                    "subControls": [
                        [
                            {
                                "name": "demoType",
                                "label": "Demo Label",
                                "visibleLabel": true,
                                "visible": true,
                                "type": "addOnDetails",
                                "class": "",
                                "demoSubControls": [
                                    {
                                        "name": "addOnSumInsured",
                                        "visibleLabel": false,
                                        "label": "Add On Sum Insured",
                                        "visible": true,
                                        "class": "col-md-3",
                                        "value": "",
                                        "type": "select",
                                        "disabled": false,
                                        "options": [
                                            {
                                                "name": "500",
                                                "label": "500",
                                                "value": 500
                                            },
                                            {
                                                "name": "750",
                                                "label": "750",
                                                "value": 750
                                            },
                                            {
                                                "name": "1000",
                                                "label": "1000",
                                                "value": 1000
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                "name": "multiply",
                                "visibleLabel": true,
                                "label": "Multiply",
                                "class": "col-md-6 acceptTermsCheck ah-opcovers",
                                "type": "checkbox",
                                "method": "addOrRemoveAdditionalInsuredMember",
                                "value": false,
                                "visible": true
                            },
                            {
                                "name": "addOnId",
                                "label": "Add On Id",
                                "visibleLabel": false,
                                "value": "MULTIPLY",
                                "type": "text",
                                "visible": false
                            }
                        ]
                    ]
                }
            ]
        },
        {
            "sectionTitle": "Optional Covers",
            "visible": true,
            "class": "section-title",
            "formControls": [
                {
                    "name": "accident",
                    "label": "Accident",
                    "visibleLabel": false,
                    "class": "col-md-4 acceptTermsCheck",
                    "type": "combinedCheckbox",
                    "subControls": [
                        [
                            {
                                "name": "demoType",
                                "label": "Demo Label",
                                "visibleLabel": true,
                                "visible": true,
                                "type": "addOnDetails",
                                "class": "",
                                "demoSubControls": [
                                    {
                                        "name": "occupation",
                                        "visibleLabel": false,
                                        "label": "Occupation",
                                        "method": "getAllOccupation",
                                        "value": "",
                                        "type": "select",
                                        "options": []
                                    },
                                    {
                                        "name": "occupationRisk",
                                        "visibleLabel": false,
                                        "label": "",
                                        "method": "getAllOccupationRisk",
                                        "value": "",
                                        "type": "select",
                                        "options": []
                                    },
                                    {
                                        "name": "addOnSumInsured",
                                        "visibleLabel": false,
                                        "label": "Add On Sum Insured",
                                        "value": "",
                                        "type": "select",
                                        "options": [
                                            {
                                                "name": "500000",
                                                "label": "500000",
                                                "value": 500000
                                            },
                                            {
                                                "name": "1000000",
                                                "label": "1000000",
                                                "value": 1000000
                                            },
                                            {
                                                "name": "1500000",
                                                "label": "1500000",
                                                "value": 1500000
                                            },
                                            {
                                                "name": "2000000",
                                                "label": "2000000",
                                                "value": 2000000
                                            },
                                            {
                                                "name": "3000000",
                                                "label": "3000000",
                                                "value": 3000000
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                "name": "accidentCover",
                                "visibleLabel": true,
                                "label": "Personal Accident",
                                "class": "col-md-6 acceptTermsCheck ah-opcovers",
                                "type": "checkbox",
                                "method": "addOrRemoveAdditionalInsuredMember",
                                "value": false,
                                "visible": true
                            },
                            {
                                "name": "addOnId",
                                "label": "Add On Id",
                                "visibleLabel": false,
                                "value": "AHPA",
                                "type": "text",
                                "visible": false
                            },
                            {
                                "name": "premium",
                                "label": "Premium",
                                "visibleLabel": false,
                                "value": 470,
                                "type": "text",
                                "visible": false
                            },
                            {
                                "name": "optionalCoverName",
                                "label": "Optional Cover Name",
                                "visibleLabel": false,
                                "value": "Personal Accident Cover (AD, PTD)",
                                "type": "text",
                                "visible": false
                            },
                            {
                                "name": "optionalCoverValue",
                                "label": "Optional Cover Value",
                                "visibleLabel": false,
                                "value": "62124128",
                                "type": "text",
                                "visible": false,
                                "class": "col-md-6"
                            }
                        ]
                    ]
                },
                {
                    "name": "criticalIllness",
                    "label": "criticalIllness",
                    "visibleLabel": false,
                    "class": "col-md-4 acceptTermsCheck",
                    "type": "combinedCheckbox",
                    "subControls": [
                        [
                            {
                                "name": "demoType",
                                "label": "Demo Label",
                                "visibleLabel": true,
                                "visible": true,
                                "type": "addOnDetails",
                                "class": "",
                                "demoSubControls": [
                                    {
                                        "name": "addOnSumInsured",
                                        "visibleLabel": false,
                                        "label": "Add On Sum Insured",
                                        "value": "",
                                        "type": "select",
                                        "options": [
                                            {
                                                "name": "300000",
                                                "label": "300000",
                                                "value": 300000
                                            },
                                            {
                                                "name": "500000",
                                                "label": "500000",
                                                "value": 500000
                                            },
                                            {
                                                "name": "1000000",
                                                "label": "1000000",
                                                "value": 1000000
                                            },
                                            {
                                                "name": "1500000",
                                                "label": "1500000",
                                                "value": 1500000
                                            },
                                            {
                                                "name": "2000000",
                                                "label": "2000000",
                                                "value": 2000000
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                "name": "criticalIllnessCover",
                                "visibleLabel": true,
                                "label": "Critical Illness",
                                "class": "col-md-6 acceptTermsCheck ah-opcovers",
                                "type": "checkbox",
                                "method": "addOrRemoveAdditionalInsuredMember",
                                "value": false,
                                "visible": true
                            },
                            {
                                "name": "addOnId",
                                "label": "Add On Id",
                                "visibleLabel": false,
                                "value": "AHCI",
                                "type": "text",
                                "visible": false
                            },
                            {
                                "name": "premium",
                                "label": "Premium",
                                "visibleLabel": false,
                                "value": 1171.5,
                                "type": "text",
                                "visible": false
                            },
                            {
                                "name": "optionalCoverName",
                                "label": "Optional Cover Name",
                                "visibleLabel": false,
                                "value": "Critical Illness Cover",
                                "type": "text",
                                "visible": false
                            },
                            {
                                "name": "optionalCoverValue",
                                "label": "Optional Cover Value",
                                "visibleLabel": false,
                                "value": "62124129",
                                "type": "text",
                                "visible": false,
                                "class": "col-md-6"
                            }
                        ]
                    ]
                },
                {
                    "name": "internationalCoverage",
                    "label": "internationalCoverage",
                    "visibleLabel": false,
                    "class": "col-md-4 acceptTermsCheck",
                    "type": "combinedCheckbox",
                    "subControls": [
                        [
                            {
                                "name": "demoType",
                                "label": "Demo Label",
                                "visibleLabel": true,
                                "visible": true,
                                "type": "addOnDetails",
                                "class": "",
                                "demoSubControls": [
                                    {
                                        "name": "addOnSumInsured",
                                        "visibleLabel": false,
                                        "label": "Add On Sum Insured",
                                        "value": "",
                                        "type": "select",
                                        "options": [
                                            {
                                                "name": "30000000",
                                                "label": "30000000",
                                                "value": 30000000
                                            },
                                            {
                                                "name": "60000000",
                                                "label": "60000000",
                                                "value": 60000000
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                "name": "internationalCover",
                                "visibleLabel": true,
                                "label": "International Coverage for Illness",
                                "class": "col-md-6 acceptTermsCheck ah-opcovers",
                                "type": "checkbox",
                                "method": "addOrRemoveAdditionalInsuredMember",
                                "value": false,
                                "visible": true
                            },
                            {
                                "name": "addOnId",
                                "label": "Add On Id",
                                "visibleLabel": false,
                                "value": "AHIC",
                                "type": "text",
                                "visible": false
                            },
                            {
                                "name": "premium",
                                "label": "Premium",
                                "visibleLabel": false,
                                "value": 17394,
                                "type": "text",
                                "visible": false
                            },
                            {
                                "name": "optionalCoverName",
                                "label": "Optional Cover Name",
                                "visibleLabel": false,
                                "value": "International Coverage for major illnesses",
                                "type": "text",
                                "visible": false
                            },
                            {
                                "name": "optionalCoverValue",
                                "label": "Optional Cover Value",
                                "visibleLabel": false,
                                "value": "62124130",
                                "type": "text",
                                "visible": false,
                                "class": "col-md-6"
                            }
                        ]
                    ]
                },
                {
                    "name": "hospitalDailyCash",
                    "label": "Hospital Daily Cash",
                    "visibleLabel": false,
                    "class": "col-md-4 acceptTermsCheck",
                    "type": "combinedCheckbox",
                    "subControls": [
                        [
                            {
                                "name": "demoType",
                                "label": "Demo Label",
                                "visibleLabel": true,
                                "visible": true,
                                "type": "addOnDetails",
                                "class": "",
                                "demoSubControls": [
                                    {
                                        "name": "addOnSumInsured",
                                        "visibleLabel": false,
                                        "label": "Add On Sum Insured",
                                        "value": "",
                                        "type": "select",
                                        "options": [
                                            {
                                                "name": "500",
                                                "label": "500",
                                                "value": 500
                                            },
                                            {
                                                "name": "1000",
                                                "label": "1000",
                                                "value": 1000
                                            },
                                            {
                                                "name": "1500",
                                                "label": "1500",
                                                "value": 1500
                                            },
                                            {
                                                "name": "2000",
                                                "label": "2000",
                                                "value": 2000
                                            },
                                            {
                                                "name": "2500",
                                                "label": "2500",
                                                "value": 2500
                                            },
                                            {
                                                "name": "3000",
                                                "label": "3000",
                                                "value": 3000
                                            },
                                            {
                                                "name": "3500",
                                                "label": "3500",
                                                "value": 3500
                                            },
                                            {
                                                "name": "4000",
                                                "label": "4000",
                                                "value": 4000
                                            },
                                            {
                                                "name": "4500",
                                                "label": "4500",
                                                "value": 4500
                                            },
                                            {
                                                "name": "5000",
                                                "label": "5000",
                                                "value": 5000
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                "name": "hospitalDailyCashCover",
                                "visibleLabel": true,
                                "label": "Hospital Daily Cash Benefit",
                                "class": "col-md-6 acceptTermsCheck ah-opcovers",
                                "type": "checkbox",
                                "method": "addOrRemoveAdditionalInsuredMember",
                                "value": false,
                                "visible": true
                            },
                            {
                                "name": "addOnId",
                                "label": "Add On Id",
                                "visibleLabel": false,
                                "value": "AHHCBM",
                                "type": "text",
                                "visible": false
                            },
                            {
                                "name": "premium",
                                "label": "Premium",
                                "visibleLabel": false,
                                "value": 204,
                                "type": "text",
                                "visible": false
                            },
                            {
                                "name": "optionalCoverName",
                                "label": "Optional Cover Name",
                                "visibleLabel": false,
                                "value": "Hospital Cash Benefit",
                                "type": "text",
                                "visible": false
                            },
                            {
                                "name": "optionalCoverValue",
                                "label": "Optional Cover Value",
                                "visibleLabel": false,
                                "value": "62124141",
                                "type": "text",
                                "visible": false,
                                "class": "col-md-6"
                            }
                        ]
                    ]
                },
                {
                    "name": "opd",
                    "label": "Opd",
                    "visibleLabel": false,
                    "class": "col-md-4 acceptTermsCheck",
                    "type": "combinedCheckbox",
                    "subControls": [
                        [
                            {
                                "name": "demoType",
                                "label": "Demo Label",
                                "visibleLabel": true,
                                "visible": true,
                                "type": "addOnDetails",
                                "class": "",
                                "demoSubControls": [
                                    {
                                        "name": "addOnSumInsured",
                                        "visibleLabel": false,
                                        "label": "Add On Sum Insured",
                                        "value": "",
                                        "type": "select",
                                        "options": [
                                            {
                                                "name": "5000",
                                                "label": "5000",
                                                "value": 5000
                                            },
                                            {
                                                "name": "6000",
                                                "label": "6000",
                                                "value": 6000
                                            },
                                            {
                                                "name": "7000",
                                                "label": "7000",
                                                "value": 7000
                                            },
                                            {
                                                "name": "8000",
                                                "label": "8000",
                                                "value": 8000
                                            },
                                            {
                                                "name": "9000",
                                                "label": "9000",
                                                "value": 9000
                                            },
                                            {
                                                "name": "10000",
                                                "label": "10000",
                                                "value": 10000
                                            },
                                            {
                                                "name": "11000",
                                                "label": "11000",
                                                "value": 11000
                                            },
                                            {
                                                "name": "12000",
                                                "label": "12000",
                                                "value": 12000
                                            },
                                            {
                                                "name": "13000",
                                                "label": "13000",
                                                "value": 13000
                                            },
                                            {
                                                "name": "14000",
                                                "label": "14000",
                                                "value": 14000
                                            },
                                            {
                                                "name": "15000",
                                                "label": "15000",
                                                "value": 15000
                                            },
                                            {
                                                "name": "16000",
                                                "label": "16000",
                                                "value": 16000
                                            },
                                            {
                                                "name": "17000",
                                                "label": "17000",
                                                "value": 17000
                                            },
                                            {
                                                "name": "18000",
                                                "label": "18000",
                                                "value": 18000
                                            },
                                            {
                                                "name": "19000",
                                                "label": "19000",
                                                "value": 19000
                                            },
                                            {
                                                "name": "20000",
                                                "label": "20000",
                                                "value": 20000
                                            }
                                        ]

                                    }
                                ]
                            },
                            {
                                "name": "opdCover",
                                "visibleLabel": true,
                                "label": "OPD",
                                "class": "col-md-6 acceptTermsCheck ah-opcovers",
                                "type": "checkbox",
                                "method": "addOrRemoveAdditionalInsuredMember",
                                "value": false,
                                "visible": true
                            },
                            {
                                "name": "addOnId",
                                "label": "Add On Id",
                                "visibleLabel": false,
                                "value": "AHOPD",
                                "type": "text",
                                "visible": false
                            },
                            {
                                "name": "premium",
                                "label": "Premium",
                                "visibleLabel": false,
                                "value": 4494,
                                "type": "text",
                                "visible": false
                            },
                            {
                                "name": "optionalCoverName",
                                "label": "Optional Cover Name",
                                "visibleLabel": false,
                                "value": "OPD Expenses",
                                "type": "text",
                                "visible": false
                            },
                            {
                                "name": "optionalCoverValue",
                                "label": "Optional Cover Value",
                                "visibleLabel": false,
                                "value": "62124140",
                                "type": "text",
                                "visible": false,
                                "class": "col-md-6"
                            }
                        ]
                    ]
                },
                {
                    "name": "abhiProtect",
                    "label": "ABHI Protect",
                    "visibleLabel": false,
                    "class": "col-md-4 acceptTermsCheck",
                    "type": "combinedCheckbox",
                    "subControls": [
                        [
                            {
                                "name": "demoType",
                                "label": "Demo Label",
                                "visibleLabel": true,
                                "visible": true,
                                "type": "addOnDetails",
                                "class": "",
                                "demoSubControls": [
                                    {
                                        "name": "addOnSumInsured",
                                        "visibleLabel": false,
                                        "label": "Add On Sum Insured",
                                        "value": "",
                                        "type": "select",
                                        "options": [
                                            {
                                                "name": "2000000",
                                                "label": "2000000",
                                                "value": 2000000
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                "name": "abhiProtectCover",
                                "visibleLabel": true,
                                "label": "ABHI Protect",
                                "class": "col-md-6 acceptTermsCheck ah-opcovers",
                                "type": "checkbox",
                                "method": "addOrRemoveAdditionalInsuredMember",
                                "value": false,
                                "visible": true
                            },
                            {
                                "name": "addOnId",
                                "label": "Add On Id",
                                "visibleLabel": false,
                                "value": "ABPRO",
                                "type": "text",
                                "visible": false
                            },
                            {
                                "name": "premiumPerype",
                                "label": "Premium Perype",
                                "visibleLabel": false,
                                "value": "",
                                "type": "text",
                                "visible": false
                            },
                            {
                                "name": "premium",
                                "label": "Premium",
                                "visibleLabel": false,
                                "value": 247,
                                "type": "text",
                                "visible": false
                            },
                            {
                                "name": "optionalCoverName",
                                "label": "Optional Cover Name",
                                "visibleLabel": false,
                                "value": "ABPRO",
                                "type": "text",
                                "visible": false
                            },
                            {
                                "name": "optionalCoverValue",
                                "label": "Optional Cover Value",
                                "visibleLabel": false,
                                "value": "0",
                                "type": "text",
                                "visible": false,
                                "class": "col-md-6"
                            }
                        ]
                    ]
                }
            ]
        },
        {
            "sectionTitle": "Health Add On",
            "visible": true,
            "class": "section-title",
            "formControls": [
                {
                    "name": "futureSecure",
                    "label": "futureSecure",
                    "visibleLabel": false,
                    "class": "col-md-4 acceptTermsCheck",
                    "type": "combinedCheckbox",
                    "subControls": [
                        [
                            {
                                "name": "demoType",
                                "label": "Demo Label",
                                "visibleLabel": true,
                                "visible": true,
                                "type": "addOnDetails",
                                "class": "",
                                "demoSubControls": [
                                    {
                                        "name": "addOnSumInsured",
                                        "visibleLabel": false,
                                        "label": "Add On Sum Insured",
                                        "value": 2000000,
                                        "type": "text"
                                    }
                                ]
                            },
                            {
                                "name": "futureSecureCover",
                                "visibleLabel": true,
                                "label": "Future Secure",
                                "class": "col-md-6 acceptTermsCheck ah-opcovers",
                                "type": "checkbox",
                                "method": "addOrRemoveAdditionalInsuredMember",
                                "value": false,
                                "visible": true
                            },
                            {
                                "name": "addOnId",
                                "label": "Add On Id",
                                "visibleLabel": false,
                                "value": "FTSE",
                                "type": "text",
                                "visible": false
                            },
                            {
                                "name": "premiumPerype",
                                "label": "Premium Perype",
                                "visibleLabel": false,
                                "value": "",
                                "type": "text",
                                "visible": false
                            },
                            {
                                "name": "premium",
                                "label": "Premium",
                                "visibleLabel": false,
                                "value": 714,
                                "type": "text",
                                "visible": false
                            },
                            {
                                "name": "optionalCoverName",
                                "label": "Optional Cover Name",
                                "visibleLabel": false,
                                "value": "Future Secure",
                                "type": "text",
                                "visible": false
                            },
                            {
                                "name": "optionalCoverValue",
                                "label": "Optional Cover Value",
                                "visibleLabel": false,
                                "value": "62124142",
                                "type": "text",
                                "visible": false,
                                "class": "col-md-6"
                            }
                        ]
                    ]
                },
                {
                    "name": "cancerHospitalBooster",
                    "label": "Cancer Hospitalisation Booster",
                    "visibleLabel": false,
                    "class": "col-md-4 acceptTermsCheck",
                    "type": "combinedCheckbox",
                    "subControls": [
                        [
                            {
                                "name": "demoType",
                                "label": "Demo Label",
                                "visibleLabel": true,
                                "visible": true,
                                "type": "addOnDetails",
                                "class": "",
                                "demoSubControls": [
                                    {
                                        "name": "addOnSumInsured",
                                        "visibleLabel": false,
                                        "label": "Add On Sum Insured",
                                        "value": 2000000,
                                        "type": "text"
                                    }
                                ]
                            },
                            {
                                "name": "cancerHospitalisationCover",
                                "visibleLabel": true,
                                "label": "Cancer Hospitalisation Booster",
                                "class": "col-md-6 acceptTermsCheck ah-opcovers",
                                "type": "checkbox",
                                "method": "addOrRemoveAdditionalInsuredMember",
                                "value": false,
                                "visible": true
                            },
                            {
                                "name": "addOnId",
                                "label": "Add On Id",
                                "visibleLabel": false,
                                "value": "HRCHB",
                                "type": "text",
                                "visible": false
                            },
                            {
                                "name": "premiumPerype",
                                "label": "Premium Perype",
                                "visibleLabel": false,
                                "value": "",
                                "type": "text",
                                "visible": false
                            },
                            {
                                "name": "premium",
                                "label": "Premium",
                                "visibleLabel": false,
                                "value": 181,
                                "type": "text",
                                "visible": false
                            },
                            {
                                "name": "optionalCoverName",
                                "label": "Optional Cover Name",
                                "visibleLabel": false,
                                "value": "Cancer Hospitalization Booster",
                                "type": "text",
                                "visible": false
                            },
                            {
                                "name": "optionalCoverValue",
                                "label": "Optional Cover Value",
                                "visibleLabel": false,
                                "value": "62124145",
                                "type": "text",
                                "visible": false,
                                "class": "col-md-6"
                            }
                        ]
                    ]
                },
                {
                    "name": "vaccine",
                    "label": "Vaccine",
                    "visibleLabel": false,
                    "class": "col-md-4 acceptTermsCheck",
                    "type": "combinedCheckbox",
                    "subControls": [
                        [
                            {
                                "name": "demoType",
                                "label": "Demo Label",
                                "visibleLabel": true,
                                "visible": true,
                                "type": "addOnDetails",
                                "class": "",
                                "demoSubControls": [
                                    {
                                        "name": "addOnSumInsured",
                                        "visibleLabel": false,
                                        "label": "Add On Sum Insured",
                                        "visible": true,
                                        "class": "col-md-3",
                                        "value": "",
                                        "type": "select",
                                        "disabled": false,
                                        "options": [
                                            {
                                                "name": "500",
                                                "label": "500",
                                                "value": 500
                                            },
                                            {
                                                "name": "750",
                                                "label": "750",
                                                "value": 750
                                            },
                                            {
                                                "name": "1000",
                                                "label": "1000",
                                                "value": 1000
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                "name": "vaccineCover",
                                "visibleLabel": true,
                                "label": "Vaccine Cover",
                                "class": "col-md-6 acceptTermsCheck ah-opcovers",
                                "type": "checkbox",
                                "method": "addOrRemoveAdditionalInsuredMember",
                                "value": false,
                                "visible": true
                            },
                            {
                                "name": "addOnId",
                                "label": "Add On Id",
                                "visibleLabel": false,
                                "value": "RVCV",
                                "type": "text",
                                "visible": false
                            },
                            {
                                "name": "premiumPerype",
                                "label": "Premium Perype",
                                "visibleLabel": false,
                                "value": "NULL",
                                "type": "text",
                                "visible": false
                            },
                            {
                                "name": "premium",
                                "label": "Premium",
                                "visibleLabel": false,
                                "value": 369,
                                "type": "text",
                                "visible": false
                            },
                            {
                                "name": "optionalCoverName",
                                "label": "Optional Cover Name",
                                "visibleLabel": false,
                                "value": "Vaccine Cover",
                                "type": "text",
                                "visible": false
                            },
                            {
                                "name": "optionalCoverValue",
                                "label": "Optional Cover Value",
                                "visibleLabel": false,
                                "value": "62124143",
                                "type": "text",
                                "visible": false,
                                "class": "col-md-6"
                            }
                        ]
                    ]
                },
                {
                    "name": "teleOpdConsultation",
                    "label": "Tele-OPD Consultation",
                    "visibleLabel": false,
                    "class": "col-md-4 acceptTermsCheck",
                    "type": "combinedCheckbox",
                    "subControls": [
                        [
                            {
                                "name": "demoType",
                                "label": "Demo Label",
                                "visibleLabel": true,
                                "visible": true,
                                "type": "addOnDetails",
                                "class": "",
                                "demoSubControls": [
                                    {
                                        "name": "addOnSumInsured",
                                        "visibleLabel": false,
                                        "label": "Add On Sum Insured",
                                        "value": 500,
                                        "type": "text"
                                    }
                                ]
                            },
                            {
                                "name": "teleOpdCover",
                                "visibleLabel": true,
                                "label": "Tele-OPD Consultation",
                                "class": "col-md-6 acceptTermsCheck ah-opcovers",
                                "type": "checkbox",
                                "method": "addOrRemoveAdditionalInsuredMember",
                                "value": false,
                                "visible": true
                            },
                            {
                                "name": "addOnId",
                                "label": "Add On Id",
                                "visibleLabel": false,
                                "value": "TOPD",
                                "type": "text",
                                "visible": false
                            },
                            {
                                "name": "premiumPerype",
                                "label": "Premium Perype",
                                "visibleLabel": false,
                                "value": "NULL",
                                "type": "text",
                                "visible": false
                            },
                            {
                                "name": "premium",
                                "label": "Premium",
                                "visibleLabel": false,
                                "value": 376,
                                "type": "text",
                                "visible": false
                            },
                            {
                                "name": "optionalCoverName",
                                "label": "Optional Cover Name",
                                "visibleLabel": false,
                                "value": "Tele-OPD Consultation",
                                "type": "text",
                                "visible": false
                            },
                            {
                                "name": "optionalCoverValue",
                                "label": "Optional Cover Value",
                                "visibleLabel": false,
                                "value": "62124144",
                                "type": "text",
                                "visible": false,
                                "class": "col-md-6"
                            }
                        ]
                    ]
                }

            ]
        }
    ]
}

