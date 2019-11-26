import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { NgbModalOptions, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomerFormComponent } from '../customer-form/customer-form.component';
import { CustomerModalComponent } from '../customer-modal/customer-modal.component';
import { CustomerViewService } from '../services/customer-view/customer-view.service';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { StaticInjector } from '@angular/core/src/di/injector';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToasterNotiService } from '../../../shared/services/notifications/toaster-noti.service';
import { DatePipe } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'customer-view',
  templateUrl: './customer-view.component.html',
  styleUrls: ['./customer-view.component.scss'],
  providers: [DatePipe]
})
export class CustomerViewComponent implements OnInit {

  fileUrl: any;
  @ViewChild('myCustomerTable') customerTable: any;
  public licID: any;
  public editData: any;
  public modalOption: NgbModalOptions = {};
  public confirmationOption: NgbModalOptions = {};
  public searchCustomer: FormGroup;
  public test: Array<object>;
  public custViewData: Array<object>;
  public custDetails: Array<object>;
  public totalElements: number;
  public pageNumber: number;
  public pagelimit: number;
  private closeResult: string;
  private searchData: string;
  public cOrder: string;

  public currentPageLimit: number = 25;
  public pageLimitOptions = [
    { value: 10 },
    { value: 25 },
    { value: 50 },
    { value: 100 },
  ];

  constructor(
    private notiService: ToasterNotiService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private router: Router,
    private custService: CustomerViewService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private sanitizer: DomSanitizer
  ) {

  }

  ngOnInit() {
    //this.exportExcel()
    this.buildSearchForm();
    this.setPage({ offset: 0 });

    this.pagelimit = 25;
    this.searchData = '';
    this.cOrder = '';

    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    this.modalOption.size = "lg";
  }

  public exportExcel() {
 
    let params = {
      search_name: this.searchData,
      order: this.cOrder
    }
    
    this.custService.exportExcel(params).subscribe(
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

  public buildSearchForm() {
    this.searchCustomer = this.formBuilder.group({
      searchValue: new FormControl('', [Validators.required])
    });
  }

  public setPage(pageInfo) {
    this.pageNumber = pageInfo.offset;
    this.getCustomerData(2, this.pageNumber, this.pagelimit, this.searchData, this.cOrder);
  }

  public getCustomerData(type, pageNumber, limit, searchName, orderType) {
    this.spinner.show();
    this.pageNumber = pageNumber;
    this.spinner.show();
    let postCustomerObj = {
      type_id: type,
      page_number: pageNumber,
      limit: limit,
      search_name: searchName,
      order: orderType
    }
    this.custService.getCustomerList(postCustomerObj).subscribe(
      data => {
        this.getCustDetails(data);
      },
      error => {
        this.notiService.showError(error, "", 4000);
        this.spinner.hide();
        this.router.navigate(['signin']);
      }
    )
  }

  private getCustDetails(data) {
    this.totalElements = data.total_row;
    this.custDetails = data.customerslist;
    console.log(this.custDetails)
    this.custDetails.map(item => {
      item['created_on'] = this.datePipe.transform(item['created_on'], 'MM/dd/yyyy');
      item['last_visit'] = this.datePipe.transform(item['last_visit'], 'MM/dd/yyyy hh:mm:ss a');
      item['expires_on'] = this.datePipe.transform(item['expires_on'], 'MM/dd/yyyy');
    })
    this.spinner.hide();
  }

  public onSort(event) {
    
    if (event.column.name == "Customer") {
      this.cOrder = event.newValue;
      this.spinner.show();
      this.pageNumber = 0;
      this.pagelimit = this.customerTable.pageSize;
      this.getCustomerData(2, this.pageNumber, this.pagelimit, this.searchData, this.cOrder);
    }
  }

  public search() {
    this.spinner.show();
    this.searchData = this.searchCustomer.controls['searchValue'].value;
    this.pageNumber = 0;
    this.pagelimit = this.customerTable.pageSize;
    this.getCustomerData(2, this.pageNumber, this.pagelimit, this.searchData, this.cOrder);
  }

  public clear() {
    this.spinner.show();
    this.searchCustomer.reset();
    this.searchData = "";
    this.pageNumber = 0;
    this.pagelimit = this.customerTable.pageSize;
    this.getCustomerData(2, this.pageNumber, this.pagelimit, this.searchData, this.cOrder);
  }

  public openAddCustomer() {
    let addParams = {
      id: '',
      type: 'add'
    }
    this.modalOption.size = "lg";
    const addPopup = this.modalService.open(CustomerFormComponent, this.modalOption);
    addPopup.componentInstance.popupType = addParams;

    addPopup.result.then((result) => {
      
      if (result == 'yes') {

        this.pageNumber = 0;
        this.pagelimit = this.customerTable.pageSize

        this.getCustomerData(2, this.pageNumber, this.pagelimit, this.searchData, this.cOrder);
      }
    }).catch((error) => {
      console.log(error);
    });
  }

  public editCustomerData(data) {
    this.spinner.show();
    this.custService.getEditCustomerDetails(data).subscribe(
      data => this.editCustomerDetails(data[0], data[1])
    );
  }

  public editCustomerDetails(edit, lic) {

    this.editData = Object.assign(edit.data.customer_details[0], lic.licenseList[0]);
    this.editData.eff_from = new Date(this.editData.eff_from);
    this.editData.expires_on = new Date(this.editData.expires_on);
    this.editData.effective_date_contract = this.editData.effective_date_contract != null ? new Date(this.editData.effective_date_contract): '';
    this.editData.renewal_date_contract = this.editData.renewal_date_contract != null ? new Date(this.editData.renewal_date_contract) : '';
    this.editData.state = this.editData.state_id;
    this.editData.phone_num = this.editData.phone;
    console.log(this.editData)

    this.licID = this.editData.license_id;
    let editParams = {
      type: 'edit'
    }
    this.modalOption.size = "lg";
    this.editData = Object.assign(this.editData, editParams);
    const editPopup = this.modalService.open(CustomerFormComponent, this.modalOption);
    editPopup.componentInstance.popupType = this.editData
    this.spinner.hide();
  }


  public actionClicked(event: any, rowData: any, firstChild: any, type: string): void {
    event.stopPropagation();
    firstChild && firstChild.parentElement && firstChild.parentElement.parentElement &&
      firstChild.parentElement.parentElement.blur();

    if (type == 'edit') {

      let editDataParams = {
        customer_id: rowData.customer_id
      }
      this.editCustomerData(editDataParams);

    } else if (type == 'view') {
      this.router.navigate(['customer/edit', rowData.customer_id]);
    }
  }

  public onStatusChange(event, rowData, firstChild) {
    event.stopPropagation();
    firstChild && firstChild.parentElement && firstChild.parentElement.parentElement &&
      firstChild.parentElement.parentElement.blur();

    let dataParams = {
      name: rowData.customer,
      type: 'customer',
      action: rowData.is_active == 0 ? 'activate' : 'inactivate'
    }
    this.modalOption.centered = true;
    const confRef = this.modalService.open(CustomerModalComponent, this.modalOption);
    confRef.componentInstance.dataStatus = dataParams;

    confRef.result.then((result) => {

      if (result == 'yes') {
        let param = {
          customer_id: rowData.customer_id,
          activate: rowData.is_active == 0 ? 'active' : 'inactive'
        }
        this.spinner.show();
        this.custService.deleteCustomer(param).subscribe(
          data => this.deleteCustomerDetails(data)
        )
      } else if (result == 'no') {

      }
    }).catch((error) => {
      console.log(error);
    });

  }

  private deleteCustomerDetails(data) {

    if (data.success) {
      this.pageNumber = this.customerTable.offset;
      this.pagelimit = this.customerTable.pageSize
      this.getCustomerData(2, this.pageNumber, this.pagelimit, this.searchData, this.cOrder);
      this.notiService.showSuccess(data.message, "", 4000);
    } else {
      this.notiService.showError(data.error, "", 4000);
      this.spinner.hide();
    }

  }

  public onLimitChange(limit) {
    this.pagelimit = limit;
    this.pageNumber = 0;
    this.getCustomerData(2, this.pageNumber, this.pagelimit, this.searchData, this.cOrder);
  }

  public openReports(){
    this.router.navigate(['customer/reports']);
  }

}

