import { Component, OnInit, Input, ViewChild, ChangeDetectorRef } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { FormMapModalService } from '../services/form-map-modal/form-map-modal.service';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-form-map-modal',
  templateUrl: './form-map-modal.component.html',
  styleUrls: ['./form-map-modal.component.scss']
})
export class FormMapModalComponent implements OnInit {

  selectedanimal: any;
  currentItem_id: any
  type_id_value: any;
  group_id_value: any;
  subgroup_id_value: any;
  field_Order: any;
  @Input() formFieldData;
  groupID: any;
  formFieldToMapData: any;
  formFieldMapSubGroupData: any;
  formFieldMapGroupData: any;
  public searchMapFormFields: FormGroup;
  loading: boolean = true;
  fieldCount: number;
  fieldOffset: number;
  fieldLimit: number;

  public showcolumn: boolean;
  public checkModel: boolean;
  all_locations: any;
  @ViewChild('fieldMapping') field_mapping: any;

  columns = [
    { name: 'Field Name' },
    { name: 'Field Order' },
    { name: 'Map' }
  ];
  public multipleLocation = [
    { item_name: 'First Row', item_id: 1 },
    { item_name: 'Second Row', item_id: 2 },
    { item_name: 'Third Row', item_id: 3 },
    { item_name: 'Forth Row', item_id: 4 },
    { item_name: 'Fifth Row', item_id: 5 },
    { item_name: 'Sixth Row', item_id: 6 },
    { item_name: 'Seventh Row', item_id: 7 },
    { item_name: 'Eight Row', item_id: 8 },
    { item_name: 'Nineth Row', item_id: 9 },
    { item_name: 'Tenth Row', item_id: 10 }
  ];
  public formType = [
    { item_id: 1, item_name: 'TIN' },
    { item_id: 2, item_name: 'Location' },
    { item_id: 3, item_name: 'Provider' }

  ];
  editing = {}

  constructor(
    private ref: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    public activeModal: NgbActiveModal,
    private formMapModalService: FormMapModalService,
  ) {
    this.fieldLimit = null;
  }

  ngOnInit() {

    this.buildSearchForm();
    this.fetchmultiplelocations();

    console.log(this.formFieldData)

    this.showcolumn = false;
    this.checkModel = false;

    this.formFieldToMapData = []
    this.fieldOffset = 0

    if (this.formFieldData.field_history) {

      this.onTypeChange({ item_id: this.formFieldData.field_history.type_id })
      this.onGroupChange({ group_id: this.formFieldData.field_history.group_id })
      this.multilocationEnable();
      this.searchMapFormFields.patchValue(this.formFieldData.field_history)
      this.getFormFieldsData(this.fieldOffset, this.fieldLimit, this.field_Order);

    } else if (sessionStorage.getItem('historySearch')) {

      let params = {
        type_id: Number(sessionStorage.getItem('type_id')),
        group_id: Number(sessionStorage.getItem('group_id')),
        sub_group_id: Number(sessionStorage.getItem('sub_group_id'))
      }
      if (sessionStorage.getItem('type_id').length != 0) {
        this.onTypeChange({ item_id: sessionStorage.getItem('type_id') })
      } else {
        params.type_id = null;
      }
      if (sessionStorage.getItem('group_id').length != 0) {
        this.onGroupChange({ group_id: sessionStorage.getItem('group_id') })
      } else {
        params.group_id = null;
      }
      if (sessionStorage.getItem('sub_group_id').length == 0) {
        params.sub_group_id = null;
      }
      this.multilocationEnable();
      this.searchMapFormFields.patchValue(params)
      this.getFormFieldsData(this.fieldOffset, this.fieldLimit, this.field_Order);
    }




  }

  // Fetch Multiple location list
  public fetchmultiplelocations() {
    this.formMapModalService.fetchmultiplelocations().subscribe(
      data => {
        this.all_locations = data['result'];
      });
  }

  multilocationEnable() {
    if (this.formFieldData.field_history) {
      if (this.formFieldData.field_history.loc_category_id != 0) {
        this.showcolumn = true;
        this.searchMapFormFields.patchValue({ 'is_multiple': true })
        this.checkModel = true;
      } else {
        this.checkModel = false;
        this.showcolumn = false;
      }
    } else {
      if (sessionStorage.getItem('multipleLocation')) {
        this.showcolumn = true;
        this.searchMapFormFields.patchValue({ 'is_multiple': true })
        this.checkModel = true;
      } else {
        this.checkModel = false;
        this.showcolumn = false;
      }

    }
  }

  onPage(pageInfo) {

    this.fieldOffset = pageInfo.offset;
    this.getFormFieldsData(this.fieldOffset, this.fieldLimit, this.field_Order);
  }

  buildSearchForm() {
    this.searchMapFormFields = this.formBuilder.group({
      type_id: new FormControl(null),
      group_id: new FormControl(null),
      sub_group_id: new FormControl(null),
      search_text: new FormControl(''),
      is_multiple: new FormControl(null)
    });
  }

  getFormFieldsData(fOffset, fLimt, sOrder) {

    console.log(this.searchMapFormFields.value)
    let params = {
      group_id: this.searchMapFormFields.value.group_id,
      sub_group_id: this.searchMapFormFields.value.sub_group_id,
      search_text: this.searchMapFormFields.value.search_text,
      page_number: fOffset,
      limit_of_page: fLimt,
      sort_by: 'field_name',
      sort_order: sOrder
    }
    this.formMapModalService.getFormFieldsToMapData(params).subscribe(
      data => {
        console.log(data);
        this.getFormFieldToMapDetails(data)
      }
    )
  }

  getFormFieldToMapDetails(data) {

    if (this.searchMapFormFields.value.is_multiple) {
      this.showcolumn = true;
    } else {
      this.showcolumn = false;
    }

    this.formFieldToMapData = data.result;


    if (this.searchMapFormFields.value.group_id == 31 && this.searchMapFormFields.value.sub_group_id == 123) {
      this.formFieldToMapData.map(item => {
        item['multipleLocation'] = this.multipleLocation;
      })
    } else {
      this.formFieldToMapData.map(item => {
        item['multipleLocation'] = this.all_locations;
      })
    }

    if (this.formFieldData.field_history) {
      for (let i = 0; i < this.formFieldToMapData.length; i++) {
        if (this.formFieldToMapData[i]['group_field_id'] == this.formFieldData.field_history.field_id) {
          this.formFieldToMapData[i]['is_mapped'] = true;
          for (let j = 0; j < this.formFieldToMapData[i]['multipleLocation'].length; j++) {
            if (this.formFieldToMapData[i]['multipleLocation'][j]['item_id'] == this.formFieldData.field_history.loc_category_id) {
              this.formFieldToMapData[i]['multi_selected_item_id'] = this.formFieldToMapData[i]['multipleLocation'][j]['item_id'];
              this.formFieldToMapData[i]['multi_selected_item_name'] = this.formFieldToMapData[i]['multipleLocation'][j]['item_name'];
            }
          }
        } else {
          this.formFieldToMapData[i]['is_mapped'] = false;
          // for(let j=0; j< this.formFieldToMapData[i]['multipleLocation'].length; j++){
          //   if(this.formFieldToMapData[i]['multipleLocation'][j]['item_id'] != this.formFieldData.field_history.loc_category_id){
          //     this.formFieldToMapData[i]['multipleLocation'][j]['selected_item_id'] = false;
          //   }else{
          //     this.formFieldToMapData[i]['multipleLocation'][j]['selected_item_id'] = false;
          //   }
          // }
        }
      }
      // this.formFieldToMapData.map(item => {
      //   if (item['group_field_id'] == this.formFieldData.field_history.field_id) {
      //     item['is_mapped'] = true;
      //     item['multipleLocation'].map(data =>{
      //       if(data['item_id'] == this.formFieldData.field_history.loc_category_id){
      //         data['is_selected'] = true;
      //       }else{
      //         data['is_selected'] = false;
      //       }
      //     })
      //   } else {
      //     item['is_mapped'] = false;
      //     item['multipleLocation'].map(data =>{
      //       if(data['item_id'] != this.formFieldData.field_history.loc_category_id){
      //         data['is_selected'] = false;
      //       }else{
      //         data['is_selected'] = false;
      //       }
      //     })
      //   }

      // })
    }

    console.log(this.formFieldToMapData)
    this.fieldCount = data.total_row;
    this.spinner.hide();
    this.loading = false;
    console.log(this.field_mapping)
  }

  public onTypeChange(event) {
    this.formFieldMapGroupData = [];
    this.formFieldMapSubGroupData = [];
    this.field_Order = null
    this.field_mapping.sorts = [];
    this.formFieldToMapData = []

    if (event) {
      setTimeout(() => {
        this.spinner.show();
      })

      let params = {
        group_id: null,
        sub_group_id: null
      }

      this.searchMapFormFields.patchValue(params)

      let groupParams = {
        page_number: null,
        limit_of_page: null,
        type_id: event.item_id,
        group_name: null
      }

      this.formMapModalService.getDropdownGroupData(groupParams).subscribe(
        data => {
          this.formFieldMapGroupDetails(data)
        }
      )
    } else {
      this.searchMapFormFields.reset();
      console.log(this.searchMapFormFields.value);
    }

  }

  private formFieldMapGroupDetails(data) {
    this.formFieldMapGroupData = data.groups_list;
    this.spinner.hide();
  }


  public onGroupChange(event) {

    this.formFieldMapSubGroupData = [];
    this.field_Order = null
    this.field_mapping.sorts = [];
    this.formFieldToMapData = []

    if (event) {

      setTimeout(() => {
        this.spinner.show();
      })

      let params = {
        sub_group_id: null
      }
      this.searchMapFormFields.patchValue(params);


      let groupParams = {
        page_number: null,
        limit_of_page: null,
        group_id: event.group_id
      }
      this.formMapModalService.getDropdownSubGroupData(groupParams).subscribe(
        data => {
          this.formFieldMapSubGroupDetails(data)
        }
      )
    } else {
      this.searchMapFormFields.patchValue({ 'sub_group_id': null });
    }

  }

  private formFieldMapSubGroupDetails(data) {
    this.formFieldMapSubGroupData = data.sub_groups_list;
    this.spinner.hide();
  }

  public onsugroupChange(event) {

    this.field_Order = null
    this.field_mapping.sorts = [];
    this.formFieldToMapData = []
    // this.checkModel = false;
    // this.searchMapFormFields.patchValue({ 'is_multiple': false })

  }

  public onchangemulti(event) {
    console.log(event.target.checked)
    console.log(this.searchMapFormFields.value)
  }




  search() {
    sessionStorage.setItem('historySearch', 'true')
    sessionStorage.setItem('type_id', this.searchMapFormFields.value.type_id == null ? '' : this.searchMapFormFields.value.type_id);
    sessionStorage.setItem('group_id', this.searchMapFormFields.value.group_id == null ? '' : this.searchMapFormFields.value.group_id);
    sessionStorage.setItem('sub_group_id', this.searchMapFormFields.value.sub_group_id == null ? '' : this.searchMapFormFields.value.sub_group_id);
    sessionStorage.setItem('multipleLocation', this.searchMapFormFields.value.is_multiple)
    this.getFormFieldsData(this.fieldOffset, this.fieldLimit, this.field_Order);
    console.log(this.searchMapFormFields.value);
  }
  public onSort(event) {
    console.log(this.field_mapping)
    console.log(event);
    if (event.column.name == "Field Name") {
      this.field_Order = event.newValue;
      this.getFormFieldsData(this.fieldOffset, this.fieldLimit, this.field_Order);
    }
  }

  clear() {
    this.field_Order = null
    this.field_mapping.sorts = [];
    this.formFieldToMapData = []
    this.searchMapFormFields.reset();
    //this.showmulti = false;
  }

  updateValue(event, name, rowIndex, row) {
    console.log(row)
    console.log(event.target.value)
    this.editing[rowIndex + '-' + name] = false;
    // row.multipleLocation[rowIndex]['item_id'] = event.target.value;
    let orderIdMultipleLocation;
    row.multipleLocation.map(item => {
      if (item['item_name'] == event.target.value) {
        orderIdMultipleLocation = item['item_id']
      }
    })
    this.formFieldToMapData[rowIndex]['multi_selected_item_id'] = orderIdMultipleLocation;
    this.formFieldToMapData[rowIndex]['multi_selected_item_name'] = event.target.value;
    this.formFieldToMapData[rowIndex]['item_id'] = orderIdMultipleLocation;
    console.log(this.formFieldToMapData)
  }
  mapField(data) {
    let dataparams = {
      field_id: data.group_field_id,
      field_map_id: this.formFieldData.field_map_id,
      form_id: this.formFieldData.form_id,
      order_id: null
    }

    if (data.item_id) {
      dataparams.order_id = data.item_id;
    } else {
      dataparams.order_id = 0;
    }

    this.formMapModalService.mapFormField(dataparams).subscribe(
      data => {
        this.formFieldMappedData(data);
      }
    )

  }

  formFieldMappedData(data) {
    if (data.success) {
      this.activeModal.close('yes');
    }
  }

  close() {
    this.activeModal.close('no');
  }

  toggle(data) {
    console.log(data.srcElement.checked);
    // let gender = 'Gender'
    // let idx = this.columns.indexOf({name:'Name'});
    // console.log(idx);
    // this.columns.splice(idx, 1);
    let columnToRemove = 'Gender'
    this.columns = this.columns.filter(
      (item) => item.name !== columnToRemove);
    console.log(this.columns);

  }
  isChecked(data) {
    console.log(data.srcElement.checked);
  }


}
