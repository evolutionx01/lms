import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { NgbModalOptions, NgbActiveModal, NgbModal, NgbDateStruct, NgbCalendar, NgbDateAdapter, NgbDateNativeAdapter, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { NgOption } from '@ng-select/ng-select';
import { CustomerModalComponent } from '../customer-modal/customer-modal.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToasterNotiService } from '../../../shared/services/notifications/toaster-noti.service';
import { Router } from '@angular/router';
import { CustomerReportsService } from '../services/customer-reports/customer-reports.service';

@Component({
  selector: 'app-customer-reports',
  templateUrl: './customer-reports.component.html',
  styleUrls: ['./customer-reports.component.scss']
})
export class CustomerReportsComponent implements OnInit {

  public showStatusBtn: boolean

  public displayCheck: any;
  public selected = [];
  public selectedArray: any;

  public cannedReportData: any;
  public cannedCustomerId: number;
  public customerList: any
  public cannedPageNumber: number;
  public cannedLimit: number;
  public cannedCount: number

  public ipaPageNumber: number;
  public ipaLimit: number;
  public ipaReportData: any;
  public ipaCount: number;

  @ViewChild('cannedTable') cannedtable: any;
  @ViewChild('ipaTable') ipatable: any;

  modalOption: NgbModalOptions = {};

  public currentPageLimit: number = 25;
  public pageLimitOptions = [
    { value: 10 },
    { value: 25 },
    { value: 50 },
    { value: 100 },
  ];

  public searchCanned: FormGroup;
  public searchIpa: FormGroup;
  public selectCustomer: FormGroup;

  constructor(
    private notiService: ToasterNotiService,
    private spinner: NgxSpinnerService,
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private customerReportsService: CustomerReportsService,
    private router: Router

  ) {
    this.cannedLimit = 25;
    this.ipaLimit = 25;
  }

  ngOnInit() {
    this.showStatusBtn = true;

    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    this.modalOption.size = "lg";
    this.modalOption.centered = true;
    this.buildSelectForm();
    this.buildCannedForm();
    this.buildIpaForm();

    this.onIpaPage({ offset: 0 });

  }

  public buildCannedForm() {
    this.searchCanned = this.formBuilder.group({
      searchValue: new FormControl('', [Validators.required])
    });
  }

  public buildIpaForm() {
    this.searchIpa = this.formBuilder.group({
      searchValue: new FormControl('', [Validators.required])
    });
  }

  public buildSelectForm() {
    this.selectCustomer = this.formBuilder.group({
      customer_id: new FormControl(null, [Validators.required])
    });
  }
  //{"page_number":0,"limit_of_page":20}



  public onIpaPage(pageInfo) {
    this.ipaPageNumber = pageInfo.offset;
    this.getIpaReport(this.ipaPageNumber, this.ipaLimit)
  }

  public getIpaReport(pNumber, pLimit) {
    this.spinner.show();
    let dataParams = {
      page_number: pNumber,
      limit_of_page: pLimit
    }

    this.customerReportsService.getIpaReportDetails(dataParams).subscribe(
      item => {
        this.ipaReportDetails(item);
      })
  }

  private ipaReportDetails(data) {
    this.ipaReportData = data.customer_list;
    this.ipaCount = data.total_row;
    this.ipaReportData.map(item => {
      if (item['is_caap'] == 1) {
        item['ipastatus'] = true;
      } else if (item['is_caap'] == 0) {
        item['ipastatus'] = false;
      }
    })
    this.spinner.hide();
  }

  public beforeChange($event: NgbTabChangeEvent) {

    if ($event.nextId == "canned") {

      // this.cannedPageNumber = 0 ;
      // this.cannedLimit = 25 ;
      // this.cannedCustomerId = 0;
      // this.cannedReportData = [];
      // this.cannedCount = 0;
      // this.selectCustomer.patchValue({ customer_id: null })

      this.getCustomerList();
    } else if ($event.nextId == "ipa") {

      this.onIpaPage({ offset: 0 });
    }
  }

  public getCustomerList() {
    this.customerReportsService.getCustomerList().subscribe(
      data => {
        this.getCustomerDetails(data)
      }
    )
  }

  private getCustomerDetails(data) {
    console.log(data)
    this.customerList = data.customer_list;
    this.cannedCustomerId = data.customer_list[0].user_id;
    this.cannedPageNumber = 0;
    this.cannedLimit = 25;
    this.selectCustomer.patchValue({ customer_id: this.cannedCustomerId })
    this.getCannedReport(this.cannedPageNumber, this.cannedLimit, this.cannedCustomerId)
  }

  public onLimitChange(limit, type) {
    if (type == 'canned') {

      console.log(limit + type)
      this.cannedPageNumber = 0;
      this.cannedLimit = limit;
      this.getCannedReport(this.cannedPageNumber, this.cannedLimit, this.cannedCustomerId)

    } else if (type == 'ipa') {

      console.log(limit + type)
      this.ipaPageNumber = 0;
      this.ipaLimit = limit;
      this.getIpaReport(this.ipaPageNumber, this.ipaLimit);
    }
  }

  public onIpaStatusChange(event, rowData, firstChild) {
    event.stopPropagation();
    firstChild && firstChild.parentElement && firstChild.parentElement.parentElement &&
      firstChild.parentElement.parentElement.blur();

    let dataPost = {
      name: rowData.customer,
      type: 'Ipa Report',
      action: rowData.ipastatus ? 'inactivate' : 'activate'
    }

    const confRef = this.modalService.open(CustomerModalComponent, this.modalOption);
    confRef.componentInstance.dataStatus = dataPost;
    confRef.result.then((result) => {

      if (result == 'yes') {

        let dataParams = {
          user_id: rowData.user_id,
          flag: rowData.ipastatus ? 'disable' : 'enable'
        }
        this.spinner.show();
        this.customerReportsService.getIpaReportStatus(dataParams).subscribe(
          item => {
            this.ipaStatusChangeData(item)
          }
        )
      } else if (result == 'no') {

      }
    }).catch((error) => {
      console.log(error);
    });
    //{"user_id":53,"flag":"enable"}


  }

  private ipaStatusChangeData(data) {
    console.log(data)
    if (data.success) {
      this.notiService.showSuccess(data.message, '', 4000);
      this.getIpaReport(this.ipaPageNumber, this.ipaLimit);
    } else {
      this.notiService.showSuccess(data.error, '', 4000);
      this.spinner.hide();
    }

  }

  public onCustomerChange(event) {
    console.log(event);
    this.showStatusBtn = true;
    this.selected =[]
    this.cannedCustomerId = event.user_id;
    this.onCannedPage({ offset: 0 });
  }


  public onCannedPage(pageInfo) {
    this.cannedPageNumber = pageInfo.offset;
    this.getCannedReport(this.cannedPageNumber, this.cannedLimit, this.cannedCustomerId)
  }

  public getCannedReport(pNumber, pLimit, custId) {
    this.spinner.show();
    let dataParams = {
      page_number: 0,
      limit_of_page: 0,
      customer_id: custId
    }

    this.customerReportsService.getCannedReportDetails(dataParams).subscribe(
      data => {
        this.getCannedReportDetails(data);
      }
    )
  }

  private getCannedReportDetails(data) {
    this.cannedReportData = data.customer_list;
    this.cannedCount = data.total_row;
    this.cannedReportData.map(item => {
      if (item['is_access'] == 1) {
        item['cannedstatus'] = true;
      } else if (item['is_access'] == 0) {
        item['cannedstatus'] = false;
      }
    })
    console.log(this.cannedReportData)
    this.spinner.hide();
  }


  public onCannedStatusChange(flag) {

    let dataPost = {
      name: 'Canned Report',
      type: 'selected',
      action: flag == 0 ? 'inactivate' : 'activate'
    }

    const confRef = this.modalService.open(CustomerModalComponent, this.modalOption);
    confRef.componentInstance.dataStatus = dataPost;
    confRef.result.then((result) => {

      if (result == 'yes') {

        let dataParams = {
          user_id: this.cannedCustomerId,
          canned_report_id: this.selectedArray,
          action: flag == 0 ? 'disable' : 'enable'
        }
        this.spinner.show();
        this.customerReportsService.getCannedReportStatus(dataParams).subscribe(
          item => {
            this.cannedStatusChangeData(item)
          }
        )
      } else if (result == 'no') {

      }
    }).catch((error) => {
      console.log(error);
    });
  }

  private cannedStatusChangeData(data) {
    this.selected = []
    this.showStatusBtn = true;
    console.log(data)
    if (data.success) {

      this.notiService.showSuccess(data.message, '', 4000);
      this.getCannedReport(this.cannedPageNumber, this.cannedLimit, this.cannedCustomerId)
    } else {
      this.notiService.showSuccess(data.error, '', 4000);
      this.spinner.hide();
    }

  }

  public onActivate() {

  }
  public onSelect(event) {
    if(event.selected.length == 0){
      this.showStatusBtn = true;
    }else{
      this.showStatusBtn = false;
    }
    
    this.selectedArray = []

    event.selected.map(item => {
      this.selectedArray.push(item['canned_report_id'])
    })
    console.log(this.selectedArray)
  }

  public onSort(event) {

  }

}
