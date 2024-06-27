import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmEventType, ConfirmationService, MessageService } from 'primeng/api';
import { CommonService } from 'src/app/services/common.service';


@Component({
  selector: 'app-form-sequence',
  templateUrl: './form-sequence.component.html',
  styleUrls: ['./form-sequence.component.scss'],
  providers: [ConfirmationService, MessageService],

})
export class FormSequenceComponent {
  formSequence: any[] = [];
  bankCode: any;
  verticalCode: any;
  insuranceTypeCode: any;
  productId: any;

  jsonFormData: any;
  jsonForm: any;


  constructor(private router: Router,
    private commonService: CommonService,
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private messageService: MessageService

  ) { }

  ngOnInit() {
    this.jsonForm = this.fb.group({
      bankCode: ['', Validators.required],
      insuranceTypeCode: ['', Validators.required],
      productId: ['', Validators.required],
      formName: ['', Validators.required],
      formId: ['', Validators.required],
      jsonFormData: ['', Validators.required],
      jsonMakerData: ['', Validators.required],
    });
    this.bankCode = history.state.bankCode;
    this.verticalCode = history.state.verticalCode;
    this.insuranceTypeCode = history.state.insuranceTypeCode;
    this.productId = history.state.productId;
    this.getFormSequence();
  }

  getFormSequence() {
    this.commonService
      .getFormConfig(
        this.bankCode,
        this.insuranceTypeCode,
        this.productId
      )
      .subscribe({
        next: (res) => {
          this.formSequence = JSON.parse(res.insureFormConfiguration);
          console.log(this.formSequence);
        },
        error: (err) => {
          this.formSequence = [];
        },
      });
  }

  drop(event: CdkDragDrop<any[]>): void {
    moveItemInArray(this.formSequence, event.previousIndex, event.currentIndex);
  }

  async getFormDataFromFormSequence(formSeq: any) {
    try {
      const res = await this.commonService.getJSONForm(
        this.bankCode,
        this.insuranceTypeCode,
        this.productId,
        formSeq.formId
      ).toPromise();

      console.log(res);
      this.jsonFormData = JSON.parse(res.jsonFormData);
      console.log(this.jsonFormData);
      this.jsonForm.get('formName').setValue(formSeq.formName);
      this.jsonForm.get('formId').setValue(formSeq.formId);
      this.jsonForm.get('jsonFormData').setValue(this.jsonFormData);
      console.log(this.jsonForm.value);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  deleteFormConfiguration(index: any) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.formSequence.splice(index, 1);
        this.saveFormSequence();
      },
      reject: (type: any) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              severity: 'error',
              summary: 'Rejected',
              detail: 'You have rejected',
            });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({
              severity: 'warn',
              summary: 'Cancelled',
              detail: 'You have cancelled',
            });
            break;
        }
      },
    });
  }

  saveFormSequence() {
    let req = {
      bankCode: this.bankCode,
      insuranceTypeCode: this.insuranceTypeCode,
      productId: this.productId,
      insureFormConfiguration: JSON.stringify(this.formSequence),
    };
    this.commonService.insertFormConfig(req).subscribe({
      next: (res) => {
        this.messageService.add({
          severity: 'info',
          summary: 'Confirmed',
          detail: 'Form Sequence Updated Successfully.',
        });
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
  getEditNewForm() {
    this.router.navigate(['/portal/finaladminDashboard/editForm'],
      {
        state: {
          bankCode: this.bankCode,
          verticalCode: this.verticalCode,
          insuranceTypeCode: this.insuranceTypeCode,
          productId: this.productId
        }
      });
    // const url = `/portal/finaladminDashboard/editForm?bankCode=${this.bankCode}&verticalCode=${this.verticalCode}&insuranceTypeCode=${this.insuranceTypeCode}&productId=${this.productId}`;
    // window.open(url, '_blank');
  }
  // getPreview(form: any){
  //   console.log(form);
  //   this.getFormDataFromFormSequence(form);
  //   console.log(this.jsonForm.value.jsonFormData);
  //   // this.router.navigate(['/portal/finaladminDashboard/finalAdminPreview'],
  //   // {state:{form : this.jsonForm.value.jsonFormData}});
  //   // const url = `/portal/finaladminDashboard/finalAdminPreview?form=${this.jsonForm.value.jsonFormData}`;
  //   // window.open(url, '_blank');

  // }
  async getPreview(form: any) {
    try {
      console.log(form);
      await this.getFormDataFromFormSequence(form);
      console.log(this.jsonForm.value.jsonFormData);
      // const jsonFormData = JSON.stringify(this.jsonForm.value.jsonFormData);
      // const url = `/portal/finaladminDashboard/finalAdminPreview?form=${jsonFormData}?bankCode=${this.bankCode}?verticalCode=${this.verticalCode}?insuranceTypeCode=${this.insuranceTypeCode}?productId=${this.productId}`;
      // window.open(url, '_blank');
      this.router.navigate(['/portal/finaladminDashboard/formPreview'],
        {
          state: {
            form: this.jsonForm.value.jsonFormData,
            bankCode: history.state.bankCode,
            verticalCode: history.state.verticalCode,
            insuranceTypeCode: history.state.insuranceTypeCode,
            productId: history.state.productId
          }
        });

    } catch (error) {
      console.error(error);
    }
  }

  getEditForm(form: any) {
    console.log(form);
    console.log(this.bankCode, this.verticalCode, this.insuranceTypeCode, this.productId);
    console.log(form.formId, form.formName);
    this.commonService.getJSONForm(
      this.bankCode,
      this.insuranceTypeCode,
      this.productId,
      form.formId
    ).subscribe({
      next: (res) => {
        console.log(res);
        this.router.navigate(['/portal/finaladminDashboard/editForm'],
          {
            state: {
              bankCode: this.bankCode,
              verticalCode: this.verticalCode,
              insuranceTypeCode: this.insuranceTypeCode,
              productId: this.productId,
              formId: form.formId,
              formName: form.formName,
              jsonFormData: res.jsonFormData
            }
          });
      },
      error: (err) => {
        console.error(err);
      },
    })
  }
}
