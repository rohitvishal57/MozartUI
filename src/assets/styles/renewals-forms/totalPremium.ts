export const totalPremium =
{
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
                    "name": "covers",
                    "label": "Covers",
                    "visible": false,
                    "visibleLabel": false,
                    "type": "text",
                    "value": "",
                    "class": "col-12 col-md-6 col-lg-2"
                },
                {
                    "name": "tenure",
                    "label": "Tenure",
                    "visible": false,
                    "visibleLabel": false,
                    "type": "text",
                    "value": "",
                    "class": "col-12 col-md-6 col-lg-2"
                },
                {
                    "name": "quoteId",
                    "label": "Quote Id",
                    "visible": false,
                    "visibleLabel": false,
                    "type": "text",
                    "value": "",
                    "class": "col-12 col-md-6 col-lg-2"
                },
                {
                    "name": "quoteIdDetails",
                    "label": "Quote Id Details",
                    "visible": false,
                    "visibleLabel": false,
                    "type": "text",
                    "value": "",
                    "class": "col-12 col-md-6 col-lg-2"
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
                    "methodName": "insuredMembersForAddons",
                    "subControls": [
                        {
                            "name": "accidentCover",
                            "visibleLabel": true,
                            "label": "Personal Accident",
                            "class": "col-md-6 acceptTermsCheck ah-opcovers",
                            "type": "checkbox",
                            "value": false,
                            "visible": true
                        },
                        {
                            "name": "addOnDetails",
                            "visible": false,
                            "type": "overlayControl",
                            "class": "",
                            "innerSubControls": [
                                {
                                    "name": "demoType",
                                    "label": "demoType",
                                    "class": "",
                                    "type": "",
                                    "coreControls": [
                                        {
                                            "name": "memberCheckbox",
                                            "label": "",
                                            "visibleLabel": true,
                                            "visible": true,
                                            "type": "checkbox",
                                            "value": false,
                                            "class": "col-lg-12"
                                        },
                                        {
                                            "name": "occupation",
                                            "visibleLabel": true,
                                            "label": "Occupation",
                                            "value": "",
                                            "type": "select",
                                            "options": [
                                                {
                                                    "id": "7",
                                                    "value": "O014",
                                                    "name": "Accountants"
                                                },
                                                {
                                                    "id": "8",
                                                    "value": "O140",
                                                    "name": "Ambulance Attendant"
                                                },
                                                {
                                                    "id": "9",
                                                    "value": "O015",
                                                    "name": "Architects"
                                                },
                                                {
                                                    "id": "68",
                                                    "value": "1071",
                                                    "name": "Armed Forces"
                                                },
                                                {
                                                    "id": "10",
                                                    "value": "O047",
                                                    "name": "Ballooning"
                                                },
                                                {
                                                    "id": "11",
                                                    "value": "O018",
                                                    "name": "Bankers"
                                                },
                                                {
                                                    "id": "12",
                                                    "value": "O041",
                                                    "name": "Big game hunting"
                                                },
                                                {
                                                    "id": "69",
                                                    "value": "1072",
                                                    "name": "Blasters"
                                                },
                                                {
                                                    "id": "13",
                                                    "value": "O019",
                                                    "name": "Builders"
                                                },
                                                {
                                                    "id": "67",
                                                    "value": "O190",
                                                    "name": "Bus Guards/cleaner"
                                                },
                                                {
                                                    "id": "14",
                                                    "value": "O051",
                                                    "name": "business"
                                                },
                                                {
                                                    "id": "15",
                                                    "value": "O103",
                                                    "name": "business1"
                                                },
                                                {
                                                    "id": "16",
                                                    "value": "O104",
                                                    "name": "business2"
                                                },
                                                {
                                                    "id": "17",
                                                    "value": "O105",
                                                    "name": "business3"
                                                },
                                                {
                                                    "id": "18",
                                                    "value": "O106",
                                                    "name": "business4"
                                                },
                                                {
                                                    "id": "19",
                                                    "value": "O024",
                                                    "name": "Businessmen"
                                                },
                                                {
                                                    "id": "20",
                                                    "value": "O038",
                                                    "name": "Circus personnel"
                                                },
                                                {
                                                    "id": "21",
                                                    "value": "O025",
                                                    "name": "Clerical & Administrative functions"
                                                },
                                                {
                                                    "id": "22",
                                                    "value": "O016",
                                                    "name": "Consulting engineers"
                                                },
                                                {
                                                    "id": "23",
                                                    "value": "O020",
                                                    "name": "Contractors"
                                                },
                                                {
                                                    "id": "24",
                                                    "value": "O036",
                                                    "name": "Demolition workers"
                                                },
                                                {
                                                    "id": "70",
                                                    "value": "1070",
                                                    "name": "Detective - Private"
                                                },
                                                {
                                                    "id": "25",
                                                    "value": "O012",
                                                    "name": "Doctors"
                                                },
                                                {
                                                    "id": "26",
                                                    "value": "O032",
                                                    "name": "Drivers"
                                                },
                                                {
                                                    "id": "27",
                                                    "value": "O052",
                                                    "name": "Employee"
                                                },
                                                {
                                                    "id": "28",
                                                    "value": "O022",
                                                    "name": "Engineers"
                                                },
                                                {
                                                    "id": "29",
                                                    "value": "O021",
                                                    "name": "Engineers on site engaged in superintending functi"
                                                },
                                                {
                                                    "id": "30",
                                                    "value": "O066",
                                                    "name": "Engineers on site engaged in superintending functions only"
                                                },
                                                {
                                                    "id": "31",
                                                    "value": "O110",
                                                    "name": "Factory Worker"
                                                },
                                                {
                                                    "id": "32",
                                                    "value": "O107",
                                                    "name": "Government Employee"
                                                },
                                                {
                                                    "id": "33",
                                                    "value": "O048",
                                                    "name": "Hand gliding"
                                                },
                                                {
                                                    "id": "5",
                                                    "value": "O555",
                                                    "name": "House Wife/Husband"
                                                },
                                                {
                                                    "id": "34",
                                                    "value": "O004",
                                                    "name": "Housewife"
                                                },
                                                {
                                                    "id": "35",
                                                    "value": "O046",
                                                    "name": "Ice Hockey"
                                                },
                                                {
                                                    "id": "36",
                                                    "value": "O095",
                                                    "name": "IT Professionals"
                                                },
                                                {
                                                    "id": "37",
                                                    "value": "O037",
                                                    "name": "Jockeys"
                                                },
                                                {
                                                    "id": "38",
                                                    "value": "O013",
                                                    "name": "Lawyers"
                                                },
                                                {
                                                    "id": "39",
                                                    "value": "O033",
                                                    "name": "Manual laborers (except those falling under Group"
                                                },
                                                {
                                                    "id": "40",
                                                    "value": "O077",
                                                    "name": "Manual laborers (except those falling under Group III)"
                                                },
                                                {
                                                    "id": "41",
                                                    "value": "O112",
                                                    "name": "Mass Affluent"
                                                },
                                                {
                                                    "id": "42",
                                                    "value": "O031",
                                                    "name": "Mechanics"
                                                },
                                                {
                                                    "id": "43",
                                                    "value": "O113",
                                                    "name": "Micro & SME Owner/Trader"
                                                },
                                                {
                                                    "id": "44",
                                                    "value": "O043",
                                                    "name": "Mountaineering"
                                                },
                                                {
                                                    "id": "4",
                                                    "value": "O554",
                                                    "name": "Not Employed"
                                                },
                                                {
                                                    "id": "45",
                                                    "value": "O009",
                                                    "name": "Others"
                                                },
                                                {
                                                    "id": "71",
                                                    "value": "1038",
                                                    "name": "Paramedical Personnel"
                                                },
                                                {
                                                    "id": "63",
                                                    "value": "O042",
                                                    "name": "Persons engaged in activities like racing on wheel"
                                                },
                                                {
                                                    "id": "64",
                                                    "value": "O040",
                                                    "name": "Persons engaged in Adventurous  Sports"
                                                },
                                                {
                                                    "id": "65",
                                                    "value": "O039",
                                                    "name": "Persons working as Air Crew and Ship Crew"
                                                },
                                                {
                                                    "id": "46",
                                                    "value": "O034",
                                                    "name": "Persons working in underground mines,explosives, m"
                                                },
                                                {
                                                    "id": "47",
                                                    "value": "O078",
                                                    "name": "Persons working in underground mines,explosives, magazines"
                                                },
                                                {
                                                    "id": "66",
                                                    "value": "O094",
                                                    "name": "Polo"
                                                },
                                                {
                                                    "id": "48",
                                                    "value": "O002",
                                                    "name": "Private Service"
                                                },
                                                {
                                                    "id": "49",
                                                    "value": "O027",
                                                    "name": "Professional Athletics"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "O464",
                                                    "name": "Retired"
                                                },
                                                {
                                                    "id": "50",
                                                    "value": "O049",
                                                    "name": "River rafting"
                                                },
                                                {
                                                    "id": "51",
                                                    "value": "O101",
                                                    "name": "Sailors"
                                                },
                                                {
                                                    "id": "3",
                                                    "value": "O553",
                                                    "name": "Salaried"
                                                },
                                                {
                                                    "id": "6",
                                                    "value": "O556",
                                                    "name": "Self Employed"
                                                },
                                                {
                                                    "id": "53",
                                                    "value": "O045",
                                                    "name": "Skiing"
                                                },
                                                {
                                                    "id": "54",
                                                    "value": "O111",
                                                    "name": "Small & Marginal Farmers"
                                                },
                                                {
                                                    "id": "55",
                                                    "value": "O028",
                                                    "name": "Sportsmen"
                                                },
                                                {
                                                    "id": "2",
                                                    "value": "O490",
                                                    "name": "STUDENT"
                                                },
                                                {
                                                    "id": "56",
                                                    "value": "O017",
                                                    "name": "Teachers"
                                                },
                                                {
                                                    "id": "52",
                                                    "value": "O109",
                                                    "name": "Urban Aspirer"
                                                },
                                                {
                                                    "id": "57",
                                                    "value": "O023",
                                                    "name": "Veterinary Doctors"
                                                },
                                                {
                                                    "id": "58",
                                                    "value": "O044",
                                                    "name": "Winter sports"
                                                },
                                                {
                                                    "id": "59",
                                                    "value": "O029",
                                                    "name": "Wood working Machinists"
                                                },
                                                {
                                                    "id": "60",
                                                    "value": "O030",
                                                    "name": "Workers"
                                                },
                                                {
                                                    "id": "61",
                                                    "value": "O035",
                                                    "name": "workers involved in electrical installation with h"
                                                },
                                                {
                                                    "id": "62",
                                                    "value": "O079",
                                                    "name": "Workers involved in electrical installation with high tension supply"
                                                }
                                            ]
                                        },
                                        {
                                            "name": "occupationRisk",
                                            "visibleLabel": true,
                                            "label": "Nature Of Duty",
                                            "value": "",
                                            "type": "select",
                                            "options": [
                                                {
                                                    "id": "2",
                                                    "value": "ND074",
                                                    "name": "2 - Bus Guards/cleaner"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND02",
                                                    "name": "ACCOUNTANT"
                                                },
                                                {
                                                    "id": "4",
                                                    "value": "ND03",
                                                    "name": "ACROBAT"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND04",
                                                    "name": "ACTUARY"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND05",
                                                    "name": "ACUPUNCTURIST"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND06",
                                                    "name": "ADMINISTRATIVE WORKER"
                                                },
                                                {
                                                    "id": "4",
                                                    "value": "ND07",
                                                    "name": "Adventurous sports professionals/ trainers"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND08",
                                                    "name": "ADVERTISING AGENT"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND09",
                                                    "name": "ADVOCATE/LAWYER"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND010",
                                                    "name": "AERONAUTICAL ENGINEER"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND011",
                                                    "name": "Agents-Others"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND012",
                                                    "name": "Agricultural Administration"
                                                },
                                                {
                                                    "id": "3",
                                                    "value": "ND013",
                                                    "name": "Agricultural and Horticultural Workers"
                                                },
                                                {
                                                    "id": "3",
                                                    "value": "ND014",
                                                    "name": "Agricultural Others"
                                                },
                                                {
                                                    "id": "3",
                                                    "value": "ND015",
                                                    "name": "AGRICULTURAL WORKER / LABOURER"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND016",
                                                    "name": "AGRICULTURIST/ LAND OWNER"
                                                },
                                                {
                                                    "id": "4",
                                                    "value": "ND0330",
                                                    "name": "Air force operations"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND017",
                                                    "name": "Air Traffic Control"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND018",
                                                    "name": "AIR TRAFFIC CONTROLLER"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND019",
                                                    "name": "AIRCRAFT GROUND CREW"
                                                },
                                                {
                                                    "id": "2",
                                                    "value": "ND020",
                                                    "name": "AIRCRAFT TECHNICIANS"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND021",
                                                    "name": "Aircraft-Others"
                                                },
                                                {
                                                    "id": "2",
                                                    "value": "ND022",
                                                    "name": "Aircraft-Worker"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND023",
                                                    "name": "AIRPORT SERVICE STAFF / MANAGEMENT"
                                                },
                                                {
                                                    "id": "2",
                                                    "value": "ND024",
                                                    "name": "Alcohol Production-Others"
                                                },
                                                {
                                                    "id": "3",
                                                    "value": "ND025",
                                                    "name": "Alcohol Production-Workers"
                                                },
                                                {
                                                    "id": "2",
                                                    "value": "ND026",
                                                    "name": "AMBULANCE ATTENDANT"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND027",
                                                    "name": "ANAESTHETIST"
                                                },
                                                {
                                                    "id": "3",
                                                    "value": "ND028",
                                                    "name": "Animal Handlers and Breeders"
                                                },
                                                {
                                                    "id": "3",
                                                    "value": "ND029",
                                                    "name": "Animal Trainers"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND030",
                                                    "name": "ANIMATOR / CARTOONIST"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND031",
                                                    "name": "ANNOUNCER - Radio / Television"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND032",
                                                    "name": "ARCHAEOLOGIST"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND033",
                                                    "name": "ARCHITECT"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND033",
                                                    "name": "Architects"
                                                },
                                                {
                                                    "id": "4",
                                                    "value": "ND034",
                                                    "name": "Armed Forces"
                                                },
                                                {
                                                    "id": "4",
                                                    "value": "ND0328",
                                                    "name": "Army"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND035",
                                                    "name": "ART TEACHER"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND036",
                                                    "name": "ARTIST"
                                                },
                                                {
                                                    "id": "4",
                                                    "value": "ND037",
                                                    "name": "Asbestos Worker"
                                                },
                                                {
                                                    "id": "4",
                                                    "value": "ND038",
                                                    "name": "ASPHALT WORKER"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND039",
                                                    "name": "ASSESSOR - Insurance"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND040",
                                                    "name": "Astrologer"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND041",
                                                    "name": "AUDITOR"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND042",
                                                    "name": "AUTHOR"
                                                },
                                                {
                                                    "id": "4",
                                                    "value": "ND043",
                                                    "name": "Aviation-Cabin Personnel"
                                                },
                                                {
                                                    "id": "2",
                                                    "value": "ND044",
                                                    "name": "Aviation-Ground Personnel"
                                                },
                                                {
                                                    "id": "4",
                                                    "value": "ND045",
                                                    "name": "Aviation-Pilots"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND046",
                                                    "name": "BAKER / BAKERY MANAGER"
                                                },
                                                {
                                                    "id": "4",
                                                    "value": "ND047",
                                                    "name": "Ballooning"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND048",
                                                    "name": "BANKER"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND049",
                                                    "name": "BARBER / HAIRDRESSER"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND050",
                                                    "name": "BARMAN / BARMAID"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND051",
                                                    "name": "BEAUTICIAN"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND052",
                                                    "name": "Beauty Treatment"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND053",
                                                    "name": "Beauty Treatment-Others"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND054",
                                                    "name": "BEUROCRATS"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND055",
                                                    "name": "BIOCHEMIST"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND056",
                                                    "name": "BIOLOGIST"
                                                },
                                                {
                                                    "id": "4",
                                                    "value": "ND057",
                                                    "name": "BLASTERS"
                                                },
                                                {
                                                    "id": "4",
                                                    "value": "ND058",
                                                    "name": "BODYGUARD"
                                                },
                                                {
                                                    "id": "4",
                                                    "value": "ND059",
                                                    "name": "BOMB DISPOSAL"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND060",
                                                    "name": "BOTANIST"
                                                },
                                                {
                                                    "id": "3",
                                                    "value": "ND061",
                                                    "name": "Brick and Tile-Workers"
                                                },
                                                {
                                                    "id": "3",
                                                    "value": "ND062",
                                                    "name": "BRICKLAYER"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND063",
                                                    "name": "BROKER - Administrative"
                                                },
                                                {
                                                    "id": "2",
                                                    "value": "ND064",
                                                    "name": "Builders"
                                                },
                                                {
                                                    "id": "3",
                                                    "value": "ND065",
                                                    "name": "Building and Construction Workers"
                                                },
                                                {
                                                    "id": "4",
                                                    "value": "ND066",
                                                    "name": "Building and Construction-Drivers and Operatives"
                                                },
                                                {
                                                    "id": "4",
                                                    "value": "ND067",
                                                    "name": "BUILDING CLEANER"
                                                },
                                                {
                                                    "id": "4",
                                                    "value": "ND068",
                                                    "name": "Building Labourer-Special Hazards"
                                                },
                                                {
                                                    "id": "2",
                                                    "value": "ND069",
                                                    "name": "Building-Technicians and Administrators"
                                                },
                                                {
                                                    "id": "4",
                                                    "value": "ND070",
                                                    "name": "BULLDOZER OPERATOR"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND071",
                                                    "name": "Bureaucrats"
                                                },
                                                {
                                                    "id": "2",
                                                    "value": "ND072",
                                                    "name": "BUS CONDUCTORS"
                                                },
                                                {
                                                    "id": "3",
                                                    "value": "ND073",
                                                    "name": "Bus Drivers"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND075",
                                                    "name": "BUSINESS OWNER / MANAGER - Clerical"
                                                },
                                                {
                                                    "id": "3",
                                                    "value": "ND076",
                                                    "name": "Butcher"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND077",
                                                    "name": "CAMERAMAN  (no hazardous work)"
                                                },
                                                {
                                                    "id": "4",
                                                    "value": "ND078",
                                                    "name": "CAPTAIN - Fishing Boat or Trawler"
                                                },
                                                {
                                                    "id": "4",
                                                    "value": "ND079",
                                                    "name": "CAPTAIN - Ship"
                                                },
                                                {
                                                    "id": "3",
                                                    "value": "ND080",
                                                    "name": "Car Exhaust fitter"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND081",
                                                    "name": "CARDIOLOGIST"
                                                },
                                                {
                                                    "id": "3",
                                                    "value": "ND082",
                                                    "name": "Cargo Staff-Heavy Goods"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND083",
                                                    "name": "Cargo-Administration"
                                                },
                                                {
                                                    "id": "2",
                                                    "value": "ND084",
                                                    "name": "Cargo-Staff"
                                                },
                                                {
                                                    "id": "3",
                                                    "value": "ND085",
                                                    "name": "CARPENTER"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND086",
                                                    "name": "CASHIER"
                                                },
                                                {
                                                    "id": "2",
                                                    "value": "ND087",
                                                    "name": "Casino and Gambling Personnel"
                                                },
                                                {
                                                    "id": "4",
                                                    "value": "ND088",
                                                    "name": "Ceramics Industry-Kiln Workers"
                                                },
                                                {
                                                    "id": "3",
                                                    "value": "ND089",
                                                    "name": "Ceramics Industry-Workers"
                                                },
                                                {
                                                    "id": "2",
                                                    "value": "ND090",
                                                    "name": "CHAUFFEUR /TOURIST CAR/PRIVATE CAR/COMPANY CAR"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND091",
                                                    "name": "CHEF / COOK OTHERS"
                                                },
                                                {
                                                    "id": "2",
                                                    "value": "ND092",
                                                    "name": "CHEMICAL ENGINEER"
                                                },
                                                {
                                                    "id": "2",
                                                    "value": "ND093",
                                                    "name": "Chemical Industry-research"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND094",
                                                    "name": "CHEMIST / PHARMACIST"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND095",
                                                    "name": "CHILDCARE WORKER"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND096",
                                                    "name": "CHOREOGRAPHER"
                                                },
                                                {
                                                    "id": "4",
                                                    "value": "ND097",
                                                    "name": "CIRCUS PERFORMER"
                                                },
                                                {
                                                    "id": "4",
                                                    "value": "ND098",
                                                    "name": "Circus personal"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND099",
                                                    "name": "CIVIL ENGINEER"
                                                },
                                                {
                                                    "id": "2",
                                                    "value": "ND0100",
                                                    "name": "Clergy and Religion"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0101",
                                                    "name": "CLERK"
                                                },
                                                {
                                                    "id": "4",
                                                    "value": "ND0102",
                                                    "name": "Coal and Mining Industry-Others"
                                                },
                                                {
                                                    "id": "4",
                                                    "value": "ND0103",
                                                    "name": "Coal and Mining Industry-Worker"
                                                },
                                                {
                                                    "id": "2",
                                                    "value": "ND0104",
                                                    "name": "COASTGUARD"
                                                },
                                                {
                                                    "id": "2",
                                                    "value": "ND0105",
                                                    "name": "Commercial Cleaning-Workers"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0106",
                                                    "name": "COMPUTER ANALYST / PROGRAMMER / OPERATOR"
                                                },
                                                {
                                                    "id": "4",
                                                    "value": "ND0107",
                                                    "name": "CONSTABLE - Police"
                                                },
                                                {
                                                    "id": "3",
                                                    "value": "ND0108",
                                                    "name": "CONSTRUCTION WORKER"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0109",
                                                    "name": "Consulting Engineers"
                                                },
                                                {
                                                    "id": "2",
                                                    "value": "ND0110",
                                                    "name": "Contractors"
                                                },
                                                {
                                                    "id": "2",
                                                    "value": "ND0111",
                                                    "name": "COURIER - Car / Truck"
                                                },
                                                {
                                                    "id": "4",
                                                    "value": "ND0112",
                                                    "name": "Cradles or Safety lines"
                                                },
                                                {
                                                    "id": "2",
                                                    "value": "ND0113",
                                                    "name": "Craftsmen-Creative Aspects"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0114",
                                                    "name": "CUSTOMS OFFICIAL"
                                                },
                                                {
                                                    "id": "4",
                                                    "value": "ND0338",
                                                    "name": "Demolition Workers"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0115",
                                                    "name": "DENTIST"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0116",
                                                    "name": "DERMATOLOGIST"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0117",
                                                    "name": "Designer"
                                                },
                                                {
                                                    "id": "3",
                                                    "value": "ND0118",
                                                    "name": "DETECTIVE - Private"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0119",
                                                    "name": "DIAMOND CUTTER / POLISHER"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0120",
                                                    "name": "DIETICIAN"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0121",
                                                    "name": "DIPLOMAT"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0122",
                                                    "name": "DISC JOCKEY"
                                                },
                                                {
                                                    "id": "4",
                                                    "value": "ND0123",
                                                    "name": "Diver"
                                                },
                                                {
                                                    "id": "3",
                                                    "value": "ND0124",
                                                    "name": "Dockyards-Miscellaneous"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0125",
                                                    "name": "DOCTOR"
                                                },
                                                {
                                                    "id": "2",
                                                    "value": "ND0126",
                                                    "name": "DOMESTIC SERVANT"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0127",
                                                    "name": "DRAUGHTSMAN"
                                                },
                                                {
                                                    "id": "4",
                                                    "value": "ND0128",
                                                    "name": "DRILLER"
                                                },
                                                {
                                                    "id": "3",
                                                    "value": "ND0129",
                                                    "name": "DRIVER -  Ambulance"
                                                },
                                                {
                                                    "id": "2",
                                                    "value": "ND0130",
                                                    "name": "Driver-Commercial Vehicles/Taxi/Auto Rickshaw"
                                                },
                                                {
                                                    "id": "2",
                                                    "value": "ND0131",
                                                    "name": "Driving-Instructors and Examiners"
                                                },
                                                {
                                                    "id": "2",
                                                    "value": "ND0132",
                                                    "name": "Driving-Messenger (no motorcycle)"
                                                },
                                                {
                                                    "id": "2",
                                                    "value": "ND0133",
                                                    "name": "Dustmen and Road Cleaners"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0134",
                                                    "name": "EDITOR"
                                                },
                                                {
                                                    "id": "4",
                                                    "value": "ND0135",
                                                    "name": "ELECTRICAL LINE WORKER"
                                                },
                                                {
                                                    "id": "4",
                                                    "value": "ND0136",
                                                    "name": "Electrical Workers"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0137",
                                                    "name": "Electrical-Others"
                                                },
                                                {
                                                    "id": "3",
                                                    "value": "ND0138",
                                                    "name": "Electricians"
                                                },
                                                {
                                                    "id": "4",
                                                    "value": "ND0139",
                                                    "name": "Employees engaged in offshore activities like oil rigs, or in similar activity or occupation"
                                                },
                                                {
                                                    "id": "3",
                                                    "value": "ND0140",
                                                    "name": "Energy Industry"
                                                },
                                                {
                                                    "id": "3",
                                                    "value": "ND0141",
                                                    "name": "Energy Industry-Supervision"
                                                },
                                                {
                                                    "id": "4",
                                                    "value": "ND0142",
                                                    "name": "ENGINEER - Mining"
                                                },
                                                {
                                                    "id": "2",
                                                    "value": "ND0143",
                                                    "name": "Engineer-Others"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0144",
                                                    "name": "Entertainment Electronics-creative aspects"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0145",
                                                    "name": "Entertainment Electronics-No creative aspects"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0146",
                                                    "name": "Entertainment-Classical Musician"
                                                },
                                                {
                                                    "id": "2",
                                                    "value": "ND0147",
                                                    "name": "Entertainment-Dancer"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0148",
                                                    "name": "Entertainment-Musician"
                                                },
                                                {
                                                    "id": "2",
                                                    "value": "ND0149",
                                                    "name": "Entertainment-Performer"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0150",
                                                    "name": "Entertainment-Production and Administration"
                                                },
                                                {
                                                    "id": "3",
                                                    "value": "ND0151",
                                                    "name": "Entertainment-Worker"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0152",
                                                    "name": "Entertainment-Writers and Composers"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0153",
                                                    "name": "ENTOMOLOGIST"
                                                },
                                                {
                                                    "id": "4",
                                                    "value": "ND0154",
                                                    "name": "EXPLOSIVE WORKER"
                                                },
                                                {
                                                    "id": "4",
                                                    "value": "ND0155",
                                                    "name": "Explosives Industry-Worker"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0156",
                                                    "name": "FACTORY MANAGER"
                                                },
                                                {
                                                    "id": "3",
                                                    "value": "ND0157",
                                                    "name": "FACTORY WORKER"
                                                },
                                                {
                                                    "id": "3",
                                                    "value": "ND0158",
                                                    "name": "Factory-Others"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0159",
                                                    "name": "FARM OWNER"
                                                },
                                                {
                                                    "id": "3",
                                                    "value": "ND0160",
                                                    "name": "FARM WORKER"
                                                },
                                                {
                                                    "id": "3",
                                                    "value": "ND0161",
                                                    "name": "Farmers"
                                                },
                                                {
                                                    "id": "2",
                                                    "value": "ND0162",
                                                    "name": "Fibre or Textile Industry-Supervising Workers"
                                                },
                                                {
                                                    "id": "3",
                                                    "value": "ND0163",
                                                    "name": "Fibre or Textile Industry-Workers"
                                                },
                                                {
                                                    "id": "3",
                                                    "value": "ND0164",
                                                    "name": "Filing Station Attendants"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0165",
                                                    "name": "Fine Arts, Clock and Jewellery Industry-Workers"
                                                },
                                                {
                                                    "id": "4",
                                                    "value": "ND0166",
                                                    "name": "Fire Brigade"
                                                },
                                                {
                                                    "id": "4",
                                                    "value": "ND0167",
                                                    "name": "Fire Brigade-Very Special Duties"
                                                },
                                                {
                                                    "id": "4",
                                                    "value": "ND0168",
                                                    "name": "FIREMAN"
                                                },
                                                {
                                                    "id": "4",
                                                    "value": "ND0169",
                                                    "name": "FISHERMAN - Deep Sea"
                                                },
                                                {
                                                    "id": "2",
                                                    "value": "ND0170",
                                                    "name": "FISHERMAN - Inshore"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0171",
                                                    "name": "Fishery-Administration"
                                                },
                                                {
                                                    "id": "4",
                                                    "value": "ND0172",
                                                    "name": "Fishing Boat Crew-Captain"
                                                },
                                                {
                                                    "id": "4",
                                                    "value": "ND0173",
                                                    "name": "Fishing Boat Crew-Others"
                                                },
                                                {
                                                    "id": "3",
                                                    "value": "ND0174",
                                                    "name": "Fishing Industry-Miscellaneous"
                                                },
                                                {
                                                    "id": "3",
                                                    "value": "ND0175",
                                                    "name": "Fishing Industry-Worker"
                                                },
                                                {
                                                    "id": "2",
                                                    "value": "ND0176",
                                                    "name": "Floor-Worker"
                                                },
                                                {
                                                    "id": "3",
                                                    "value": "ND0177",
                                                    "name": "Food Industry-Direct Contact"
                                                },
                                                {
                                                    "id": "3",
                                                    "value": "ND0178",
                                                    "name": "Food Industry-Others"
                                                },
                                                {
                                                    "id": "3",
                                                    "value": "ND0179",
                                                    "name": "Food Processing-Worker"
                                                },
                                                {
                                                    "id": "4",
                                                    "value": "ND0180",
                                                    "name": "Food Production-Dangerous"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0181",
                                                    "name": "FOREMAN - Non hazardous industry"
                                                },
                                                {
                                                    "id": "2",
                                                    "value": "ND0182",
                                                    "name": "Forestry-Others"
                                                },
                                                {
                                                    "id": "3",
                                                    "value": "ND0183",
                                                    "name": "Forestry-Worker"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0184",
                                                    "name": "Funeral Services - Administrative"
                                                },
                                                {
                                                    "id": "2",
                                                    "value": "ND0185",
                                                    "name": "Funeral Services-Miscellaneous"
                                                },
                                                {
                                                    "id": "2",
                                                    "value": "ND0186",
                                                    "name": "FURNACEMAN  Supervisory"
                                                },
                                                {
                                                    "id": "4",
                                                    "value": "ND0187",
                                                    "name": "FURNACEMAN  Worker"
                                                },
                                                {
                                                    "id": "3",
                                                    "value": "ND0188",
                                                    "name": "Furniture Industry-Workers"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0189",
                                                    "name": "GARDENER - Supervisory"
                                                },
                                                {
                                                    "id": "3",
                                                    "value": "ND0190",
                                                    "name": "GARDENER - Worker"
                                                },
                                                {
                                                    "id": "4",
                                                    "value": "ND0191",
                                                    "name": "Gas and Heating-Others"
                                                },
                                                {
                                                    "id": "4",
                                                    "value": "ND0192",
                                                    "name": "Gas and Heating-Workers"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0193",
                                                    "name": "GEOLOGIST - No explosives"
                                                },
                                                {
                                                    "id": "3",
                                                    "value": "ND0194",
                                                    "name": "Glass - Industry-Workers"
                                                },
                                                {
                                                    "id": "3",
                                                    "value": "ND0195",
                                                    "name": "Glass-Industry-Others"
                                                },
                                                {
                                                    "id": "4",
                                                    "value": "ND0196",
                                                    "name": "Glass-Industry-Workers with dangerous duties"
                                                },
                                                {
                                                    "id": "2",
                                                    "value": "ND0197",
                                                    "name": "GOLDSMITH"
                                                },
                                                {
                                                    "id": "4",
                                                    "value": "ND0337",
                                                    "name": "Hand gliding as an occupation"
                                                },
                                                {
                                                    "id": "4",
                                                    "value": "ND0198",
                                                    "name": "Hang gliding"
                                                },
                                                {
                                                    "id": "3",
                                                    "value": "ND0199",
                                                    "name": "Harbour-Others"
                                                },
                                                {
                                                    "id": "3",
                                                    "value": "ND0200",
                                                    "name": "Harbour-Worker"
                                                },
                                                {
                                                    "id": "4",
                                                    "value": "ND0201",
                                                    "name": "HEAVY MACHINARY WORKERS"
                                                },
                                                {
                                                    "id": "3",
                                                    "value": "ND0202",
                                                    "name": "Heavy Vehicle Drivers"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0203",
                                                    "name": "HOMEOPATH"
                                                },
                                                {
                                                    "id": "2",
                                                    "value": "ND0204",
                                                    "name": "Hotel and Catering-Administration"
                                                },
                                                {
                                                    "id": "2",
                                                    "value": "ND0205",
                                                    "name": "Hotel and Catering-Others"
                                                },
                                                {
                                                    "id": "2",
                                                    "value": "ND0206",
                                                    "name": "Hotel and Catering-Workers"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0207",
                                                    "name": "Househusband"
                                                },
                                                {
                                                    "id": "2",
                                                    "value": "ND0208",
                                                    "name": "Housekeeping"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0209",
                                                    "name": "Housewife"
                                                },
                                                {
                                                    "id": "4",
                                                    "value": "ND0336",
                                                    "name": "Ice hockey"
                                                },
                                                {
                                                    "id": "4",
                                                    "value": "ND0210",
                                                    "name": "Ice Skating"
                                                },
                                                {
                                                    "id": "4",
                                                    "value": "ND0335",
                                                    "name": "Individual engaged in racing in wheels or horseback"
                                                },
                                                {
                                                    "id": "3",
                                                    "value": "ND0211",
                                                    "name": "Industrial Workers"
                                                },
                                                {
                                                    "id": "2",
                                                    "value": "ND0212",
                                                    "name": "Industry Others-Miscellaneous Workers"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0213",
                                                    "name": "INSURANCE BROKER"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0214",
                                                    "name": "Insurance-Agent"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0215",
                                                    "name": "Interpreter"
                                                },
                                                {
                                                    "id": "2",
                                                    "value": "ND0327",
                                                    "name": "Investigator - On field"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0326",
                                                    "name": "Investigator - Other"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0216",
                                                    "name": "IT-Staff"
                                                },
                                                {
                                                    "id": "4",
                                                    "value": "ND0217",
                                                    "name": "Jockeys"
                                                },
                                                {
                                                    "id": "2",
                                                    "value": "ND0218",
                                                    "name": "JOURNALIST - Other"
                                                },
                                                {
                                                    "id": "4",
                                                    "value": "ND0219",
                                                    "name": "JOURNALIST - War risk"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0220",
                                                    "name": "JUDGE"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0221",
                                                    "name": "LABORATORY - Assistant / Technician"
                                                },
                                                {
                                                    "id": "3",
                                                    "value": "ND0222",
                                                    "name": "Labourer"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0223",
                                                    "name": "LATHE OPERATOR"
                                                },
                                                {
                                                    "id": "2",
                                                    "value": "ND0224",
                                                    "name": "Laundry Service-Others"
                                                },
                                                {
                                                    "id": "2",
                                                    "value": "ND0225",
                                                    "name": "Laundry Service-Worker"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0226",
                                                    "name": "Lawyers"
                                                },
                                                {
                                                    "id": "2",
                                                    "value": "ND0227",
                                                    "name": "Leather-Workmanship-Workers"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0228",
                                                    "name": "LECTURER"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0229",
                                                    "name": "Legal Profession"
                                                },
                                                {
                                                    "id": "2",
                                                    "value": "ND0230",
                                                    "name": "LIFT OPERATOR"
                                                },
                                                {
                                                    "id": "4",
                                                    "value": "ND0231",
                                                    "name": "Loggers"
                                                },
                                                {
                                                    "id": "3",
                                                    "value": "ND01",
                                                    "name": "Lorry Driver"
                                                },
                                                {
                                                    "id": "4",
                                                    "value": "ND0232",
                                                    "name": "Lumber mill workers"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0233",
                                                    "name": "MAGISTRATE"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0234",
                                                    "name": "Management-Others"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0235",
                                                    "name": "Marketing"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0236",
                                                    "name": "MARTIAL ARTS"
                                                },
                                                {
                                                    "id": "3",
                                                    "value": "ND0237",
                                                    "name": "MASON / STONEMASON"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0238",
                                                    "name": "Matchmaker"
                                                },
                                                {
                                                    "id": "3",
                                                    "value": "ND0239",
                                                    "name": "Mechanics"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0240",
                                                    "name": "Medical Administration"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0241",
                                                    "name": "Medical Assistance"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0242",
                                                    "name": "Medical Doctors"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0243",
                                                    "name": "Medical-Miscellaneous"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0244",
                                                    "name": "Medical-Others"
                                                },
                                                {
                                                    "id": "3",
                                                    "value": "ND0245",
                                                    "name": "Metal Industry-Others"
                                                },
                                                {
                                                    "id": "3",
                                                    "value": "ND0246",
                                                    "name": "Metal Industry-Workers"
                                                },
                                                {
                                                    "id": "4",
                                                    "value": "ND0247",
                                                    "name": "Metal Industry-Workers with dangerous duties"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0248",
                                                    "name": "METEOROLOGIST"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0249",
                                                    "name": "MIDWIFE"
                                                },
                                                {
                                                    "id": "4",
                                                    "value": "ND0250",
                                                    "name": "MINER"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0251",
                                                    "name": "MINER - Administration"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0252",
                                                    "name": "MODEL"
                                                },
                                                {
                                                    "id": "4",
                                                    "value": "ND0253",
                                                    "name": "Mountaineering"
                                                },
                                                {
                                                    "id": "4",
                                                    "value": "ND0332",
                                                    "name": "Mountaineers"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0254",
                                                    "name": "Musical Instrument Specialists"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0255",
                                                    "name": "MUSICIAN"
                                                },
                                                {
                                                    "id": "3",
                                                    "value": "ND0256",
                                                    "name": "Navigation-Administration"
                                                },
                                                {
                                                    "id": "4",
                                                    "value": "ND0257",
                                                    "name": "Navigation-Inland Water"
                                                },
                                                {
                                                    "id": "4",
                                                    "value": "ND0258",
                                                    "name": "Navigation-Off Shore-No Special Duties"
                                                },
                                                {
                                                    "id": "4",
                                                    "value": "ND0259",
                                                    "name": "Navigation-Off Shore-Ships Crew"
                                                },
                                                {
                                                    "id": "3",
                                                    "value": "ND0260",
                                                    "name": "Navigation-Others"
                                                },
                                                {
                                                    "id": "4",
                                                    "value": "ND0261",
                                                    "name": "Navigation-Pilots and Lighthousemen"
                                                },
                                                {
                                                    "id": "4",
                                                    "value": "ND0329",
                                                    "name": "Navy"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0262",
                                                    "name": "NURSE"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0263",
                                                    "name": "OBSTETRICIAN / GYNAECOLOGIST"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0264",
                                                    "name": "Office Executives"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0340",
                                                    "name": "Office Workers and Commercial Clerks"
                                                },
                                                {
                                                    "id": "2",
                                                    "value": "ND0341",
                                                    "name": "Office Workers-Craftsmen"
                                                },
                                                {
                                                    "id": "4",
                                                    "value": "ND0342",
                                                    "name": "OIL RIG WORKER - Manual"
                                                },
                                                {
                                                    "id": "3",
                                                    "value": "ND0343",
                                                    "name": "OIL RIG WORKER - Non Manual e.g.. Engineer"
                                                },
                                                {
                                                    "id": "4",
                                                    "value": "ND0344",
                                                    "name": "Oil Rig-Flying Personnel"
                                                },
                                                {
                                                    "id": "4",
                                                    "value": "ND0345",
                                                    "name": "Oil Rig-Management and Control"
                                                },
                                                {
                                                    "id": "4",
                                                    "value": "ND0346",
                                                    "name": "Oil Rig-Others"
                                                },
                                                {
                                                    "id": "4",
                                                    "value": "ND0347",
                                                    "name": "Oil Rig-Workers with dangerous duties"
                                                },
                                                {
                                                    "id": "4",
                                                    "value": "ND0348",
                                                    "name": "Oil Rig-Workers with very dangerous duties"
                                                },
                                                {
                                                    "id": "3",
                                                    "value": "ND0349",
                                                    "name": "On-site engineers"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0350",
                                                    "name": "Optical Industry-Others"
                                                },
                                                {
                                                    "id": "3",
                                                    "value": "ND0351",
                                                    "name": "Optical Industry-Workers"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0352",
                                                    "name": "OPTOMETRIST / OPTICIAN / TECHNICIAN"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0353",
                                                    "name": "ORTHODONTIST"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0354",
                                                    "name": "ORTHOPAEDIC SURGEON"
                                                },
                                                {
                                                    "id": "4",
                                                    "value": "ND06",
                                                    "name": "Others PA"
                                                },
                                                {
                                                    "id": "3",
                                                    "value": "ND0355",
                                                    "name": "Paper Industry-Workers"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0356",
                                                    "name": "PATHOLOGIST"
                                                },
                                                {
                                                    "id": "2",
                                                    "value": "ND0357",
                                                    "name": "Personal Car Drivers"
                                                },
                                                {
                                                    "id": "3",
                                                    "value": "ND0358",
                                                    "name": "PETROL STATION PUMP ATTENDANT"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0359",
                                                    "name": "PHARMACIST/CHEMIST"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0360",
                                                    "name": "PHOTOGRAPHER"
                                                },
                                                {
                                                    "id": "2",
                                                    "value": "ND0361",
                                                    "name": "Photography-Technical"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0362",
                                                    "name": "PHYSIOTHERAPIST"
                                                },
                                                {
                                                    "id": "4",
                                                    "value": "ND0363",
                                                    "name": "PILOT Harbour"
                                                },
                                                {
                                                    "id": "3",
                                                    "value": "ND0364",
                                                    "name": "PIPELINE WORKER"
                                                },
                                                {
                                                    "id": "2",
                                                    "value": "ND0365",
                                                    "name": "Plastics Industry-Supervision"
                                                },
                                                {
                                                    "id": "3",
                                                    "value": "ND0366",
                                                    "name": "Plastics Industry-Worker"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0367",
                                                    "name": "PLUMBER"
                                                },
                                                {
                                                    "id": "4",
                                                    "value": "ND0368",
                                                    "name": "POLICE PROFESSIONALS"
                                                },
                                                {
                                                    "id": "4",
                                                    "value": "ND0369",
                                                    "name": "Polo playing"
                                                },
                                                {
                                                    "id": "2",
                                                    "value": "ND0370",
                                                    "name": "PORTER"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0371",
                                                    "name": "POST OFFICE  - Clerical Staff"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0372",
                                                    "name": "Postal Service-Others"
                                                },
                                                {
                                                    "id": "2",
                                                    "value": "ND0373",
                                                    "name": "Postal Service-Workers"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0374",
                                                    "name": "POSTMAN"
                                                },
                                                {
                                                    "id": "3",
                                                    "value": "ND0375",
                                                    "name": "Pottery Worker"
                                                },
                                                {
                                                    "id": "3",
                                                    "value": "ND0376",
                                                    "name": "Pottery Worker with dangerous duties"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0377",
                                                    "name": "Press Coverage-No foreign assignments"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0378",
                                                    "name": "PRIEST"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0379",
                                                    "name": "Printing Industry-Others"
                                                },
                                                {
                                                    "id": "2",
                                                    "value": "ND0380",
                                                    "name": "Printing Industry-Workers"
                                                },
                                                {
                                                    "id": "4",
                                                    "value": "ND0381",
                                                    "name": "Printing Industry-Workers with dangerous duties"
                                                },
                                                {
                                                    "id": "3",
                                                    "value": "ND0382",
                                                    "name": "PROFESSIONAL SPORTSMAN"
                                                },
                                                {
                                                    "id": "4",
                                                    "value": "ND0333",
                                                    "name": "Professionals in car/bike racing"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0383",
                                                    "name": "Property - Landlord"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0384",
                                                    "name": "Property Owner"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0385",
                                                    "name": "PSYCHIATRIST"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0386",
                                                    "name": "PSYCHOLOGIST"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0387",
                                                    "name": "Public Health Service"
                                                },
                                                {
                                                    "id": "3",
                                                    "value": "ND0388",
                                                    "name": "Public Health Service-Pest Control"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0389",
                                                    "name": "Public Services-Not Office"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0390",
                                                    "name": "Public Services-Others"
                                                },
                                                {
                                                    "id": "2",
                                                    "value": "ND0391",
                                                    "name": "Public Services-Prison"
                                                },
                                                {
                                                    "id": "4",
                                                    "value": "ND0392",
                                                    "name": "Public Services-Security [Armed - No Personal Security]"
                                                },
                                                {
                                                    "id": "4",
                                                    "value": "ND0393",
                                                    "name": "Public Services-Security [Not Armed]"
                                                },
                                                {
                                                    "id": "4",
                                                    "value": "ND0394",
                                                    "name": "Public Services-Security [Personal Security]"
                                                },
                                                {
                                                    "id": "4",
                                                    "value": "ND0395",
                                                    "name": "QUARRY WORKER - Blasting"
                                                },
                                                {
                                                    "id": "3",
                                                    "value": "ND0396",
                                                    "name": "QUARRY WORKER - Non Blasting"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0397",
                                                    "name": "Radio and Television"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0398",
                                                    "name": "RADIOLOGIST / X-RAY TECHNICIAN"
                                                },
                                                {
                                                    "id": "4",
                                                    "value": "ND0399",
                                                    "name": "RAILWAY LINESMAN - high voltage"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0400",
                                                    "name": "RAILWAY PROFESSIONAL"
                                                },
                                                {
                                                    "id": "3",
                                                    "value": "ND0401",
                                                    "name": "RAILWAY WORKER"
                                                },
                                                {
                                                    "id": "2",
                                                    "value": "ND0404",
                                                    "name": "Railway-Supervising Workers"
                                                },
                                                {
                                                    "id": "3",
                                                    "value": "ND0405",
                                                    "name": "Railway-Workers with less dangerous duties"
                                                },
                                                {
                                                    "id": "3",
                                                    "value": "ND0402",
                                                    "name": "Railways-Drivers and Guards"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0403",
                                                    "name": "Railways-Others"
                                                },
                                                {
                                                    "id": "4",
                                                    "value": "ND0406",
                                                    "name": "REFINERY WORKER - oil / gas"
                                                },
                                                {
                                                    "id": "2",
                                                    "value": "ND0407",
                                                    "name": "REFINERY WORKER - sugarcane"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0408",
                                                    "name": "Retail and Sales - back office"
                                                },
                                                {
                                                    "id": "2",
                                                    "value": "ND0409",
                                                    "name": "Retail and Sales-Others"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0410",
                                                    "name": "Retired"
                                                },
                                                {
                                                    "id": "4",
                                                    "value": "ND0411",
                                                    "name": "River Rafting"
                                                },
                                                {
                                                    "id": "3",
                                                    "value": "ND0412",
                                                    "name": "Road Safety-Officer"
                                                },
                                                {
                                                    "id": "3",
                                                    "value": "ND0413",
                                                    "name": "Road Transport-Others"
                                                },
                                                {
                                                    "id": "2",
                                                    "value": "ND0414",
                                                    "name": "ROOF TILER"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0415",
                                                    "name": "Rubber Industry-Others"
                                                },
                                                {
                                                    "id": "2",
                                                    "value": "ND0416",
                                                    "name": "Rubber Industry-Workers"
                                                },
                                                {
                                                    "id": "3",
                                                    "value": "ND0417",
                                                    "name": "Rubber Industry-Workers with dangerous duties"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0418",
                                                    "name": "Salesmen"
                                                },
                                                {
                                                    "id": "4",
                                                    "value": "ND0419",
                                                    "name": "Salvage worker"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0420",
                                                    "name": "Scientists-predominantly indoor"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0421",
                                                    "name": "Scientists-predominantly indoor and  humanistic"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0422",
                                                    "name": "SECRETARY / TYPIST"
                                                },
                                                {
                                                    "id": "4",
                                                    "value": "ND0265",
                                                    "name": "Security Service-Guards [Armed - No Personal Security]"
                                                },
                                                {
                                                    "id": "4",
                                                    "value": "ND0266",
                                                    "name": "Security Service-Guards [Not Armed]"
                                                },
                                                {
                                                    "id": "4",
                                                    "value": "ND0267",
                                                    "name": "Security Service-Guards [Personal Security]"
                                                },
                                                {
                                                    "id": "3",
                                                    "value": "ND0268",
                                                    "name": "SHEET METAL WORKER"
                                                },
                                                {
                                                    "id": "3",
                                                    "value": "ND0269",
                                                    "name": "Ship Building-Others"
                                                },
                                                {
                                                    "id": "3",
                                                    "value": "ND0270",
                                                    "name": "Ship Building-Workers"
                                                },
                                                {
                                                    "id": "4",
                                                    "value": "ND0271",
                                                    "name": "Ship crews"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0272",
                                                    "name": "Shopkeepers and Traders"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0273",
                                                    "name": "SINGER"
                                                },
                                                {
                                                    "id": "4",
                                                    "value": "ND0274",
                                                    "name": "Skiing"
                                                },
                                                {
                                                    "id": "3",
                                                    "value": "ND0275",
                                                    "name": "Sports-Coach"
                                                },
                                                {
                                                    "id": "3",
                                                    "value": "ND0276",
                                                    "name": "Sports-Miscellaneous"
                                                },
                                                {
                                                    "id": "4",
                                                    "value": "ND0339",
                                                    "name": "Steeple Jacks"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0277",
                                                    "name": "STUDENT"
                                                },
                                                {
                                                    "id": "4",
                                                    "value": "ND0278",
                                                    "name": "STUNT MAN"
                                                },
                                                {
                                                    "id": "4",
                                                    "value": "ND0331",
                                                    "name": "Stunt pilots"
                                                },
                                                {
                                                    "id": "4",
                                                    "value": "ND0279",
                                                    "name": "Stunt show participants"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0280",
                                                    "name": "SURGEON"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0281",
                                                    "name": "SURVEYOR"
                                                },
                                                {
                                                    "id": "2",
                                                    "value": "ND0282",
                                                    "name": "Synthetic Material-Worker"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0283",
                                                    "name": "TAILOR"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0284",
                                                    "name": "TEACHER"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0285",
                                                    "name": "Teacher-normal career"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0286",
                                                    "name": "Teacher-Others [not predominantly artistic]"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0287",
                                                    "name": "Teacher-upscaled career"
                                                },
                                                {
                                                    "id": "2",
                                                    "value": "ND0288",
                                                    "name": "Technicians"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0289",
                                                    "name": "Technicians-Others"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0290",
                                                    "name": "Telecommunication"
                                                },
                                                {
                                                    "id": "2",
                                                    "value": "ND0291",
                                                    "name": "Telecommunication-Others"
                                                },
                                                {
                                                    "id": "2",
                                                    "value": "ND0292",
                                                    "name": "Textile Industry-Creative Aspects"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0293",
                                                    "name": "Textile Industry-Others"
                                                },
                                                {
                                                    "id": "2",
                                                    "value": "ND0294",
                                                    "name": "Textile Industry-Workers"
                                                },
                                                {
                                                    "id": "2",
                                                    "value": "ND0295",
                                                    "name": "Tobacco Industry-Others"
                                                },
                                                {
                                                    "id": "3",
                                                    "value": "ND0296",
                                                    "name": "Tobacco Industry-Workers"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0297",
                                                    "name": "Tourism"
                                                },
                                                {
                                                    "id": "2",
                                                    "value": "ND0298",
                                                    "name": "Traders-Others"
                                                },
                                                {
                                                    "id": "2",
                                                    "value": "ND0299",
                                                    "name": "TRAFFIC OFFICER / INSPECTOR / WARDEN"
                                                },
                                                {
                                                    "id": "4",
                                                    "value": "ND0300",
                                                    "name": "TRAWLERMAN - Deep-sea"
                                                },
                                                {
                                                    "id": "3",
                                                    "value": "ND0301",
                                                    "name": "TRAWLERMAN - Inshore"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0302",
                                                    "name": "TUTOR"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0303",
                                                    "name": "Typist"
                                                },
                                                {
                                                    "id": "3",
                                                    "value": "ND0304",
                                                    "name": "Tyre Industry-Workers"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0305",
                                                    "name": "UNDERWRITER"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0306",
                                                    "name": "Unemployed"
                                                },
                                                {
                                                    "id": "3",
                                                    "value": "ND0307",
                                                    "name": "Unskilled Labourers"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0308",
                                                    "name": "UROLOGIST"
                                                },
                                                {
                                                    "id": "3",
                                                    "value": "ND0309",
                                                    "name": "Vehicle Industry-Assembly and Maintenance"
                                                },
                                                {
                                                    "id": "3",
                                                    "value": "ND0310",
                                                    "name": "Vehicle-Tester"
                                                },
                                                {
                                                    "id": "2",
                                                    "value": "ND0311",
                                                    "name": "VETERINARIAN"
                                                },
                                                {
                                                    "id": "2",
                                                    "value": "ND0312",
                                                    "name": "Veterinary Doctors"
                                                },
                                                {
                                                    "id": "3",
                                                    "value": "ND0313",
                                                    "name": "WAITER / WAITRESS"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0314",
                                                    "name": "Water Supply-Miscellaneous"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0315",
                                                    "name": "Water Supply-Workers"
                                                },
                                                {
                                                    "id": "4",
                                                    "value": "ND0316",
                                                    "name": "Weapons Production"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0317",
                                                    "name": "WEAVER"
                                                },
                                                {
                                                    "id": "3",
                                                    "value": "ND0318",
                                                    "name": "WELDER"
                                                },
                                                {
                                                    "id": null,
                                                    "value": "ND0319",
                                                    "name": "Winter Sports"
                                                },
                                                {
                                                    "id": "3",
                                                    "value": "ND0320",
                                                    "name": "Wood Processing-Workers"
                                                },
                                                {
                                                    "id": "3",
                                                    "value": "ND0321",
                                                    "name": "Wood Processing-Workers with dangerous duties"
                                                },
                                                {
                                                    "id": "2",
                                                    "value": "ND0322",
                                                    "name": "Workers (bodily)-General"
                                                },
                                                {
                                                    "id": "3",
                                                    "value": "ND0323",
                                                    "name": "Workers [With no special hazards]"
                                                },
                                                {
                                                    "id": "4",
                                                    "value": "ND0334",
                                                    "name": "Wrestlers"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0324",
                                                    "name": "X-RAY TECHNICIAN / RADIOLOGIST"
                                                },
                                                {
                                                    "id": "1",
                                                    "value": "ND0325",
                                                    "name": "ZOOLOGIST"
                                                }
                                            ]
                                        },
                                        {
                                            "name": "addOnSumInsured",
                                            "visibleLabel": true,
                                            "label": "Add On Sum Insured",
                                            "value": "",
                                            "type": "select",
                                            "options": [
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
                                                    "name": "2500000",
                                                    "label": "2500000",
                                                    "value": 2500000
                                                },
                                                {
                                                    "name": "5000000",
                                                    "label": "5000000",
                                                    "value": 5000000
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    "name": "doneButton",
                                    "type": "button",
                                    "displayOnly": true,
                                    "disabled": true,
                                    "method": "closeOverlay",
                                    "class": "col-12 col-xl-12 text-right"
                                }
                            ]
                        },
                        {
                            "name": "addOnId",
                            "label": "Add On Id",
                            "visibleLabel": false,
                            "value": "PA",
                            "type": "text",
                            "visible": false
                        },
                        {
                            "name": "premium",
                            "label": "Premium",
                            "visibleLabel": false,
                            "value": "",
                            "type": "text",
                            "visible": false
                        },
                        {
                            "name": "additionalCoverName",
                            "label": "Additional Cover Name",
                            "visibleLabel": false,
                            "value": "Personal Accident Cover (AD, PTD)",
                            "type": "text",
                            "visible": false
                        },
                        {
                            "name": "aditionalCoverValue",
                            "label": "Aditional Cover Value",
                            "visibleLabel": false,
                            "value": "",
                            "type": "text",
                            "visible": false,
                            "class": "col-md-6"
                        },
                        {
                            "name": "changeMember",
                            "label": "Change Member",
                            "visibleLabel": false,
                            "value": "",
                            "type": "button",
                            "visible": true,
                            "class": "col-md-3",
                            "onChangeMethod": "showOverlay"
                        }
                    ]
                },
                {
                    "name": "criticalIllness",
                    "label": "criticalIllness",
                    "visibleLabel": false,
                    "visible": true,
                    "methodName": "insuredMembersForAddons",
                    "class": "col-md-4 acceptTermsCheck",
                    "type": "combinedCheckbox",
                    "subControls": [
                        {
                            "name": "addOnCover",
                            "visibleLabel": true,
                            "label": "Critical Illness",
                            "class": "col-md-6 acceptTermsCheck ah-opcovers",
                            "type": "checkbox",
                            "value": false,
                            "visible": true
                        },
                        {
                            "name": "addOnDetails",
                            "visible": false,
                            "type": "overlayControl",
                            "class": "",
                            "innerSubControls": [
                                {
                                    "name": "demoType",
                                    "label": "demoType",
                                    "class": "",
                                    "type": "",
                                    "coreControls": [
                                        {
                                            "name": "memberCheckbox",
                                            "label": "",
                                            "visibleLabel": true,
                                            "visible": true,
                                            "type": "checkbox",
                                            "value": false,
                                            "class": "col-lg-12"
                                        },
                                        {
                                            "name": "addOnSumInsured",
                                            "visibleLabel": true,
                                            "label": "Sum Insured",
                                            "value": "",
                                            "type": "select",
                                            "options": [
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
                                                    "name": "2500000",
                                                    "label": "2500000",
                                                    "value": 2500000
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    "name": "doneButton",
                                    "type": "button",
                                    "displayOnly": true,
                                    "disabled": true,
                                    "method": "closeOverlay",
                                    "class": "col-12 col-xl-12 text-right"
                                }
                            ]
                        },
                        {
                            "name": "addOnId",
                            "label": "Add On Id",
                            "visibleLabel": false,
                            "value": "CIL",
                            "type": "text",
                            "visible": false
                        },
                        {
                            "name": "premium",
                            "label": "Premium",
                            "visibleLabel": false,
                            "value": "",
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
                            "value": "",
                            "type": "text",
                            "visible": false,
                            "class": "col-md-6"
                        },
                        {
                            "name": "changeMember",
                            "label": "Change Member",
                            "visibleLabel": false,
                            "value": "",
                            "type": "button",
                            "visible": true,
                            "class": "col-md-3",
                            "onChangeMethod": "showOverlay"
                        }
                    ]
                },
                {
                    "name": "durableCover",
                    "label": "durableCover",
                    "visibleLabel": false,
                    "visible": true,
                    "methodName": "insuredMembersForAddons",
                    "class": "col-md-4 acceptTermsCheck",
                    "type": "combinedCheckbox",
                    "subControls": [
                        {
                            "name": "addOnCover",
                            "visibleLabel": true,
                            "label": "Durable Equipment Cover",
                            "class": "col-md-6 acceptTermsCheck ah-opcovers",
                            "type": "checkbox",
                            "value": false,
                            "visible": true
                        },
                        {
                            "name": "addOnDetails",
                            "visible": false,
                            "type": "overlayControl",
                            "class": "",
                            "innerSubControls": [
                                {
                                    "name": "demoType",
                                    "label": "demoType",
                                    "class": "",
                                    "type": "",
                                    "coreControls": [
                                        {
                                            "name": "memberCheckbox",
                                            "label": "",
                                            "visibleLabel": true,
                                            "visible": true,
                                            "type": "checkbox",
                                            "value": false,
                                            "class": "col-lg-12"
                                        },
                                        {
                                            "name": "addOnSumInsured",
                                            "visibleLabel": false,
                                            "label": "Add On Sum Insured",
                                            "value": "",
                                            "type": "text"
                                        }
                                    ]
                                },
                                {
                                    "name": "doneButton",
                                    "type": "button",
                                    "displayOnly": true,
                                    "disabled": true,
                                    "method": "closeOverlay",
                                    "class": "col-12 col-xl-12 text-right"
                                }
                            ]
                        },
                        {
                            "name": "addOnId",
                            "label": "Add On Id",
                            "visibleLabel": false,
                            "value": "DECOV",
                            "type": "text",
                            "visible": false
                        },
                        {
                            "name": "premium",
                            "label": "Premium",
                            "visibleLabel": false,
                            "value": "2000000",
                            "type": "text",
                            "visible": false
                        },
                        {
                            "name": "optionalCoverName",
                            "label": "Optional Cover Name",
                            "visibleLabel": false,
                            "value": "Durable Equipment Cover",
                            "type": "text",
                            "visible": false
                        },
                        {
                            "name": "optionalCoverValue",
                            "label": "Optional Cover Value",
                            "visibleLabel": false,
                            "value": "",
                            "type": "text",
                            "visible": false,
                            "class": "col-md-6"
                        },
                        {
                            "name": "changeMember",
                            "label": "Change Member",
                            "visibleLabel": false,
                            "value": "",
                            "type": "button",
                            "visible": true,
                            "class": "col-md-3",
                            "onChangeMethod": "showOverlay"
                        }
                    ]
                },
                {
                    "name": "medicalOpinionIllness",
                    "label": "second Medical Illness",
                    "visibleLabel": false,
                    "visible": true,
                    "methodName": "insuredMembersForAddons",
                    "class": "col-md-4 acceptTermsCheck",
                    "type": "combinedCheckbox",
                    "subControls": [
                        {
                            "name": "addOnCover",
                            "visibleLabel": true,
                            "label": "Second Medical Opinion for listed Major Illness",
                            "class": "col-md-6 acceptTermsCheck ah-opcovers",
                            "type": "checkbox",
                            "value": false,
                            "visible": true
                        },
                        {
                            "name": "addOnDetails",
                            "visible": false,
                            "type": "overlayControl",
                            "class": "",
                            "innerSubControls": [
                                {
                                    "name": "demoType",
                                    "label": "demoType",
                                    "class": "",
                                    "type": "",
                                    "coreControls": [
                                        {
                                            "name": "memberCheckbox",
                                            "label": "",
                                            "visibleLabel": true,
                                            "visible": true,
                                            "type": "checkbox",
                                            "value": false,
                                            "class": "col-lg-12"
                                        },
                                        {
                                            "name": "addOnSumInsured",
                                            "visibleLabel": false,
                                            "label": "Add On Sum Insured",
                                            "value": "",
                                            "type": "text"
                                        }
                                    ]
                                },
                                {
                                    "name": "doneButton",
                                    "type": "button",
                                    "displayOnly": true,
                                    "disabled": true,
                                    "method": "closeOverlay",
                                    "class": "col-12 col-xl-12 text-right"
                                }
                            ]
                        },
                        {
                            "name": "addOnId",
                            "label": "Add On Id",
                            "visibleLabel": false,
                            "value": "SCOP",
                            "type": "text",
                            "visible": false
                        },
                        {
                            "name": "premium",
                            "label": "Premium",
                            "visibleLabel": false,
                            "value": "5000000",
                            "type": "text",
                            "visible": false
                        },
                        {
                            "name": "optionalCoverName",
                            "label": "Optional Cover Name",
                            "visibleLabel": false,
                            "value": "Second Medical Opinion for listed Major Illness",
                            "type": "text",
                            "visible": false
                        },
                        {
                            "name": "optionalCoverValue",
                            "label": "Optional Cover Value",
                            "visibleLabel": false,
                            "value": "",
                            "type": "text",
                            "visible": false,
                            "class": "col-md-6"
                        },
                        {
                            "name": "changeMember",
                            "label": "Change Member",
                            "visibleLabel": false,
                            "value": "",
                            "type": "button",
                            "visible": true,
                            "class": "col-md-3",
                            "onChangeMethod": "showOverlay"
                        }
                    ]
                },
                {
                    "name": "annualScreening",
                    "label": "annualScreening",
                    "visibleLabel": false,
                    "visible": true,
                    "methodName": "insuredMembersForAddons",
                    "class": "col-md-4 acceptTermsCheck",
                    "type": "combinedCheckbox",
                    "subControls": [
                        {
                            "name": "addOnCover",
                            "visibleLabel": true,
                            "label": "Annual Screening Package",
                            "class": "col-md-6 acceptTermsCheck ah-opcovers",
                            "type": "checkbox",
                            "value": false,
                            "visible": true
                        },
                        {
                            "name": "addOnDetails",
                            "visible": false,
                            "type": "overlayControl",
                            "class": "",
                            "innerSubControls": [
                                {
                                    "name": "demoType",
                                    "label": "demoType",
                                    "class": "",
                                    "type": "",
                                    "coreControls": [
                                        {
                                            "name": "memberCheckbox",
                                            "label": "",
                                            "visibleLabel": true,
                                            "visible": true,
                                            "type": "checkbox",
                                            "value": false,
                                            "class": "col-lg-12"
                                        },
                                        {
                                            "name": "addOnSumInsured",
                                            "visibleLabel": false,
                                            "label": "Add On Sum Insured",
                                            "value": "",
                                            "type": "text"
                                        }
                                    ]
                                },
                                {
                                    "name": "doneButton",
                                    "type": "button",
                                    "displayOnly": true,
                                    "disabled": true,
                                    "method": "closeOverlay",
                                    "class": "col-12 col-xl-12 text-right"
                                }
                            ]
                        },
                        {
                            "name": "addOnId",
                            "label": "Add On Id",
                            "visibleLabel": false,
                            "value": "ANCANC",
                            "type": "text",
                            "visible": false
                        },
                        {
                            "name": "premium",
                            "label": "Premium",
                            "visibleLabel": false,
                            "value": "",
                            "type": "text",
                            "visible": false
                        },
                        {
                            "name": "optionalCoverName",
                            "label": "Optional Cover Name",
                            "visibleLabel": false,
                            "value": "Annual Screening",
                            "type": "text",
                            "visible": false
                        },
                        {
                            "name": "optionalCoverValue",
                            "label": "Optional Cover Value",
                            "visibleLabel": false,
                            "value": "",
                            "type": "text",
                            "visible": false,
                            "class": "col-md-6"
                        },
                        {
                            "name": "changeMember",
                            "label": "Change Member",
                            "visibleLabel": false,
                            "value": "",
                            "type": "button",
                            "visible": true,
                            "class": "col-md-3",
                            "onChangeMethod": "showOverlay"
                        }
                    ]
                },
                {
                    "name": "perClaim",
                    "label": "perClaimDeduct",
                    "visibleLabel": false,
                    "visible": true,
                    "methodName": "insuredMembersForAddons",
                    "class": "col-md-4 acceptTermsCheck",
                    "type": "combinedCheckbox",
                    "subControls": [
                        {
                            "name": "addOnCover",
                            "visibleLabel": true,
                            "label": "Per Claim Deductible Cover",
                            "class": "col-md-6 acceptTermsCheck ah-opcovers",
                            "type": "checkbox",
                            "value": false,
                            "visible": true
                        },
                        {
                            "name": "addOnDetails",
                            "visible": false,
                            "type": "overlayControl",
                            "class": "",
                            "innerSubControls": [
                                {
                                    "name": "demoType",
                                    "label": "demoType",
                                    "class": "",
                                    "type": "",
                                    "coreControls": [
                                        {
                                            "name": "memberCheckbox",
                                            "label": "",
                                            "visibleLabel": true,
                                            "visible": true,
                                            "type": "checkbox",
                                            "value": false,
                                            "class": "col-lg-12"
                                        },
                                        {
                                            "name": "addOnSumInsured",
                                            "visibleLabel": true,
                                            "label": "Sum Insured",
                                            "value": "",
                                            "type": "select",
                                            "options": [
                                                {
                                                    "name": "15000",
                                                    "label": "15000",
                                                    "value": 15000
                                                },
                                                {
                                                    "name": "25000",
                                                    "label": "25000",
                                                    "value": 25000
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    "name": "doneButton",
                                    "type": "button",
                                    "displayOnly": true,
                                    "disabled": true,
                                    "method": "closeOverlay",
                                    "class": "col-12 col-xl-12 text-right"
                                }
                            ]
                        },
                        {
                            "name": "addOnId",
                            "label": "Add On Id",
                            "visibleLabel": false,
                            "value": "PCDED",
                            "type": "text",
                            "visible": false
                        },
                        {
                            "name": "premium",
                            "label": "Premium",
                            "visibleLabel": false,
                            "value": "",
                            "type": "text",
                            "visible": false
                        },
                        {
                            "name": "optionalCoverName",
                            "label": "Optional Cover Name",
                            "visibleLabel": false,
                            "value": "Per Claim Deductible",
                            "type": "text",
                            "visible": false
                        },
                        {
                            "name": "optionalCoverValue",
                            "label": "Optional Cover Value",
                            "visibleLabel": false,
                            "value": "",
                            "type": "text",
                            "visible": false,
                            "class": "col-md-6"
                        },
                        {
                            "name": "changeMember",
                            "label": "Change Member",
                            "visibleLabel": false,
                            "value": "",
                            "type": "button",
                            "visible": true,
                            "class": "col-md-3",
                            "onChangeMethod": "showOverlay"
                        }
                    ]
                },
                {
                    "name": "preferredNetwork",
                    "label": "preferredNetwork",
                    "visibleLabel": false,
                    "visible": true,
                    "methodName": "insuredMembersForAddons",
                    "class": "col-md-4 acceptTermsCheck",
                    "type": "combinedCheckbox",
                    "subControls": [
                        {
                            "name": "addOnCover",
                            "visibleLabel": true,
                            "label": "Preferred Provider Network",
                            "class": "col-md-6 acceptTermsCheck ah-opcovers",
                            "type": "checkbox",
                            "value": false,
                            "visible": true
                        },
                        {
                            "name": "addOnDetails",
                            "visible": false,
                            "type": "overlayControl",
                            "class": "",
                            "innerSubControls": [
                                {
                                    "name": "demoType",
                                    "label": "demoType",
                                    "class": "",
                                    "type": "",
                                    "coreControls": [
                                        {
                                            "name": "memberCheckbox",
                                            "label": "",
                                            "visibleLabel": true,
                                            "visible": true,
                                            "type": "checkbox",
                                            "value": false,
                                            "class": "col-lg-12"
                                        },
                                        {
                                            "name": "addOnSumInsured",
                                            "visibleLabel": false,
                                            "label": "Add On Sum Insured",
                                            "value": "",
                                            "type": "text"
                                        }
                                    ]
                                },
                                {
                                    "name": "doneButton",
                                    "type": "button",
                                    "displayOnly": true,
                                    "disabled": true,
                                    "method": "closeOverlay",
                                    "class": "col-12 col-xl-12 text-right"
                                }
                            ]
                        },
                        {
                            "name": "addOnId",
                            "label": "Add On Id",
                            "visibleLabel": false,
                            "value": "PPNDISC",
                            "type": "text",
                            "visible": false
                        },
                        {
                            "name": "premium",
                            "label": "Premium",
                            "visibleLabel": false,
                            "value": "",
                            "type": "text",
                            "visible": false
                        },
                        {
                            "name": "optionalCoverName",
                            "label": "Optional Cover Name",
                            "visibleLabel": false,
                            "value": "Preferred Network",
                            "type": "text",
                            "visible": false
                        },
                        {
                            "name": "optionalCoverValue",
                            "label": "Optional Cover Value",
                            "visibleLabel": false,
                            "value": "",
                            "type": "text",
                            "visible": false,
                            "class": "col-md-6"
                        },
                        {
                            "name": "changeMember",
                            "label": "Change Member",
                            "visibleLabel": false,
                            "value": "",
                            "type": "button",
                            "visible": true,
                            "class": "col-md-3",
                            "onChangeMethod": "showOverlay"
                        }
                    ]
                },
                {
                    "name": "compassionate",
                    "label": "compassionateVisit",
                    "visibleLabel": false,
                    "visible": true,
                    "methodName": "insuredMembersForAddons",
                    "class": "col-md-4 acceptTermsCheck",
                    "type": "combinedCheckbox",
                    "subControls": [
                        {
                            "name": "addOnCover",
                            "visibleLabel": true,
                            "label": "Compassionate Visit",
                            "class": "col-md-6 acceptTermsCheck ah-opcovers",
                            "type": "checkbox",
                            "value": false,
                            "visible": true
                        },
                        {
                            "name": "addOnDetails",
                            "visible": false,
                            "type": "overlayControl",
                            "class": "",
                            "innerSubControls": [
                                {
                                    "name": "demoType",
                                    "label": "demoType",
                                    "class": "",
                                    "type": "",
                                    "coreControls": [
                                        {
                                            "name": "memberCheckbox",
                                            "label": "",
                                            "visibleLabel": true,
                                            "visible": true,
                                            "type": "checkbox",
                                            "value": false,
                                            "class": "col-lg-12"
                                        },
                                        {
                                            "name": "addOnSumInsured",
                                            "visibleLabel": false,
                                            "label": "Add On Sum Insured",
                                            "value": "",
                                            "type": "text"
                                        }
                                    ]
                                },
                                {
                                    "name": "doneButton",
                                    "type": "button",
                                    "displayOnly": true,
                                    "disabled": true,
                                    "method": "closeOverlay",
                                    "class": "col-12 col-xl-12 text-right"
                                }
                            ]
                        },
                        {
                            "name": "addOnId",
                            "label": "Add On Id",
                            "visibleLabel": false,
                            "value": "COMV",
                            "type": "text",
                            "visible": false
                        },
                        {
                            "name": "premium",
                            "label": "Premium",
                            "visibleLabel": false,
                            "value": "",
                            "type": "text",
                            "visible": false
                        },
                        {
                            "name": "optionalCoverName",
                            "label": "Optional Cover Name",
                            "visibleLabel": false,
                            "value": "Compassionate Visit",
                            "type": "text",
                            "visible": false
                        },
                        {
                            "name": "optionalCoverValue",
                            "label": "Optional Cover Value",
                            "visibleLabel": false,
                            "value": "",
                            "type": "text",
                            "visible": false,
                            "class": "col-md-6"
                        },
                        {
                            "name": "changeMember",
                            "label": "Change Member",
                            "visibleLabel": false,
                            "value": "",
                            "type": "button",
                            "visible": true,
                            "class": "col-md-3",
                            "onChangeMethod": "showOverlay"
                        }
                    ]
                },
                {
                    "name": "roomRentType",
                    "label": "roomRentType",
                    "visibleLabel": false,
                    "visible": true,
                    "methodName": "insuredMembersForAddons",
                    "class": "col-md-4 acceptTermsCheck",
                    "type": "combinedCheckbox",
                    "subControls": [
                        {
                            "name": "addOnCover",
                            "visibleLabel": true,
                            "label": "Room Rent Type Options",
                            "class": "col-md-6 acceptTermsCheck ah-opcovers",
                            "type": "checkbox",
                            "value": false,
                            "visible": true
                        },
                        {
                            "name": "addOnDetails",
                            "visible": false,
                            "type": "overlayControl",
                            "class": "",
                            "innerSubControls": [
                                {
                                    "name": "demoType",
                                    "label": "demoType",
                                    "class": "",
                                    "type": "",
                                    "coreControls": [
                                        {
                                            "name": "memberCheckbox",
                                            "label": "",
                                            "visibleLabel": true,
                                            "visible": true,
                                            "type": "checkbox",
                                            "value": false,
                                            "class": "col-lg-12"
                                        },
                                        {
                                            "name": "roomType",
                                            "visibleLabel": true,
                                            "label": "Room Type",
                                            "value": "",
                                            "type": "select",
                                            "options": [
                                                {
                                                    "name": "Single Private Room",
                                                    "label": "Single Private Room",
                                                    "value": "Single Private Room"
                                                },
                                                {
                                                    "name": "Shared Accomodation",
                                                    "label": "Shared Accomodation",
                                                    "value": "Shared Accomodation"
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    "name": "doneButton",
                                    "type": "button",
                                    "displayOnly": true,
                                    "disabled": true,
                                    "method": "closeOverlay",
                                    "class": "col-12 col-xl-12 text-right"
                                }
                            ]
                        },
                        {
                            "name": "addOnId",
                            "label": "Add On Id",
                            "visibleLabel": false,
                            "value": "RRTO",
                            "type": "text",
                            "visible": false
                        },
                        {
                            "name": "premium",
                            "label": "Premium",
                            "visibleLabel": false,
                            "value": "",
                            "type": "text",
                            "visible": false
                        },
                        {
                            "name": "optionalCoverName",
                            "label": "Optional Cover Name",
                            "visibleLabel": false,
                            "value": "Room Rent Type Options",
                            "type": "text",
                            "visible": false
                        },
                        {
                            "name": "optionalCoverValue",
                            "label": "Optional Cover Value",
                            "visibleLabel": false,
                            "value": "",
                            "type": "text",
                            "visible": false,
                            "class": "col-md-6"
                        },
                        {
                            "name": "changeMember",
                            "label": "Change Member",
                            "visibleLabel": false,
                            "value": "",
                            "type": "button",
                            "visible": true,
                            "class": "col-md-3",
                            "onChangeMethod": "showOverlay"
                        }
                    ]
                },
                {
                    "name": "cancerBooster",
                    "label": "cancerBooster",
                    "visibleLabel": false,
                    "visible": true,
                    "methodName": "insuredMembersForAddons",
                    "class": "col-md-4 acceptTermsCheck",
                    "type": "combinedCheckbox",
                    "subControls": [
                        {
                            "name": "addOnCover",
                            "visibleLabel": true,
                            "label": "Cancer Booster",
                            "class": "col-md-6 acceptTermsCheck ah-opcovers",
                            "type": "checkbox",
                            "value": false,
                            "visible": true
                        },
                        {
                            "name": "addOnDetails",
                            "visible": false,
                            "type": "overlayControl",
                            "class": "",
                            "innerSubControls": [
                                {
                                    "name": "demoType",
                                    "label": "demoType",
                                    "class": "",
                                    "type": "",
                                    "coreControls": [
                                        {
                                            "name": "memberCheckbox",
                                            "label": "",
                                            "visibleLabel": true,
                                            "visible": true,
                                            "type": "checkbox",
                                            "value": false,
                                            "class": "col-lg-12"
                                        },
                                        {
                                            "name": "addOnSumInsured",
                                            "visibleLabel": false,
                                            "label": "Add On Sum Insured",
                                            "value": "",
                                            "type": "text"
                                        }
                                    ]
                                },
                                {
                                    "name": "doneButton",
                                    "type": "button",
                                    "displayOnly": true,
                                    "disabled": true,
                                    "method": "closeOverlay",
                                    "class": "col-12 col-xl-12 text-right"
                                }
                            ]
                        },
                        {
                            "name": "addOnId",
                            "label": "Add On Id",
                            "visibleLabel": false,
                            "value": "CANC",
                            "type": "text",
                            "visible": false
                        },
                        {
                            "name": "premium",
                            "label": "Premium",
                            "visibleLabel": false,
                            "value": "",
                            "type": "text",
                            "visible": false
                        },
                        {
                            "name": "optionalCoverName",
                            "label": "Optional Cover Name",
                            "visibleLabel": false,
                            "value": "Cancer Booster",
                            "type": "text",
                            "visible": false
                        },
                        {
                            "name": "optionalCoverValue",
                            "label": "Optional Cover Value",
                            "visibleLabel": false,
                            "value": "",
                            "type": "text",
                            "visible": false,
                            "class": "col-md-6"
                        },
                        {
                            "name": "changeMember",
                            "label": "Change Member",
                            "visibleLabel": false,
                            "value": "",
                            "type": "button",
                            "visible": true,
                            "class": "col-md-3",
                            "onChangeMethod": "showOverlay"
                        }
                    ]
                },
                {
                    "name": "hlthMeter",
                    "label": "hlthMeter",
                    "visibleLabel": false,
                    "visible": true,
                    "methodName": "insuredMembersForAddons",
                    "class": "col-md-4 acceptTermsCheck",
                    "type": "combinedCheckbox",
                    "subControls": [
                        {
                            "name": "addOnCover",
                            "visibleLabel": true,
                            "label": "HLTH Meter",
                            "class": "col-md-6 acceptTermsCheck ah-opcovers",
                            "type": "checkbox",
                            "value": false,
                            "visible": true
                        },
                        {
                            "name": "addOnDetails",
                            "visible": false,
                            "type": "overlayControl",
                            "class": "",
                            "innerSubControls": [
                                {
                                    "name": "demoType",
                                    "label": "demoType",
                                    "class": "",
                                    "type": "",
                                    "coreControls": [
                                        {
                                            "name": "memberCheckbox",
                                            "label": "",
                                            "visibleLabel": true,
                                            "visible": true,
                                            "type": "checkbox",
                                            "value": false,
                                            "class": "col-lg-12"
                                        },
                                        {
                                            "name": "addOnSumInsured",
                                            "visibleLabel": false,
                                            "label": "Add On Sum Insured",
                                            "value": "",
                                            "type": "text"
                                        }
                                    ]
                                },
                                {
                                    "name": "doneButton",
                                    "type": "button",
                                    "displayOnly": true,
                                    "disabled": true,
                                    "method": "closeOverlay",
                                    "class": "col-12 col-xl-12 text-right"
                                }
                            ]
                        },
                        {
                            "name": "addOnId",
                            "label": "Add On Id",
                            "visibleLabel": false,
                            "value": "HLTHMTR",
                            "type": "text",
                            "visible": false
                        },
                        {
                            "name": "premium",
                            "label": "Premium",
                            "visibleLabel": false,
                            "value": "",
                            "type": "text",
                            "visible": false
                        },
                        {
                            "name": "optionalCoverName",
                            "label": "Optional Cover Name",
                            "visibleLabel": false,
                            "value": "HLTH Meter",
                            "type": "text",
                            "visible": false
                        },
                        {
                            "name": "optionalCoverValue",
                            "label": "Optional Cover Value",
                            "visibleLabel": false,
                            "value": "",
                            "type": "text",
                            "visible": false,
                            "class": "col-md-6"
                        },
                        {
                            "name": "changeMember",
                            "label": "Change Member",
                            "visibleLabel": false,
                            "value": "",
                            "type": "button",
                            "visible": true,
                            "class": "col-md-3",
                            "onChangeMethod": "showOverlay"
                        }
                    ]
                },
                {
                    "name": "chronicCare",
                    "label": "Chronic Care",
                    "visibleLabel": false,
                    "visible": true,
                    "methodName": "insuredMembersForAddons",
                    "class": "col-md-4 acceptTermsCheck",
                    "type": "combinedCheckbox",
                    "subControls": [
                        {
                            "name": "addOnCover",
                            "visibleLabel": true,
                            "label": "Chronic Care",
                            "class": "col-md-6 acceptTermsCheck ah-opcovers",
                            "type": "checkbox",
                            "value": false,
                            "visible": true
                        },
                        {
                            "name": "addOnDetails",
                            "visible": false,
                            "type": "overlayControl",
                            "class": "",
                            "conditionCheck": true,
                            "innerSubControls": [
                                {
                                    "name": "demoType",
                                    "label": "demoType",
                                    "class": "",
                                    "type": "",
                                    "coreControls": [
                                        {
                                            "name": "memberCheckbox",
                                            "label": "",
                                            "visibleLabel": true,
                                            "visible": true,
                                            "type": "checkbox",
                                            "value": false,
                                            "class": "col-lg-12",
                                            "dependentControls": [
                                                "diabetes",
                                                "hypertension",
                                                "asthma",
                                                "hyperlipidemia",
                                                "copd",
                                                "obesity",
                                                "corneryDisease"
                                            ],
                                            "conditionCheck": true
                                        },
                                        {
                                            "name": "diabetes",
                                            "label": "Diabetes",
                                            "visibleLabel": true,
                                            "visible": false,
                                            "type": "checkbox",
                                            "value": false,
                                            "class": "col-lg-6",
                                            "dependentControls": [
                                                "diabetesQuestion"
                                            ]
                                        },
                                        {
                                            "name": "diabetesQuestion",
                                            "label": "Diabetes Question",
                                            "class": "col-md-12",
                                            "type": "questionnaire",
                                            "visible": false,
                                            "innerControls": [
                                                {
                                                    "name": "diseaseName",
                                                    "label": "Disease Name",
                                                    "visibleLabel": true,
                                                    "value": "",
                                                    "class": "col-md-6",
                                                    "visible": true,
                                                    "type": "text",
                                                    "validators": [
                                                        {
                                                            "message": "This field is required.",
                                                            "required": true,
                                                            "validatorName": "required"
                                                        }
                                                    ]
                                                },
                                                {
                                                    "name": "treatmentDetails",
                                                    "label": "Treatment Details",
                                                    "visibleLabel": true,
                                                    "type": "text",
                                                    "value": "",
                                                    "class": "col-md-6",
                                                    "visible": true,
                                                    "validators": [
                                                        {
                                                            "message": "This field is required.",
                                                            "required": true,
                                                            "validatorName": "required"
                                                        }
                                                    ]
                                                },
                                                {
                                                    "name": "dateOfDiagnosis",
                                                    "label": "Date of Diagnosis",
                                                    "visibleLabel": true,
                                                    "type": "date",
                                                    "value": "",
                                                    "class": "col-md-6",
                                                    "visible": true
                                                },
                                                {
                                                    "name": "lastConsultationDate",
                                                    "label": "Last Consultation Date",
                                                    "visibleLabel": true,
                                                    "type": "date",
                                                    "value": "",
                                                    "class": "col-md-6",
                                                    "visible": true,
                                                    "validators": [
                                                        {
                                                            "message": "This field is required.",
                                                            "required": true,
                                                            "validatorName": "required"
                                                        }
                                                    ]
                                                },
                                                {
                                                    "name": "disability",
                                                    "label": "Disability %",
                                                    "visibleLabel": true,
                                                    "type": "number",
                                                    "value": "",
                                                    "class": "col-md-6",
                                                    "visible": true,
                                                    "validators": [
                                                        {
                                                            "message": "This field is required.",
                                                            "required": true,
                                                            "validatorName": "required"
                                                        }
                                                    ]
                                                },
                                                {
                                                    "name": "nameOfSurgery",
                                                    "label": "Name of Surgery (if any)",
                                                    "visibleLabel": true,
                                                    "type": "text",
                                                    "value": "",
                                                    "class": "col-md-6",
                                                    "visible": true,
                                                    "validators": [
                                                        {
                                                            "message": "This field is required.",
                                                            "required": true,
                                                            "validatorName": "required"
                                                        }
                                                    ]
                                                },
                                                {
                                                    "name": "periodOfHospitalization",
                                                    "label": "Period of hospitalization",
                                                    "visibleLabel": true,
                                                    "type": "text",
                                                    "value": "",
                                                    "class": "col-md-6",
                                                    "visible": true,
                                                    "validators": [
                                                        {
                                                            "message": "This field is required.",
                                                            "required": true,
                                                            "validatorName": "required"
                                                        }
                                                    ]
                                                },
                                                {
                                                    "name": "anyOtherInformation",
                                                    "label": "Any Other information",
                                                    "visibleLabel": true,
                                                    "type": "text",
                                                    "value": "",
                                                    "class": "col-md-6",
                                                    "visible": true,
                                                    "validators": [
                                                        {
                                                            "message": "This field is required.",
                                                            "required": true,
                                                            "validatorName": "required"
                                                        }
                                                    ]
                                                }
                                            ]
                                        },
                                        {
                                            "name": "hypertension",
                                            "label": "Hypertension",
                                            "visibleLabel": true,
                                            "visible": false,
                                            "type": "checkbox",
                                            "value": false,
                                            "class": "col-lg-6",
                                            "dependentControls": [
                                                "hypertensionQuestion"
                                            ]
                                        },
                                        {
                                            "name": "hypertensionQuestion",
                                            "label": "Hypertension Question",
                                            "class": "col-md-12",
                                            "type": "questionnaire",
                                            "visible": false,
                                            "innerControls": [
                                                {
                                                    "name": "diseaseName",
                                                    "label": "Disease Name",
                                                    "visibleLabel": true,
                                                    "value": "",
                                                    "class": "col-md-6",
                                                    "visible": true,
                                                    "type": "text"
                                                },
                                                {
                                                    "name": "treatmentDetails",
                                                    "label": "Treatment Details",
                                                    "visibleLabel": true,
                                                    "type": "text",
                                                    "value": "",
                                                    "class": "col-md-6",
                                                    "visible": true
                                                },
                                                {
                                                    "name": "dateOfDiagnosis",
                                                    "label": "Date of Diagnosis",
                                                    "visibleLabel": true,
                                                    "type": "date",
                                                    "value": "",
                                                    "class": "col-md-6",
                                                    "visible": true
                                                },
                                                {
                                                    "name": "lastConsultationDate",
                                                    "label": "Last Consultation Date",
                                                    "visibleLabel": true,
                                                    "type": "date",
                                                    "value": "",
                                                    "class": "col-md-6",
                                                    "visible": true
                                                },
                                                {
                                                    "name": "disability",
                                                    "label": "Disability %",
                                                    "visibleLabel": true,
                                                    "type": "number",
                                                    "value": "",
                                                    "class": "col-md-6",
                                                    "visible": true
                                                },
                                                {
                                                    "name": "nameOfSurgery",
                                                    "label": "Name of Surgery (if any)",
                                                    "visibleLabel": true,
                                                    "type": "text",
                                                    "value": "",
                                                    "class": "col-md-6",
                                                    "visible": true
                                                },
                                                {
                                                    "name": "periodOfHospitalization",
                                                    "label": "Period of hospitalization",
                                                    "visibleLabel": true,
                                                    "type": "text",
                                                    "value": "",
                                                    "class": "col-md-6",
                                                    "visible": true
                                                },
                                                {
                                                    "name": "anyOtherInformation",
                                                    "label": "Any Other information",
                                                    "visibleLabel": true,
                                                    "type": "text",
                                                    "value": "",
                                                    "class": "col-md-6",
                                                    "visible": true
                                                }
                                            ]
                                        },
                                        {
                                            "name": "asthma",
                                            "label": "Asthma",
                                            "visibleLabel": true,
                                            "visible": false,
                                            "type": "checkbox",
                                            "value": false,
                                            "class": "col-lg-6",
                                            "dependentControls": [
                                                "asthmaQuestion"
                                            ]
                                        },
                                        {
                                            "name": "asthmaQuestion",
                                            "label": "Asthma Question",
                                            "class": "col-md-12",
                                            "type": "questionnaire",
                                            "visible": false,
                                            "innerControls": [
                                                {
                                                    "name": "diseaseName",
                                                    "label": "Disease Name",
                                                    "visibleLabel": true,
                                                    "value": "",
                                                    "class": "col-md-6",
                                                    "visible": true,
                                                    "type": "text"
                                                },
                                                {
                                                    "name": "treatmentDetails",
                                                    "label": "Treatment Details",
                                                    "visibleLabel": true,
                                                    "type": "text",
                                                    "value": "",
                                                    "class": "col-md-6",
                                                    "visible": true
                                                },
                                                {
                                                    "name": "dateOfDiagnosis",
                                                    "label": "Date of Diagnosis",
                                                    "visibleLabel": true,
                                                    "type": "date",
                                                    "value": "",
                                                    "class": "col-md-6",
                                                    "visible": true
                                                },
                                                {
                                                    "name": "lastConsultationDate",
                                                    "label": "Last Consultation Date",
                                                    "visibleLabel": true,
                                                    "type": "date",
                                                    "value": "",
                                                    "class": "col-md-6",
                                                    "visible": true
                                                },
                                                {
                                                    "name": "disability",
                                                    "label": "Disability %",
                                                    "visibleLabel": true,
                                                    "type": "number",
                                                    "value": "",
                                                    "class": "col-md-6",
                                                    "visible": true
                                                },
                                                {
                                                    "name": "nameOfSurgery",
                                                    "label": "Name of Surgery (if any)",
                                                    "visibleLabel": true,
                                                    "type": "text",
                                                    "value": "",
                                                    "class": "col-md-6",
                                                    "visible": true
                                                },
                                                {
                                                    "name": "periodOfHospitalization",
                                                    "label": "Period of hospitalization",
                                                    "visibleLabel": true,
                                                    "type": "text",
                                                    "value": "",
                                                    "class": "col-md-6",
                                                    "visible": true
                                                },
                                                {
                                                    "name": "anyOtherInformation",
                                                    "label": "Any Other information",
                                                    "visibleLabel": true,
                                                    "type": "text",
                                                    "value": "",
                                                    "class": "col-md-6",
                                                    "visible": true
                                                }
                                            ]
                                        },
                                        {
                                            "name": "hyperlipidemia",
                                            "label": "Hyperlipidemia",
                                            "visibleLabel": true,
                                            "visible": false,
                                            "type": "checkbox",
                                            "value": false,
                                            "class": "col-lg-6",
                                            "dependentControls": [
                                                "hyperlipidemiaQuestion"
                                            ]
                                        },
                                        {
                                            "name": "hyperlipidemiaQuestion",
                                            "label": "Hyperlipidemia Question",
                                            "class": "col-md-12",
                                            "type": "questionnaire",
                                            "visible": false,
                                            "innerControls": [
                                                {
                                                    "name": "diseaseName",
                                                    "label": "Disease Name",
                                                    "visibleLabel": true,
                                                    "value": "",
                                                    "class": "col-md-6",
                                                    "visible": true,
                                                    "type": "text"
                                                },
                                                {
                                                    "name": "treatmentDetails",
                                                    "label": "Treatment Details",
                                                    "visibleLabel": true,
                                                    "type": "text",
                                                    "value": "",
                                                    "class": "col-md-6",
                                                    "visible": true
                                                },
                                                {
                                                    "name": "dateOfDiagnosis",
                                                    "label": "Date of Diagnosis",
                                                    "visibleLabel": true,
                                                    "type": "date",
                                                    "value": "",
                                                    "class": "col-md-6",
                                                    "visible": true
                                                },
                                                {
                                                    "name": "lastConsultationDate",
                                                    "label": "Last Consultation Date",
                                                    "visibleLabel": true,
                                                    "type": "date",
                                                    "value": "",
                                                    "class": "col-md-6",
                                                    "visible": true
                                                },
                                                {
                                                    "name": "disability",
                                                    "label": "Disability %",
                                                    "visibleLabel": true,
                                                    "type": "number",
                                                    "value": "",
                                                    "class": "col-md-6",
                                                    "visible": true
                                                },
                                                {
                                                    "name": "nameOfSurgery",
                                                    "label": "Name of Surgery (if any)",
                                                    "visibleLabel": true,
                                                    "type": "text",
                                                    "value": "",
                                                    "class": "col-md-6",
                                                    "visible": true
                                                },
                                                {
                                                    "name": "periodOfHospitalization",
                                                    "label": "Period of hospitalization",
                                                    "visibleLabel": true,
                                                    "type": "text",
                                                    "value": "",
                                                    "class": "col-md-6",
                                                    "visible": true
                                                },
                                                {
                                                    "name": "anyOtherInformation",
                                                    "label": "Any Other information",
                                                    "visibleLabel": true,
                                                    "type": "text",
                                                    "value": "",
                                                    "class": "col-md-6",
                                                    "visible": true
                                                }
                                            ]
                                        },
                                        {
                                            "name": "copd",
                                            "label": "COPD",
                                            "visibleLabel": true,
                                            "visible": false,
                                            "type": "checkbox",
                                            "value": false,
                                            "class": "col-lg-6",
                                            "dependentControls": [
                                                "copdQuestion"
                                            ]
                                        },
                                        {
                                            "name": "copdQuestion",
                                            "label": "COPD Question",
                                            "class": "col-md-12",
                                            "type": "questionnaire",
                                            "visible": false,
                                            "innerControls": [
                                                {
                                                    "name": "diseaseName",
                                                    "label": "Disease Name",
                                                    "visibleLabel": true,
                                                    "value": "",
                                                    "class": "col-md-6",
                                                    "visible": true,
                                                    "type": "text"
                                                },
                                                {
                                                    "name": "treatmentDetails",
                                                    "label": "Treatment Details",
                                                    "visibleLabel": true,
                                                    "type": "text",
                                                    "value": "",
                                                    "class": "col-md-6",
                                                    "visible": true
                                                },
                                                {
                                                    "name": "dateOfDiagnosis",
                                                    "label": "Date of Diagnosis",
                                                    "visibleLabel": true,
                                                    "type": "date",
                                                    "value": "",
                                                    "class": "col-md-6",
                                                    "visible": true
                                                },
                                                {
                                                    "name": "lastConsultationDate",
                                                    "label": "Last Consultation Date",
                                                    "visibleLabel": true,
                                                    "type": "date",
                                                    "value": "",
                                                    "class": "col-md-6",
                                                    "visible": true
                                                },
                                                {
                                                    "name": "disability",
                                                    "label": "Disability %",
                                                    "visibleLabel": true,
                                                    "type": "number",
                                                    "value": "",
                                                    "class": "col-md-6",
                                                    "visible": true
                                                },
                                                {
                                                    "name": "nameOfSurgery",
                                                    "label": "Name of Surgery (if any)",
                                                    "visibleLabel": true,
                                                    "type": "text",
                                                    "value": "",
                                                    "class": "col-md-6",
                                                    "visible": true
                                                },
                                                {
                                                    "name": "periodOfHospitalization",
                                                    "label": "Period of hospitalization",
                                                    "visibleLabel": true,
                                                    "type": "text",
                                                    "value": "",
                                                    "class": "col-md-6",
                                                    "visible": true
                                                },
                                                {
                                                    "name": "anyOtherInformation",
                                                    "label": "Any Other information",
                                                    "visibleLabel": true,
                                                    "type": "text",
                                                    "value": "",
                                                    "class": "col-md-6",
                                                    "visible": true
                                                }
                                            ]
                                        },
                                        {
                                            "name": "obesity",
                                            "label": "Obesity",
                                            "visibleLabel": true,
                                            "visible": false,
                                            "type": "checkbox",
                                            "value": false,
                                            "class": "col-lg-6",
                                            "dependentControls": [
                                                "obesityQuestion"
                                            ]
                                        },
                                        {
                                            "name": "obesityQuestion",
                                            "label": "Obesity Question",
                                            "class": "col-md-12",
                                            "type": "questionnaire",
                                            "visible": false,
                                            "innerControls": [
                                                {
                                                    "name": "diseaseName",
                                                    "label": "Disease Name",
                                                    "visibleLabel": true,
                                                    "value": "",
                                                    "class": "col-md-6",
                                                    "visible": true,
                                                    "type": "text"
                                                },
                                                {
                                                    "name": "treatmentDetails",
                                                    "label": "Treatment Details",
                                                    "visibleLabel": true,
                                                    "type": "text",
                                                    "value": "",
                                                    "class": "col-md-6",
                                                    "visible": true
                                                },
                                                {
                                                    "name": "dateOfDiagnosis",
                                                    "label": "Date of Diagnosis",
                                                    "visibleLabel": true,
                                                    "type": "date",
                                                    "value": "",
                                                    "class": "col-md-6",
                                                    "visible": true
                                                },
                                                {
                                                    "name": "lastConsultationDate",
                                                    "label": "Last Consultation Date",
                                                    "visibleLabel": true,
                                                    "type": "date",
                                                    "value": "",
                                                    "class": "col-md-6",
                                                    "visible": true
                                                },
                                                {
                                                    "name": "disability",
                                                    "label": "Disability %",
                                                    "visibleLabel": true,
                                                    "type": "number",
                                                    "value": "",
                                                    "class": "col-md-6",
                                                    "visible": true
                                                },
                                                {
                                                    "name": "nameOfSurgery",
                                                    "label": "Name of Surgery (if any)",
                                                    "visibleLabel": true,
                                                    "type": "text",
                                                    "value": "",
                                                    "class": "col-md-6",
                                                    "visible": true
                                                },
                                                {
                                                    "name": "periodOfHospitalization",
                                                    "label": "Period of hospitalization",
                                                    "visibleLabel": true,
                                                    "type": "text",
                                                    "value": "",
                                                    "class": "col-md-6",
                                                    "visible": true
                                                },
                                                {
                                                    "name": "anyOtherInformation",
                                                    "label": "Any Other information",
                                                    "visibleLabel": true,
                                                    "type": "text",
                                                    "value": "",
                                                    "class": "col-md-6",
                                                    "visible": true
                                                }
                                            ]
                                        },
                                        {
                                            "name": "corneryDisease",
                                            "label": "Coronary Artery Disease (PTCA done prior to 1 year)",
                                            "visibleLabel": true,
                                            "visible": false,
                                            "type": "checkbox",
                                            "value": false,
                                            "class": "col-lg-6",
                                            "dependentControls": [
                                                "corneryDiseaseQuestion"
                                            ]
                                        },
                                        {
                                            "name": "corneryDiseaseQuestion",
                                            "label": "Cornery Disease Question",
                                            "class": "col-md-12",
                                            "type": "questionnaire",
                                            "visible": false,
                                            "innerControls": [
                                                {
                                                    "name": "diseaseName",
                                                    "label": "Disease Name",
                                                    "visibleLabel": true,
                                                    "value": "",
                                                    "class": "col-md-6",
                                                    "visible": true,
                                                    "type": "text"
                                                },
                                                {
                                                    "name": "treatmentDetails",
                                                    "label": "Treatment Details",
                                                    "visibleLabel": true,
                                                    "type": "text",
                                                    "value": "",
                                                    "class": "col-md-6",
                                                    "visible": true
                                                },
                                                {
                                                    "name": "dateOfDiagnosis",
                                                    "label": "Date of Diagnosis",
                                                    "visibleLabel": true,
                                                    "type": "date",
                                                    "value": "",
                                                    "class": "col-md-6",
                                                    "visible": true
                                                },
                                                {
                                                    "name": "lastConsultationDate",
                                                    "label": "Last Consultation Date",
                                                    "visibleLabel": true,
                                                    "type": "date",
                                                    "value": "",
                                                    "class": "col-md-6",
                                                    "visible": true
                                                },
                                                {
                                                    "name": "disability",
                                                    "label": "Disability %",
                                                    "visibleLabel": true,
                                                    "type": "number",
                                                    "value": "",
                                                    "class": "col-md-6",
                                                    "visible": true
                                                },
                                                {
                                                    "name": "nameOfSurgery",
                                                    "label": "Name of Surgery (if any)",
                                                    "visibleLabel": true,
                                                    "type": "text",
                                                    "value": "",
                                                    "class": "col-md-6",
                                                    "visible": true
                                                },
                                                {
                                                    "name": "periodOfHospitalization",
                                                    "label": "Period of hospitalization",
                                                    "visibleLabel": true,
                                                    "type": "text",
                                                    "value": "",
                                                    "class": "col-md-6",
                                                    "visible": true
                                                },
                                                {
                                                    "name": "anyOtherInformation",
                                                    "label": "Any Other information",
                                                    "visibleLabel": true,
                                                    "type": "text",
                                                    "value": "",
                                                    "class": "col-md-6",
                                                    "visible": true
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    "name": "doneButton",
                                    "type": "button",
                                    "displayOnly": true,
                                    "disabled": true,
                                    "method": "closeOverlay",
                                    "class": "col-12 col-xl-12 text-right"
                                }
                            ]
                        },
                        {
                            "name": "addOnId",
                            "label": "Add On Id",
                            "visibleLabel": false,
                            "value": "CHRHSPT",
                            "type": "text",
                            "visible": false
                        },
                        {
                            "name": "premium",
                            "label": "Premium",
                            "visibleLabel": false,
                            "value": "",
                            "type": "text",
                            "visible": false
                        },
                        {
                            "name": "optionalCoverName",
                            "label": "Optional Cover Name",
                            "visibleLabel": false,
                            "value": "Chronic Care Cover",
                            "type": "text",
                            "visible": false
                        },
                        {
                            "name": "optionalCoverValue",
                            "label": "Optional Cover Value",
                            "visibleLabel": false,
                            "value": "",
                            "type": "text",
                            "visible": false,
                            "class": "col-md-6"
                        },
                        {
                            "name": "changeMember",
                            "label": "Change Member",
                            "visibleLabel": false,
                            "value": "",
                            "type": "button",
                            "visible": true,
                            "class": "col-md-3",
                            "onChangeMethod": "showOverlay"
                        }
                    ]
                }
            ]
        },
        {
            "sectionTitle": "Health Add On",
            "visible": true,
            "visibleLabel": true,
            "class": "section-title",
            "formControls": [
                {
                    "name": "vaccineCover",
                    "label": "vaccineCover",
                    "visibleLabel": false,
                    "visible": true,
                    "methodName": "insuredMembersForAddons",
                    "class": "col-md-4 acceptTermsCheck",
                    "type": "combinedCheckbox",
                    "subControls": [
                        {
                            "name": "addOnCover",
                            "visibleLabel": true,
                            "label": "Vaccine Cover",
                            "class": "col-md-6 acceptTermsCheck ah-opcovers",
                            "type": "checkbox",
                            "value": false,
                            "visible": true
                        },
                        {
                            "name": "addOnDetails",
                            "visible": false,
                            "type": "overlayControl",
                            "class": "",
                            "innerSubControls": [
                                {
                                    "name": "demoType",
                                    "label": "demoType",
                                    "class": "",
                                    "type": "",
                                    "coreControls": [
                                        {
                                            "name": "memberCheckbox",
                                            "label": "",
                                            "visibleLabel": true,
                                            "visible": true,
                                            "type": "checkbox",
                                            "value": false,
                                            "class": "col-lg-12"
                                        },
                                        {
                                            "name": "addOnSumInsured",
                                            "visibleLabel": true,
                                            "label": "Sum Insured",
                                            "value": "",
                                            "type": "select",
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
                                    "name": "doneButton",
                                    "type": "button",
                                    "displayOnly": true,
                                    "disabled": true,
                                    "method": "closeOverlay",
                                    "class": "col-12 col-xl-12 text-right"
                                }
                            ]
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
                            "name": "premium",
                            "label": "Premium",
                            "visibleLabel": false,
                            "value": "",
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
                            "value": "",
                            "type": "text",
                            "visible": false,
                            "class": "col-md-6"
                        },
                        {
                            "name": "changeMember",
                            "label": "Change Member",
                            "visibleLabel": false,
                            "value": "",
                            "type": "button",
                            "visible": true,
                            "class": "col-md-3",
                            "onChangeMethod": "showOverlay"
                        }
                    ]
                },
                {
                    "name": "teleOPD",
                    "label": "teleOPDConsult",
                    "visibleLabel": false,
                    "visible": true,
                    "methodName": "insuredMembersForAddons",
                    "class": "col-md-4 acceptTermsCheck",
                    "type": "combinedCheckbox",
                    "subControls": [
                        {
                            "name": "addOnCover",
                            "visibleLabel": true,
                            "label": "Tele-OPD Consultation",
                            "class": "col-md-6 acceptTermsCheck ah-opcovers",
                            "type": "checkbox",
                            "value": false,
                            "visible": true
                        },
                        {
                            "name": "addOnDetails",
                            "visible": false,
                            "type": "overlayControl",
                            "class": "",
                            "innerSubControls": [
                                {
                                    "name": "demoType",
                                    "label": "demoType",
                                    "class": "",
                                    "type": "",
                                    "coreControls": [
                                        {
                                            "name": "memberCheckbox",
                                            "label": "",
                                            "visibleLabel": true,
                                            "visible": true,
                                            "type": "checkbox",
                                            "value": false,
                                            "class": "col-lg-12"
                                        },
                                        {
                                            "name": "addOnSumInsured",
                                            "visibleLabel": false,
                                            "label": "Add On Sum Insured",
                                            "value": "",
                                            "type": "text"
                                        }
                                    ]
                                },
                                {
                                    "name": "doneButton",
                                    "type": "button",
                                    "displayOnly": true,
                                    "disabled": true,
                                    "method": "closeOverlay",
                                    "class": "col-12 col-xl-12 text-right"
                                }
                            ]
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
                            "name": "premium",
                            "label": "Premium",
                            "visibleLabel": false,
                            "value": "",
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
                            "value": "",
                            "type": "text",
                            "visible": false,
                            "class": "col-md-6"
                        },
                        {
                            "name": "changeMember",
                            "label": "Change Member",
                            "visibleLabel": false,
                            "value": "",
                            "type": "button",
                            "visible": true,
                            "class": "col-md-3",
                            "onChangeMethod": "showOverlay"
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
                    "name": "next",
                    "label": "Next",
                    "visibleLabel": false,
                    "visible": true,
                    "type": "button",
                    "class": "col-12 col-md-6 col-lg-2 next-btn",
                    "methodName": "onSubmit"
                },
                {
                    "name": "recalculate",
                    "label": "Re-calculate",
                    "visibleLabel": false,
                    "visible": false,
                    "type": "button",
                    "class": "col-12 col-md-6 col-lg-2 next-btn",
                    "methodName": "getPremiumAmount"
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