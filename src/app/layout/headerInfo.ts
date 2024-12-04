import { Injectable } from "@angular/core";


export default class HeaderInformation {
  marketingContent : any[] = [
    {
      "name": "Content Hub Portal",
      "redirectURL": "https://www.abhimarketingcontenthub.com/contenthub/index.php/home/api_login?code="
    },
    {
      "name": "Customer Testimonials",
      "redirectURL": "https://www.youtube.com/playlist?list=PLfHGRTdw3O3Pp0O3pJKDciMJlqHuPoS3m"
    },
    {
      "name": "Application Tracker",
      "redirectURL": "https://www.adityabirlacapital.com/healthinsurance/#!/application-tracker"
    },
    {
      "name": "KMS",
      "redirectURL": "https://abclearning.adityabirlacapital.com/login"
    }           
];

downloadBrowcher : any[] =[
  { "productName": "Activ One Max", "browcherURL": "assets/browcher/Active_One_Max-Brochure.pdf" },
  { "productName": "Activ One Max Plus", "browcherURL": "assets/browcher/Active_One_Max-Brochure.pdf" },
  { "productName": "Activ One VIP", "browcherURL": "assets/browcher/Active_One_Max-Brochure.pdf" },
  { "productName": "Activ One VIP Plus", "browcherURL": "assets/browcher/Active_One_Max-Brochure.pdf"},
  { "productName": "Activ One VYTL", "browcherURL": "assets/browcher/Active_One_Max-Brochure.pdf" },
  { "productName": "Activ One SAVR", "browcherURL": "assets/browcher/Active_One_Max-Brochure.pdf" },
  { "productName": "Activ Health Platinum Essential", "browcherURL": "assets/browcher/Activ-Health-Platinum-Essential-Brochure.pdf" },
  { "productName": "Activ Health Platinum Enhanced", "browcherURL": "assets/browcher/Activ-Health-Platinum-Enhanced-Brochure.pdf" },
  { "productName": "Activ Health Platinum Premiere", "browcherURL": "" },
  { "productName": "Activ Care Standard", "browcherURL": "" },
  { "productName": "Activ Care Classic", "browcherURL": "assets/browcher/Activ-Care-Classic-Brochure.pdf" },
  { "productName": "Activ Care Premiere", "browcherURL": "" },
  { "productName": "Activ Fit Plus", "browcherURL": "assets/browcher/Activ-Fit-Plus-Brochure.pdf" },
  { "productName": "Activ Fit Preferred", "browcherURL": "assets/browcher/Activ-Fit-Preferred-Brochure.pdf" },
  { "productName": "Global Health Secure", "browcherURL": "" },
  { "productName": "Super Health Top Up Plan B", "browcherURL": "assets/browcher/Super-Top-Up-Brochure.pdf" },
  { "productName": "Arogya Sanjeevani", "browcherURL": "" }
];

notificationType : any[]=
[
  {
    "notificationType": "Policy",
    "icon": "assets/Img/icon_notification_card_products.svg"
  },
  {
    "notificationType": "Leads",
    "icon": "assets/Img/icon_notification_card_lead.svg"
  },
  {
    "notificationType": "Profile",
    "icon": "assets/Img/icon_notification_card_user.svg"
  },
  {
    "notificationType": "Claims",
    "icon": "assets/Img/icon_notification_card_claims.svg"
  },
  {
    "notificationType": "Renewal",
    "icon": "assets/Img/icon_notification_card_renewal.svg"
  }
]


}