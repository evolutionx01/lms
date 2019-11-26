import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { CaqhListService } from '../services/caqh-list/caqh-list.service';
import { ToasterNotiService } from 'src/app/shared/services/notifications/toaster-noti.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';

@Component({
  selector: 'app-caqh-list',
  templateUrl: './caqh-list.component.html',
  styleUrls: ['./caqh-list.component.scss']
})
export class CaqhListComponent implements OnInit {

  @ViewChild('provideTable') provideTable: any;
  public searchCustomer: FormGroup;
  public customerList: any;

  public provLimit: number;
  public provCount: number;
  public provOffset: number;
  public searchData: string;
  public customerId: number;

  public providerListData: any;

  public currentPageLimit: number = 25;
  public pageLimitOptions = [
    { value: 10 },
    { value: 25 },
    { value: 50 },
    { value: 100 },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private caqhListService: CaqhListService,
    private notiService: ToasterNotiService,
    private spinner: NgxSpinnerService,
    private router: Router,
  ) {
    this.provLimit = 25;
    this.provOffset = 0;
  }

  ngOnInit() {
    this.buildSearchForm();
    this.getListOfCustomer()
  }

  public buildSearchForm() {
    this.searchCustomer = this.formBuilder.group({
      searchValue: new FormControl('', [Validators.required])
    });
  }

  public getListOfCustomer() {
    this.spinner.show()
    this.caqhListService.getCustomer().subscribe(
      data => {
        this.customerListDetails(data)
      }

    )
  }

  private customerListDetails(data) {
    this.spinner.hide()
    if (data.success) {
      this.customerList = data.customer_list
    }
  }

  onPage(pageInfo) {
    this.spinner.show();
    this.provOffset = pageInfo.offset;
    this.getListofProvider(this.provOffset, this.provLimit, this.customerId, this.searchData);
  }


  public getListofProvider(pNumber, plimit, cId, searchProv) {
    let params = {
      customer_id: cId,
      page_number: pNumber,
      limit: plimit,
      search_term: searchProv
    }
    this.caqhListService.getProviderList(params).subscribe(
      data => {
        this.getProviderData(data);
      }
    )
  }

  private getProviderData(data: any) {
    this.spinner.hide();
    console.log(data)
    if (data.success) {
      this.providerListData = data.provider_list;
      this.provCount = data.total_row
    }
  }

  public customerChange(event) {
    console.log(event)
    this.customerId = event.user_id;
    this.onPage({ offset: 0 });

    // this.getListofProvider(this.provOffset, this.provLimit, this.customerId, this.searchData)
  }

  public onLimitChange(limit) {
    this.provLimit = limit;
    this.provOffset = 0;
    this.getListofProvider(this.provOffset, this.provLimit, this.customerId, this.searchData)
  }

  public search() {
    this.spinner.show();
    this.searchData = this.searchCustomer.controls['searchValue'].value;
    this.provOffset = 0;
    this.provLimit = this.provideTable.pageSize;
    this.getListofProvider(this.provOffset, this.provLimit, this.customerId, this.searchData)
  }

  public clear() {
    this.spinner.show();
    this.searchCustomer.reset();
    this.searchData = "";
    this.provOffset = 0;
    this.provLimit = this.provideTable.pageSize;
    this.getListofProvider(this.provOffset, this.provLimit, this.customerId, this.searchData)
  }

  public actionClicked(event: any, rowData: any, firstChild: any, type: string): void {
    event.stopPropagation();
    firstChild && firstChild.parentElement && firstChild.parentElement.parentElement &&
      firstChild.parentElement.parentElement.blur();
    if (type == 'view') {
      console.log(rowData)
      this.router.navigate(['/caqhview', rowData.provir_id]);

    }
  }

}
