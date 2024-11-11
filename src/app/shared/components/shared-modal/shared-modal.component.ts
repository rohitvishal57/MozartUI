import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-shared-modal',
  templateUrl: './shared-modal.component.html',
  styleUrls: ['./shared-modal.component.scss']
})
export class SharedModalComponent implements OnInit {

  howComment = false;
  selectedList: any;
  isSubmited: boolean = false;

  constructor(private fb: FormBuilder,
    public dialogRef: MatDialogRef<ConfirmModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit(): void {
    let arr: any = {};
    this.data.inputsList && this.data.inputsList.forEach((element: any) => {
      arr[element.key] = ['', Validators.required];
    })
    this.data.formName = this.fb.group(arr);
    if (!this.data.isNew) {
      this.data.formName.patchValue(this.data.formData);
    }
  }

  get f() { return this.data.formName.controls; }

  yes() {
    this.isSubmited = true;
    this.dialogRef.close(this.selectedList || this.data)
  }

  copyMessage(val: string) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    // this.toastService.success('Copied to Clipboard');
    document.body.removeChild(selBox);
  }

  checkboxClicked(event: any) {
    if (event.value) {
      if (!this.selectedList)
        this.selectedList = [];
      if (typeof event.element === "string" && event.element === "all") {
        this.selectedList = event.data;
      } else {
        this.selectedList = this.selectedList.concat(event.element);
      }
    } else {
      if (typeof event.element === "string" && event.element === "all") {
        this.selectedList = event.data;
      } else {
        this.selectedList = this.deleteElementByKey(this.selectedList, "userId", event.element?.userId)
      }
    }
  }

  deleteElementByKey(array: Array<any>, key: string, value: string) {
    return array.filter(obj => obj[key] !== value);
  }
}
