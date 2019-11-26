import { Component, OnInit, ViewChild } from '@angular/core';
import { ToasterNotiService } from '../../../shared/services/notifications/toaster-noti.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { FormBrowserService } from '../services/form-browser/form-browser.service';
import { FormBrowserAddComponent } from '../form-browser-add/form-browser-add.component';
import { FormModalComponent } from '../form-modal/form-modal.component';

@Component({
  selector: 'app-form-browser',
  templateUrl: './form-browser.component.html',
  styleUrls: ['./form-browser.component.scss'],
  providers: [DatePipe]
})
export class FormBrowserComponent implements OnInit {

  @ViewChild('formBrowserTable') formBrowserTable: any;

  public modalOption: NgbModalOptions = {};

  public currentPageLimit: number = 25;
  public pageLimitOptions = [
    { value: 10 },
    { value: 25 },
    { value: 50 },
    { value: 100 },
  ];

  public searchCustomer: FormGroup;

  public totalElements: number;
  public pageNumber: number;
  public pagelimit: number;
  public sortOrder: string;
  private searchData: string;

  public formBrowserListData: any;

  constructor(
    private notiService: ToasterNotiService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private router: Router,
    private formBrowserService: FormBrowserService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
  ) {
    this.pagelimit = 25;
  }

  ngOnInit() {


    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    this.modalOption.size = "lg";

    this.buildSearchForm();
    this.setPage({ offset: 0 });
  }

  public buildSearchForm() {
    this.searchCustomer = this.formBuilder.group({
      searchValue: new FormControl('', [Validators.required])
    });
  }

  public setPage(pageInfo) {
    this.pageNumber = pageInfo.offset;
    this.getFormListData(this.pageNumber, this.pagelimit, this.searchData, this.sortOrder);
  }

  public getFormListData(pageNumber, pagelimit, searchData, sortOrder) {
    this.spinner.show();
    let dataParams = {
      page_number: pageNumber,
      limit_of_page: pagelimit,
      search_form_name: searchData,
      sort_by: 'form_name',
      sort_order: sortOrder
    }

    this.formBrowserService.getFormBrowserList(dataParams).subscribe(data => {
      console.log(data)
      this.formBrowserListDetails(data)
    })
  }

  private formBrowserListDetails(data) {
    this.spinner.hide()
    if (data.success) {
      this.formBrowserListData = data.forms_list;

      this.formBrowserListData.map(item => {
        item['created_on'] = this.datePipe.transform(item['created_on'], 'MM/dd/yyyy');
      })
      this.totalElements = data.total_row
      console.log(this.formBrowserListData)
    }
  }

  public onSort(event) {

    if (event.column.name == "Form Name") {
      this.sortOrder = event.newValue;
      this.pageNumber = 0;
      this.pagelimit = this.formBrowserTable.pageSize;
      this.getFormListData(this.pageNumber, this.pagelimit, this.searchData, this.sortOrder);
    }
  }

  public search() {
    this.searchData = this.searchCustomer.controls['searchValue'].value;
    this.pageNumber = 0;
    this.pagelimit = this.formBrowserTable.pageSize;
    this.getFormListData(this.pageNumber, this.pagelimit, this.searchData, this.sortOrder);
  }

  public clear() {
    this.searchCustomer.reset();
    this.searchData = "";
    this.pageNumber = 0;
    this.pagelimit = this.formBrowserTable.pageSize;
    this.getFormListData(this.pageNumber, this.pagelimit, this.searchData, this.sortOrder);
  }

  public onLimitChange(limit) {
    this.pagelimit = limit;
    this.pageNumber = 0;
    this.getFormListData(this.pageNumber, this.pagelimit, this.searchData, this.sortOrder);
  }

  public actionClicked(event: any, rowData: any, firstChild: any, type: string): void {
    event.stopPropagation();
    firstChild && firstChild.parentElement && firstChild.parentElement.parentElement &&
      firstChild.parentElement.parentElement.blur();

    if (type == 'edit') {

      let addParams = {
        type: 'edit',
        form_data: rowData.form_name
      }
  
      const addPopup = this.modalService.open(FormBrowserAddComponent, this.modalOption);
      addPopup.componentInstance.popupType = addParams;
  
      addPopup.result.then((result) => {
        console.log(result);
  
        if (result == 'yes') {
          this.pageNumber = 0;
          this.getFormListData(this.pageNumber, this.pagelimit, this.searchData, this.sortOrder);
        } else {
  
        }
      }).catch((error) => {
        console.log(error);
      });

    } else if (type == 'map') {
      //this.router.navigateByUrl(myurl)
      this.router.navigate(['formlist/browser/map', rowData.form_id]);
    } else if (type == 'delete') {
      let dataItem = {
        name: rowData.form_name,
        type: 'form',
        action: 'delete'
      };
      const confRef = this.modalService.open(FormModalComponent, this.modalOption);
      confRef.componentInstance.dataStatus = dataItem;
      confRef.result.then((result) => {
        if (result == 'yes') {
         this.deleteFormBrowser(rowData)
        }
        else if (result == 'no') {
        }
      }).catch((error) => {
        console.log(error);
      });
    }
  }

  public deleteFormBrowser(data){

    let param = {
      form_id: data.form_id
    }

    this.formBrowserService.deleteFormBrowser(param).subscribe( data => {
      this.deleteFormBrowserDetails(data)
    })

  }

  private deleteFormBrowserDetails(data){
    if(data.success){
      this.notiService.showSuccess(data.message, '' , 4000)
      this.getFormListData(this.pageNumber, this.pagelimit, this.searchData, this.sortOrder);
    }else{
      this.notiService.showError(data.error, '' , 4000)
    }
  }

  public createForm() {

    let addParams = {
      type: 'add',
      form_id: ''
    }

    const addPopup = this.modalService.open(FormBrowserAddComponent, this.modalOption);
    addPopup.componentInstance.popupType = addParams;

    addPopup.result.then((result) => {
      console.log(result);

      if (result == 'yes') {
        this.pageNumber = 0;
        this.getFormListData(this.pageNumber, this.pagelimit, this.searchData, this.sortOrder);
      } else {

      }
    }).catch((error) => {
      console.log(error);
    });
  }



}
