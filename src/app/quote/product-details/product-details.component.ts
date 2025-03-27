import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { firstValueFrom } from 'rxjs';
import { CommonService } from 'src/app/services/common.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { QuoteService } from '../quote.service';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language.service';
import { LeadsService } from 'src/app/leads/leads.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent {

  state: any
  productId: any
  partnerId: any;
  tab: any[] = []
  activeIndex: any = 0
  groupedFeatures: any[] = []
  healthAddOns: any[] = []
  optionalCovers: any[] = []
  formData: any;
  formSequence: any[] = [];
  displayInfo: string = 'Health Add On';
  private allJsonFormData: any[] = []
  proposalNum: any = '';
  leadId: string = '';
  quickQuoteRedirect: boolean = false;
  searchQuestiontName : any ='';
  faqs : any []=[];
  disableBuyJourney: boolean | undefined;

  questionInformation = [
    {
      id: 1,
      question: 'Is there an age limit for opting for a Critical Illness plan?',
      description: 'At Aditya Birla Health Insurance, we provide you a range of unique health insurance benefits such as:',
      points: [
        {
          title: 'HealthReturns™',
          items: [
            'Earn rewards for adopting a healthy lifestyle.',
            'Earn back up to 30% of your health insurance premium.'
          ]
        },
        {
          title: 'Chronic Management Program',
          items: [
            '<a href="https://www.adityabirlacapital.com/healthinsurance/chronic-management-program" target="_blank">Chronic Management Program</a> is specially designed for managing chronic illnesses like asthma, diabetes, and hypertension.',
            'Day 1 cover for chronic conditions.',
            'Automatic upgrade to the program if you develop a chronic condition during your policy tenure.'
          ]
        },
        {
          title: 'Second E Opinion',
          items: [
            'Second opinions in case of critical illnesses are covered.',
            'Panel of expert doctors including international specialists.'
          ]
        },
        {
          title: 'Choice of Hospital Room',
          items: [
            'Freedom to use a shared room or a private room during your hospital stay.',
            'If treated in a lower room category than what you are eligible for, you can earn back ' +
            '<a href="https://www.adityabirlacapital.com/healthinsurance/#!/health-returns" target="_blank">HealthReturns™</a>.'
          ]
        },
        {
          title: 'Day 1 Cover',
          items: [
            'Get insurance coverage right from Day 1 in case of chronic diseases on OPD expenses. (Hospitalization still has 90 day waiting period).',
            'Day 1 Cover is applicable for diseases such as Hypertension, Asthma, Diabetes and High Cholesterol.'
          ]
        }
      ]
    },
    {
      id: 2,
      question: "Advantages of Buying a Health Insurance Policy",
      description: "Benefits of health insurance are plenty. Illnesses and injuries are an unavoidable aspect of life. Given the escalating medical treatment costs, healthcare tends to become a financial burden. Health insurance is the need of the hour as it makes quality healthcare affordable for everyone. Besides covering your medical care costs, there are several other benefits of health insurance such as no claim bonus, top-up plans, cashless facility, tax benefits, free health check-ups, and much more.",
      points: [
        {
          title: "Tax Benefits",
          items: [
            'The premium paid towards <a href="https://www.adityabirlacapital.com/healthinsurance/#!/homepage" target="_blank">health insurance</a> is deductible from taxable income under Section 80D of the Income Tax Act 1961.'
          ]
        },
        {
          title: "No Claim Bonus",
          items: [
            "For every claim-free year, you will be eligible for a no-claim bonus that increases progressively with each year of policy renewal until it reaches 50% of the policy premium. The No Claim Bonus gets added to your sum insured, which in turn enhances your claim/coverage amount."
          ]
        },
        {
          title: "Free Health Check-Up",
          items: [
            "Health Insurance companies cover annual health check-ups in a bid to encourage their customers to stay healthy."
          ]
        },
        {
          title: "Cashless Facility",
          items: [
            "Under a cashless facility, health insurance companies settle the medical bills directly with your healthcare providers. Hence, you are saved from the hassle of making the initial payment and then waiting for the claim."
          ]
        },
        {
          title: "Coverage for OPD Expenses",
          items: [
            "Obtain coverage for expenses incurred during OPD visits as well as diagnostic tests."
          ]
        }
      ]
    },
    {
      id: 3,
      question: "Why do I need a health insurance plan?",
      description: 'An illness or an injury can strike without any warning. Moreover, the cost of medical treatment is skyrocketing in the present time. Hence, medical insurance plans have become imperative in order to avoid financial stress when medical emergencies strike. By taking up a <a href="https://www.adityabirlacapital.com/homepage" target="_blank">health insurance</a> policy, you can focus on your recovery rather than worrying about finances.'
    },
    {
      "id": 4,
      "question": "What are the factors affecting health insurance premium?",
      "description": "Before you buy medical insurance online, it is very important to understand the factors affecting the medical insurance premium, which are as follows:",
      "points": [
        {
          "title": "Factors Influencing Premium",
          "items": [
            "Amount of coverage required",
            "Age",
            "Previous/ current medical history",
            "Tobacco use/ Smoking",
            "BMI (Body Mass Index)",
            "Lifestyle factors such as occupation, area of residence etc",
            "Other factors as required by the Insurer"
          ]
        }
      ]
    },
    {
      "id": 5,
      "question": "Should I opt for an individual plan or a family floater insurance plan?",
      "description": "In a Family floater health insurance plan, a single Sum Insured is shared by all members, whereas in an Individual policy, each member is entitled to have a separate Sum Insured. If you choose an individual medical insurance policy, then you would have to pay the premium according to the Sum Insured opted for each member. In a family floater health insurance policy, you pay a premium for a single Sum Insured based on the ages of the members in the policy. While choosing individual vs family floater, health insurance premium should not be the only deciding factor. You should choose the policy type based on your need for coverage. For example, an Individual health insurance policy provides coverage limits for each member, thus offering substantial coverage, whereas in a family floater policy, the coverage limit is shared. Your choice can vary based on family type, number of members, and need for health insurance coverage."
    },
    {
      "id": 6,
      "question": "What is the importance of cashless health insurance plans?",
      "description": "When medical emergencies strike, the last thing you want to do is worry about making payments. Under a cashless health insurance policy, the health insurance company makes the payment directly to the cashless hospital. Hence, at the time of a medical emergency, you don't have to worry about carrying cash or arranging for funds. If you buy a medical insurance policy, it's wise to ensure that it is a cashless policy."
    },
    {
      "id": 7,
      "question": "What is health insurance portability?",
      "description": "Health insurance portability lets you transfer your health insurance policy from your existing health care provider to another. Under health insurance portability, accumulated health insurance benefits such as no claim bonuses and waiting period remain the same. Hence, if you are not satisfied with your existing health insurance company, you can switch without losing the accumulated benefits."
    },
    {
      "id": 8,
      "question": "What are exclusions of Aditya Birla Health Insurance plan?",
      "description": "The following aspects are not included under health insurance benefits.",
      "points": [
        {
          "title": "Exclusions",
          "items": [
            "Surgeries such as joint replacement, cosmetic surgery, and dental surgery",
            "Alternative treatments such as homeopathic & Ayurvedic",
            "Illnesses and injuries occurring within the waiting period"
          ]
        }
      ]
    },

    {
      "id": 9,
      "question": "What is a no claim bonus health insurance benefit?",
      "description": "Under a no claim bonus health insurance benefit, the medical insurance holder will receive a bonus for every claim-free year. No claim bonuses are a progressive benefit that keeps increasing with each year of renewal.",
      "points": []
    },
    {
      "id": 10,
      "question": "Why are my HealthReturns™ not reflecting?",
      "description": "In order to earn up to 30% of your premium back as HealthReturns™ you need to:",
      "points": [
        {
          "title": "Steps to Earn HealthReturns™",
          "items": [
            "Download the active health app and register with your member ID and OTP to create a username and password",
            "Link your wearable or Fitness App",
            "Get your healthy heart score by Booking Free Health Assessment via App or Website / <a href='https://www.adityabirlacapital.com/healthinsurance/health-assesment/ha-request' target='_blank'>click here to book</a>",
            "Live healthy and earn Active Dayz"
          ]
        }
      ],
      "additional_info": [
        "If the HealthReturns™ is still not reflecting, please write into our support team/ raise a Service Request on the app and we will see what we can do to assist further.",
        "You can reach us at <a href='mailto:care.healthinsurance@adityabirlacapital.com'>care.healthinsurance@adityabirlacapital.com</a>"
      ]
    },
    {
      "id": 11,
      "question": "Are exclusions and waiting periods as mentioned in policy wordings applicable for a claim against HealthReturns™?",
      "description": "Permanent exclusions and waiting periods do not apply under the HealthReturns™ benefit.",
      "points": []
    },
    {
      "id": 12,
      "question": "How can I utilize my earned HealthReturns™?",
      "description": "Funds under HealthReturns™ may be utilized for:",
      "points": [
        {
          "title": "Utilization of HealthReturns™",
          "items": [
            "In-patient medical expenses and day care treatment, provided that the sum insured, cumulative bonus and reloaded sum insured (if applicable) are exhausted during the policy year.",
            "Payment of co-payment and deductible (wherever applicable).",
            "For non-payable claims, in case of an in-patient hospitalization or day care treatment.",
            "Non-medical expenses, that would not otherwise be payable under the policy.",
            "Out-patient expenses up to the value of accrued funds, subject to complete utilization of OPD expenses (if opted under the policy).",
            "Alternative treatments or you can also utilize the funds under HealthReturns™ to pay your premium for the renewal of the policy."
          ]
        }
      ]
    },
    {
      "id": 13,
      "question": "What is a Health Assessment™?",
      "description": "Health Assessment™ is a simple health exam that measures the insured person on the parameters of MER (including BP, BMI, HWR and smoking status), fasting blood sugar and total cholesterol."
    },
    {
      "id": 14,
      "question": "How is a Healthy Heart Score™ calculated?",
      "description": "For calculating the Healthy Heart Score™, we have provided access to a free Health Assessment™ test namely - MER (including BP, BMI, HWR and smoking status), Fasting Blood Sugar, Total Cholesterol will be carried out at one go and at least once every policy year."
    },
    {
      "id": 15,
      "question": "What if I can't download the Activ Health app?",
      "description": "In case you can't download the app for some reason, you can also get a Fitness Assessment Test done every 6 months at any of our partnered centers. Your Health Returns™ will then be calculated based on your Fitness Assessment Level and your Healthy Heart Score™. For example, FA Level 5+ Green Heart Score=30% Health Returns™."
    },
    {
      "id": 16,
      "question": "How can I use my HealthReturns™?",
      "description": "You can use your HealthReturns™ to:",
      "points": [
        {
          "title": "Steps to Utilize HealthReturns™",
          "items": [

            "Pay for your next policy premium",
            "Pay for medicines",
            "Pay for diagnostic tests",
            "Pay for health emergencies",
            "Pay for alternative treatments"

          ]
        }
      ]
    },
    {
      "id": 17,
      "question": "Do I need to pay to get my Healthy Heart Score™?",
      "description": "The charges for one Health Assessment in a policy year, done at our medical network providers/empaneled service providers, is borne by us as part of the 'Health Check-up program'."
    },
    {
      "id": 18,
      "question": "Is the Healthy Heart Score™ a medical test that my doctor/dietitian can refer to?",
      "description": "Yes, your doctor or dietitian can refer to your Healthy Heart Score™ report."
    },
    {
      "id": 19,
      "question": "How often do I have to get my Healthy Heart Score™ generated?",
      "description": "You need to get your Healthy Heart Score™ generated at least once during a policy year, at one of our medical network providers/empaneled service providers. The score remains valid for a period of 12 months."
    }];

  constructor(private quoteservices: QuoteService, private router: Router, private toast: NgToastService,
    private encryptionService: EncryptionService, private commonService: CommonService, private languageService: LanguageService,
    private translateService: TranslateService,private common: CommonService,private leadsService: LeadsService,private authService: AuthService  
  ) {

  }

  ngOnInit(): void {
    this.disableBuyJourney = this.authService.getUserInfo().disableBuyJourney;
    this.languageService.language$.subscribe(lang => {
      this.translateService.use(lang).subscribe({
        error: () => {
          this.translateService.use('en'); // Fallback to English if translation file is missing
        }
      });
    });
    this.productId = history.state.item.productId
    this.partnerId = history.state.item.partnerId;
    this.state = history.state.item
    this.leadId = history.state.leadnumber;
    this.quickQuoteRedirect = history.state.quickQuoteRedirect;
    console.log(this.productId, this.state);
    this.productdetails();
    this.questionSearch();
  }

  productdetails() {
    this.tab.push("Covers")
    let features: any
    const reqData = {
      "productId": this.productId,
      "agentCode": localStorage.getItem('agentCode')
    }
    console.log(reqData);
    this.quoteservices.Getproductdetailsandfeatures(reqData).subscribe({
      next: (res: any) => {
        console.log(res.data);
        this.state = res.data;
        this.state.keyFeatures = JSON.parse(this.state.keyFeatures);
        features = res.data.productFeatures
        this.groupedFeatures = features.reduce((result: any, { categoryName, featureName, featureDescription }: any) => {
          if (!result[categoryName]) {
            result[categoryName] = [];
          }
          result[categoryName].push({ featureName, featureDescription });
          return result;
        }, {});
        console.log(this.groupedFeatures);
      },
      error: (err) => {
        console.error(err);
      }
    })
  }

  onTabChange(event: any) {
    this.activeIndex = event.index;
    if (this.activeIndex == 0) {
     this.displayInfo = 'Health Add On';
    } else if (this.activeIndex == 1) {
      this.displayInfo = 'Optional Covers';
    }else if (this.activeIndex == 2){
      this.displayInfo = 'FAQs';
    }
  }

  async getProposalNum() {
    try {
      const res = await firstValueFrom(this.common.getProposalNumber());
      console.log(res);
      this.proposalNum = res.data.proposalNumber;
      console.log(this.proposalNum);
      
    } catch (error) {
      console.error(error);
    }
  }


  async buyNow(item: any) {
    this.formData = { ...this.formData, productName: item.productName }
    try {
      await this.getProposalNum();

      await this.getFormSequence(item);
      console.log(item)
      const productData : any = {
        partnerId: item.partnerId,
        productId: item.productId,
        proposalNum: this.proposalNum
      }
      
      if(this.quickQuoteRedirect){
        await this.getLeadInformationByLeadNumber(item.productName)
        productData.leadId = this.leadId;
        productData.quickQuoteRedirect = this.quickQuoteRedirect
      }

      console.log(productData)
      if (this.formSequence != null && this.formSequence.length > 0) {
        this.router.navigate(['yatra'], {
          state: { productData: productData, formSequence: this.formSequence }
        });
      }
    } catch (error) {
      console.error(error);
    }
  }
  async getFormSequence(item: any) {
    console.log(item);
    try {
      sessionStorage.clear();
      const reqData = {
        "partnerId": item.partnerId,
        "productId": item.productId

      }
      console.log(reqData);
      const res = await firstValueFrom(this.commonService.Getformsequence(reqData));
      console.log(res);
      this.formSequence = JSON.parse(res.data.formSequence);
      console.log(this.formSequence);

      if (this.formSequence != null && this.formSequence.length > 0) {
        this.formSequence.forEach(() => { this.allJsonFormData.push({}) });
        sessionStorage.setItem("allJsonForm", this.encryptionService.encrypt(this.allJsonFormData));
      }
      console.log(this.allJsonFormData);
      sessionStorage.setItem("allFormData", this.encryptionService.encrypt(this.formData));
      sessionStorage.setItem("formIndex", "0");
    } catch (err) {
      this.toast.warning({ detail: "Warning", summary: "Form Configuration not found!!", duration: 2000 });
    }
  }

  async getLeadInformationByLeadNumber( productName: any) {
    try {
      const response = await firstValueFrom(this.leadsService.getLeadInformationByLeadID(this.leadId));
      const leadInformation = response?.data?.leadList[0];
      leadInformation.interestedProductName = productName;
      leadInformation.isUpdate = 1;

      this.leadsService.saveLeadData(leadInformation).subscribe(
        (response) => {
          console.log("Lead has been Successfully Updated", response);
        }, (error) => {
          console.log("Failed to update Lead Infomation", error);
        });

    }
    catch (error) {
      console.log("Failed to fetch lead Information!", error)
    }
  }

  // productSearch() {
  //   this.ProductList = this.productsInformation;
  //   this.ProductList = this.ProductList.filter(product =>
  //     product.productName.trim().toLowerCase().includes(this.searchProductName.trim().toLowerCase())
  //   );
  // }
  
  questionSearch() {
    this.faqs = this.questionInformation;
    this.faqs = this.faqs.filter(faq =>
      faq.question.trim().toLowerCase().includes(this.searchQuestiontName.trim().toLowerCase())
    );
  }
}
