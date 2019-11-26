import { Component, OnInit, ViewChild } from '@angular/core';
import { ToasterNotiService } from '../../../shared/services/notifications/toaster-noti.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbModalOptions, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DropdownAddComponent } from '../dropdown-add/dropdown-add.component';
import { DropdownViewService } from '../service/dropdown-view/dropdown-view.service';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-dropdown-view',
  templateUrl: './dropdown-view.component.html',
  styleUrls: ['./dropdown-view.component.scss'],
  providers: [DatePipe]
})
export class DropdownViewComponent implements OnInit {


  cOrder: any;
  SearchData: any;
  @ViewChild('myDropdownTable') dropdownTable: any;

  modalOption: NgbModalOptions = {};

  public dropdownData: any;
  public totalElements: number;
  public pageNumber: number;
  public pageLimit: number;

  public currentPageLimit: number = 25;
  public pageLimitOptions = [
    { value: 10 },
    { value: 25 },
    { value: 50 },
    { value: 100 },
  ];

  public searchDropdown: FormGroup;

  constructor(
    private dropdownService: DropdownViewService,
    private notiService: ToasterNotiService,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
    private datePipe: DatePipe,
    private formBuilder: FormBuilder,
    private router: Router,
  ) {
    this.pageLimit = 25;

  }

  ngOnInit() {
    this.setPage({ offset: 0 });
    this.buildSearchForm();
    this.SearchData = '';

    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    this.modalOption.size = "lg";
  }


  buildSearchForm() {
    this.searchDropdown = this.formBuilder.group({
      searchValue: new FormControl('', Validators.required)
    });
  }

  public search() {
    this.SearchData = this.searchDropdown.controls['searchValue'].value;
    this.getDropdownList(this.pageNumber, this.pageLimit, this.SearchData, this.cOrder);

  }

  public clear() {
    this.searchDropdown.reset();
    this.SearchData = '';
    this.pageNumber = 0;
    this.getDropdownList(this.pageNumber, this.pageLimit, this.SearchData, this.cOrder);
  }

  public onSort(event) {
    console.log(event);
    if (event.column.name == "Dropdown Name") {
      this.cOrder = event.newValue;
      //this.spinner.show();
      this.pageNumber = 0;
      this.pageLimit = this.dropdownTable.pageSize;
      this.getDropdownList(this.pageNumber, this.pageLimit, this.SearchData, this.cOrder);
    }
  }

  public setPage(pageInfo) {
    this.spinner.show();
    this.pageNumber = pageInfo.offset;
    this.getDropdownList(this.pageNumber, this.pageLimit, this.SearchData, this.cOrder);

  }

  public getDropdownList(pNumber, pLimit, pSearch, pOrder) {
    this.spinner.show();
    let dataParams = {
      page_number: pNumber,
      limit_of_page: pLimit,
      drop_down_name: pSearch,
      sort_by: 'drop_down_name',
      sort_order: pOrder
    }

    this.dropdownService.getDropdownList(dataParams).subscribe(
      data => {
        this.getDropdownData(data);
      },
      error => {
        this.notiService.showError(error, "", 4000);
        this.spinner.hide();
      }
    )
  }

  private getDropdownData(data) {
    if (data.success) {
      console.log(data.drop_downs_list)
      this.totalElements = data.total_row;
      data.drop_downs_list.map(item => {
        item['created_on'] = this.datePipe.transform(item['created_on'], 'MM/dd/yyyy');
        if (!item['created_by']) {
          item['user_name'] = '';
        } else {
          item['user_name'] = item['created_by']['first_name'] + " " + item['created_by']['last_name']
        }
      })
      this.dropdownData = data.drop_downs_list;

      console.log(this.dropdownData)
      this.spinner.hide();
    }
  }

  public onLimitChange(limit) {
    this.pageLimit = limit;
    this.pageNumber = 0;
    this.getDropdownList(this.pageNumber, this.pageLimit, this.SearchData, this.cOrder);
  }

  public openAddDropdown() {
    // this.router.navigate(['dropdown/edit', '']);
    let addParams = {
      id: '',
      type: 'add'
    }

    const addDropdown = this.modalService.open(DropdownAddComponent, this.modalOption);
    addDropdown.componentInstance.popupType = addParams;

    addDropdown.result.then((result) => {
      console.log(result);
      if (result == 'yes') {
        this.pageNumber = 0;
        this.pageLimit = this.dropdownTable.pageSize;
        this.getDropdownList(this.pageNumber, this.pageLimit, this.SearchData, this.cOrder);
      }

    }).catch((error) => {
      console.log(error);
    });
  }


  public actionClicked(event: any, rowData: any, dropdownTable: any, type: string): void {
    event.stopPropagation();
    dropdownTable && dropdownTable.parentElement && dropdownTable.parentElement.parentElement &&
      dropdownTable.parentElement.parentElement.blur();

    if (type == 'edit') {
      console.log(rowData)
      //this.router.navigate(['dropdown/edit', rowData.drop_down_id]);
      this.spinner.show();

      let dataParams = {
        drop_down_id: rowData.drop_down_id,
        page_number: 0,
        limit_of_page: 25
      }

      this.dropdownService.getDropdownEditDetails(dataParams).subscribe(
        data => {
          this.getEditDropdownDetails(data, rowData);
        }
      )
    } else if (type == 'export') {
      console.log(rowData)
      this.spinner.show();

      let dataParams = {
        drop_down_id: rowData.drop_down_id,
        dropdown_item_name: rowData.drop_down_name,
        page_number: 0,
        limit_of_page: 0
      }

      this.dropdownService.exportDropdown(dataParams).subscribe(
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
          this.spinner.hide()
          
        }
      )
    }

  }

  private getEditDropdownDetails(data, rowData) {

    console.log(data);
    this.spinner.hide();
    let addParams = {
      id: rowData.drop_down_id,
      type: 'edit',
      drop_down_name: data.drop_down_details[0].drop_down_name,
      drop_down_items: data.items,
      count: data.items_count

    }

    const editPopup = this.modalService.open(DropdownAddComponent, this.modalOption);
    editPopup.componentInstance.popupType = addParams;

    editPopup.result.then((result) => {
      console.log(result);
      if (result == 'yes') {
        this.pageNumber = 0;
        this.pageLimit = this.dropdownTable.pageSize;
        this.getDropdownList(this.pageNumber, this.pageLimit, this.SearchData, this.cOrder);
      } else if (result == 'no') {

      }
    }).catch((error) => {
      console.log(error);
    });
  }





}
