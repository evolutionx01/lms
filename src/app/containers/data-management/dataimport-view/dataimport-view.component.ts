import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { NgbModalOptions, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ToasterNotiService } from '../../../shared/services/notifications/toaster-noti.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';

import { DatePipe } from '@angular/common';
import { DataimportViewService } from '../service/dataimport-view/dataimport-view.service';
import { environment } from '../../../../environments/environment';
import { DataimportModalComponent } from '../dataimport-modal/dataimport-modal.component';


@Component({
  selector: 'app-dataimport-view',
  templateUrl: './dataimport-view.component.html',
  styleUrls: ['./dataimport-view.component.scss'],
  providers: [DatePipe]
})
export class DataimportViewComponent implements OnInit {

  @ViewChild('standardfileinput') standardFileInput: ElementRef;
  @ViewChild('uploadfileinput') uploadFileInput: ElementRef;

  get getformCustomer() { return <FormArray>this.downloadTemplate.get('customer_details'); }

  public showCustomer: boolean;
  public fileList: any;
  public uploadFileList: any;
  public customerDropdownData: any;
  public tinDropdownData: any;
  public locationDropdowndata: any;
  public modalOption: NgbModalOptions = {};

  public typeData = [
    { id: 1, item_name: 'TIN' },
     { id: 2, item_name: 'Location' },
    { id: 3, item_name: 'Provider' },
    { id: 4, item_name: 'Provider Payer' },
    { id: 5, item_name: 'Location Payer' },
  ];

  public customerData = [
    { id: 1, customer_name: 'Aravinth' },
    { id: 2, customer_name: 'Aravinth kumar' },
    { id: 3, customer_name: 'Aravinth 2' },
    { id: 4, customer_name: 'Aravinth 4' }
  ]

  public customerType = [
    { id: 1, type_name: 'TIN' },
    // { id: 2, type_name: 'Provider' },
    // { id: 3, type_name: 'Location' },

  ]


  public customer = {
    id: []

  };

  public showTINNote: any;
  public showProviderPayerNote: any
  public showLocationNote: any
  public showProviderNote: any
  public showLocationPayerNote: any

  public downloadTemplate: FormGroup;
  public uploadTemplate: FormGroup;
  public standardTemplate: FormGroup;

  public customerList: any;
  public userId: any;

  constructor(
    private formBuilder: FormBuilder,
    private dataimportViewService: DataimportViewService,
    private notiService: ToasterNotiService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private modalService: NgbModal,
    private datePipe: DatePipe,
  ) { }

  ngOnInit() {
    this.getCustomerDropdown();
    this.showCustomer = false;
    this.userId = localStorage.getItem('userId');
    this.buildDownloadTemplate();
    this.buildUploadTemplate();
    this.buildStandardTemplate();
    this.getCustomerDetails();
    this.setCustomer();
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    this.modalOption.size = "lg";
    this.showTINNote = false;
    this.showProviderPayerNote = false;
    this.showLocationNote = false;
    this.showProviderNote = false;
    this.showLocationPayerNote = false;
  }

  public buildDownloadTemplate() {
    this.downloadTemplate = this.formBuilder.group({
      item_id: new FormControl(null, [Validators.required]),
      customer_details: this.formBuilder.array([])
    });
  }

  setCustomer() {
    let control = <FormArray>this.downloadTemplate.controls.customer_details;
    this.customer.id.forEach(x => {
      control.push(this.formBuilder.group({
        customer_id: x.customer_id
      })
      )
    })
  }
  public addCustomer(): void {
    let control = <FormArray>this.downloadTemplate.controls.customer_details;
    control.push(
      this.formBuilder.group({
        customer_id: [null, Validators.required]
      })
    )

  }
  public deleteCustomer() {
    let control = <FormArray>this.downloadTemplate.controls.customer_details;
    control.removeAt(0)
  }

  public onTypeChage(event) {
    console.log(event)
    this.deleteCustomer()
    if (event == 4 || event == 5 || event == 2) {
      this.addCustomer()
    } else {
      this.deleteCustomer()
    }
  }

  public onUploadTypeChage(event){
    console.log(event)
    this.showTINNote = false;
    this.showProviderPayerNote = false;
    this.showLocationNote = false;
    this.showProviderNote = false;
    this.showLocationPayerNote = false;
    if (event == 1) {
      this.showTINNote = true;
    } else if (event == 4) {
      this.showProviderPayerNote = true;
    } else if (event == 2) {
      this.showLocationNote = true;
    } else if (event == 3) {
      this.showProviderNote = true;
    } else if (event == 5) {
      this.showLocationPayerNote = true;
    }else {
      this.showTINNote = false;
      this.showProviderPayerNote = false;
      this.showLocationNote = false;
      this.showProviderNote = false;
      this.showLocationPayerNote = false;
    }
  }

  public downloadPDF() {
    if (this.downloadTemplate.value.item_id == '1') {
      this.spinner.show();
      this.dataimportViewService.downloadTIN().subscribe(
        data => {
          this.downloadTemplateDetails(data)

        }, error => {
          console.log(error)
        }
      )
    } else if (this.downloadTemplate.value.item_id == '4') {
      console.log(this.downloadTemplate.value)
      this.spinner.show();
      let params = {
        customer_id: this.downloadTemplate.value.customer_details[0].customer_id,
      }

      this.dataimportViewService.downloadProviderPayer(params).subscribe(
        data => {
          this.downloadTemplateDetails(data)

        }, error => {
          console.log(error)
        }
      )
    } else if (this.downloadTemplate.value.item_id == '3') {
      console.log(this.downloadTemplate.value)
      this.spinner.show();

      this.dataimportViewService.downloadProvider().subscribe(
        data => {
          this.downloadTemplateDetails(data)

        }, error => {
          console.log(error)
        }
      )
    } else if (this.downloadTemplate.value.item_id == '5') {
      console.log(this.downloadTemplate.value)
      this.spinner.show();
      let params = {
        customer_id: this.downloadTemplate.value.customer_details[0].customer_id,
      }

      this.dataimportViewService.downloadLocationPayer(params).subscribe(
        data => {
          this.downloadTemplateDetails(data)

        }, error => {
          console.log(error)
        }
      )
    } else if (this.downloadTemplate.value.item_id == '2') {
      console.log(this.downloadTemplate.value)
      this.spinner.show();
      let params = {
        customer_id: this.downloadTemplate.value.customer_details[0].customer_id,
      }

      this.dataimportViewService.downloadLocation(params).subscribe(
        data => {
          this.downloadTemplateDetails(data)

        }, error => {
          console.log(error)
        }
      )
    }
  }

  private downloadTemplateDetails(data) {
    console.log(data);

    this.spinner.hide();
    if (data.success) {
      this.notiService.showSuccess('Template downloaded successfully', '', 4000);
      var downloadLink = window.document.createElement('a');
      downloadLink.href = `${environment.apiDownloadUrl}${data['file_name']}` //stage & dev
      //downloadLink.href = `${environment.apiUrl}${data['file_name']}`
      downloadLink.download = data['file_name'];
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      if (this.downloadTemplate.value.item_id == 4) {
        this.deleteCustomer()
      }
      this.downloadTemplate.reset();
    } else {
      this.notiService.showError(data.error, '', 4000);
    }

  }

  public cleardownload() {
    this.downloadTemplate.reset();
  }

  public getCustomerDetails() {
    this.dataimportViewService.getCustomer().subscribe(item => {
      this.getCustomerData(item)
    })
  }

  private getCustomerData(data) {
    if (data.success) {
      console.log(data)
      this.customerList = data.customer_list;
    }
  }

  public buildUploadTemplate() {
    this.uploadTemplate = this.formBuilder.group({
      item_id: new FormControl(null, [Validators.required]),
      Customer_id: new FormControl(null, [Validators.required]),
      upload_template: new FormControl(null, [Validators.required])
    });
  }

  // {
  //   "form_name": "Texas, Uniform Credentialing Application Updated 2015",
  //   "uploaded_file_id": 0,
  //   "created_by": 53,
  //   "form_status_id": 3,
  //   "is_active": 1,
  //   "customer_ids": 53,
  //   "tin_id": 7627,
  //   "location_id": 76528,
  //   "upload_file": "Texas__Uniform_Credentialing_Appliction_Updated_2015[Affleck, Ben_31102_09182018]_161611.pdf"
  // }

  public buildStandardTemplate() {
    this.standardTemplate = this.formBuilder.group({
      tin_id: new FormControl(null, [Validators.required]),
      location_id: new FormControl(null, [Validators.required]),
      Customer_id: new FormControl(null, [Validators.required]),
      upload_file: new FormControl(null, [Validators.required])
    });
  }

  public beforeChange(event) {

    if (event.nextId == 'download') {
      console.log('CAQH INSERT');
      this.buildDownloadTemplate();

      // this.getCustomerDropdown();
    } else if (event.nextId == 'upload') {
      console.log('CAQH Update');
      this.buildUploadTemplate();
      this.getCustomerDetails();

    } else if (event.nextId == 'standard') {
      console.log('Standard');
      this.buildStandardTemplate();
      this.getCustomerDropdown();
    }
  }

  standardFileChange(e) {
    this.fileList = e.target.files[0];
    this.standardFileInput.nativeElement.nextSibling.innerHTML = this.fileList.name;
  }

  public getCustomerDropdown() {
    this.spinner.show();
    let params = {
      is_active: 1
    }
    this.dataimportViewService.getCustomerList(params).subscribe(data => {
      this.customerDropdownDetails(data)
    })
  }

  private customerDropdownDetails(data) {
    console.log(data)
    this.spinner.hide()
    this.customerDropdownData = data.dropdown_list
  }

  public onCustomerChange(data) {

    if (data) {
      this.spinner.show();
      let params = {
        user_id: data,
        is_active: 1
      }
      this.dataimportViewService.getTinList(params).subscribe(data => {
        this.tinDropdownDetails(data)
      })
    } else {
      let params = {
        tin_id: null,
        location_id: null
      }
      this.standardTemplate.patchValue(params);
      this.tinDropdownData = [];
      this.locationDropdowndata = [];
    }

  }

  private tinDropdownDetails(data) {

    console.log(data);
    this.tinDropdownData = data.dropdown_list;
    this.spinner.hide();
  }

  public onTinChange(data) {

    console.log(data);
    if (data) {
      this.spinner.show();
      let params = {
        tin_id: data,
        is_active: 1
      }

      this.dataimportViewService.getLocationList(params).subscribe(data => {
        console.log(data)
        this.locationDropdownDetails(data)
      })
    } else {
      let params = {
        location_id: null
      }
      this.standardTemplate.patchValue(params);
      this.locationDropdowndata = [];
    }

  }

  private locationDropdownDetails(data) {
    this.spinner.hide();
    this.locationDropdowndata = data.dropdown_list;
    this.locationDropdowndata.map(item =>{
      item['practice__add1'] = item['practice__add1'] == null ? ' ' : item['practice__add1'];
      item['practice__add2'] = item['practice__add2'] == null ? ' ' : item['practice__add2'];
      item['label'] = item['practice_name']+' '+item['practice__add1']+' ' + item['practice__add2'] 
    })
  }

  // {
  //   "form_name": "Texas, Uniform Credentialing Application Updated 2015",
  //   "uploaded_file_id": 0,
  //   "created_by": 53,
  //   "form_status_id": 3,
  //   "is_active": 1,
  //   "customer_ids": 53,
  //   "tin_id": 7627,
  //   "location_id": 76528,
  //   "upload_file": "Texas__Uniform_Credentialing_Appliction_Updated_2015[Affleck, Ben_31102_09182018]_161611.pdf"
  // }

  public uploadStandardForm() {
    console.log(this.standardTemplate.value)
    this.spinner.show();
    let postParams = new FormData();

    postParams.append('form_name', 'Texas, Uniform Credentialing Application Updated 2015');
    postParams.append('upload_file', this.fileList, this.fileList.name);
    postParams.append('uploaded_file_id', '0');
    postParams.append('created_by', this.userId);
    postParams.append('form_status_id', '3');
    postParams.append('is_active', '1');
    postParams.append('customer_ids', this.standardTemplate.value.Customer_id);
    postParams.append('tin_id', this.standardTemplate.value.tin_id);
    postParams.append('location_id', this.standardTemplate.value.location_id);
    console.log(postParams)

    this.dataimportViewService.uploadStandardTemplate(postParams).subscribe(
      data => {
        this.postStandardTemplate(data);
      }
      // ,
      // error => {
      //   this.spinner.hide();
      //   this.notiService.showError(error, '', 4000)
      //   this.router.navigate(['signin']);
      // }
    )
  }

  private postStandardTemplate(data) {
    console.log(data);
    this.spinner.hide();
    if (data.success) {
      this.notiService.showSuccess('Standard Form Uploaded Successfully', '', 4000);
      this.standardTemplate.reset();
      this.standardFileInput.nativeElement.nextSibling.innerHTML = '';
    } else {
      this.notiService.showError(data.error, '', 4000)
    }
  }

  public clearStandard() {

    this.standardTemplate.reset();
    this.standardFileInput.nativeElement.nextSibling.innerHTML = '';
  }

  public clearUpload() {

    this.uploadTemplate.reset();
    this.uploadFileInput.nativeElement.nextSibling.innerHTML = '';
  }


  public uploadFileChange(e) {
    this.uploadFileList = e.target.files[0];
    this.uploadFileInput.nativeElement.nextSibling.innerHTML = this.uploadFileList.name;
  }

  public uploadXlsxTemplate() {
    console.log(this.uploadTemplate.value);

    let postUploadParams = new FormData();

    postUploadParams.append('upload_template', this.uploadFileList, this.uploadFileList.name);
    postUploadParams.append('customer_id', this.uploadTemplate.value.Customer_id);

    if (this.uploadTemplate.value.item_id == 1) {
      this.spinner.show()
      this.dataimportViewService.uploadTIN(postUploadParams).subscribe(
        data => {
          this.uploadTemplateDetails(data);
        }
      )
    } else if (this.uploadTemplate.value.item_id == 4) {
      this.spinner.show()
      this.dataimportViewService.uploadProviderPayer(postUploadParams).subscribe(
        data => {
          this.uploadTemplateDetails(data);
        }
      )
    } else if (this.uploadTemplate.value.item_id == 3) {
      this.spinner.show()
      this.dataimportViewService.uploadProvider(postUploadParams).subscribe(
        data => {
          this.uploadTemplateDetails(data);
        },
        error => {
          this.spinner.hide();
          this.notiService.showError("An error occured", '', 4000)
        }
      )
    } else if (this.uploadTemplate.value.item_id == 5) {
      this.spinner.show()
      this.dataimportViewService.uploadLocationPayer(postUploadParams).subscribe(
        data => {
          this.uploadTemplateDetails(data);
        },
        error => {
          this.spinner.hide();
          this.notiService.showError("An error occured", '', 4000)
        }

      )
    } else if (this.uploadTemplate.value.item_id == 2) {
      this.spinner.show()
      this.dataimportViewService.uploadLocation(postUploadParams).subscribe(
        data => {
          this.uploadTemplateDetails(data);
        },
        error => {
          this.spinner.hide();
          this.notiService.showError("An error occured", '', 4000)
        }

      )
    }
  }

  private uploadTemplateDetails(data) {
    console.log(data);
    this.spinner.hide();
    if (data.success) {
      this.uploadTemplate.reset();
      this.uploadFileInput.nativeElement.nextSibling.innerHTML = '';
      this.notiService.showSuccess(data.message, '', 4000);
    } else {


      if(data.error_details){
        const addPopup = this.modalService.open(DataimportModalComponent, this.modalOption);
        addPopup.componentInstance.error_data = data.error_details;
  
        addPopup.result.then((result) => {
          console.log(result);
          if (result == 'yes') {
          }
        }).catch((error) => {
          console.log(error);
        });
      }else{
        let errorData = data.error != '' ? data.error : 'Something went wrong'
        this.notiService.showError(errorData, '', 4000);
      }

    }
  }




}
