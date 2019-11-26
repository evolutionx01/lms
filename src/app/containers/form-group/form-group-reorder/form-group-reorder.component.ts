import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { FormGroupReorderService } from '../services/form-group-reorder/form-group-reorder.service';
import { ToasterNotiService } from '../../../shared/services/notifications/toaster-noti.service';

@Component({
  selector: 'app-form-group-reorder',
  templateUrl: './form-group-reorder.component.html',
  styleUrls: ['./form-group-reorder.component.scss']
})
export class FormGroupReorderComponent implements OnInit {

  popupTitle: string;
  @Input() dataStatus;
  public reorderForm: FormGroup;

  private mobilepattern = /[0-9\+\-\ ]/;

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    public formGroupReorderService: FormGroupReorderService,
    private notiService: ToasterNotiService
  ) { }

  ngOnInit() {
    console.log(this.dataStatus);
    
    if(this.dataStatus.type == 'group'){
      this.popupTitle = 'Re-Order Group'
    }else if(this.dataStatus.type == 'subgroup'){
      this.popupTitle = 'Re-Order Sub Group'
    }else if(this.dataStatus.type == 'formFields'){
      this.popupTitle = 'Re-Order Form Fields'
    }
    this.buildReorderForm();
    this.reorderForm.patchValue(this.dataStatus)
    // {"group_id":12,"old_order_id":3,"new_order_id":5}
  }

  buildReorderForm() {
    this.reorderForm = this.formBuilder.group({
      
      old_order_id: new FormControl({value:'', disabled: true}, [Validators.required]),
      new_order_id: new FormControl('', [Validators.required, Validators.pattern(this.mobilepattern)])
    });
  }

  actionClicked(data) {
    if(data == 'save'){

      
      console.log(this.reorderForm.getRawValue().old_order_id)
      this.reorderForm.value.old_order_id = this.reorderForm.getRawValue().old_order_id
      if(this.dataStatus.type == 'group'){
        this.reorderForm.value.group_id = this.dataStatus.group_id;
        
        this.formGroupReorderService.postReorderFormGroup(this.reorderForm.value).subscribe(
          data=>this.reorderDetails(data)
        )
      }else if(this.dataStatus.type == 'subgroup'){
        this.reorderForm.value.sub_group_id = this.dataStatus.sub_group_id;
        this.formGroupReorderService.postReorderFormSubGroup(this.reorderForm.value).subscribe(
          data=>this.reorderDetails(data)
        )
      }else if(this.dataStatus.type == 'formFields'){
        this.reorderForm.value.group_field_id = this.dataStatus.group_field_id;
        this.formGroupReorderService.postReorderFormFields(this.reorderForm.value).subscribe(
          data=>this.reorderDetails(data)
        )
      }
      
      

    }else if(data == 'cancel'){
      this.activeModal.close('no');
    }
  }

  private reorderDetails(data){
    if(data.success){
      this.activeModal.close('yes');
      this.notiService.showSuccess(this.dataStatus.type+ " reordered successfully", "", 4000);
    }else{
      this.notiService.showError(data.error, "", 4000);
    }
  }
  

}
