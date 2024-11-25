
export class LeadFormListValue {
    CampaignName: string[] = ["New business", "Renewal"];
    LeadType: string[] = ["New business", "Renewal"];
    LeadVintage: string[] = ["Existing", "Fresh"];
    Source: string[] = ["Self", "Campaign", "Referral"];
    IsWhatsApp: boolean[] = [true, false];
    Gender: string[] = ["Male", "Female", "Other"];
    MaritalStatus: string[] = ["Married", "Single", "Widowed", "Separated", "Divorced"];
    // ProductName: string[] = [
    //     "Active Assure",
    //     "Activ Health",
    //     "Activ Care",
    //     "Activ Secure",
    //     "Global Health Secure",
    //     "Arogya Sanjeevani",
    //     "Corona Kavach",
    //     "Activ Assure -Super Top Up Plan A",
    //     "Activ Assure - Super Top Up B",
    //     "Activ Fit",
    //     "Activ One"  
        
    // ];
    // PlanName: string[] = [
    //     "NA",
    //     "Standard",
    //     "Classic",
    //     "Premier",
    //     "Plan1",
    //     "Plan2",
    //     "Plan3",
    //     "Plan4",
    //     "Plan5"
    // ]

    ProductName: string[] = [
        "Activ Assure",
        "Activ Assure Plus",
        "Activ Health",
        "Activ Health Plus",
        "Activ Care",
        "Activ Secure",
        "Global Health Secure",
        "Arogya Sanjeevani",
       // "Corona Kavach",
        "ACTIV ASSURE + SUPER HEALTH TOP UP",
        "Activ Fit",
        "Activ One",
        "Super Health Top Up"
        
    ];
    PlanName: string[] = [
        "NA",
        "Enhanced", "Essential", "Premier",
        "Max", "MaxPlus", "Vytl", "Vip", "VipPlus", "SAVR",
        "Plus", "Preferred",
        "Standard",
        "Classic",
        "Premier",
        "Plan A", "Plan B",
        // "Plan1",
        // "Plan2",
        // "Plan3",
        // "Plan4",
        // "Plan5"
    ]
    ProductAndPlans=[
        {product:"Activ Assure",plan:["NA"]},
        {product:"Activ Assure Plus",plan:["NA"]},
        {product:"Activ Health",plan:["NA" ,"Enhanced", "Essential", "Premier"]},
        {product:"Activ Health Plus",plan:["NA" ,"Enhanced", "Essential", "Premier"]},
        {product:"Activ Care",plan:["NA","standard", "classic" , "premier"]},
        {product:"Activ Secure",plan:["NA"]},
        {product:"Global Health Secure",plan:["NA"]},
        {product:"Arogya Sanjeevani",plan:["NA"]},
        {product:"ACTIV ASSURE + SUPER HEALTH TOP UP",plan:["NA","Plan A", "Plan B"]},
        {product:"Activ Fit",plan:["NA",'Plus', 'Preferred']},
        {product:"Activ One",plan:["NA", "Max", "MaxPlus", "Vytl", "Vip", "VipPlus", "SAVR"]},
        {product:"Super Health Top Up",plan:["NA","Plan A", "Plan B"]}

    ]
    FamilyConstruct: string[] = ["Family Floater", "Multi Individual"];
    PolicyType: string[] = ["Multi Individual", "Family Floater"];
    salutations = ["Mr", "Mrs","Ms","Dr","Mx","Miss","Others"];
    educationLevels = [ "Below Metric","Metric","Under Graduate","Graduate","Post Graduate", "Diploma","Professional","Other"];
      
   
      

}