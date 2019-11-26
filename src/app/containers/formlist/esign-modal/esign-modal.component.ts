import { Component, OnInit,Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { FormViewService } from '../services/form-view/form-view.service';
import { NgxSpinnerService } from 'ngx-spinner'; 
import { ToasterNotiService } from '../../../shared/services/notifications/toaster-noti.service';


@Component({
  selector: 'app-esign-modal',
  templateUrl: './esign-modal.component.html',
  styleUrls: ['./esign-modal.component.scss']
})
export class EsignModalComponent implements OnInit {
  public userId: any;
  public esignature: FormGroup;
  public esignformdata:any;
  public totalElements: number;
  @Input() dataStatus;
  private pattern = /[0-9\+\-\ ]/;

  constructor( private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private FormService:FormViewService,
    private toast: ToasterNotiService,
    public activeModal: NgbActiveModal) { }

  ngOnInit() {
    this.userId = localStorage.getItem('userId');
    this.buildSearchesign();
    this.getesignforms();
  }

  buildSearchesign() {
    this.esignature = this.formBuilder.group({
      x_axis: new FormControl('',[Validators.required,Validators.pattern(this.pattern)]),
      y_axis: new FormControl('',[Validators.required,Validators.pattern(this.pattern)]),
      height: new FormControl('',[Validators.required,Validators.pattern(this.pattern)]),
      width: new FormControl('',[Validators.required,Validators.pattern(this.pattern)]),
      page_number: new FormControl('',[Validators.required,Validators.pattern(this.pattern)])
    });
  }

  addcoordinates(){
    this.esignature.value.x_axis;
    this.esignature.value.y_axis;
    this.esignature.value.height;
    this.esignature.value.width;
    this.esignature.value.page_number;
    this.esignature.value.created_by =this.userId;
    this.esignature.value.form_id =this.dataStatus;

    this.FormService.addEsignDimensions(this.esignature.value).subscribe(data=>{
      if(data['success']==true){
        this.toast.showSuccess(data['message'], "", 1000);
        this.getesignforms();
        this.spinner.hide();
        this.esignature.reset();
      }
      else {
      this.toast.showError(data['message'], "", 1000);
      }
})

  }

  getesignforms(){
    this.spinner.show();
    let dataparam ={
      form_id : this.dataStatus
    }
    this.FormService.fetchEsignDimensions(dataparam).subscribe(data=>{
    this.esignformdata = data['details'];
    this.spinner.hide();
   })
  }

  deleteClicked(rowdata){
  let dataItem = {
    esign_form_id: rowdata.id,
    updated_by:this.userId
      };
    this.FormService.deleteEsignDimension(dataItem).subscribe(data=>{
      if(data['success']==true){
        this.toast.showSuccess(data['message'], "", 1000);
        this.getesignforms();
        this.spinner.hide();
      } else {
      this.toast.showError(data['message'], "", 1000);
      }
   })
  }

}
