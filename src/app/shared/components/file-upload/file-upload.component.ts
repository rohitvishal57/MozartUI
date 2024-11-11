import { Component } from '@angular/core';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent  {


  // @ViewChild('myFileInput') myFileInput: any;


  // @Input() id = '';
  // @Input() multiple = false;
  // @Input() type = ''
  // @Input() fileExtension = ['pdf', 'doc', 'docx', 'jpg'];
  // @Input() fileUploadMessage: string;


  // @Output() emitFilesList = new EventEmitter();
  // @Output() emitImage = new EventEmitter();
  // @Output() clearUploadedFile = new EventEmitter();

  // fileList: any = [];

  // @Input() set oldFileList(value: any) {
  //   if (value && typeof value == 'string' && value != 'null' && value != 'NULL' && value != 'Null') {
  //     // for(let o = 0; o < value.length; o++) {
  //     let obj = {
  //       name: this.getFileName(value),
  //       image: value
  //     }
  //     this.fileList.push(obj)
  //     // }
  //   } else if (!value) {
  //     this.fileList = []
  //   }
  // }

  // constructor(private commonService: CommonService) { }

  // ngOnInit(): void {
  // }

  // getFileExtension(file: any) {
  //   return file && file.split('.').pop();
  // }
  // openFile(filePath: any) {
  //   if (filePath?.image) {
  //     window.open(domainpath + filePath?.image, "_blank");
  //   } else {
  //     this.showImage(filePath);
  //   }
  // }

  // showImage(file: any) {
  //   let fileType = this.getFileExtension(file.name)
  //   if (file && (fileType == 'png' || fileType == 'jpg' || fileType == 'jpeg')) {
  //     var reader = new FileReader();
  //     reader.readAsDataURL(file); // read file as data url
  //     reader.onload = (event: any) => { // called once readAsDataURL is completed
  //       this.commonService.openDialog({ template: FileuploadPreviewComponent, width: '800px', data: event.target.result }, (el: any) => { })
  //     }
  //   }
  // }



  // getFileName(file: any) {
  //   return file && file.split('/').pop();
  // }

  // onSelectFilebase(inputValue: any): void {
  //   let data = [...inputValue.target.files];
  //   for (let f = 0; f < data.length; f++) {
  //     if (this.fileExtension.length && !this.fileExtension.includes(this.getFileExtension(data[f].name).toLowerCase())) {
  //       this.commonService.snackBar('Please upload ' + [...this.fileExtension] + 'only', AlertInfo.ERROR);
  //       this.myFileInput.nativeElement.value = '';
  //       return;
  //     }
  //     if (Math.round((data[f].size / 1024)) > 2048) {
  //       this.commonService.snackBar('The maximum supported file size 2 MB', AlertInfo.ERROR);
  //       this.myFileInput.nativeElement.value = '';
  //       return
  //     }
  //   };
  //   if (!this.multiple) {
  //     var myReader: FileReader = new FileReader();
  //     myReader.onloadend = (e: any) => {
  //       let url = e.target.result;
  //       var content = url.split(",");
  //       this.emitImage.emit(content);
  //     };
  //     myReader.readAsDataURL(data[0]);
  //     this.fileList = data;
  //   } else {
  //     this.fileList.push(data[0]);
  //   }
  //   this.emitFilesList.emit(this.fileList);
  //   this.myFileInput.nativeElement.value = '';
  // }

  // clearFile(i: any) {
  //   this.fileList = this.fileList.filter((res: any, index: any) => index != i);
  //   this.clearUploadedFile.emit(this.fileList)
  // }

}
