import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-access-privilege-edit',
  templateUrl: './access-privilege-edit.component.html',
  styleUrls: ['./access-privilege-edit.component.scss']
})

export class AccessPrivilegeEditComponent implements OnInit {

  public modalTitle: any;
  public buttonTitle: any;
  public buttonCancel: any;

  public showSaveButton: boolean

  public apiAccessUrl: FormGroup;

  //private urlPattern = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
  private urlPattern = /^(http(s)?:\/\/)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/
  @Input() dataStatus;

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {

    console.log(this.dataStatus)
    this.buildApiAccessForm()  
    if(this.dataStatus.domain_name != ""){
      this.apiAccessUrl.patchValue({url:this.dataStatus.domain_name})
    }

  }

  public buildApiAccessForm() {
    this.apiAccessUrl = this.formBuilder.group({
      url: new FormControl('', [Validators.required, Validators.pattern(this.urlPattern)])
    });
  }

  actionClicked(data) {
    let callBackData = {
      updated_domain: this.apiAccessUrl.value.url,
      action: data
    }
    this.activeModal.close(callBackData)

  }

}



