import { Component, EventEmitter, forwardRef, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FileUploadComponent),
      multi: true
    }
  ]
})
export class FileUploadComponent implements ControlValueAccessor {

  @ViewChild('myFileInput') myFileInput: any;
  @Input() multiple = false;
  @Input() dataInputs : any;
  @Input() fileExtension = ['pdf','jpg', 'png','jpeg'];
  @Input() fileUploadMessage: string = '';
  @Output() emitFilesList = new EventEmitter();
  @Output() emitImage = new EventEmitter();
  @Output() clearUploadedFile = new EventEmitter();
  @Output() backEmit = new EventEmitter();
  @Output() onFilesSelected = new EventEmitter();
  fileList: any = [];
  fileUploadname: any;

  @Input() set oldFileList(value: any) {
    if (value && typeof value == 'string' && value != 'null' && value != 'NULL' && value != 'Null') {
      // for(let o = 0; o < value.length; o++) {
      let obj = {
        name: this.getFileName(value),
        image: value
      }
      this.fileList.push(obj);
      // }
    } else if (!value) {
      this.fileList = [];
    }
  }

  selectedFiles: File[] = [];

  onChange: any = () => {};
  onTouched: any = () => {};

  writeValue(files: File[]): void {
    if (files) {
      this.selectedFiles = files;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  constructor(private toast: NgToastService) { }

  ngOnInit(): void {
  }

  getFileExtension(file: any) {
    return file && file.split('.').pop();
  }

  openFile(filePath: any) {
    if (filePath?.image) {
      // window.open(domainpath + filePath?.image, "_blank");
    } else {
      // this.showImage(filePath);
    }
  }

  getFileName(file: any) {
    return file && file.split('/').pop();
  }

  onSelectFilebase(inputValue: any): void {
    let data = [...inputValue.target.files];
    this.fileUploadname = data;
    for (let f = 0; f < data.length; f++) {
      if (this.fileExtension.length && !this.fileExtension.includes(this.getFileExtension(data[f].name).toLowerCase())) {
        this.toast.error({
          detail: "ERROR",
          summary: 'Please upload ' + [...this.fileExtension] + 'only',
          duration: 3000,
        });
        this.myFileInput.nativeElement.value = '';
        return;
      }
      if (Math.round((data[f].size / 1024)) > 2048) {
        this.toast.error({
          detail: "ERROR",
          summary: 'The maximum supported file size 2 MB',
          duration: 3000,
        });
        this.myFileInput.nativeElement.value = '';
        return
      }
    };
    if (!this.multiple) {
      var myReader: FileReader = new FileReader();
      myReader.onloadend = (e: any) => {
        let url = e.target.result;
        var content = url.split(",");
        this.emitImage.emit(content);
      };
      myReader.readAsDataURL(data[0]);
    }
    this.fileList = data;
    this.emitFilesList.emit(data, );
    this.myFileInput.nativeElement.value = '';
  }

  clearFile(i?: any) {
    this.fileList = this.fileList.filter((res: any, index: any) => index != i);
    // this.clearUploadedFile.emit(i)
    this.fileUploadname.splice(i, 1);

    // Optionally, you can also reset the file input element if needed
    if (this.myFileInput) {
      this.myFileInput.nativeElement.value = '';  // This clears the file input itself
    }
  }
}
