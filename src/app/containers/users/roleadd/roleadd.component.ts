import { Component, OnInit, Input} from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbModalOptions, NgbActiveModal, NgbModal, NgbDateStruct, NgbCalendar, NgbDateAdapter, NgbDateNativeAdapter } from '@ng-bootstrap/ng-bootstrap';
import { ToasterNotiService } from '../../../shared/services/notifications/toaster-noti.service';
import  { UsersviewService } from '../services/userview/usersview.service';
import { CommonService } from '../../../shared/services/common/common.service';


@Component({
  selector: 'app-roleadd',
  templateUrl: './roleadd.component.html',
  styleUrls: ['./roleadd.component.scss']
})
export class RoleaddComponent implements OnInit {
  modalOption: NgbModalOptions = {};
  public addrole: FormGroup;
  public popupTitle: string;
  public buttonTitle: string;
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

  ) { }

  ngOnInit() {
    this.buildaddform();
    if (this.popupType == 'add') {  
      this.showhide = true;                
      this.popupTitle = 'Add User Role';
      this.buttonTitle = 'Save';
     }else if (this.popupType == 'edit') {
      this.showhide = false;
      this.popupTitle = 'Edit User Role';
      this.buttonTitle = 'Update';
    }
    if(this.dataStatus){
      let formdata = {
        role_id: this.dataStatus
      }

      this.userservice.edituserrole(formdata).subscribe(data=>{
         this.addrole.patchValue({
          role:data['user_detail'][0].role,
          description:data['user_detail'][0].description
         });
       })
     }
  }
  buildaddform(){
    this.addrole = this.formBuilder.group({
      role:new FormControl('',[Validators.required]),
      description:new FormControl('',[Validators.required])
    })

  }

  addsaveDetails(){
    this.spinner.show();
    this.addrole.value.role;
    this.addrole.value.description;
    if (this.popupType == 'add') {
      this.userservice.adduserrole(this.addrole.value).subscribe(data=>{
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
    this.addrole.value.role_id=this.dataStatus;
    this.userservice.updateuserrole(this.addrole.value).subscribe(data=>{
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

  clearrole(){
    this.addrole.reset();
  }

  

}
