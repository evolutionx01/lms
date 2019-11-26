import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';

import { ToasterNotiService } from '../../../shared/services/notifications/toaster-noti.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TagInputModule } from 'ngx-chips';
import { Observable } from 'rxjs';
import { DropdownViewService } from '../service/dropdown-view/dropdown-view.service';
import { NgbPaginationConfig } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-dropdown-add',
  templateUrl: './dropdown-add.component.html',
  styleUrls: ['./dropdown-add.component.scss'],
  providers: [NgbPaginationConfig]
})
export class DropdownAddComponent implements OnInit {


  SearchData: any;
  @ViewChild('pagination') pagination: any;
  isAdd: boolean;
  limitChaged: boolean;
  totalCount: any;
  pageNumber: any;
  pageLimit: any;
  public currentPageLimit: number = 25;
  public pageLimitOptions = [
    { value: 10 },
    { value: 25 },
    { value: 50 },
    { value: 100 },
  ];
  page = 1;
  itemType: string;
  buttonTittle: string;
  existingArray: any;
  existingItemName: any;
  addButton: boolean;
  duplicateItem: boolean;
  public addItemData: boolean;
  @ViewChild('mydatatable') myTable: any;

  public editing = {}
  public data = {
    drop_down_items: []
  }

  public searchItem: FormGroup;
  public specialCharacter = /^[a-zA-Z0-9_ ]*$/;
  public userId: any;
  public buttonTitle: string;
  public popupTitle: string;
  public showButton: boolean;

  public addDropdown: FormGroup;
  public drop_down_item: FormArray;
  get formData() { return <FormArray>this.addDropdown.get('drop_down_items'); }
  @Input() popupType;

  constructor(
    private formBuilder: FormBuilder,
    private dropdownService: DropdownViewService,
    private notiService: ToasterNotiService,
    public activeModal: NgbActiveModal,
  ) { }

  ngOnInit() {
    this.buildSearchForm()
    console.log(this.pagination)
    this.pageLimit = 25;
    this.pageNumber = 0;
    this.limitChaged = false;
    this.addButton = false;
    this.addItemData = true;
    this.userId = localStorage.getItem('userId');



    this.buildAddDropdownForm();
    this.setItem();

    if (this.popupType.type == 'add') {
      this.showButton = false;
      this.popupTitle = 'Add Dropdown';
      this.buttonTittle = 'Save';
      this.isAdd = false;

    } else if (this.popupType.type == 'edit') {
      this.isAdd = true;
      this.showButton = true;
      this.buttonTittle = 'Update';
      this.popupTitle = 'Edit Dropdown';
      console.log('in popup');
      console.log(this.popupType);
      this.totalCount = this.popupType.count

      this.addDropdown.patchValue(this.popupType);

      this.popupType.drop_down_items.map((item, index) => {
        this.editing[index + '-name'] = true;
      })
      this.data.drop_down_items = this.popupType.drop_down_items;

      this.setItem();
      console.log(this.editing)

      console.log(this.addDropdown.value);

    }
  }

  public buildSearchForm() {
    this.searchItem = this.formBuilder.group({
      searchValue: new FormControl('', Validators.required)
    });
  }

  public search() {
    this.SearchData = this.searchItem.controls['searchValue'].value;
    //this.getDropdownList(this.pageNumber, this.pageLimit, this.SearchData, this.cOrder);
    this.pageNumber = 0;
    this.pagination.page = 1
    this.getEditDropdownPageDetails(this.pageNumber, this.pageLimit, this.SearchData);
  }

  public clearSearch(){
    this.searchItem.reset();
    this.SearchData = '';
    this.pageNumber = 0;
    this.pagination.page = 1
    this.getEditDropdownPageDetails(this.pageNumber, this.pageLimit, this.SearchData);
  }


  public onLimitChange(limit) {
    console.log('limitchaged')
    this.pageLimit = limit;
    this.pageNumber = 0;
    this.pagination.page = 1
    this.getEditDropdownPageDetails(this.pageNumber, this.pageLimit, this.SearchData);
    this.limitChaged = true;
  }

  public onPageChange(event) {
    console.log('pagechaged')
    console.log(event)
    this.pageNumber = event - 1;
    if (!this.limitChaged) {
      this.getEditDropdownPageDetails(this.pageNumber, this.pageLimit,this.SearchData)
    }

  }

  public getEditDropdownPageDetails(pNumber, pLimit, pSearch) {
    console.log("list called")
    this.addDropdown.reset();
    let control = <FormArray>this.addDropdown.controls.drop_down_items;
    for (let i = control.length - 1; i >= 0; i--) {
      control.removeAt(i)
    }
    this.addDropdown.value.drop_down_items.length = 0;
    this.editing = {}
    this.data.drop_down_items = []

    let dataParams = {
      drop_down_id: this.popupType.id,
      page_number: pNumber,
      limit_of_page: pLimit,
      dropdown_item_name: pSearch
    }

    this.dropdownService.getDropdownEditDetails(dataParams).subscribe(
      data => {
        this.getEditDropdownPageData(data);
      }
    )
  }

  private getEditDropdownPageData(data) {
    this.totalCount = data.items_count;

    let dataParams = {
      drop_down_name: data.drop_down_details[0].drop_down_name,
      drop_down_items: data.items,
    }

    this.addDropdown.patchValue(dataParams);
    data.items.map((item, index) => {
      this.editing[index + '-name'] = true;
    })
    this.data.drop_down_items = data.items;

    this.setItem();
    this.limitChaged = false;

  }


  public buildAddDropdownForm() {
    this.addDropdown = this.formBuilder.group({
      drop_down_name: new FormControl('', [Validators.required]),
      drop_down_items: this.formBuilder.array([], Validators.compose([Validators.required, Validators.minLength(1)]))
    });
  }

  setItem() {
    let control = <FormArray>this.addDropdown.controls.drop_down_items;
    this.data.drop_down_items.forEach(x => {
      control.push(this.formBuilder.group({
        item_id: x.item_id,
        item_name: x.item_name
      })
      )
    })
  }

  addItem(event): void {

    event.preventDefault();
    this.addButton = true;
    this.existingArray = this.addDropdown.controls.drop_down_items.value;

    console.log('add Item');
    console.log(this.editing);
    console.log(this.addDropdown.value);
    this.itemType = 'add'


    let control = <FormArray>this.addDropdown.controls.drop_down_items;
    control.push(
      this.formBuilder.group({
        //['', Validators.pattern(this.specialCharacter)]
        item_name: ['', Validators.required],
        item_id: ''
      })

    )
    this.existingArray = this.addDropdown.controls.drop_down_items.value;

    console.log('added Item');
    console.log(this.editing);
    console.log(this.addDropdown.value);
    console.log(this.addDropdown.get('drop_down_items').value)
    console.log(this.addDropdown.controls.drop_down_items)

  }

  deleteItem(index): void {
    //this.addDropdown.get('drop_down_items').value
    console.log(index)
    this.editing = {}
    console.log(this.editing);
    // delete this.editing[index + '-name'];
    console.log(this.addDropdown.value)
    let control = <FormArray>this.addDropdown.controls.drop_down_items;
    control.removeAt(index);

    this.addDropdown.controls.drop_down_items.value.map((item, index) => {
      this.editing[index + '-name'] = true;
    })

    console.log(this.addDropdown.value)
    console.log(this.editing);

  }
  editItem(event, cell, rowIndex) {
    this.itemType = 'edit'
    console.log(event)
    this.existingArray = this.addDropdown.controls.drop_down_items.value;
    this.existingItemName = event;
    if (!this.addButton) {
      this.addButton = true;
      this.editing[rowIndex + '-' + cell] = false;
    }

  }
  onchange(event) {
    event.preventDefault();
    console.log(this.addDropdown.value.drop_down_items)
  }

  updateValue(event, event_id, cell, rowIndex) {

    console.log(event.target.value);



    this.addButton = false;
    if (this.popupType.type == 'add' && event.target.value != '' && event.target.value.trim() != '') {
      console.log(this.existingArray);
      this.editing[rowIndex + '-' + cell] = true;
      var index = this.existingArray.findIndex(ele => {
        return ele.item_name == event.target.value
      })
      console.log(index)
      if (index == -1) {
        console.log(this.editing);
        this.editing[rowIndex + '-' + cell] = true;
        //this.addEditItem(event.target.value, event_id);
      } else if (index == rowIndex) {
        this.addDropdown.controls.drop_down_items.value[rowIndex]['item_name'] = this.existingItemName
        this.addDropdown.patchValue(this.addDropdown.value);
        this.editing[rowIndex + '-' + cell] = true;
      } else {
        if (this.itemType == 'add') {
          console.log(this.editing);
          delete this.editing[rowIndex + '-' + cell];
          this.notiService.showError('Item already exits', "", 4000);
          let control = <FormArray>this.addDropdown.controls.drop_down_items;
          control.removeAt(rowIndex)
        } else if (this.itemType == 'edit') {
          this.addDropdown.controls.drop_down_items.value[rowIndex]['item_name'] = this.existingItemName
          this.addDropdown.patchValue(this.addDropdown.value);
          this.notiService.showError('Item already exits', "", 4000);
          this.editing[rowIndex + '-' + cell] = true;
        }
      }
    } else if (this.popupType.type == 'edit' && event.target.value != '' && event.target.value.trim() != '') {
      console.log('edit')

      console.log(this.existingArray);
      var index = this.existingArray.findIndex(ele => {
        return ele.item_name == event.target.value
      })
      console.log(index)
      if (index == -1) {
        this.editing[rowIndex + '-' + cell] = true;
        this.addEditItem(event.target.value, event_id);
      } else {
        if (!event_id) {
          this.notiService.showError('Item already exits', "", 4000);
          let control = <FormArray>this.addDropdown.controls.drop_down_items;
          control.removeAt(rowIndex)
        } else {
          console.log(this.existingItemName)
          this.addDropdown.controls.drop_down_items.value[rowIndex]['item_name'] = this.existingItemName
          this.addDropdown.patchValue(this.addDropdown.value);
          this.notiService.showError('Item already exits', "", 4000);
          this.editing[rowIndex + '-' + cell] = true;
        }

      }

      console.log(this.addDropdown.controls.drop_down_items.value);
    } else {
      if (!event_id) {
        this.notiService.showError('Item cannot be empty', "", 4000);
        let control = <FormArray>this.addDropdown.controls.drop_down_items;
        control.removeAt(rowIndex)
      } else {
        console.log(this.existingItemName)
        this.addDropdown.controls.drop_down_items.value[rowIndex]['item_name'] = this.existingItemName
        this.addDropdown.patchValue(this.addDropdown.value);
        this.notiService.showError('Item cannot be empty', "", 4000);
        this.editing[rowIndex + '-' + cell] = true;
      }
    }
  }

  public addEditItem(itemName, itemId) {
    if (this.popupType.type == 'add') {
      console.log('add')
    } else if (this.popupType.type == 'edit') {
      console.log('edit')
      let dataParams = {
        drop_down_id: this.popupType.id,
        item_id: null,
        item_name: itemName
      }


      if (itemId) {
        dataParams.item_id = itemId;
      } else {
        dataParams.item_id = 0;
      }
      this.dropdownService.addDropdownEditItem(dataParams).subscribe(
        data => {
          this.editItemToDropdown(data, itemId);
        }
      )

    }
  }

  private editItemToDropdown(data, id) {
    console.log(this.addDropdown.value.drop_down_items);
    let message = id ? 'updated' : 'added';
    if (data.success) {
      this.notiService.showSuccess('Item ' + message + ' successfully', "", 4000)
      // let dataParams = {
      //   drop_down_id: this.popupType.id,
      //   page_number: 0,
      //   limit_of_page: 0
      // }
      // this.dropdownService.getDropdownEditDetails(dataParams).subscribe(item => {
      //   this.successItemData(item);
      // })

      // this.addDropdown.reset();

      // console.log(this.addDropdown.value)
      // let control = <FormArray>this.addDropdown.controls.drop_down_items;
      // for (let i = control.length - 1; i >= 0; i--) {
      //   control.removeAt(i)
      // }

      // this.addDropdown.value.drop_down_items.length = 0;
      // this.editing = {}
      // this.data.drop_down_items = []
      this.getEditDropdownPageDetails(this.pageNumber, this.pageLimit,this.SearchData)

    } else {
      this.notiService.showError(data.error, "", 4000);
    }
  }

  private successItemData(data) {
    let params = {
      drop_down_name: this.addDropdown.value.drop_down_name,
      drop_down_items: data.items
    }
    this.addDropdown.patchValue(params);

  }

  public addEditDropdownData() {
    this.addDropdown.value.created_updated_by = this.userId;

    if (this.popupType.type == 'add') {
      this.addDropdown.value.drop_down_id = 0;
      this.addDropdown.value.drop_down_items.map(item => {
        item['item_id'] = '';
      })
    } else if (this.popupType.type == 'edit') {
      this.addDropdown.value.drop_down_id = this.popupType.id
    }







    console.log(this.addDropdown.value)

    this.dropdownService.addDropdownDetails(this.addDropdown.value).subscribe(
      data => {
        this.addDropdownMethod(data, this.popupType.type)
      },
      error => {
        this.notiService.showError(error, "", 4000);
        // this.spinner.hide();
      }
    )
  }

  private addDropdownMethod(data, type) {
    console.log(data);
    let message = type == 'add' ? 'added' : 'updated';
    if (data.success) {
      this.notiService.showSuccess("dropdown " + message + " successfully", "", 4000);
      this.activeModal.close('yes');
    } else {
      this.notiService.showError(data.error, "", 4000);

    }
  }

  public reset() {
    this.addDropdown.reset();
    this.addDropdown.value.drop_down_items.length = 0;

    console.log(this.addDropdown.value)
  }



}
