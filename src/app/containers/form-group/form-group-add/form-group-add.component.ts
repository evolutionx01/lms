import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { FormGroupAddService } from '../services/form-group-add/form-group-add.service';
import { ToasterNotiService } from '../../../shared/services/notifications/toaster-noti.service';

@Component({
  selector: 'app-form-group-add',
  templateUrl: './form-group-add.component.html',
  styleUrls: ['./form-group-add.component.scss']
})
export class FormGroupAddComponent implements OnInit {

  public isDisableField: boolean;
  helpText: string;
  public group_id: any;
  public buttonTitle: string;
  public popupTitle: string;
  public showButton: boolean;

  @Input() popupType;

  public userId: any;
  public addGroup: FormGroup;
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
    if (this.popupType.group_type == 'add') {
      this.isDisableField = false;
    } else {
      this.isDisableField = true;
    }
    this.buildAddGroupForm();
    console.log(this.popupType)
    if (this.popupType.group_type == 'add') {
      console.log(this.popupType)
      this.showButton = false;
      this.popupTitle = 'Add Group';
      this.buttonTitle = 'Save';

    } else if (this.popupType.group_type == 'edit') {
      console.log(this.popupType)
      this.showButton = true;
      this.popupTitle = 'Edit Group';
      this.buttonTitle = 'Update'
      this.group_id = this.popupType.group_id

      this.addGroup.patchValue(this.popupType);
    }


  }

  public buildAddGroupForm() {
    let validators = this.isDisableField ? [] : [Validators.required];
    this.addGroup = this.formBuilder.group({
      group_name: new FormControl('', Validators.required),
      type_id: new FormControl({ value: null, disabled: this.isDisableField }, validators)
    })
  }

  public addGroupDetails() {

    this.addGroup.value.is_active = 1;
    this.addGroup.value.created_by = this.userId;

    if (this.popupType.group_type == 'add') {
      this.addGroup.value.group_id = 0;
      this.helpText = 'added';
    } else if (this.popupType.group_type == 'edit') {
      this.addGroup.value.group_id = this.group_id;
      this.helpText = 'updated';
      this.addGroup.value.type_id = this.addGroup.getRawValue().type_id
    }

    this.formGroupAddService.postGroupData(this.addGroup.value).subscribe(
      data => this.groupAddUpadteData(data)
    )
  }

  private groupAddUpadteData(data) {
    if (data.success) {
      this.activeModal.close('yes');
      this.notiService.showSuccess("Group " + this.helpText + " successfully", "", 4000);
    } else {
      //this.activeModal.close('no');
      this.notiService.showError(data.error, "", 4000);
    }
  }

  public reset() {
    this.addGroup.reset();
  }

}
