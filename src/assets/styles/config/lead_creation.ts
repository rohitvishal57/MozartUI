export const lead_creation = {
    "formTitle": "LEAD CREATION",
    "saveBtnTitle": "Save",
    "prevBtnTitle": "",
    "resetBtnTitle": "Reset",
    "themeFile": "ABHI.css",
    "formSections": [
        {
            "sectionTitle": "Lead Details",
            "visible": true,
            "class": "section-title",
            "formControls": [
                {
                    "name": "leadFirstName",
                    "label": "First Name",
                    "visible":true,
                    "visibleLabel": true,
                    "type": "text",
                    "value": "",
                    "class": "col-md-6",
                    "validators": [
                        {
                            "validatorName": "required",
                            "required": true,
                            "message": "First Name is required field."
                        },
                        {
                            "validatorName": "pattern",
                            "pattern": "^[a-zA-Z]+$",
                            "message": "Name is not valid"
                        }
                    ]
                },
                {
                    "name": "leadMiddleName",
                    "label": "Middle Name",
                    "visible":true,
                    "visibleLabel": true,
                    "type": "text",
                    "value": "",
                    "class": "col-md-6",
                    "validators": [
                        {
                            "validatorName": "required",
                            "required": true,
                            "message": "Middle Name is required field."
                        },
                        {
                            "validatorName": "pattern",
                            "pattern": "^[a-zA-Z]+$",
                            "message": "Middle Name is not valid"
                        }
                    ]
                },
                {
                    "name": "leadLastName",
                    "label": "Last Name",
                    "visible":true,
                    "visibleLabel": true,
                    "type": "text",
                    "value": "",
                    "class": "col-md-6",
                    "validators": [
                        {
                            "validatorName": "required",
                            "required": true,
                            "message": "Last Name is required field."
                        },
                        {
                            "validatorName": "pattern",
                            "pattern": "^[a-zA-Z]+$",
                            "message": "Last Name is not valid"
                        }
                    ]
                },
                {
                    "name": "leadEmailId",
                    "label": "Email Id",
                    "visible":true,
                    "visibleLabel": true,
                    "type": "text",
                    "value": "",
                    "class": "col-md-6",
                    "validators": [
                        {
                            "validatorName": "required",
                            "required": true,
                            "message": "Email Id is required field."
                        },
                        {
                            "validatorName": "pattern",
                            "pattern": "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$",
                            "message": "Email Id is not valid"
                        }
                    ]
                },
                {
                    "name": "leadMobileNo",
                    "label": "Mobile Number",
                    "visibleLabel": true,
                    "visible":true,
                    "type": "text",
                    "value": "",
                    "class": "col-md-6",
                    "validators": [
                        {
                            "validatorName": "required",
                            "required": true,
                            "message": "Mobile No is required field."
                        },
                        {
                            "validatorName": "pattern",
                            "pattern": "^[6-9]\\d{9}$",
                            "message": "Mobile No is not valid"
                        }
                    ]
                }
            ]
        }
    ]
}