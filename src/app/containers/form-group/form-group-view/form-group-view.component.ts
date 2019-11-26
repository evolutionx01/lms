import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormGroupViewService } from '../services/form-group-view/form-group-view.service';
import { Router } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { FormGroupAddComponent } from '../form-group-add/form-group-add.component';
import { ToasterNotiService } from '../../../shared/services/notifications/toaster-noti.service';
import { FormGroupModalComponent } from '../form-group-modal/form-group-modal.component';
import { FormGroupReorderComponent } from '../form-group-reorder/form-group-reorder.component';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-form-group-view',
  templateUrl: './form-group-view.component.html',
  styleUrls: ['./form-group-view.component.scss']
})
export class FormGroupViewComponent implements OnInit {

  totalProviderElements: any;
  totalLocationElements: any;
  totalTinElements: any;
  groupSortBy: string;
  cOrder: any;
  userId: string;
  @ViewChild('myGroupTable') fromGroupTable: any;

  modalOption: NgbModalOptions = {};

  public totalElements: number;
  public formGroupData: any;
  public pageNumber: number;
  public pageLimit: number;
  public typeId: number;
  public searchText: string;

  public searchGroup: FormGroup;

  public currentPageLimit: number = 25;
  public pageLimitOptions = [
    { value: 10 },
    { value: 25 },
    { value: 50 },
    { value: 100 },
  ];
  public formType = [
    { item_id: 1, item_name: 'TIN' },
    { item_id: 2, item_name: 'Location' },
    { item_id: 3, item_name: 'Provider' }

  ];

  public groupTypeData = [
    { type: 'TIN', type_id: 1 },
    { type: 'Location', type_id: 2 },
    { type: 'Provider', type_id: 3 }
  ];



  constructor(
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private formGroupViewService: FormGroupViewService,
    private router: Router,
    private modalService: NgbModal,
    private notiService: ToasterNotiService
  ) {

  }

  ngOnInit() {
    this.userId = localStorage.getItem('userId');
    this.searchText = '';
    this.pageLimit = 25;
    this.typeId = 0;

    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    this.modalOption.size = "lg";


    this.buildSearchForm();
    this.setPage({ offset: 0 });
  }
  // search code
  buildSearchForm() {
    this.searchGroup = this.formBuilder.group({
      searchValue: new FormControl(''),
      type_id: new FormControl(null)
    });
  }

  public onSort(event) {
    console.log(event);
    if (event.column.name == "Group Name") {
      this.cOrder = event.newValue;
      this.groupSortBy = 'group_name'
      //this.spinner.show();
      this.pageNumber = 0;
      this.pageLimit = this.fromGroupTable.pageSize;
      this.getFormGroupDetails(this.pageNumber, this.pageLimit, this.typeId, this.searchText, this.cOrder, this.groupSortBy)
    } else if (event.column.name == "Order ID") {
      this.cOrder = event.newValue;
      this.groupSortBy = 'order_id'
      //this.spinner.show();
      this.pageNumber = 0;
      this.pageLimit = this.fromGroupTable.pageSize;
      this.getFormGroupDetails(this.pageNumber, this.pageLimit, this.typeId, this.searchText, this.cOrder, this.groupSortBy)
    }
  }
  public search() {
    console.log(this.searchGroup.controls['type_id'].value);
    this.searchText = this.searchGroup.controls['searchValue'].value;
    this.pageNumber = 0;
    this.pageLimit = this.fromGroupTable.pageSize;
    this.typeId = this.searchGroup.controls['type_id'].value;
    this.getFormGroupDetails(this.pageNumber, this.pageLimit, this.typeId, this.searchText, this.cOrder, this.groupSortBy)
  }

  public clear() {

    this.searchGroup.reset();
    this.pageNumber = 0;
    this.pageLimit = this.fromGroupTable.pageSize;
    this.typeId = 0;
    this.searchText = '';
    this.getFormGroupDetails(this.pageNumber, this.pageLimit, this.typeId, this.searchText, this.cOrder, this.groupSortBy)
  }

  // ngx-datatable code

  onFormGroupSort(data) {
    console.log(data);
  }

  setPage(pageInfo) {
    this.spinner.show();
    console.log(pageInfo);
    this.pageNumber = pageInfo.offset;
    this.getFormGroupDetails(this.pageNumber, this.pageLimit, this.typeId, this.searchText, this.cOrder, this.groupSortBy)
  }

  getFormGroupDetails(grpPageNumber, grpPageLimit, grpTypeId, grpSearchText, sOrder, grpSort) {
    this.spinner.show();
    let dataParams = {
      page_number: grpPageNumber,
      limit_of_page: grpPageLimit,
      type_id: grpTypeId,
      group_name: grpSearchText,
      sort_by: grpSort,
      sort_order: sOrder
    }

    this.formGroupViewService.getFormGroupData(dataParams).subscribe(
      data => this.groupDetails(data)
    )
  }

  groupDetails(data) {
    this.formGroupData = data.groups_list;
    this.totalElements = data.total_row;
    this.totalTinElements = data.tin_count;
    this.totalLocationElements = data.location_count;
    this.totalProviderElements = data.provider_count;
    this.spinner.hide();
    console.log(this.formGroupData);
  }

  // limit change of grid

  onLimitChange(limit) {
    console.log(limit);
    this.pageLimit = limit;
    this.pageNumber = 0;
    this.getFormGroupDetails(this.pageNumber, this.pageLimit, this.typeId, this.searchText, this.cOrder, this.groupSortBy)
  }

  // action clicked

  public actionClicked(event: any, rowData: any, fromGroupView: any, type: string): void {
    event.stopPropagation();
    fromGroupView && fromGroupView.parentElement && fromGroupView.parentElement.parentElement &&
      fromGroupView.parentElement.parentElement.blur();

    if (type == 'view') {
      this.router.navigate(['groups/subgroup', rowData.group_id]);
    } else if (type == 'edit') {
      console.log(rowData);
      rowData.group_type = 'edit'
      const editPopup = this.modalService.open(FormGroupAddComponent, this.modalOption);
      editPopup.componentInstance.popupType = rowData;

      editPopup.result.then((result) => {
        if (result == 'yes') {
          console.log(this.fromGroupTable);
          console.log(this.fromGroupTable.offset);
          this.pageNumber = this.fromGroupTable.offset;
          this.pageLimit = this.fromGroupTable.pageSize;
          this.getFormGroupDetails(this.pageNumber, this.pageLimit, this.typeId, this.searchText, this.cOrder, this.groupSortBy);
          // this.setPage({ offset: 0 });
        } else if (result == 'no') {

        }
      }).catch((error) => {
        console.log(error);
      });
    } else if (type == 'delete') {
      let dataParams = {
        action: 'delete',
        type: 'group',
        name: rowData.group_name
      }
      const confirmPopup = this.modalService.open(FormGroupModalComponent, this.modalOption);
      confirmPopup.componentInstance.dataStatus = dataParams;

      confirmPopup.result.then((result) => {
        if (result == 'yes') {
          let dataParams = {
            group_id: rowData.group_id,
            updated_by: this.userId
          }
          this.formGroupViewService.deleteFromGroupData(dataParams).subscribe(
            data => this.deleteGroupDetails(data, rowData)
          )
        }
      }).catch((error) => {
        console.log(error);
      });

    } else if (type == 'reorder') {
      console.log(rowData);

      let count = '';
      if (rowData.type_id == 1) {
        count = this.totalTinElements
      } else if (rowData.type_id == 2) {
        count = this.totalLocationElements
      } else if (rowData.type_id == 3) {
        count = this.totalProviderElements
      }
      let dataParams = {
        action: 'reorder',
        type: 'group',
        name: rowData.group_name,
        old_order_id: rowData.order_id,
        group_id: rowData.group_id,
        total_count: count
      }
      const confirmPopup = this.modalService.open(FormGroupReorderComponent, this.modalOption);
      confirmPopup.componentInstance.dataStatus = dataParams;

      confirmPopup.result.then((result) => {
        console.log('yes')
        if (result == 'yes') {
          this.pageNumber = this.fromGroupTable.offset;
          this.pageLimit = this.fromGroupTable.pageSize;
          this.getFormGroupDetails(this.pageNumber, this.pageLimit, this.typeId, this.searchText, this.cOrder, this.groupSortBy);
        }
      }).catch((error) => {
        console.log(error);
      });
    }
    console.log(rowData.group_id);
  }

  private deleteGroupDetails(data, rowData) {
    if (data.success) {
      this.pageNumber = this.fromGroupTable.offset;
      this.pageLimit = this.fromGroupTable.pageSize;
      this.getFormGroupDetails(this.pageNumber, this.pageLimit, this.typeId, this.searchText, this.cOrder, this.groupSortBy);
      this.notiService.showSuccess("Group deleted successfully", "", 4000);

    } else {

      this.notiService.showError("An error occured!", "", 4000);
    }
  }

  public openAddGroup() {
    let addParams = {
      id: '',
      group_type: 'add'
    }
    const addPopup = this.modalService.open(FormGroupAddComponent, this.modalOption);
    addPopup.componentInstance.popupType = addParams;

    addPopup.result.then((result) => {
      if (result == 'yes') {
        this.pageNumber = 0;
        this.pageLimit = this.fromGroupTable.pageSize;
        this.getFormGroupDetails(this.pageNumber, this.pageLimit, this.typeId, this.searchText, this.cOrder, this.groupSortBy);
      } else if (result == 'no') {

      }
    }).catch((error) => {
      console.log(error);
    });

  }

  public exportExcel() {

    let dataParams = {
      page_number: 0,
      limit_of_page: this.totalElements,
      type_id: this.typeId,
      group_name: this.searchText,
      sort_by: this.groupSortBy,
      sort_order: this.cOrder
    }
    this.formGroupViewService.exportFormGroup(dataParams).subscribe(
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
