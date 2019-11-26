import { Component, OnInit, ViewChild } from '@angular/core';
import { FormSubgroupViewService } from '../services/form-subgroup-view/form-subgroup-view.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { FormSubgroupAddComponent } from '../form-subgroup-add/form-subgroup-add.component';
import { FormGroupModalComponent } from '../form-group-modal/form-group-modal.component';
import { ToasterNotiService } from '../../../shared/services/notifications/toaster-noti.service';
import { FormGroupReorderComponent } from '../form-group-reorder/form-group-reorder.component';
import { FormAddfieldsComponent } from '../form-addfields/form-addfields.component';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-form-subgroup-view',
  templateUrl: './form-subgroup-view.component.html',
  styleUrls: ['./form-subgroup-view.component.scss']
})
export class FormSubgroupViewComponent implements OnInit {

  subGroupSortBy: string;
  sortBy: any;
  searchFieldData: any;
  cOrder: any;
  searchData: any;
  public isSubGroupSelected: boolean;
  public selected: any[] = [];
  public subGroupName: any;
  public fieldTotalElements: any;
  public listOfFieldData: any;
  public fieldPageLimit: number;
  public fieldPageNumber: number;
  public subGroupID: any;
  public groupName: any;
  public userId: string;

  @ViewChild('mySubGroupTable') fromSubGroupTable: any;
  @ViewChild('mySubGroupField') fromSubGroupFieldView: any;

  modalOption: NgbModalOptions = {};

  columns = [
    { name: 'Field Name', sortable: true }
  ];

  public totalElements: number;
  public subGroupItem: any;
  public pageNumber: number;
  public pageLimit: number;
  public groupId: number;

  public searchSubGroup: FormGroup;
  public searchField: FormGroup;


  public currentPageLimit: number = 25;
  public pageLimitOptions = [
    { value: 10 },
    { value: 25 },
    { value: 50 },
    { value: 100 },
  ];

  public currentFieldPageLimit: number = 25;
  public pageFieldLimitOptions = [
    { value: 10 },
    { value: 25 },
    { value: 50 },
    { value: 100 },
  ];


  constructor(
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private formSubGroupViewService: FormSubgroupViewService,
    private router: Router,
    private modalService: NgbModal,
    private activatedRoute: ActivatedRoute,
    private notiService: ToasterNotiService

  ) {

  }

  ngOnInit() {
    this.isSubGroupSelected = true;
    this.pageLimit = 25;
    this.fieldPageLimit = 25;
    this.userId = localStorage.getItem('userId');
    this.activatedRoute.params.subscribe(data => {
      console.log(data);
      this.groupId = data.group_id
    })

    this.buildSearchForm();

    this.setPage({ offset: 0 });
    this.searchData = '';
    this.buildSearchField();
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    this.modalOption.size = "lg";
  }




  setPage(pageInfo) {
    this.spinner.show();
    this.pageNumber = pageInfo.offset;
    this.getSubGroupDetails(this.pageNumber, this.pageLimit, this.groupId, this.searchData, this.cOrder, this.subGroupSortBy)

  }

  getSubGroupDetails(sPageNumber, sPageLimit, groupId, searchText, sOrder, sSortBy) {
    let dataParams = {
      page_number: sPageNumber,
      limit_of_page: sPageLimit,
      group_id: groupId,
      sub_group_name: searchText,
      sort_by: sSortBy,
      sort_order: sOrder
    }

    this.formSubGroupViewService.getSubGroupData(dataParams).subscribe(
      data => {
        console.log(data);
        this.subGroupData(data);
      },
      error=>{
        console.log(error);
        this.notiService.showError(error.error,'',4000)
      }
    )
  }

  subGroupData(data) {
    console.log(data);
    this.groupName = data.group_name
    this.subGroupItem = data.sub_groups_list;
    this.subGroupItem.map(item => {
      if (item['is_static'] == 0) {
        item['display_edit'] = true
      } else {
        item['display_edit'] = false
      }
    })
    this.totalElements = data.total_row;
    this.spinner.hide();
  }

  // search code
  buildSearchForm() {
    this.searchSubGroup = this.formBuilder.group({
      searchValue: new FormControl('', [Validators.required])
    });
  }

  buildSearchField() {
    this.searchField = this.formBuilder.group({
      searchValue: new FormControl('', [Validators.required])
    });
  }

  fieldSearch() {
    console.log(this.searchField.controls['searchValue'].value);
    this.pageNumber = 0;
    this.searchFieldData = this.searchField.controls['searchValue'].value;
    this.getListOfFormFields(this.fieldPageNumber, this.fieldPageLimit, this.subGroupID, this.searchFieldData, this.sortBy, this.cOrder)
  }

  public fieldClear() {
    this.spinner.show();
    this.searchField.reset();
    this.fieldPageNumber = 0;
    this.searchFieldData = '';
    this.fieldPageLimit = this.fromSubGroupFieldView.pageSize;
    this.fromSubGroupFieldView.offset = 0
    this.getListOfFormFields(this.fieldPageNumber, this.fieldPageLimit, this.subGroupID, this.searchFieldData, this.sortBy, this.cOrder)
  }

  public onFieldSort(event) {
    console.log(event);
    if (event.column.name == "Field Name") {
      this.cOrder = event.newValue;
      //this.spinner.show();
      this.sortBy = 'field_name'

    } else if (event.column.name == "Display Label") {
      this.cOrder = event.newValue;
      this.sortBy = 'display_label'
    }

    this.fieldPageNumber = 0;
    this.fieldPageLimit = this.fromSubGroupFieldView.pageSize;
    this.getListOfFormFields(this.fieldPageNumber, this.fieldPageLimit, this.subGroupID, this.searchFieldData, this.sortBy, this.cOrder)
  }

  public search() {
    console.log(this.searchSubGroup.controls['searchValue'].value);
    this.pageNumber = 0;
    this.searchData = this.searchSubGroup.controls['searchValue'].value;
    this.getSubGroupDetails(this.pageNumber, this.pageLimit, this.groupId, this.searchData, this.cOrder, this.subGroupSortBy)
  }

  public onSort(event) {
    console.log(event);
    if (event.column.name == "Sub Group Name") {
      this.cOrder = event.newValue;
      this.subGroupSortBy = 'sub_group_name';
      //this.spinner.show();
      this.pageNumber = 0;
      this.pageLimit = this.fromSubGroupTable.pageSize;
      this.getSubGroupDetails(this.pageNumber, this.pageLimit, this.groupId, this.searchData, this.cOrder, this.subGroupSortBy)
    } else if(event.column.name == "Order ID"){
      this.cOrder = event.newValue;
      this.subGroupSortBy = 'order_id';
      //this.spinner.show();
      this.pageNumber = 0;
      this.pageLimit = this.fromSubGroupTable.pageSize;
      this.getSubGroupDetails(this.pageNumber, this.pageLimit, this.groupId, this.searchData, this.cOrder, this.subGroupSortBy)
    }
  }

  public clear() {
    this.spinner.show();
    this.searchSubGroup.reset();
    this.pageNumber = 0;
    this.searchData = '';
    this.pageLimit = this.fromSubGroupTable.pageSize
    this.getSubGroupDetails(this.pageNumber, this.pageLimit, this.groupId, this.searchData, this.cOrder, this.subGroupSortBy)
  }

  public openAddSubGroup() {
    let addParams = {
      id: '',
      group_type: 'add',
      group_id: this.groupId
    }
    const addPopup = this.modalService.open(FormSubgroupAddComponent, this.modalOption);
    addPopup.componentInstance.popupType = addParams;

    addPopup.result.then((result) => {
      if (result == 'yes') {
        this.selected = [];
        this.listOfFieldData = [];
        this.fieldTotalElements = 0;
        this.subGroupName = '';
        this.isSubGroupSelected = true;
        this.pageNumber = 0;
        this.pageLimit = this.fromSubGroupTable.pageSize;
        this.getSubGroupDetails(this.pageNumber, this.pageLimit, this.groupId, this.searchData, this.cOrder, this.subGroupSortBy)
      } else if (result == 'no') {

      }
    }).catch((error) => {
      console.log(error);
    });
  }

  public setFieldPage(pageInfo) {
    this.fieldPageNumber = pageInfo.offset;
    this.getListOfFormFields(this.fieldPageNumber, this.fieldPageLimit, this.subGroupID, this.searchFieldData, this.sortBy, this.cOrder)
  }

  public getListOfFormFields(fPageNumber, fPageLimit, subGroupId, searchText, sortby, sortOrder) {
    this.spinner.show();
    let postParams = {
      page_number: fPageNumber,
      limit_of_page: fPageLimit,
      sub_group_id: subGroupId,
      display_label: searchText,
      sort_by: sortby,
      sort_order: sortOrder
    }


    this.formSubGroupViewService.getListOfFields(postParams).subscribe(
      data => this.listOfFieldDetails(data)
    )
  }

  listOfFieldDetails(data) {

    this.listOfFieldData = data.sub_groups_fields_list;
    this.listOfFieldData.map(item => {
      if (item['is_static'] == 0) {
        item['display_edit'] = true
      } else {
        item['display_edit'] = false
      }
    })
    console.log(this.listOfFieldData);
    this.fieldTotalElements = data.total_row;
    this.subGroupName = data.sub_group_name;
    this.spinner.hide();
  }

  public actionClicked(event: any, rowData: any, fromGroupView: any, type: string): void {
    event.stopPropagation();
    fromGroupView && fromGroupView.parentElement && fromGroupView.parentElement.parentElement &&
      fromGroupView.parentElement.parentElement.blur();

    if (type == 'view') {
      console.log(rowData);
      this.subGroupID = rowData.sub_group_id;
      this.fieldPageNumber = 0;
      this.fieldPageLimit = 100;
      this.getListOfFormFields(this.fieldPageNumber, this.fieldPageLimit, this.subGroupID, this.searchFieldData, this.sortBy, this.cOrder)

    } else if (type == 'edit') {
      console.log(rowData);
      rowData.group_type = 'edit'
      const editPopup = this.modalService.open(FormSubgroupAddComponent, this.modalOption);
      editPopup.componentInstance.popupType = rowData;

      editPopup.result.then((result) => {
        if (result == 'yes') {
          this.selected = [];
          this.listOfFieldData = [];
          this.fieldTotalElements = 0;
          this.subGroupName = '';
          this.isSubGroupSelected = true;
          console.log(this.fromSubGroupTable);
          console.log(this.fromSubGroupTable.offset);
          this.pageNumber = this.fromSubGroupTable.offset;
          this.pageLimit = this.fromSubGroupTable.pageSize;
          this.getSubGroupDetails(this.pageNumber, this.pageLimit, this.groupId, this.searchData, this.cOrder, this.subGroupSortBy)
          // this.setPage({ offset: 0 });
        } else if (result == 'no') {

        }
      }).catch((error) => {
        console.log(error);
      });
    } else if (type == 'delete') {

      let dataParams = {
        action: 'delete',
        type: 'sub group',
        name: rowData.sub_group_name
      }
      const confirmPopup = this.modalService.open(FormGroupModalComponent, this.modalOption);
      confirmPopup.componentInstance.dataStatus = dataParams;

      confirmPopup.result.then((result) => {
        if (result == 'yes') {

          let dataParams = {
            sub_group_id: rowData.sub_group_id,
            updated_by: this.userId
          }
          this.formSubGroupViewService.deleteFromSubGroupData(dataParams).subscribe(
            data => this.deleteSubGroupDetails(data, rowData)
          )
        }
      }).catch((error) => {
        console.log(error);
      });


    } else if (type == 'reorder') {
      console.log(rowData);
      let dataParams = {
        action: 'reorder',
        type: 'subgroup',
        name: rowData.sub_group_name,
        old_order_id: rowData.order_id,
        sub_group_id: rowData.sub_group_id,
        total_count: this.totalElements
      }
      const confirmPopup = this.modalService.open(FormGroupReorderComponent, this.modalOption);
      confirmPopup.componentInstance.dataStatus = dataParams;

      confirmPopup.result.then((result) => {
        console.log('yes')
        if (result == 'yes') {
          this.selected = [];
          this.listOfFieldData = [];
          this.fieldTotalElements = 0;
          this.subGroupName = '';
          this.isSubGroupSelected = true;
          this.pageNumber = this.fromSubGroupTable.offset;
          this.pageLimit = this.fromSubGroupTable.pageSize;
          this.getSubGroupDetails(this.pageNumber, this.pageLimit, this.groupId, this.searchData, this.cOrder, this.subGroupSortBy)
        }
      }).catch((error) => {
        console.log(error);
      });
    }

  }

  private deleteSubGroupDetails(data, row) {
    if (data.success) {
      this.selected = [];
      this.listOfFieldData = [];
      this.fieldTotalElements = 0;
      this.subGroupName = '';
      this.isSubGroupSelected = true;
      this.pageNumber = this.fromSubGroupTable.offset;
      this.pageLimit = this.fromSubGroupTable.pageSize;
      this.getSubGroupDetails(this.pageNumber, this.pageLimit, this.groupId, this.searchData, this.cOrder, this.subGroupSortBy)
      this.notiService.showSuccess("Sub Group deleted successfully", "", 4000);
    } else {
      this.notiService.showError("An error occured!", "", 4000);
    }
  }

  public onLimitChange(limit) {
    this.pageLimit = limit;
    this.pageNumber = 0;
    this.fromSubGroupTable.offset = 0;
    this.getSubGroupDetails(this.pageNumber, this.pageLimit, this.groupId, this.searchData, this.cOrder, this.subGroupSortBy)
  }

  public onFieldLimitChange(limit) {
    this.fieldPageNumber = 0;
    this.fromSubGroupFieldView.offset = 0;
    this.fieldPageLimit = limit;
    this.getListOfFormFields(this.fieldPageNumber, this.fieldPageLimit, this.subGroupID, this.searchFieldData, this.sortBy, this.cOrder)
  }

  public openAddFields() {
    let dataParams = {
      type: 'add',
      subGroupId: this.subGroupID
    }
    const confirmPopup = this.modalService.open(FormAddfieldsComponent, this.modalOption);
    confirmPopup.componentInstance.dataStatus = dataParams;

    confirmPopup.result.then((result) => {
      console.log(result);
      if (result == 'yes') {
        this.pageNumber = 0;
        this.fromSubGroupFieldView.offset = 0;
        this.pageLimit = this.fromSubGroupFieldView.pageSize;
        this.getListOfFormFields(this.pageNumber, this.pageLimit, this.subGroupID, this.searchFieldData, this.sortBy, this.cOrder)
      }
    }).catch((error) => {
      console.log(error);
    });
  }

  onSelect({ selected }) {
    this.isSubGroupSelected = false;
    console.log('Select Event', selected, this.selected[0].sub_group_id);

    this.subGroupID = this.selected[0].sub_group_id;
    this.fieldPageNumber = 0;
    this.fieldPageLimit = 25;
    this.getListOfFormFields(this.fieldPageNumber, this.fieldPageLimit, this.subGroupID, this.searchFieldData, this.sortBy, this.cOrder)


  }

  onActivate(event) {

  }

  goBack() {
    this.router.navigate(['groups']);
  }

  public actionClickedField(event: any, rowData: any, fromGroupFieldView: any, type: string): void {
    event.stopPropagation();
    fromGroupFieldView && fromGroupFieldView.parentElement && fromGroupFieldView.parentElement.parentElement &&
      fromGroupFieldView.parentElement.parentElement.blur();

    if (type == 'edit') {
      console.log("sub group id");
      console.log(this.subGroupID);
      console.log(rowData)
      let dataParams = {
        type: 'edit',
        subGroupId: this.subGroupID,
        group_field_id: rowData.group_field_id
      }
      const editField = this.modalService.open(FormAddfieldsComponent, this.modalOption);
      editField.componentInstance.dataStatus = dataParams;

      editField.result.then((result) => {
        if (result == 'yes') {
          this.fieldPageNumber = this.fromSubGroupFieldView.offset;
          this.fieldPageLimit = this.fromSubGroupFieldView.pageSize;
          this.getListOfFormFields(this.fieldPageNumber, this.fieldPageLimit, this.subGroupID, this.searchFieldData, this.sortBy, this.cOrder)
        } else if (result == 'no') {

        }
      }).catch((error) => {
        console.log(error);
      });
    } else if (type == 'delete') {
      console.log(rowData);
      let dataParams = {
        action: 'delete',
        type: 'field name',
        name: rowData.field_name
      }
      const confirmPopup = this.modalService.open(FormGroupModalComponent, this.modalOption);
      confirmPopup.componentInstance.dataStatus = dataParams;

      confirmPopup.result.then((result) => {
        if (result == 'yes') {

          let dataParams = {
            group_field_id: rowData.group_field_id,
            updated_by: this.userId
          }
          this.formSubGroupViewService.deleteFormField(dataParams).subscribe(
            data => this.deleteSubGroupFieldDetails(data, rowData)
          )
        }
      }).catch((error) => {
        console.log(error);
      });
    } else if (type == 'reorder') {
      console.log(rowData);
      let dataParams = {
        action: 'reorder',
        type: 'formFields',
        name: rowData.field_name,
        old_order_id: rowData.order_id,
        group_field_id: rowData.group_field_id,
        total_count: this.fieldTotalElements
      }
      const confirmPopup = this.modalService.open(FormGroupReorderComponent, this.modalOption);
      confirmPopup.componentInstance.dataStatus = dataParams;

      confirmPopup.result.then((result) => {
        console.log('yes')
        if (result == 'yes') {
          this.fieldPageNumber = this.fromSubGroupFieldView.offset;
          this.fieldPageLimit = this.fromSubGroupFieldView.pageSize;
          this.getListOfFormFields(this.fieldPageNumber, this.fieldPageLimit, this.subGroupID, this.searchFieldData, this.sortBy, this.cOrder)
        }
      }).catch((error) => {
        console.log(error);
      });
    }
  }

  private deleteSubGroupFieldDetails(data, row) {
    if (data.success) {
      this.fieldPageNumber = this.fromSubGroupFieldView.offset;
      this.fieldPageLimit = this.fromSubGroupFieldView.pageSize;
      this.getListOfFormFields(this.fieldPageNumber, this.fieldPageLimit, this.subGroupID, this.searchFieldData, this.sortBy, this.cOrder)
      this.notiService.showSuccess("Sub Group Field deleted successfully", "", 4000);
    } else {
      this.notiService.showError("An error occured!", "", 4000);
    }
  }


  // public actionTableItem(event: any, rowData: any, fromGroupView: any, type: string): void {
  //   event.stopPropagation();
  //   fromGroupView && fromGroupView.parentElement && fromGroupView.parentElement.parentElement &&
  //     fromGroupView.parentElement.parentElement.blur();

  public exportSubGroupExcel() {
   
    let dataParams = {
      page_number: 0,
      limit_of_page: this.totalElements,
      group_id: this.groupId,
      sub_group_name: this.searchData,
      sort_by: this.subGroupSortBy,
      sort_order: this.cOrder
    }
    this.formSubGroupViewService.exportSubgroupList(dataParams).subscribe(
      data => {
        if(data['success']){
          var downloadLink = window.document.createElement('a');
          downloadLink.href = `${environment.apiDownloadUrl}${data['file_name']}`
          downloadLink.download = data['file_name'];
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
          this.notiService.showSuccess('Excel downloaded successfully','',4000);
        }else{
          this.notiService.showError(data['error'],'',4000);
        }

      }, error => {
        console.log(error)
      }
    )
  }

  public exportFieldsExcel() {
    
    let postParams = {
      page_number: 0,
      limit_of_page: this.fieldTotalElements,
      sub_group_id: this.subGroupID,
      display_label: this.searchFieldData,
      sort_by: this.sortBy,
      sort_order: this.cOrder
    }
    this.formSubGroupViewService.exportFieldsList(postParams).subscribe(
      data => {
        if(data['success']){
          var downloadLink = window.document.createElement('a');
          downloadLink.href = `${environment.apiDownloadUrl}${data['file_name']}`
          downloadLink.download = data['file_name'];
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
          this.notiService.showSuccess('Excel downloaded successfully','',4000);
        }else{
          this.notiService.showError(data['error'],'',4000);
        }

      }, error => {
        console.log(error)
      }
    )
  }
}
