export const totalpremium = {
  "formTitle": "Total Premium",
  "saveBtnTitle": "Save",
  "prevBtnTitle": "Prev",
  "resetBtnTitle": "",
  "calculateBtnTitle": "",
  "themeFile": "ABHI.css",
  "formSections": [
    {
      "sectionTitle": "Total Premium: ",
      "visible": true,
      "visibleLabel": true,
      "class": "section-title",
      "formControls": [
        {
          "name": "totalPremium",
          "label": "Total Premium",
          "visibleLabel": true,
          "class": "radio-button",
          "value": 1,
          "placeholder": "",
          "methodName": "setPremiumAmount",
          "radioOptions": [
            {
              "name": "1yrPremium",
              "label": "1 Yr Rs -$premium",
              "value": 1,
              "selected": true
            },
            {
              "name": "2yrPremium",
              "label": "2 Yr Rs - $premium",
              "value": 2,
              "selected": false
            },
            {
              "name": "3yrPremium",
              "label": "3 Yr Rs - $premium",
              "value": 3,
              "selected": false
            }
          ],
          "type": "custom-radio"
        }
      ]
    },
    {
      "sectionTitle": "Optional Covers",
      "visible": true,
      "visibleLabel": true,
      "class": "section-title",
      "formControls": [
        {
          "name": "accident",
          "label": "Accident",
          "visibleLabel": false,
          "class": "col-md-4 acceptTermsCheck",
          "type": "combinedCheckbox",
          "subControls": [
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
              "name": "accidentAddOnDetails",
              "visible": false,
              "type": "overlayControl",
              "class": "",
              "innerSubControls": [
                [
                  {
                    "name": "demoType",
                    "label": "Demo Label",
                    "visibleLabel": true,
                    "visible": true,
                    "type": "addOnDetails",
                    "class": "",
                    "coreControls": [
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
                  }
                ]
              ]
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
        }
      ]
    },
    {
      "sectionTitle": "Bottom Section",
      "visible": true,
      "class": "section-title bottom-section",
      "formControls": [
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

