import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { NgbModalOptions, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatauploadViewService } from '../service/dataupload-view/dataupload-view.service';
import { ToasterNotiService } from '../../../shared/services/notifications/toaster-noti.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { DatauploadModalComponent } from '../dataupload-modal/dataupload-modal.component';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-dataupload-view',
  templateUrl: './dataupload-view.component.html',
  styleUrls: ['./dataupload-view.component.scss'],
  providers: [DatePipe]
})
export class DatauploadViewComponent implements OnInit {

  public selectedFiles: any;

  public pageNumber: number;
  public pagelimit: number;
  public caqhData: any;
  private searchData: string;
  public totalElements: number;
  public searchCaqh: FormGroup;

  modalOption: NgbModalOptions = {};
  @ViewChild('myCaqhTable') mycaqhtable: any;
  public providerDropdownData: any;
  myFiles: string[] = [];
  public fileArray: any[];
  @ViewChild('uploadfileinput') uploadFileInput: ElementRef;
  @ViewChild('uploadupdatefileinput') uploadUpdateFileInput: ElementRef;
  public userId: any;
  public fileList;
  public isCollapsed = false;
  public formDropdownData: any;
  public locationDropdowndata: any;
  public tinDropdownData: any;
  public customerDropdownData: any;
  public createProvider: FormGroup;
  public updateCAQH: FormGroup;

  public currentPageLimit: number = 25;
  public pageLimitOptions = [
    { value: 10 },
    { value: 25 },
    { value: 50 },
    { value: 100 },
  ];
  public stateDropdownData = [{ state: 'texta', state_id: 1 }, { state: 'texta', state_id: 1 }, { state: 'texta', state_id: 1 }]
  constructor(
    private formBuilder: FormBuilder,
    private datauploadViewService: DatauploadViewService,
    private notiService: ToasterNotiService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private modalService: NgbModal,
    private datePipe: DatePipe,
  ) { }

  ngOnInit() {
    this.buildSearchForm();
    this.pagelimit = 25;
    this.searchData = '';

    this.userId = localStorage.getItem('userId');

    this.buildCreateProviderForm();
    this.buildUpdateCAQHForm();
    this.getCustomerDropdown();
    //this.getFormDropdown();

    this.setPage({ offset: 0 });

    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    this.modalOption.size = "lg";
  }

  public buildSearchForm() {
    this.searchCaqh = this.formBuilder.group({
      searchValue: new FormControl('', [Validators.required])
    });
  }

  public search() {
    this.spinner.show();
    this.searchData = this.searchCaqh.controls['searchValue'].value;
    this.pageNumber = 0;
    this.pagelimit = this.mycaqhtable.pageSize;
    this.getCaqhList(this.pageNumber, this.pagelimit, this.searchData);
  }

  public clearCaqhList() {
    this.spinner.show();
    this.searchCaqh.reset();
    this.searchData = "";
    this.pageNumber = 0;
    this.pagelimit = this.mycaqhtable.pageSize;
    this.getCaqhList(this.pageNumber, this.pagelimit, this.searchData);
  }

  public onLimitChange(limit) {
    this.pagelimit = limit;
    this.pageNumber = 0;
    this.getCaqhList(this.pageNumber, this.pagelimit, this.searchData);
  }


  public setPage(pageInfo) {
    this.pageNumber = pageInfo.offset;
    this.getCaqhList(this.pageNumber, this.pagelimit, this.searchData);
  }

  public getCaqhList(pNumber, pLimit, searchData) {
    
    // this.pageNumber = pageNumber;
    this.spinner.show();
    let dataParams = {
      page_number: pNumber,
      limit_of_page: pLimit,
      search_text: searchData,
    }
    this.datauploadViewService.getCaqhListData(dataParams).subscribe(
      data => {
        this.getCaqhDetails(data);
        console.log(data)
      },
      error => {
        this.notiService.showError(error, "", 4000);
        this.spinner.hide();
        this.router.navigate(['signin']);
      }
    )
  }

  private getCaqhDetails(data) {
    this.caqhData = data.list;
    this.caqhData.map(item => {
      item['date'] = this.datePipe.transform(item['date'], 'MM/dd/yyyy');
      if(item['updated_on'] == null){
        item['updated_on'] = '';
      }else{
        item['updated_on'] = this.datePipe.transform(item['updated_on'], 'MM/dd/yyyy');
      }
      
    })
    this.totalElements = data.total_count;
    this.spinner.hide();
  }



  public buildCreateProviderForm() {
    this.createProvider = this.formBuilder.group({
      customer_ids: new FormControl(null, [Validators.required]),
      tin_id: new FormControl(null, [Validators.required]),
      location_id: new FormControl(null, [Validators.required]),
      // form_id: new FormControl(null, [Validators.required]),
      upload_form: new FormControl('', [Validators.required])
    });
  }

  public buildUpdateCAQHForm() {
    this.updateCAQH = this.formBuilder.group({
      customer_ids: new FormControl(null, [Validators.required]),
      provider_id: new FormControl(null, [Validators.required]),
      update_upload_form: new FormControl('', [Validators.required])
    });
  }



  public getFormDropdown() {

    let params = {
      form_status_id: 2,
      is_active: 1,
      is_custom_form: 1
    }
    this.datauploadViewService.getFormList(params).subscribe(data => {
      this.formDropdownDetails(data)
    })
  }

  private formDropdownDetails(data) {
    console.log(data);
    this.formDropdownData = data.dropdown_list;

  }


  public getCustomerDropdown() {
    this.spinner.show();
    let params = {
      is_active: 1
    }
    this.datauploadViewService.getCustomerList(params).subscribe(data => {
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
      this.datauploadViewService.getTinList(params).subscribe(data => {
        this.tinDropdownDetails(data)
      })
    } else {
      let params = {
        tin_id: null,
        location_id: null
      }
      this.createProvider.patchValue(params);
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

      this.datauploadViewService.getLocationList(params).subscribe(data => {
        console.log(data)
        this.locationDropdownDetails(data)
      })
    } else {
      let params = {
        location_id: null
      }
      this.createProvider.patchValue(params);
      this.locationDropdowndata = [];
    }

  }

  private locationDropdownDetails(data) {
    
    this.spinner.hide();
    this.locationDropdowndata = data.dropdown_list
  //  let  Object.keys( this.locationDropdowndata).map(function(k){return this.locationDropdowndata[k]}).join(",");
    this.locationDropdowndata.map(item =>{
      item['practice__add1'] = item['practice__add1'] == null ? ' ' : item['practice__add1'];
      item['practice__add2'] = item['practice__add2'] == null ? ' ' : item['practice__add2'];
      item['label'] = item['practice_name']+' '+item['practice__add1']+' ' + item['practice__add2'] 
    })
  }

  fileChange(e) {
    let UploadLabel = [];
    for (var i = 0; i < e.target.files.length; i++) {
      this.myFiles.push(e.target.files[i]);
      UploadLabel.push(e.target.files[i].name)
    }
    console.log(this.myFiles);

    this.selectedFiles = UploadLabel.join()
   // console.log(uploadLabelData);
    this.uploadFileInput.nativeElement.nextSibling.innerHTML = e.target.files.length + ' selected';
  }

  public addProvider() {

    let postParams = new FormData();

    for (var i = 0; i < this.myFiles.length; i++) {
      postParams.append("upload_file[]", this.myFiles[i]);
    }

    postParams.append('created_by', this.userId);
    postParams.append('uploaded_file_id', '0');
    postParams.append('form_status_id', '1');
    postParams.append('is_active', '1');
    postParams.append('customer_ids', this.createProvider.value.customer_ids);
    postParams.append('form_name', 'CAQH Form');
    postParams.append('location_id', this.createProvider.value.location_id);
    postParams.append('tin_id', this.createProvider.value.tin_id);
    // postParams.append('form_id', this.createProvider.value.form_id);
    console.log(postParams);
    this.spinner.show();
    this.datauploadViewService.postCAQHForm(postParams).subscribe(
      data => {
        this.postCAQHFormData(data);
      },
      error => {
        this.spinner.hide();
        this.notiService.showError(error, '', 4000)
        this.router.navigate(['signin']);
      })
  }

  public postCAQHFormData(data) {
    this.selectedFiles = '';
    this.uploadFileInput.nativeElement.nextSibling.innerHTML = '';
    this.myFiles = [];
    this.spinner.hide();
    if (data.success) {
      this.pageNumber = 0;
      this.pagelimit = this.mycaqhtable.pageSize;
      this.getCaqhList(this.pageNumber, this.pagelimit, this.searchData);
      this.notiService.showSuccess('CAQH Data Uploaded Successfully', '', 4000);
      this.createProvider.reset();
    } else {
      this.notiService.showError(data.error, '', 4000)
    }
  }

  public clear() {
    this.selectedFiles = '';
    this.myFiles = [];
    this.createProvider.reset();
    this.uploadFileInput.nativeElement.nextSibling.innerHTML = '';
  }

  public beforeChange(event) {

    if (event.nextId == 'insert') {
      console.log('CAQH INSERT');
      this.buildCreateProviderForm();
      // this.getCustomerDropdown();
    } else if (event.nextId == 'update') {
      console.log('CAQH Update');
      this.buildUpdateCAQHForm();

    }
  }

  public onCustomerUpdateChange(data) {
    console.log(data)

    if (data) {
      this.spinner.show();
      let params = {
        user_id: data,
        is_active: 1
      }
      this.datauploadViewService.getProviderUpdateCaqh(params).subscribe(data => {
        this.getTinUpdateChanges(data);

      })
    } else {
      console.log('delete')
      // let params = {
      //   tin_id: null,
      //   location_id: null
      // }
      // this.createProvider.patchValue(params);
      // this.tinDropdownData = [];
      // this.locationDropdowndata = [];
    }
  }

  private getTinUpdateChanges(data) {
    this.spinner.hide();
    if (data.success) {
      console.log(data)
      this.providerDropdownData = data.dropdown_list;
      this.providerDropdownData.map(item => {
        item['name'] = item['first_name'] + ' ' + item['last_name']
      })
    }
  }


  updateFileChange(e) {
    this.fileList = e.target.files[0];
    this.uploadUpdateFileInput.nativeElement.nextSibling.innerHTML = this.fileList.name;
  }

  public updateCAQHForm() {

    console.log(this.updateCAQH.value)

    this.spinner.show();

    let postUpadteParams = new FormData();

    postUpadteParams.append('upload_file', this.fileList, this.fileList.name);
    postUpadteParams.append('updated_by', this.userId);
    postUpadteParams.append('uploaded_file_id', '0');
    postUpadteParams.append('form_status_id', '1');
    postUpadteParams.append('is_active', '1');
    postUpadteParams.append('customer_ids', this.updateCAQH.value.customer_ids);
    postUpadteParams.append('form_name', 'CAQH update Form');
    postUpadteParams.append('provider_id', this.updateCAQH.value.provider_id);

    this.datauploadViewService.postUpdateCAQHForm(postUpadteParams).subscribe(
      data => {
        this.postUpdateCAQHFormData(data);
      },
      error => {
        this.spinner.hide();
        this.notiService.showError(error, '', 4000)
        this.router.navigate(['signin']);
      })
  }

  public forceUpdateCAQHForm() {
    this.spinner.show();

    console.log(this.fileList);
    console.log(this.updateCAQH.value)
    let postforceUpadteParams = new FormData();

    postforceUpadteParams.append('upload_file', this.fileList, this.fileList.name);
    postforceUpadteParams.append('updated_by', this.userId);
    postforceUpadteParams.append('uploaded_file_id', '0');
    postforceUpadteParams.append('form_status_id', '1');
    postforceUpadteParams.append('is_active', '1');
    postforceUpadteParams.append('customer_ids', this.updateCAQH.value.customer_ids);
    postforceUpadteParams.append('form_name', 'CAQH Force Update Form');
    postforceUpadteParams.append('provider_id', this.updateCAQH.value.provider_id);
    postforceUpadteParams.append('force_update', 'true');

    this.datauploadViewService.forceUpdateCAQHFrom(postforceUpadteParams).subscribe(
      data => {
        this.postUpdateCAQHFormData(data);
      },
      error => {
        this.spinner.hide();
        this.notiService.showError(error, '', 4000)
        this.router.navigate(['signin']);
      })
  }

  public postUpdateCAQHFormData(data) {

    if (data.popup && data.success) {

      this.openPopup();
    } else if (!data.popup && data.success) {
      this.providerDropdownData = []
      this.pageNumber = 0;
      this.pagelimit = this.mycaqhtable.pageSize;
      this.getCaqhList(this.pageNumber, this.pagelimit, this.searchData);
      this.notiService.showSuccess('CAQH Data Updated Successfully', '', 4000);
      this.uploadUpdateFileInput.nativeElement.nextSibling.innerHTML = '';
      this.updateCAQH.reset();
    } else if (!data.success) {
      this.notiService.showError(data.error, '', 4000);
    }
    this.spinner.hide();
  }

  public clearUpdateCAQH() {
    this.providerDropdownData = []
    this.updateCAQH.reset();
    this.uploadUpdateFileInput.nativeElement.nextSibling.innerHTML = '';
  }

  public openPopup() {


    const openConfirmPopup = this.modalService.open(DatauploadModalComponent, this.modalOption);
    // openConfirmPopup.componentInstance.content = addParams;

    openConfirmPopup.result.then((result) => {
      console.log(result);
      if (result == 'yes') {
        this.forceUpdateCAQHForm();
      }
    }).catch((error) => {
      console.log(error);
    });
  }




}
