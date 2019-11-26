import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { FormAddService } from '../services/form-add/form-add.service';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { ToasterNotiService } from '../../../shared/services/notifications/toaster-noti.service';
import { NgOption } from '@ng-select/ng-select';
import { validateConfig } from '@angular/router/src/config';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormViewService } from '../services/form-view/form-view.service';
import { CommonService } from '../../../shared/services/common/common.service';
import { FormAddModalComponent } from '../form-add-modal/form-add-modal.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form-add',
  templateUrl: './form-add.component.html',
  styleUrls: ['./form-add.component.scss']
})


export class FormAddComponent implements OnInit {
  public fileChanged: any;
  private base64textString: String = "";
  public userId: any;
  public payerdata: object;
  formtypedata: any;
  form_field_id: number[] = [];
  public uploaded_file: string;
  public totalElements: number;
  statedata: any;
  public formBuilderData: any;
  customerName: any;
  public uploadform: FormGroup;
  public filePath: any;
  public formdata: object;
  public fileList;
  message: string;
  @Input() dataStatus;
  public orders = [
    { id: 1, name: 'Tin' },
    { id: 2, name: 'Location' },
    { id: 3, name: 'Provider' }
  ];
  public showhide: boolean;
  public showtitle: boolean;
  //public showfile: boolean;
  public showrelease: boolean;
  public showisneed: boolean;
  public is_need_field: boolean = true;
  public form_status;
  public isneed;
  @ViewChild('uploadfileinput') uploadFileInput: ElementRef;
  get formCheckboxData() { return <FormArray>this.uploadform.get('orders'); }
  modalOption: NgbModalOptions = {};
  constructor(
    private toast: ToasterNotiService,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private formService: FormAddService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private FormviewService: FormViewService,
    private commonService: CommonService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.buildform();
    this.userId = localStorage.getItem('userId');
    this.getdropdowndata();
    this.showhide = true;
    this.showtitle = true;
    //this.showfile = true;
    this.showrelease = true;
    this.showisneed = true;
    if (this.dataStatus) {
      this.showhide = false;
      this.showtitle = false;
      //this.showfile = false;
      this.showrelease = false;
    }

    if (this.dataStatus) {
      let formdata = {
        "form_id": this.dataStatus
      }
      this.formService.showform_details(formdata).subscribe(data => {
        this.form_status = data['details'].form_status_id;

        this.isneed = +data['details'].is_need_fields;
        this.is_need_field = this.isneed == 0 ? false : true;
        let rdobtns = this.uploadform.get('field_needed');
        if (this.is_need_field) {
          rdobtns.disable();
        }
        if (this.form_status === 2 || this.form_status === 3) {
          this.showrelease = true;
        }

        let states = data['details'].applicable_states ? data['details'].applicable_states.split("~") : [];
        let stateids = states.map(ele => {
          return ele = parseInt(ele);
        });

        let form_fieds = data['details'].form_loc_id ? data['details'].form_loc_id.split("~") : [];
        this.form_field_id = form_fieds.map(ele => {
          return ele = parseInt(ele);
        });

        this.uploaded_file = data['details'].uploaded_file_id;
        this.uploadform.patchValue({
          form_name: data['details'].form_name,
          form_description: data['details'].form_description,
          file: data['details'].url,
          field_needed: data['details'].is_need_fields,
          customer: data['details'].customer_id,
          state: stateids,
          formtype: data['details'].form_type_id,
          payer: data['details'].payer_id,
          is_custom_form: data['details'].is_custom_form == 1 ? true : false
          // orders: this.form_field_id  
        });
        this.uploadFileInput.nativeElement.nextSibling.innerHTML = data['details'].url;
      });

    }

  }


  buildform() {
    //let validators = this.showfile ? [Validators.required] : [];
    const controls = this.orders.map(c => new FormControl());
    this.uploadform = this.formBuilder.group({
      form_name: new FormControl('', [Validators.required]),
      //upload_form: new FormControl({ value: '', disabled: !this.showfile ? true : false }, validators),
      file: new FormControl('', [Validators.required]),
      form_description: new FormControl(''),
      field_needed: new FormControl('', Validators.required),
      orders: new FormArray(controls),
      customer: new FormControl(null),
      state: new FormControl(null, Validators.required),
      formtype: new FormControl(null, Validators.required),
      payer: new FormControl(null, Validators.required),
      is_custom_form: new FormControl(null)
    });
    // if (this.showfile) {
    //   controls[0].setValue(true);
    //   this.form_field_id.push(1);
    // }
  }

  onCheckboxChange(event) {
    console.log(event);
    console.log(this.uploadform.value)
  }

  checkStatus(checkboxId) {
    return this.form_field_id.includes(checkboxId);
  }

  public getdropdowndata() {
    let dataParams = {
      "code": "payer",
      "item_id": ''
    }
    let payerresponse$ = this.formService.getpayerdropdown(dataParams);
    let stateresponse$ = this.formService.getstates();
    let customerresponse$ = this.formService.getCustomers();
    let dataParamsform = {
      page_number: "",
      limit_of_page: ""
    }
    let formresponse$ = this.formService.getformtype(dataParamsform);
    forkJoin([payerresponse$, stateresponse$, formresponse$, customerresponse$]).subscribe(
      data => {
        this.payerdata = data[0]['dropdown_list'];
        this.statedata = data[1]['states_list'];
        this.formtypedata = data[2]['form_types_list'];
        this.customerName = data[3]['customerslist'];
      });
  }

  updateChkbxArray(event, id) {
    if (event.target.checked) {
      this.form_field_id.push(id);
    }
    else {
      let index = this.form_field_id.indexOf(id);
      this.form_field_id.splice(index, 1);
    }
  }

  fileChange(event) {
    console.log(event)
    console.log(event.target.files[0])
    console.log(this.uploadFileInput)
    this.fileChanged = true;
    this.fileList = event.target.files[0];
    this.uploadFileInput.nativeElement.nextSibling.innerHTML = event.target.files.length + ' selected'; 
    // this.selectedFileName = this.fileList.name;
    this.uploadform.patchValue({ 'file': this.fileList.name })

    if (this.fileList) {
      var reader = new FileReader();

      reader.onload = this._handleReaderLoaded.bind(this);

      reader.readAsBinaryString(this.fileList);
    }
  }

  _handleReaderLoaded(readerEvt) {
    var binaryString = readerEvt.target.result;
    this.base64textString = btoa(binaryString);
    //console.log(btoa(binaryString));
    console.log(this.uploadform.value)
  }

  addFormDetails(data) {
    
    this.spinner.show();
    const selectedOrderIds = this.uploadform.value.orders
      .map((v, i) => v ? this.orders[i].id : null)
      .filter(v => v !== null);
    let postParams = new FormData();
    postParams.append('form_name', this.uploadform.value.form_name);
    // postParams.append('form_name', '');
    postParams.append('upload_file', this.fileList, this.fileList.name);
    postParams.append('created_by', this.userId);
    postParams.append('uploaded_file_id', '0');
    postParams.append('payer_id', this.uploadform.value.payer);
    postParams.append('form_type_id', this.uploadform.value.formtype);
    postParams.append('form_loc_id', selectedOrderIds);
    postParams.append('is_need_fields', this.uploadform.value.field_needed);
    postParams.append('applicable_states', this.uploadform.value.state);
    postParams.append('form_description', this.uploadform.value.form_description);
    postParams.append('form_status_id', data);
    postParams.append('is_active', '1');
    postParams.append('delete_missing_fields', '0');
    postParams.append('customer_ids', this.uploadform.value.customer == null ? '0' : this.uploadform.value.customer);
    postParams.append('is_custom_form', this.uploadform.value.is_custom_form ? '1' : '0');

    console.log(postParams)

    this.formService.addformdetails(postParams).subscribe(item => {
      this.addFormUploadDetailsStatus(item)
    },
      error => {
        this.activeModal.dismiss('Cross click');
        this.router.navigate(['']);
        this.toast.showError(error, "", 4000);
        this.spinner.hide();

      });
  }

  private addFormUploadDetailsStatus(data) {
    this.fileChanged = false;
    this.spinner.hide();
    if (data.success) {
      this.toast.showSuccess("Form Added successfully", "", 4000);
      this.commonService.customerAdded(true);

      this.activeModal.dismiss('Cross click');
    }
    else {
      this.toast.showError(data.error, "", 4000);
    }
  }

  clearDetails() {
    this.uploadform.reset();
  }

  public selectAll() {
    let selectedState = [];
    this.statedata.map(x => {
      selectedState.push(x.state_id)
    });
    this.uploadform.patchValue({ 'state': selectedState })
  }

  public unselectAll() {
    this.uploadform.patchValue({ 'state': [] })
  }

  updateFormDetails(missing_fields, type) {

    if(type == 'release'){
      this.form_status = 2;
    }
    
    let upload_field_val = this.uploadform.value.field_needed ? this.uploadform.value.field_needed : this.isneed;
    //this.spinner.show();
    const selectedOrderIds = this.form_field_id.toString();

    let postParams = new FormData();
    postParams.append('form_name', this.uploadform.value.form_name);
    if (this.fileChanged) {
      postParams.append('upload_file', this.fileList, this.fileList.name);
    }
    postParams.append('created_by', this.userId);
    postParams.append('uploaded_file_id', this.uploaded_file);
    postParams.append('payer_id', this.uploadform.value.payer);
    postParams.append('form_type_id', this.uploadform.value.formtype);
    postParams.append('form_loc_id', selectedOrderIds);
    postParams.append('is_need_fields', upload_field_val);
    postParams.append('applicable_states', this.uploadform.value.state);
    postParams.append('form_description', this.uploadform.value.form_description);
    postParams.append('form_status_id', this.form_status);
    postParams.append('is_active', '1');
    postParams.append('customer_ids', this.uploadform.value.customer);
    postParams.append('is_custom_form', this.uploadform.value.is_custom_form ? '1' : '0');
    postParams.append('delete_missing_fields', missing_fields);

    this.formService.addformdetails(postParams).subscribe(item => {
      this.updateFormUploadDetailsStatus(item)
    },
    error => {
      // this.activeModal.dismiss('Cross click');
      // this.router.navigate(['']);
      this.toast.showError(error, "", 4000);
      this.spinner.hide();
    });
  }

  private updateFormUploadDetailsStatus(data) {

    if (data.success) {
      if (data.confirm_popup == 1) {
        this.activeModal.dismiss('Cross click');
        this.modalOption.backdrop = 'static';
        this.modalOption.keyboard = false;
        this.modalOption.size = "lg";
        this.modalOption.centered = true;
        const modalRef = this.modalService.open(FormAddModalComponent, this.modalOption);
        modalRef.componentInstance.dataStatus = data.error;
        modalRef.result.then((result) => {
          console.log(result)
          if(result == 'yes'){
           this.updateFormDetails(1, 'edit');
          }else{

          }
        })
      } else {
        this.toast.showSuccess(data.message, "", 4000);
        this.commonService.customerAdded(true);
        //this.spinner.hide();
        this.activeModal.dismiss('Cross click');
      }

    }
    else {
      // this.spinner.hide();
      this.toast.showError(data.error, "", 4000);
    }
  }


}
