import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbDateAdapter, NgbDateStruct, NgbDateNativeAdapter } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { FormAddfieldsService } from '../services/form-addfields/form-addfields.service';
import { DatePipe, NumberSymbol } from '@angular/common';
import { ToasterNotiService } from '../../../shared/services/notifications/toaster-noti.service';

@Component({
  selector: 'app-form-addfields',
  templateUrl: './form-addfields.component.html',
  styleUrls: ['./form-addfields.component.scss'],
  providers: [DatePipe, { provide: NgbDateAdapter, useClass: NgbDateNativeAdapter }]
})
export class FormAddfieldsComponent implements OnInit {
  disableDisplayLabel: boolean;
  editFieldName: any;
  editFieldId: any;
  isDisableField: boolean;
  groupFieldId: any;
  public dropdownListData: any;
  buttonTitle: string;
  showButton: boolean;
  popUpTitle: string;
  editFieldData: any;
  showDefaultMessage: boolean;
  public userId: string;
  @Input() dataStatus;

  public addField: FormGroup;

  public datatype = [];

  public dataDate = {
    date: []

  };

  public dataInteger = {
    integer: []
  }

  public dataText = {
    text: []
  }

  public dataDropdown = {
    dropdown: []
  }

  public alphanum=/^[0-9a-bA-B]+$/;

  get formDropdownData() { return <FormArray>this.addField.get('dropdown'); }
  get formDateData() { return <FormArray>this.addField.get('date'); }
  get formIntegerData() { return <FormArray>this.addField.get('integer'); }
  get formTextData() { return <FormArray>this.addField.get('text'); }
  constructor(
    private notiService: ToasterNotiService,
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private formAddfieldsService: FormAddfieldsService,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {
    //this.disableDisplayLabel = false
    if (this.dataStatus.type == 'add') {
      this.isDisableField = false;
    } else{
      this.isDisableField = true;
    }
    this.userId = localStorage.getItem('userId');
    this.buildFieldsForm();
    this.setDateItem();
    this.setTextItem();
    this.setIntegerItem();
    this.setDropdown();
    this.datatypeDropdown();
    this.dropdownData();

    this.showDefaultMessage = false;
    console.log('popup');

    console.log(this.dataStatus)
    if (this.dataStatus.type == 'add') {
      this.popUpTitle = 'Add Fields'
      this.showButton = false;
      this.buttonTitle = 'Save';
      
    } else if (this.dataStatus.type == 'edit') {
      this.popUpTitle = 'Edit Fields'
      this.showButton = true;
      this.buttonTitle = 'Update';
      this.getEditFieldData();
    }


  }

  getEditFieldData() {
    let dataParams = {
      group_field_id: this.dataStatus.group_field_id
    }
    this.formAddfieldsService.getEditFormFileds(dataParams).subscribe(
      data => {
        this.setEditFieldValues(data)
      }
    )
  }

  setEditFieldValues(data) {
    this.editFieldId = data.details.field_id;
    this.editFieldName = data.details.field_name;
    console.log(data);
    this.editFieldData = data.details;

    if (data.details.allow_null == 1) {
      this.showDefaultMessage = true;
      this.editFieldData.allow_null = true;
    } else {
      this.showDefaultMessage = false;
      this.editFieldData.allow_null = false;
    }

    if (data.details.field_id == 4 || data.details.field_id == 5) {
      console.log('data');
      this.addDateItem();
      this.editFieldData.date = [];
      let dateItem = {
        default_date: new Date(data.details.default_date),
        is_expiration: data.details.is_expiration == 1 ? true : false,
        is_date_change: data.details.is_date_change == 1 ? true : false
      }
      this.editFieldData.date.push(dateItem);
    } else if (data.details.field_id == 8) {
      this.addIntegerItem()
      this.editFieldData.integer = [];
      let integerItem = {
        precision: data.details.precision,
        scale: data.details.scale
      }
      this.editFieldData.integer.push(integerItem);
    } else if (data.details.field_id == 11 || data.details.field_id == 13) {
      this.addTextItem()
      this.editFieldData.text = [];
      let textItem = {
        max_length: data.details.max_length
      }
      this.editFieldData.text.push(textItem);

    } else if (data.details.field_id == 6) {
      console.log(data.details.field_id);
      this.addDropdownItem();
      this.editFieldData.dropdown = [];
      let dropdownItem = {
        default_value: data.details.default_value,
        drop_down_id: data.details.drop_down_id
      }
      this.editFieldData.dropdown.push(dropdownItem);

    }

    this.groupFieldId = data.details.group_field_id

    this.addField.patchValue(this.editFieldData);
  }

  buildFieldsForm() {
    let validators = this.isDisableField ? [] : [Validators.required];
    //let displayLabelValidator = this.disableDisplayLabel ? [] : [Validators.required];
   // let default_message_valid = this.showDefaultMessage ?  [Validators.required] : []; 
    this.addField = this.formBuilder.group({
      field_id: new FormControl({value: null, disabled: this.isDisableField ? true : false}, validators),
      display_label: new FormControl('', [Validators.required]),
      field_name: new FormControl({value: '',disabled: this.isDisableField ? true : false}, validators),
      comment_text: new FormControl(''),
      help_text: new FormControl(''),
      allow_null: new FormControl(null),
      default_message: new FormControl(''),
      date: this.formBuilder.array([]),
      integer: this.formBuilder.array([]),
      text: this.formBuilder.array([]),
      dropdown: this.formBuilder.array([])
    });

  }

  setDateItem() {
    let control = <FormArray>this.addField.controls.date;
    this.dataDate.date.forEach(x => {
      control.push(this.formBuilder.group({
        default_date: x.default_date,
        is_expiration: x.is_expiration,
        is_date_change: x.is_date_change
      })
      )
    })
  }

  setDropdown() {
    let control = <FormArray>this.addField.controls.dropdown;
    this.dataDropdown.dropdown.forEach(x => {
      control.push(this.formBuilder.group({
        drop_down_id: x.drop_down_id,
        default_value: x.default_value
      })
      )
    })
  }

  setTextItem() {
    let control = <FormArray>this.addField.controls.text;
    this.dataText.text.forEach(x => {
      control.push(this.formBuilder.group({
        max_length: x.max_length
      })
      )
    })

  }

  setIntegerItem() {
    let control = <FormArray>this.addField.controls.integer;
    this.dataInteger.integer.forEach(x => {
      control.push(this.formBuilder.group({
        precision: x.precision,
        scale: x.scale
      })
      )
    })
  }

  public addDateItem(): void {
    let control = <FormArray>this.addField.controls.date;
    control.push(
      this.formBuilder.group({
        default_date: '',
        is_expiration: '',
        is_date_change: ''
      })
    )
  }

  public addIntegerItem(): void {
    let control = <FormArray>this.addField.controls.integer;
    control.push(
      this.formBuilder.group({
        precision: '',
        scale: ''
      })
    )
  }

  public addTextItem(): void {
    let control = <FormArray>this.addField.controls.text;
    control.push(
      this.formBuilder.group({
        max_length: ''
      })
    )
  }

  public addDropdownItem(): void {
    let control = <FormArray>this.addField.controls.dropdown;
    control.push(
      this.formBuilder.group({
        drop_down_id: [null, Validators.required],
        default_value: ''
      })
    )
  }

  public deleteDate() {
    let control = <FormArray>this.addField.controls.date;
    control.removeAt(0)
  }

  public deleteInteger() {
    let control = <FormArray>this.addField.controls.integer;
    control.removeAt(0)
  }
  public deleteText() {
    let control = <FormArray>this.addField.controls.text;
    control.removeAt(0)
  }
  public deleteDropdown() {
    let control = <FormArray>this.addField.controls.dropdown;
    control.removeAt(0)
  }

  public onDatatypeChange(event) {
    this.disableDisplayLabel = false;
    console.log(event);
    this.deleteDate();
    this.deleteInteger();
    this.deleteDropdown();
    this.deleteText();
    if (event.field == 'Date' || event.field == 'Date Time') {
      console.log('data');
      this.addDateItem();
    } else if (event.field == 'Integer') {
      this.addIntegerItem()
    } else if (event.field == "Text Field" || event.field == "Text Area") {
      this.addTextItem()
    } else if (event.field == "Drop Down") {
      console.log(event.field);
      // this.addField.value.display_label = '';
      // this.disableDisplayLabel = true
      this.addDropdownItem();
    }
  }

  public dropdownData() {

    let dataParams = {
      page_number: null,
      limit_of_page: null,
      drop_down_name: null,
      sort_by: null,
      sort_order: null
    }
    this.formAddfieldsService.getDropdownDetails(dataParams).subscribe(
      data => this.dropdownDataList(data)
    )
  }

  private dropdownDataList(data) {
    console.log(data);
    this.dropdownListData = data.drop_downs_list;
  }

  public datatypeDropdown() {
    this.formAddfieldsService.getMasterDropDown().subscribe(
      data => this.datatypeDropdownList(data)
    )
  }

  private datatypeDropdownList(data) {
    console.log(data);
    this.datatype = data.field_types_list;
  }

  actionClicked(data) {
    this.activeModal.close(data)
  }



  public onIsmandChange(event) {
    console.log(event);
    this.showDefaultMessage = event
    // if(event == true){
    //   this.showDefaultMessage = true
    // }
  }

  public save(field) {
    
    console.log(this.addField.getRawValue())
    console.log(this.addField.value)
    if (this.addField.value.allow_null == true) {
      this.addField.value.allow_null = 1;
    } else {
      this.addField.value.allow_null = 0;
    }

    let dataParams = {
      group_field_id: 0,
      sub_group_id: this.dataStatus.subGroupId,
      field_id: this.addField.value.field_id,
      field_name: this.addField.value.field_name,
      allow_null: this.addField.value.allow_null,
      default_message: this.addField.value.default_message,
      display_label: this.addField.value.display_label,
      help_text: this.addField.value.help_text,
      comment_text: this.addField.value.comment_text,
      default_value: '',
      precision: '',
      scale: '',
      is_expiration: null,
      is_date_change: null,
      max_length: '',
      drop_down_id: '',
      default_date: '',
      created_updated_by: this.userId
    }

    if (this.dataStatus.type == 'edit') {
      dataParams.group_field_id = this.groupFieldId;
      dataParams.field_id =  this.editFieldId;
      dataParams.field_name = this.editFieldName;
    }

    if (this.addField.value.date.length) {
      if (this.addField.value.date[0].is_expiration) {
        dataParams.is_expiration = 1
      } else {
        dataParams.is_expiration = 0
      }

      if (this.addField.value.date[0].is_date_change) {
        dataParams.is_date_change = 1
      } else {
        dataParams.is_date_change = 0
      }
      console.log()
      dataParams.default_date = this.datePipe.transform(this.addField.value.date[0].default_date, 'yyyy-MM-dd');

      console.log('date array')
    } else if (this.addField.value.dropdown.length) {
      dataParams.default_value = this.addField.value.dropdown[0].default_value;
      dataParams.drop_down_id = this.addField.value.dropdown[0].drop_down_id;
      console.log('dropdown array')
    } else if (this.addField.value.integer.length) {
      dataParams.precision = this.addField.value.integer[0].precision;
      dataParams.scale = this.addField.value.integer[0].scale;
      console.log('INTEGER array')
    } else if (this.addField.value.text.length) {
      dataParams.max_length = this.addField.value.text[0].max_length
      console.log('TEXT array')
    } else {
      console.log('not array')
    }





    console.log(dataParams);
    console.log(this.addField.value);
    this.formAddfieldsService.addFieldData(dataParams).subscribe(
      data => {
        this.fieldAddEditDetails(data)
      }
    )
  }

  private fieldAddEditDetails(data){
    console.log(data)
    if(data.success){
      this.activeModal.close('yes');
      this.notiService.showSuccess(data.message,'',4000);
    }else{
     // this.activeModal.close('no');
      this.notiService.showError(data.error,'',4000);
    }
  }

  clear() {
    this.addField.reset();
  }
}
