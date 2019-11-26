import { Component, OnInit, Attribute, Input, ViewChild, ElementRef } from '@angular/core';
import { DatePipe, NumberSymbol } from '@angular/common';
import { NgbModalOptions, NgbActiveModal, NgbModal, NgbDateStruct, NgbCalendar, NgbDateAdapter, NgbDateNativeAdapter } from '@ng-bootstrap/ng-bootstrap';
import { CustomerFormService } from '../services/customer-form/customer-form.service';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { CustomerModalComponent } from '../customer-modal/customer-modal.component';
import { ToasterNotiService } from '../../../shared/services/notifications/toaster-noti.service';
import { CommonService } from '../../../shared/services/common/common.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.scss'],
  providers: [DatePipe, { provide: NgbDateAdapter, useClass: NgbDateNativeAdapter }]
})

export class CustomerFormComponent implements OnInit {

  @ViewChild('uploadLogo') UploadLogo:ElementRef;
  fileList: any;
  userId: any;
  showButton: boolean;
  custID: any;
  licID: any;
  editData: any;
  buttonTitle: string;
  popupTitle: string;
  @Input() popupType;

  public stateDropdownData: Array<object>;
  public addCustomer: FormGroup;
  public phoneLength: number;
  private emailPattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  private mobilepattern = /^[0-9\s]*$/;

  private specialCharacter = /^[a-zA-Z0-9_ ,.()|]*$/;
  //private specialCharacter = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  modalOption: NgbModalOptions = {};

  constructor(
    private spinner: NgxSpinnerService,
    public activeModal: NgbActiveModal,
    private notiService: ToasterNotiService,
    private modalService: NgbModal,
    private custFormService: CustomerFormService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private commonService: CommonService
  ) { }

  ngOnInit() {
    this.userId = localStorage.getItem('userId');

    this.getMasterData();
    this.buildLoginForm();
    if (this.popupType.type == 'add') {
      this.showButton = false;
      this.popupTitle = 'Add Customer';
      this.buttonTitle = 'Save';
    } else if (this.popupType.type == 'edit') {
      console.log(this.popupType);
      this.showButton = true;
      this.popupTitle = 'Edit Customer';
      this.buttonTitle = 'Update'
      this.custID = this.popupType.customer_id
      this.licID = this.popupType.license_id;
      this.addCustomer.patchValue(this.popupType);
    }
    console.log(this.addCustomer.controls['customer'].hasError('required'))
    console.log(this.addCustomer.controls['customer'])
    console.log(this.addCustomer.controls['customer'].errors)
  }





  public getMasterData() {
    this.custFormService.getMasterDeatils().subscribe(
      data => {
        this.stateDetails(data);
      }
    )
  }

  stateDetails(data) {
    this.stateDropdownData = data.state_list;
  }

  buildLoginForm() {
    this.addCustomer = this.formBuilder.group({
      customer: new FormControl('', [Validators.required, Validators.pattern(this.specialCharacter)]), //, this.validateName
      address: new FormControl(''),
      city: new FormControl(''),
      state: new FormControl(null, Validators.required),
      zip: new FormControl('', [Validators.pattern(this.mobilepattern)]),
      first_name: new FormControl('', Validators.required),
      middle_name: new FormControl(''),
      last_name: new FormControl('', Validators.required),
      phone_num: new FormControl('', [Validators.required, Validators.pattern(this.mobilepattern)]),
      initial_provider: new FormControl('', [Validators.required, Validators.pattern(this.mobilepattern)]),
      email: new FormControl('', [Validators.required, Validators.pattern(this.emailPattern)]),
      no_of_users: new FormControl(''),
      no_of_tins: new FormControl(''),
      no_of_locations: new FormControl(''),
      eff_from: new FormControl('', Validators.required),
      expires_on: new FormControl('', Validators.required),
      effective_date_contract: new FormControl('', Validators.required),
      renewal_date_contract: new FormControl('', Validators.required),
      pay_per_form: new FormControl('yes'),
      special_terms: new FormControl(''),
      customer_logo: new FormControl('')
    })
  }

  testChange(){
    console.log(this.addCustomer.controls['customer']);
  }

  validateName(form) {
    return form.value.trim() !== ""
      ? null
      : {
          validateName: {
            errors: true
          }
        };
  }

  validateMinMax(min, max) {
    return ['', [
      Validators.required,
      Validators.minLength(min),
      Validators.maxLength(max),
      Validators.pattern('[0-9]+')  // validates input is digit
    ]]
  }

  public addCustomerDetails() {
    this.spinner.show();
    this.addCustomer.value.eff_from = this.datePipe.transform(this.addCustomer.value.eff_from, 'yyyy-MM-dd hh:mm:ss');
    this.addCustomer.value.expires_on = this.datePipe.transform(this.addCustomer.value.expires_on, 'yyyy-MM-dd hh:mm:ss');
    this.addCustomer.value.effective_date_contract = this.datePipe.transform(this.addCustomer.value.effective_date_contract, 'yyyy-MM-dd hh:mm:ss');
    this.addCustomer.value.renewal_date_contract = this.datePipe.transform(this.addCustomer.value.renewal_date_contract, 'yyyy-MM-dd hh:mm:ss');
    this.addCustomer.value.gender = 0;
    this.addCustomer.value.mobile_num = '';
    // this.addCustomer.value.type_id = 2;
    // this.addCustomer.value.role_id = 1;
    this.addCustomer.value.employe_id = '';
    this.addCustomer.value.created_update_by = this.userId;
    this.addCustomer.value.is_active = 1;
    // this.addCustomer.value.user_password = "aravinth";
    this.addCustomer.value.accessible_states = '';
    this.addCustomer.value.accessible_payers = '';
    this.addCustomer.value.create_upd_by = this.userId;
    this.addCustomer.value.is_active_license = 1;
    this.addCustomer.value.chk_bit = 0;
    if(!this.fileList){
      this.fileList = {
        name: ''
      };
    }
   this.addCustomer.value.zip = this.addCustomer.value.zip == null ? '' : this.addCustomer.value.zip;

    
    let postParams = new FormData();

    var file = new Blob([
      JSON.stringify(this.fileList)
   ], { type: 'application/json' });
    postParams.append('customer',this.addCustomer.value.customer);
    postParams.append('customer_logo', file, this.fileList.name);
    postParams.append('first_name', this.addCustomer.value.first_name);
    postParams.append('middle_name', this.addCustomer.value.middle_name);
    postParams.append('last_name', this.addCustomer.value.last_name);
    postParams.append('gender', this.addCustomer.value.gender);
    postParams.append('email', this.addCustomer.value.email);
    postParams.append('address', this.addCustomer.value.address);
    postParams.append('city', this.addCustomer.value.city);
    postParams.append('state',this.addCustomer.value.state);
    postParams.append('zip',this.addCustomer.value.zip);
    postParams.append('phone_num', this.addCustomer.value.phone_num);
    postParams.append('mobile_num', this.addCustomer.value.mobile_num);
    postParams.append('employe_id', this.addCustomer.value.employe_id);
    postParams.append('created_update_by', this.addCustomer.value.created_update_by);
    postParams.append('is_active', this.addCustomer.value.is_active);
    postParams.append('eff_from', this.addCustomer.value.eff_from );
    postParams.append('expires_on',this.addCustomer.value.expires_on);
    postParams.append('effective_date_contract', this.addCustomer.value.effective_date_contract );
    postParams.append('renewal_date_contract', this.addCustomer.value.renewal_date_contract);
    postParams.append('accessible_states', this.addCustomer.value.accessible_states);
    postParams.append('accessible_payers',this.addCustomer.value.accessible_payers);
    postParams.append('creat_upd_by', this.addCustomer.value.create_upd_by);
    postParams.append('chk_bit',this.addCustomer.value.chk_bit);    
    postParams.append('is_active_license', this.addCustomer.value.is_active_license);
    postParams.append('pay_per_form',this.addCustomer.value.pay_per_form);
    postParams.append('special_terms',this.addCustomer.value.special_terms);
    postParams.append('initial_provider',this.addCustomer.value.initial_provider);
    
  
console.log(postParams)
    if (this.popupType.type == 'edit') {
      console.log('edit');
      postParams.append('license_id',this.licID);
      postParams.append('user_id',this.custID);
      // this.addCustomer.value.license_id = this.licID;
      // this.addCustomer.value.user_id = this.custID;
      this.custFormService.postEditCustomerDetails(postParams).subscribe(
        data => this.updateCustData(data)
      )
    } else if (this.popupType.type == 'add') {
      this.custFormService.addCustomerService(postParams).subscribe(
        data => {
          this.addCustPopup(data);
        }
      )
    }
  }

  public addCustPopup(data) {
    this.spinner.hide();
    if (data.success) {
      this.activeModal.close('yes');
      //this.commonService.customerAdded(data.success);
      this.notiService.showSuccess("Customer added successfully", "", 4000);
    } else {
      this.notiService.showError(data.error, "", 4000);
    }
  }

  public updateCustData(data) {
    
    this.spinner.hide();
    if (data.success) {
      this.activeModal.dismiss();
      this.commonService.customerAdded(data.success);
      this.notiService.showSuccess("Customer updated successfully", "", 4000);
    } else {
      this.notiService.showError(data.error, "", 4000);
    }
  }

  reset() {
    this.UploadLogo.nativeElement.nextSibling.innerHTML = '';
    this.addCustomer.reset({'customer': ''})

    console.log(this.addCustomer.value)
  }

  fileChange(event) {
    this.fileList = event.target.files[0];
    this.UploadLogo.nativeElement.nextSibling.innerHTML = this.fileList.name;
  }

}
