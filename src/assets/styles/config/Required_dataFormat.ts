const requiredDataFormat = {
    "memberDetails": [
      {
        "memberRelation": {
          "key": "1", // based on the for loop for the this.insuredMemberDetails.insuredMembersMemberDetails
          "value": "Self", // available from relationshipType.value key in insuredMember
          "relDisplay": "Self",// available from relationshipType.value key in insuredMember
          "relCode": "R001" // available from relationshipType.id key in insuredMember
        },
        "selectedProductList": [
          {
            "productVariant": "Platinum", //available on formData
            "productType": "AH", //available on formData
            "planType": "mi", //available on formData
            "productPlan": "Enhanced", //available on formData
            "deductibleFlag": 0, //default
            "deductibleSi": 0, // default
            "productId": "6212", //available on formData
            "planCode": "6212100003", // need to be implemented in formData
            "sumInsured": "2000000", //available on insuredmembers.insuredMemberDetails[i].sumInsured
            "optionalDetails": [
              {
                "optionalId": "SP", //available on addOnList
                "productName": "AH", //available on addOnList
                "rate": 0, //need to be implemented in the addOnJSON
                "premium": 0, //need to be implemented in the addOnJSON
                "optionalCoverName": "Single Private A/c Room", //need to be implemented in the addOnJSON
                "optionalCoverValue": "62124101-01" //need to be implemented in the addOnJSON
              },
              {
                "optionalId": "AHPA", //available on addOnList
                "si": 1000000, //available on addOnList
                "optionalCoverName": "Personal Accident Cover (AD, PTD)",// available in the Addon AddOn list
                "riskClass": "RC1", //need to take from the personalAccident Addon
                "optionalCoverValue": "62124128", // available on the addOnList
                "premium": 470 //available on the addOnList
              },
              {
                "optionalId": "ABPRO",
                "si": "2000000",
                "optionalCoverName": "ABPRO",
                "riskClass": "RC1",
                "optionalCoverValue": "0",
                "premium": 247
              },
              {
                "optionalId": "AHCI",
                "si": 300000,
                "optionalCoverName": "Critical Illness Cover",
                "riskClass": "RC1",
                "optionalCoverValue": "62124129",
                "premium": 1171.5
              },
              {
                "optionalId": "AHIC",
                "si": 30000000,
                "optionalCoverName": "International Coverage for major illnesses",
                "riskClass": "RC1",
                "optionalCoverValue": "62124130",
                "premium": 17394
              },
              {
                "optionalId": "AHHCB",
                "si": 500,
                "optionalCoverName": "Hospital Cash Benefit",
                "riskClass": "RC1",
                "optionalCoverValue": "62124141",
                "premium": 204
              },
              {
                "optionalId": "AHOPD",
                "si": 5000,
                "optionalCoverName": "OPD Expenses",
                "riskClass": "RC1",
                "optionalCoverValue": "62124140",
                "premium": 4494
              },
              {
                "optionalId": "FTSE",
                "si": "2000000",
                "optionalCoverName": "Future Secure",
                "riskClass": "RC1",
                "optionalCoverValue": "62124142",
                "premium": 714
              },
              {
                "optionalId": "HRCHB",
                "si": "2000000",
                "optionalCoverName": "Cancer Hospitalization Booster",
                "riskClass": "RC1",
                "optionalCoverValue": "62124145",
                "premium": 181
              },
              {
                "optionalId": "RVCV",
                "si": 500,
                "optionalCoverName": "Vaccine cover",
                "riskClass": "RC1",
                "optionalCoverValue": "62124143",
                "premium": 369
              },
              {
                "optionalId": "TOPD",
                "si": 500,
                "optionalCoverName": "Tele-OPD Consultant",
                "riskClass": "RC1",
                "optionalCoverValue": "62124144",
                "premium": 376
              }
            ],
            "premium": [
              {
                "tenure": 1,
                "premium": 13083,
                "ageFrom": 35,
                "ageTo": 36
              },
              {
                "tenure": 2,
                "premium": 13217,
                "ageFrom": 36,
                "ageTo": 37
              },
              {
                "tenure": 3,
                "premium": 13350,
                "ageFrom": 37,
                "ageTo": 38
              }
            ],
            "internalPremium": 67514 // available in this.dynamicFormGroup.get("totalPremium").?value;
          }
        ],
        "dob": "", // available in insuredMemberDetails.insuredMemberDetails.memberdob
        "age": "35", // available in insuredMemberDetails.insuredMemberDetails.memberAge
        "pinCode": "500013", // available in insuredMemberDetails.insuredMemberDetails.pincode
        "riskType": "RC1", // need to take from the personalAccident Addon
        "occupation": {
          "key": "1", //fixed
          "value": "ACCOUNTANT" // occupation of first member from personalAccident Addon
        },
        "profession": {
          "key": "O553", //profession of first member from personalAccident Addon
          "value": "Salaried"// profession of first member from personalAccident Addon
        },
        "gender": "Male", //available in insuredMemberDetails.insuredMember
        "memberDiseaseName": "NC", // default
        "zone": "Zone II", //available in insuredMemberDetails.insuredMember
        "city": "Hyderabad", //available in insuredMemberDetails.insuredMember
        "residenceCity": "Hyderabad", //available in insuredMemberDetails.insuredMember
        "zoneCd": "Z002", //available in insuredMemberDetails.insuredMember
        "memberIndex": 0, //available in insuredMemberDetails.insuredMember
        "multiplyObj": {} //default
      },
      {
        "memberRelation": {
          "key": "2",
          "value": "Spouse",
          "relDisplay": "Spouse",
          "relCode": "R002"
        },
        "selectedProductList": [
          {
            "productVariant": "Platinum",
            "productType": "AH",
            "planType": "mi",
            "productPlan": "Enhanced",
            "deductibleFlag": 0,
            "deductibleSi": 0,
            "productId": "6212",
            "planCode": "6212100003",
            "sumInsured": "2000000",
            "optionalDetails": [
              {
                "optionalId": "SP",
                "productName": "AH",
                "rate": 0,
                "premium": 0,
                "optionalCoverName": "Single Private A/c Room",
                "optionalCoverValue": "62124101-01"
              },
              {
                "optionalId": "AHPA",
                "si": 1000000,
                "optionalCoverName": "Personal Accident Cover (AD, PTD)",
                "riskClass": "RC1",
                "optionalCoverValue": "62124128",
                "premium": 470
              },
              {
                "optionalId": "ABPRO",
                "si": "2000000",
                "optionalCoverName": "ABPRO",
                "riskClass": "RC1",
                "optionalCoverValue": "0",
                "premium": 247
              },
              {
                "optionalId": "AHCI",
                "si": 300000,
                "optionalCoverName": "Critical Illness Cover",
                "riskClass": "RC1",
                "optionalCoverValue": "62124129",
                "premium": 646.8
              },
              {
                "optionalId": "AHIC",
                "si": 30000000,
                "optionalCoverName": "International Coverage for major illnesses",
                "riskClass": "RC1",
                "optionalCoverValue": "62124130",
                "premium": 10314
              },
              {
                "optionalId": "AHHCB",
                "si": 500,
                "optionalCoverName": "Hospital Cash Benefit",
                "riskClass": "RC1",
                "optionalCoverValue": "62124141",
                "premium": 224
              },
              {
                "optionalId": "AHOPD",
                "si": 5000,
                "optionalCoverName": "OPD Expenses",
                "riskClass": "RC1",
                "optionalCoverValue": "62124140",
                "premium": 4494
              },
              {
                "optionalId": "FTSE",
                "si": "2000000",
                "optionalCoverName": "Future Secure",
                "riskClass": "RC1",
                "optionalCoverValue": "62124142",
                "premium": 607
              },
              {
                "optionalId": "HRCHB",
                "si": "2000000",
                "optionalCoverName": "Cancer Hospitalization Booster",
                "riskClass": "RC1",
                "optionalCoverValue": "62124145",
                "premium": 155
              },
              {
                "optionalId": "RVCV",
                "si": 500,
                "optionalCoverName": "Vaccine cover",
                "riskClass": "RC1",
                "optionalCoverValue": "62124143",
                "premium": 369
              },
              {
                "optionalId": "TOPD",
                "si": 500,
                "optionalCoverName": "Tele-OPD Consultant",
                "riskClass": "RC1",
                "optionalCoverValue": "62124144",
                "premium": 376
              }
            ],
            "internalPremium": 67513.18905999999,
            "premium": [
              {
                "tenure": 1,
                "premium": 13803,
                "ageFrom": 32,
                "ageTo": 33
              },
              {
                "tenure": 2,
                "premium": 13848,
                "ageFrom": 33,
                "ageTo": 34
              },
              {
                "tenure": 3,
                "premium": 13894,
                "ageFrom": 34,
                "ageTo": 35
              }
            ]
          }
        ],
        "dob": "",
        "age": "32",
        "pinCode": "500013",
        "riskType": "RC1",
        "occupation": {
          "key": "1",
          "value": "ACCOUNTANT"
        },
        "profession": {
          "key": "O553",
          "value": "Salaried"
        },
        "gender": "Female",
        "memberDiseaseName": "NC",
        "zone": "Zone II",
        "city": "Hyderabad",
        "residenceCity": "Hyderabad",
        "zoneCd": "Z002",
        "memberIndex": 1,
        "multiplyObj": {}
      }
    ],
    "proposerDetails": {
      "age": "35", // available in insuredMemberDetails.insuredMemberDetails[0].memberAge
      "gender": "Male",// available in insuredMemberDetails.insuredMemberDetails[0].memberGender
      "policyType": "New Business", //available in insuredMemberDetails[0].memberPlanPolicy
      "pinCode": "500013", // available in insuredMemberDetails.insuredMemberDetails[0].pincode
      "state": "TELANGANA", //available in insuredMemberDetails.insuredMemberDetails[0].state
      "city": "", //default
      "proposerZone": "Zone II", //available in insuredMemberDetails.insuredMemberDetails[0].zone
      "employee": {
        "isAbhiEmployee": "N", // default
        "employeeCode": "" // default
      },
      "isLiApplicant": "N", // default
      "firstName": "atest", //available in this.dynamicFormGroup.get("leadFirstName").?value;
      "middleName": "atest", //available in this.dynamicFormGroup.get("leadMiddleName").?value;
      "lastName": "atest", //available in this.dynamicFormGroup.get("leadLastName").?value;
      "mobileNo": "8735285477", //available in this.dynamicFormGroup.get("leadMobile").?value;
      "emailId": "atest@Gmail.com", //available in this.dynamicFormGroup.get("leadEmail").?value;
      "dateOfBirth": "", // available in insuredMemberDetails.insuredMemberDetails[0].memberdob
      "idProof": [], // default
      "address1": "", // default
      "address2": "" // default
    },
    "selectedTenure": 1, //this.selectedIndex
    "eldestMemAge": "35", // eldest of all the insuredMemberDetails.insuredMemberDetails[i].memberAge
    "familyCombinationId": "Individual", //default
    "familyCombinationValue": "AH01", //default
    "primaryMemberDetails": {
      "age": "35", // available in insuredMemberDetails.insuredMemberDetails[0].memberAge
      "relation": "Self" // available in insuredMemberDetails.insuredMemberDetails[0].relationshipType['value']
    },
    "discountLoadingList": [ // based on the number of insuredMembers if it is greater then 1
      {
        "key": "2", // default
        "type": "multiIndividual", // default
        "isDiscount": "Y", // default
        "productType": "AH", //available formData.productType
        "value": 0.05 // default
      }
    ],
    "totalGrossPremium": 67514, // available in this.dynamicFormGroup.get("totalPremium").?value;
    "proposalOptionalCoversList": [], // default
    "totalPremiumList": [
      {
        "year": 1,
        "discount": 57215,
        "displayDisc": "0",
        "tenureDiscount": 0,
        "netPremium": 57214.566999999995,
        "tax": 10298.62206,
        "grossPremium": 67513.18905999999
      },
      {
        "year": 2,
        "discount": 131100,
        "displayDisc": "7.5",
        "tenureDiscount": 9146.527087499999,
        "netPremium": 112807.1674125,
        "tax": 20305.29013425,
        "grossPremium": 133112.45754675
      },
      {
        "year": 3,
        "discount": 205539,
        "displayDisc": "10",
        "tenureDiscount": 18685.326750000004,
        "netPremium": 168167.94075,
        "tax": 30270.229335,
        "grossPremium": 198438.170085
      }
    ], // need to make this array based on the calculated AddOn API
    "indPremiumList": [
      {
        "year": 1,
        "discount": 57215,
        "displayDisc": "0",
        "tenureDiscount": 0,
        "netPremium": 57214.566999999995,
        "tax": 10298.62206,
        "grossPremium": 67513.18905999999,
        "productType": "AH"
      },
      {
        "year": 2,
        "discount": 131100,
        "displayDisc": "7.5",
        "tenureDiscount": 9146.527087499999,
        "netPremium": 112807.1674125,
        "tax": 20305.29013425,
        "grossPremium": 133112.45754675,
        "productType": "AH"
      },
      {
        "year": 3,
        "discount": 205539,
        "displayDisc": "10",
        "tenureDiscount": 18685.326750000004,
        "netPremium": 168167.94075,
        "tax": 30270.229335,
        "grossPremium": 198438.170085,
        "productType": "AH"
      }
    ], // need to make this array based on the calculated AddOn API include productType
    "netPremium": 57215, // can be fetched from the calculateAddOn API 
    "premiumCashFormat": "57,215.00", // stringifyed version of netPremium
    "totalTax": 10298.699999999999, // need to be fetched from the calculateAddOn API and the selectedIndex
    "multiplyChk": false, // is multiplyAddon checked currently keeping it false
    "premiumPerype": "2A", // default
    "customerId": "", //default
    "leadId": "LEAD-135645100161082", //this.leadId
    "documentUpload": [], //default
    "createdBy": "5100003", //not known
    "updatedBy": "5100003" //not known
  }
