import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { FormGroupAddService } from '../services/form-group-add/form-group-add.service';
import { ToasterNotiService } from '../../../shared/services/notifications/toaster-noti.service';

@Component({
  selector: 'app-form-subgroup-add',
  templateUrl: './form-subgroup-add.component.html',
  styleUrls: ['./form-subgroup-add.component.scss']
})
export class FormSubgroupAddComponent implements OnInit {

  subgroup_id: any;
  helpText: string;
  public group_id: any;
  public buttonTitle: string;
  public popupTitle: string;
  public showButton: boolean;

  @Input() popupType;

  public userId: any;
  public addSubGroup: FormGroup;
  public groupTypeData = [
    { type: 'TIN', type_id: 1 },
    { type: 'Location', type_id: 2 },
    { type: 'Provider', type_id: 3 }
  ];
  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private formGroupAddService: FormGroupAddService,
    private notiService: ToasterNotiService,
  ) { }

  ngOnInit() {
    this.userId = localStorage.getItem('userId');
    this.group_id = this.popupType.group_id;
    this.buildAddSubGroupForm();
    console.log(this.popupType)
    if (this.popupType.group_type == 'add') {
      console.log(this.popupType)
      this.showButton = false;
      this.popupTitle = 'Add Sub Group';
      this.buttonTitle = 'Save';
    } else if (this.popupType.group_type == 'edit') {
      console.log(this.popupType)
      this.showButton = true;
      this.popupTitle = 'Edit Sub Group';
      this.buttonTitle = 'Update'
      this.subgroup_id = this.popupType.sub_group_id

      if(this.popupType.is_multi_instance == 0){
        this.popupType.is_multi_instance = false;
      }else if(this.popupType.is_multi_instance == 1){
        this.popupType.is_multi_instance = true;
      }
      
      this.addSubGroup.patchValue(this.popupType);
    }

  }

  public buildAddSubGroupForm() {
    this.addSubGroup = this.formBuilder.group({
      sub_group_name: new FormControl('', Validators.required),
      is_multi_instance: new FormControl(null)
    })
  }

  public addSubGroupDetails() {

  
    console.log(this.addSubGroup.value);
    if(this.addSubGroup.value.is_multi_instance){
      this.addSubGroup.value.is_multi_instance = 1;
    }else{
      this.addSubGroup.value.is_multi_instance = 0;
    }

    console.log(this.addSubGroup.value);


    this.addSubGroup.value.created_by = this.userId;
    this.addSubGroup.value.group_id = this.group_id;
    

    if(this.popupType.group_type == 'add'){
      this.addSubGroup.value.sub_group_id = 0;
      this.addSubGroup.value.order_id = 2;
      this.helpText = 'added';
    }else if(this.popupType.group_type == 'edit'){
      this.addSubGroup.value.sub_group_id = this.subgroup_id;
      this.addSubGroup.value.order_id = this.popupType.order_id;
      this.helpText = 'updated';
    }

    this.formGroupAddService.postSubGroupData(this.addSubGroup.value).subscribe(
      data => this.subGroupAddUpadteData(data)
    )
  }

  private subGroupAddUpadteData(data){
    if(data.success){
      this.activeModal.close('yes');
      this.notiService.showSuccess("Sub Group "+this.helpText+" successfully", "", 4000);
    }else{
     // this.activeModal.close('no');
      this.notiService.showError(data.error, "", 4000);
    }
  }

  public reset() {
    this.addSubGroup.reset();
  }

}
