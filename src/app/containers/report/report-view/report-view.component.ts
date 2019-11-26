import { Component, OnInit, ViewChild } from '@angular/core';
import { ToasterNotiService } from '../../../shared/services/notifications/toaster-noti.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute, Router } from '@angular/router';

import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbModalOptions, NgbActiveModal, NgbModal, NgbDateStruct, NgbCalendar, NgbDateAdapter, NgbDateNativeAdapter, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { ReportViewService } from '../service/report-view/report-view.service';
import { environment } from '../../../../environments/environment';


@Component({
  selector: 'app-report-view',
  templateUrl: './report-view.component.html',
  styleUrls: ['./report-view.component.scss']
})
export class ReportViewComponent implements OnInit {

  @ViewChild('loggedTable') loggedTable: any;

  modalOption: NgbModalOptions = {};

  public currentPageLimit: number = 25;
  public pageLimitOptions = [
    { value: 10 },
    { value: 25 },
    { value: 50 },
    { value: 100 },
  ];

  public loggedPageNumber: number;
  public loggedLimit: number;
  public loggedCount: number;
  public loggedReportData: any;
  public loggedSortOrder: any;
  public searchLoggedData: string;

  public unloggedPageNumber: number;
  public unloggedLimit: number;
  public unloggedCount: number;
  public unloggedReportData: any;

  public searchLogged: FormGroup;
  public searchUnLogged: FormGroup;

  constructor(
    private notiService: ToasterNotiService,
    private spinner: NgxSpinnerService,
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private router: Router,
    private reportViewService: ReportViewService
  ) {
    this.unloggedLimit = 25;
    this.loggedLimit = 25;
  }

  ngOnInit() {
    this.buildLoggedForm();
    this.buildUnloggedForm();
    this.onUnloggedPage({ offset: 0 })
  }


  public buildLoggedForm() {
    this.searchLogged = this.formBuilder.group({
      searchValue: new FormControl('', [Validators.required])
    });
  }

  public buildUnloggedForm() {
    this.searchUnLogged = this.formBuilder.group({
      searchValue: new FormControl('', [Validators.required])
    });
  }
  //{"page_number":0,"limit_of_page":20}
  public onUnloggedPage(pageInfo) {
    this.unloggedPageNumber = pageInfo.offset;
    this.getUnloggedVisitor(this.unloggedPageNumber, this.unloggedLimit)
  }

  public getUnloggedVisitor(pNumber, pLimit) {
    this.spinner.show();
    let dataParams = {
      page_number: pNumber,
      limit_of_page: pLimit
    }

    this.reportViewService.getUnloggedVisitorDetails(dataParams).subscribe(
      item => {
        this.unloggedVisitorDetails(item);
      }
    )

  }

  private unloggedVisitorDetails(data) {
    if (data.success) {
      this.unloggedReportData = data.customer_list;
      this.unloggedCount = data.total_row;
    }
    this.spinner.hide();
  }

  public onLimitChange(limit, type) {
    if (type == 'unlogged') {
      console.log(limit + type)
      this.unloggedPageNumber = 0;
      this.unloggedLimit = limit;
      this.getUnloggedVisitor(this.unloggedPageNumber, this.unloggedLimit)

    } else if (type == 'logged') {
      this.loggedPageNumber = 0;
      this.loggedLimit = limit;
      this.getLoggedVisitor(this.loggedPageNumber, this.loggedLimit, this.loggedSortOrder, this.searchLoggedData)
    }
  }

  public beforeChange($event: NgbTabChangeEvent) {
    console.log($event)
    if ($event.nextId == 'unlogged') {
      this.onUnloggedPage({ offset: 0 })
    } else if ($event.nextId == 'logged') {
      this.onLoggedPage({ offset: 0 })
    }
  }

  public onLoggedPage(pageInfo) {
    this.loggedPageNumber = pageInfo.offset;
    this.getLoggedVisitor(this.loggedPageNumber, this.loggedLimit, this.loggedSortOrder, this.searchLoggedData)
  }

  public getLoggedVisitor(pNumber, pLimit, sOrder, searchData) {
    this.spinner.show();
    let dataParams = {
      page_number: pNumber,
      limit_of_page: pLimit,
      sort_by: 'customer_name',
      sort_order: sOrder,
      customer_name: searchData,
      name: '',
      email: ''
    }

    this.reportViewService.getLoggedVisitorDetails(dataParams).subscribe(
      item => {
        this.loggedVisitorDetails(item);
      }
    )

  }

  private loggedVisitorDetails(data) {
    if (data.success) {
      this.loggedReportData = data.customer_list;
      this.loggedCount = data.total_row;
      console.log(this.loggedReportData)
    }
    this.spinner.hide();
  }

  onLoggedSort(event) {

    if (event.column.name == "Customer") {
      this.loggedSortOrder = event.newValue;
      
      this.loggedPageNumber = 0;
      this.loggedLimit = this.loggedTable.pageSize;
      this.getLoggedVisitor(this.loggedPageNumber, this.loggedLimit, this.loggedSortOrder, this.searchLoggedData)
      
    }
  }

  public loggedSearch() {
    this.spinner.show();
    this.searchLoggedData = this.searchLogged.controls['searchValue'].value;
    this.loggedPageNumber = 0;
    this.loggedLimit = this.loggedTable.pageSize;
    this.getLoggedVisitor(this.loggedPageNumber, this.loggedLimit, this.loggedSortOrder, this.searchLoggedData)
  }

  public loggedClear() {
    this.spinner.show();
    this.searchLogged.reset();
    this.searchLoggedData = "";
    this.loggedPageNumber = 0;
    this.loggedLimit = this.loggedTable.pageSize;
    this.getLoggedVisitor(this.loggedPageNumber, this.loggedLimit, this.loggedSortOrder, this.searchLoggedData)
  }


  public exportVisitedLogExcel(){

    let dataParams = {
      page_number: 0,
      limit_of_page: this.loggedCount,
      sort_by: '',
      sort_order:'',
      customer_name: this.searchLoggedData,
      name: '',
      email: ''
    }
    this.reportViewService.exportVisited(dataParams).subscribe(
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

  public exportNotVisitedLogExcel(event) {
    //event.preventdefault();

    this.unloggedPageNumber, this.unloggedLimit
    let dataParams = {
      page_number: 0,
      limit_of_page: this.unloggedCount
    }
    this.reportViewService.exportNotVisited(dataParams).subscribe(
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
