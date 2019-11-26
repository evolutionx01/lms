import { Component, OnInit ,Input} from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators ,AbstractControl} from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbModalOptions, NgbActiveModal, NgbModal, NgbDateStruct, NgbCalendar, NgbDateAdapter, NgbDateNativeAdapter } from '@ng-bootstrap/ng-bootstrap';
import { ToasterNotiService } from '../../../shared/services/notifications/toaster-noti.service';

import  { UsersviewService } from '../services/userview/usersview.service';
import { forkJoin } from 'rxjs';
import { CommonService } from '../../../shared/services/common/common.service';

@Component({
  selector: 'app-useradd',
  templateUrl: './useradd.component.html',
  styleUrls: ['./useradd.component.scss']
})
export class UseraddComponent implements OnInit {

  private emailPattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  private mobilepattern = /[0-9\+\-\ ]/;
  modalOption: NgbModalOptions = {};
  public adduser: FormGroup;
  public popupTitle: string;
  public buttonTitle: string;
  statedata: any;
  roledata:any;
  @Input() popupType;
  @Input() dataStatus;
  public showhide : boolean;
 
  constructor(
    private spinner: NgxSpinnerService,
    public activeModal: NgbActiveModal,
    private toast: ToasterNotiService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private userservice: UsersviewService,
    private commonService: CommonService,
  ) {}

  ngOnInit() {
    this.buildaddform();
    this.getdropdowns();
    if (this.popupType == 'add') {  
      this.popupTitle = 'Add User';
      this.buttonTitle = 'Save';
      this.showhide = true; 
     }else if (this.popupType == 'edit') {
      this.popupTitle = 'Edit User';
      this.buttonTitle = 'Update';
      this.showhide = false;
    }

    if(this.dataStatus){
      let formdata = {
        user_id: this.dataStatus
      }

      this.userservice.edituser(formdata).subscribe(data=>{
        this.adduser.patchValue({
          first_name:data['user_detail'].first_name,
          last_name:data['user_detail'].last_name,
          email: data['user_detail'].email,
          password:data['user_detail'].password_,
          confirmedPassword:data['user_detail'].password_,
          role_id: data['user_detail'].role_id,
          mobile:data['user_detail'].mobile
          });
       })
     }
  }

  buildaddform(){
    this.adduser = this.formBuilder.group({
      first_name:new FormControl('',[Validators.required]),
      last_name:new FormControl('',[Validators.required]),
      email: new FormControl('', [Validators.required, Validators.pattern(this.emailPattern)]),
      password:new FormControl('',[Validators.required,Validators.minLength(8)]),
      confirmedPassword:new FormControl('',[Validators.required]),
      role_id: new FormControl(null,[Validators.required]),
      mobile:new FormControl('',[Validators.required,Validators.pattern(this.mobilepattern)])
    },{
      validator: this.passwordConfirming


    })
  }

  passwordConfirming(c: AbstractControl): any {
    if (c.get('password').value !== c.get('confirmedPassword').value) {
        c.get('confirmedPassword').setErrors({ matchPassword: true });
    }
}

  getdropdowns(){
    this.userservice.getuserrole().subscribe(
      data => {
        this.roledata = data['user_roles'];
      });
  }

  addsaveDetails(){
    this.spinner.show();
    this.adduser.value.first_name;
    this.adduser.value.last_name;
    this.adduser.value.role_id;
    this.adduser.value.email;
    this.adduser.value.password;
    this.adduser.value.mobile;
    this.adduser.value.created_by=3;
    this.adduser.value.is_active=1;
    if (this.popupType == 'add') {
      this.userservice.adduser(this.adduser.value).subscribe(data=>{
            if(data['success']==true){
              this.toast.showSuccess(data['message'], "", 4000);
              this.commonService.customerAdded(true);
              this.spinner.hide();
              this.activeModal.dismiss('Cross click');
            }
            else {
              this.spinner.hide();
            this.toast.showError(data['error'], "", 4000);
            }
    })
  }
  else if (this.popupType == 'edit') {
    this.adduser.value.user_id=this.dataStatus;
    this.userservice.updateuser(this.adduser.value).subscribe(
      data => {
        if(data['success']==true){
                this.toast.showSuccess(data['message'], "", 4000);
                this.commonService.customerAdded(true);
                this.spinner.hide();
                this.activeModal.dismiss('Cross click');
              }
              else {
                this.spinner.hide();
              this.toast.showError(data['error'], "", 4000);
              }
      })
  }
  }

  clearuser(){
    this.adduser.reset();
  }



  }

