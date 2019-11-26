import { Component, OnInit, Input } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbActiveModal, NgbModal, NgbDateAdapter, NgbDateNativeAdapter } from '@ng-bootstrap/ng-bootstrap';
import { ToasterNotiService } from '../../../shared/services/notifications/toaster-noti.service';
import { FormBrowserService } from '../services/form-browser/form-browser.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-form-browser-add',
  templateUrl: './form-browser-add.component.html',
  styleUrls: ['./form-browser-add.component.scss'],
  providers: [DatePipe, { provide: NgbDateAdapter, useClass: NgbDateNativeAdapter }]
})
export class FormBrowserAddComponent implements OnInit {

  @Input() popupType;

  public uploadform: FormGroup;
  public userId: any;
  public showAdd: boolean
  public modelTitle: string;

  private specialCharacter = /^[a-zA-Z0-9_ ,.()|]*$/;

  private urlPattern = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/

  constructor(
    private spinner: NgxSpinnerService,
    public activeModal: NgbActiveModal,
    private notiService: ToasterNotiService,
    private modalService: NgbModal,
    private formBrowserService: FormBrowserService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
  ) { }



  ngOnInit() {
    console.log(this.popupType)
    this.userId = localStorage.getItem('userId');
    this.buildFormUpload();

    if (this.popupType.type == 'add') {
      this.modelTitle = 'Create Form'
      this.showAdd = true;
    } else {
      this.modelTitle = 'Edit Form'
      this.showAdd = false;
      this.uploadform.patchValue({ form_url: this.popupType.form_data })
    }
  }



  public buildFormUpload() {
    this.uploadform = this.formBuilder.group({
      form_url: new FormControl('',[ Validators.required, Validators.pattern(this.urlPattern)])
    })
  }

  public createUpdateFormBrowser(type) {
    this.spinner.show()
    let params = {
      uploaded_file_id: 0,
      form_name: this.uploadform.value.form_url,
      created_by: this.userId,
      is_active: 1,
      upload_file: this.uploadform.value.form_url,
      delete_missing_fields: 0
    }

    this.formBrowserService.postFormBrowser(params).subscribe(data => {
      this.formbrowsercreateDetails(data)
    })
  }

  private formbrowsercreateDetails(data) {
    console.log(data)
    this.spinner.hide()
    if (data.success) {
      this.notiService.showSuccess(data.message, '', 4000)
      this.activeModal.close('yes');
    } else {
      this.notiService.showError(data.error, '', 4000)
    }
  }

  public clearDetails(){
    this.uploadform.reset()
  }


}
