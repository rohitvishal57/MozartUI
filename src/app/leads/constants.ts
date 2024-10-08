export class Constants {

    public static mobileViewWidth = '1100px'

    public static LOGIN = 'login';
    public static CREATELEAD = 'createlead';
    public static CREATEBULKLEAD = 'createbulklead';
    public static MANAGELEAD = 'managelead';
    public static CAMPAIGNMANAGMENT = 'campaignmanagment';
    public static CREATECAMP = 'createCamp';
    public static CALENDER = 'calender';
    public static MANUALLEAD = 'manuallead';
    public static ASSIGNEEMAPPING = 'assigneemapping';
    public static SEARCHRESULT = 'search-result';
    public static CREATERULE = 'create-rule';
    public static create = 'create';
    public static UPLOADLEAD = 'uploadlead';

    public static navList = [
        { name: 'View Lead', url: '/' + Constants.MANAGELEAD, img: 'icon-manage-lead pr-15', screenName: 'MANAGE_LEAD' },
        // + '/' + Constants.create
        { name: 'Create Lead', url: '/' + Constants.MANUALLEAD, img: 'icon-create-lead pr-15', screenName: 'CREATE_LEAD' },
        { name: 'Upload Lead', url: '/' + Constants.UPLOADLEAD, img: 'icon-upload-lead pr-15', screenName: 'IMPORT_BULK_FILE' },

        { name: 'Campaigns', url: '/campaignmanagment', img: 'icon-announcement pr-15', screenName: 'CAMPAIGN_MANAGMENT' },
        { name: 'Calender', url: '/calender', img: 'icon-calendar2 pr-15', screenName: 'CALENDER' },
    ];

    public static dynamicFormServerConstant = {
        dropdown: 'dropdown',
        radiobutton: 'radio',
        date: 'date',
        checkbox: 'checkbox',
        textbox: 'text',
        number: 'number',
        phoneGroup: 'Phone',
        emailGroup: 'Email',
        addressGroup: 'address',
        searchableAsynInput: 'searchabledropdown',
        formTemplateCheckbox: 'formTemplateCheckbox',
        key: 'fieldProperty',
        disabled: 'disabled',
        controlType: 'fieldType',
        referenceLeadFields: 'referenceLeadFields',
        fieldGroups: 'fieldGroups',
        formName: 'name',
        mobile: 'mobile',
    };
    public static mathOprOptionsConstant = {
        mathOprOptions: [
            {
              key: '=',
              value: 'Equal to'
            },
            {
              key: '>',
              value: 'Greater than'
            },
            {
              key: '<',
              value: 'Less than'
            },
            {
              key: '>=',
              value: 'Greater than or equal to'
            },
            {
              key: '<=',
              value: 'Less than or equal to'
            },
            {
              key: '<>',
              value: 'Not equal to'
            },
          ]
    }

    public static tempMap = {
        GRPPERSONALDETAILS: 'PersonalDetails',
        ADDTIONALFIELDS: 'AdditionalFieldDictionary',
        GRPADDRESSDETAILS: 'AddressDetails',
        GRPPHONEDETAILS: 'PhoneDetails',
        GRPEMAILDETAILS: 'emailDetails',
    };

    public static gridFields = {
        firstName: 'FirstName',
        middleName: 'middleName',
        lastName: 'LastName',
        mobileNumber: 'MobileNumber',
        dob: 'dob',
        age: 'age',
        gender: 'gender',
        maritalStatus: 'maritalStatus',
        noOfKids: 'noOfKids',
        occupation: 'occupation',
        education: 'education',
    };

    public static ruleOptions = {
        AND: 'AND',
        OR: 'OR',
        openingbracket: 'openingbracket',
        closeingbracket: 'closeingbracket',
        Row: 'Row'
    }

    ///////USER RIGHTS DATA////////////////////////////////////////////
    public static CHECKSCREEN = 'SCREEN';
    public static CHECKGROUP = 'GROUP';
    public static CHECKFIELD = 'FIELD';

    public static userRightsscreens = {
        createLead: {
            "IMPORT_BULK_FILE": {
                screenName: "IMPORT_BULK_FILE",
                isRead: false,
                isVisible: false,
                isWrite: false
            },
            "CREATE_MANUALLY": {
                screenName: "CREATE_MANUALLY",
                isRead: false,
                isVisible: false,
                isWrite: false
            }
        },
        manageLead: {
            "MANAGE_LEAD": {
                screenName: "MANAGE_LEAD",
                isRead: false,
                isVisible: false,
                isWrite: false
            }
        },
        campaign_managment: {
            "CAMPAIGN_MANAGMENT": {
                screenName: "CAMPAIGN_MANAGMENT",
                isRead: false,
                isVisible: false,
                isWrite: false
            }
        },
        calender: {
            "CALENDER": {
                screenName: "CALENDER",
                isRead: false,
                isVisible: false,
                isWrite: false
            }
        }
    }

    public static userRightsGrups = {
        manageLeadGrOupS: {
            "MY_LEADS": {
                groupName: "MY_LEADS",
                isRead: false,
                isVisible: false,
                isWrite: false
            },
            "ASSIGNED_LEADS": {
                groupName: "ASSIGNED_LEADS",
                isRead: false,
                isVisible: false,
                isWrite: false
            },
            "UNASSIGNED_LEADS": {
                groupName: "UNASSIGNED_LEADS",
                isRead: false,
                isVisible: false,
                isWrite: false
            }
        },
        ImpoertBulkFileGroups: {
            "EXISTING_FILE": {
                groupName: "EXISTING_FILE",
                isRead: false,
                isVisible: false,
                isWrite: false
            },
            "NEW_FILE": {
                groupNam_: "NEW_FILE",
                isRead: false,
                isVisible: false,
                isWrite: false
            }
        },
        createManuallyGroups: {
            "CREATE_CUSTOM_FORM": {
                groupName: "CREATE_CUSTOM_FORM",
                isRead: false,
                isVisible: false,
                isWrite: false
            }, "PREVIEW": {
                groupName: "PREVIEW",
                isRead: false,
                isVisible: false,
                isWrite: false
            }, "OPEN": {
                groupName: "OPEN",
                isRead: false,
                isVisible: false,
                isWrite: false
            }
        },
        campaignManagmentGroups: {
            "CAMPAIGN": {
                groupName: "CAMPAIGN",
                isRead: false,
                isVisible: false,
                isWrite: false
            },
            "CAMPAIGN_RULE": {
                groupName: "CAMPAIGN_RULE",
                isRead: false,
                isVisible: false,
                isWrite: false
            }
        },
        calenderGroups: {
            "ADD_TASK": {
                groupName: "ADD_TASK",
                isRead: false,
                isVisible: false,
                isWrite: false
            },
            "EDIT_TASK": {
                groupName: "EDIT_TASK",
                isRead: false,
                isVisible: false,
                isWrite: false
            }
        },
    }

    public static userRightsFields = {
        get manageLeadFields() {
            return {
                "EXPORT_BY": {
                    fieldName: "EXPORT_BY",
                    isRead: false,
                    isVisible: false,
                    isWrite: false
                },
                "SHOW_HIDE_COLUMNS": {
                    fieldName: "SHOW_HIDE_COLUMNS",
                    isRead: false,
                    isVisible: false,
                    isWrite: false
                },
                "VIEW_LEADS_BY": {
                    fieldName: "VIEW_LEADS_BY",
                    isRead: false,
                    isVisible: false,
                    isWrite: false
                },
                "ROW_OPERATIONS": {
                    fieldName: "ROW_OPERATIONS",
                    isRead: false,
                    isVisible: false,
                    isWrite: false
                }
            }
        },
        campaignFields: {
            "NEW_CAMPAIGN": {
                groupName: "NEW_CAMPAIGN",
                isRead: false,
                isVisible: false,
                isWrite: false
            },
            "EDIT": {
                groupName: "EDIT",
                isRead: false,
                isVisible: false,
                isWrite: false
            }
        },
        campaignRuleFields: {
            "ADD_RULE": {
                groupName: "ADD_RULE",
                isRead: false,
                isVisible: false,
                isWrite: false
            },
            "EDIT_RULES": {
                groupName: "EDIT_RULES",
                isRead: false,
                isVisible: false,
                isWrite: false
            }
        },
    }
    public static reloadMesssage = 'LMS will now reload, since you are using an older version.';

}
