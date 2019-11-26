import { Component, OnInit, ViewChild } from '@angular/core';
import { Chart } from 'angular-highcharts';
import { DashboardItemService } from '../service/dashboard-item/dashboard-item.service';
import { DatePipe } from '@angular/common';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { NgbModalOptions, NgbActiveModal, NgbModal, NgbDateStruct, NgbCalendar, NgbDateAdapter, NgbDateNativeAdapter, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ToasterNotiService } from '../../../shared/services/notifications/toaster-noti.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute } from '@angular/router';
import { DashboardModalComponent } from '../dashboard-modal/dashboard-modal.component';


@Component({
  selector: 'app-dashboard-item',
  templateUrl: './dashboard-item.component.html',
  styleUrls: ['./dashboard-item.component.scss'],
  providers: [DatePipe]
})
export class DashboardItemComponent implements OnInit {

  public modalOption: NgbModalOptions = {};
  public currentPageLimit: number = 25;
  public pageLimitOptions = [
    { value: 10 },
    { value: 25 },
    { value: 50 },
    { value: 100 },
  ];

  public statusDropdown = [
    { id: 'Active', name: 'Active' },
    { id: 'Inactive', name: 'Inactive' }
  ];

  bsConfig: Partial<BsDatepickerConfig>;
  public mostVisitedPageData: any;
  public acpageNumber: number;
  public acpageLimit: number;
  public actotalElements: number;
  public listOfActiveUsersData: any;

  public searchCustomer: FormGroup;
  public searchUser: FormGroup;

  @ViewChild('userTable') usertable: any;
  @ViewChild('customerTable') customertable: any;

  public customerLimit: number;
  public customerCount: number;
  public customerOffset: number;
  public customerSearchData: string;
  public customerStatus: string;

  public customerData: any;

  public userLimit: number;
  public userCount: number;
  public userOffset: number;
  public userSearchData: string;
  public userStatus: string;

  public userData: any;

  public totalCustomer: number
  public activeCustomer: number
  public inactiveCustomer: number
  public lastMonthCustomer: string

  public totalProvider: number
  public activeProvider: number
  public inactiveProvider: number
  public lastMonthProvider: string

  public totalUser: number

  public lastMonthUser: string



  constructor(
    private dashboardItemService: DashboardItemService,
    private notiService: ToasterNotiService,
    private spinner: NgxSpinnerService,
    private activatedRoute: ActivatedRoute,
    private datePipe: DatePipe,
    private formBuilder: FormBuilder,
    private modalService: NgbModal
  ) {
    this.customerLimit = 25;
    this.userLimit = 25;
  }

  ngOnInit() {


    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    this.modalOption.size = "lg";

    let userAgent = 'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_6; en-en) AppleWebKit/533.19.4 (KHTML, like Gecko) Version/5.0.3 Safari/533.19.4'
    console.log(userAgent.indexOf("welcome"))


    this.buildCustomerSearch();
    this.buildUserSearch();
    // this.setPage({ offset: 0 })
    // this.mostVisitedPages({ offset: 0 })
   // this.landingPage()
  this.analyticsData()

   // this.onCustomerPage({ offset: 0 });
    this.customerSearchData = ''
  }

  public analyticsData() {
    this.spinner.show()
    this.dashboardItemService.getAnalytics().subscribe(
      data => {
        
        console.log(data)
        this.analyticsDetails(data)
      },
      error => {
        this.spinner.hide()
      }
    )
  }

  private analyticsDetails(data) {
    console.log(data)
    if (data.success) {
      let customerAnalytics = data.customer_stat;

      this.totalCustomer = customerAnalytics.active_customer + customerAnalytics.inactive_customer
      this.activeCustomer = customerAnalytics.active_customer;
      this.inactiveCustomer = customerAnalytics.inactive_customer;

      this.lastMonthCustomer = ((customerAnalytics.added_customer / this.totalCustomer) * 100).toFixed(2);

      this.totalProvider = customerAnalytics.active_provider + customerAnalytics.inactive_provider
      this.activeProvider = customerAnalytics.active_provider;
      this.inactiveProvider = customerAnalytics.inactive_provider;

      this.lastMonthProvider = ((customerAnalytics.added_provider / this.totalProvider) * 100).toFixed(2)

      this.totalUser = customerAnalytics.customer_users;
      this.lastMonthUser = ((customerAnalytics.added_user / this.totalUser) * 100).toFixed(2)
      this.onCustomerPage({ offset: 0 })
    }
  }

  public buildCustomerSearch() {
    this.searchCustomer = this.formBuilder.group({
      searchValue: new FormControl(''),
      status: new FormControl(null),
    });
  }

  public buildUserSearch() {
    this.searchUser = this.formBuilder.group({
      searchValue: new FormControl(''),
      status: new FormControl(null),
    });
  }

  public beforeChange($event: NgbTabChangeEvent) {
    if ($event.nextId == "customer") {
      this.customerLimit = 25;

      this.buildCustomerSearch();
      this.onCustomerPage({ offset: 0 });

    } else if ($event.nextId == "user") {
      this.userLimit = 25;
      
      this.buildUserSearch();
      this.onUserPage({ offset: 0 });
    }
  }

  public onCustomerPage(customerPageInfo) {

    this.customerOffset = customerPageInfo.offset;
    this.getListofCustomer(this.customerOffset, this.customerLimit, this.customerSearchData, this.customerStatus);
  }

  public onUserPage(userPageInfo) {

    this.userOffset = userPageInfo.offset;
    this.getListofUser(this.userOffset, this.userLimit, this.userSearchData, this.userStatus);
  }



  public getListofCustomer(offset, limit, searchData, status) {

    this.spinner.show();

    let dataParams = {
      limit: limit,
      page_number: offset,
      customer_status: status,
      search_term: searchData
    }

    this.dashboardItemService.getListOfCustomer(dataParams).subscribe(
      data => {
        this.customerDetails(data)
      },
      error => {
        this.spinner.hide()
      }
    )

  }

  private customerDetails(data) {
    console.log(data)
    this.spinner.hide()
    if (data.success) {
      data.customer_list.map(item => {
        item['last_visit'] = this.datePipe.transform(item['last_visit'], 'MM/dd/yyyy hh:mm:ss a');
      })

      this.customerData = data.customer_list;
      this.customerCount = data.total_count;
      console.log(this.customerCount)
    } else {

    }
  }

  public getListofUser(offset, limit, searchData, status) {
    this.spinner.show();
    let dataParams = {
      limit: limit,
      page_number: offset,
      user_status: status,
      search_term: searchData
    }

    this.dashboardItemService.getListOfUsers(dataParams).subscribe(
      data => {
        this.userDetails(data)
      },
      error => {
        this.spinner.hide();
        this.notiService.showError(error, '', 4000)
      }
    )
  }

  private userDetails(data) {
    this.spinner.hide();
    if (data.success) {
      data.user_list.map(item => {
        item['last_visit'] = this.datePipe.transform(item['last_visit'], 'MM/dd/yyyy hh:mm:ss a');
        item['login_history'].map(item => {
          item['l_time'] = this.datePipe.transform(item['l_time'], 'MM/dd/yyyy hh:mm:ss a');
          let userAgent = item['u_agent']
          if (userAgent.indexOf("MSIE") != -1) {
            item['u_agent'] = 'Internet Explorer'
          } else if (  userAgent.indexOf("Chrome") != -1  && userAgent.indexOf("Safari") != -1 && userAgent.indexOf("Edge") == -1 ) {
            item['u_agent'] = 'chrome'
          } else if (userAgent.indexOf("Firefox") != -1) {
            item['u_agent'] = 'Firefox'
          } else if (userAgent.indexOf("Safari") != -1 && userAgent.indexOf("Chrome") == -1 && userAgent.indexOf("Edge") == -1) {
            item['u_agent'] = 'Safari'
          } else if (userAgent.indexOf("Chrome") != -1 && userAgent.indexOf("Safari") != -1 && userAgent.indexOf("Edge") != -1 ) {
            item['u_agent'] = 'Edge'
          } else { 
            item['u_agent'] = 'Internet Explorer 11'
          }
        })
      })

      this.userData = data.user_list;
      this.userCount = data.total_count;
    } else {

    }
  }

  public onCustomerSearch() {
    this.customerStatus = this.searchCustomer.controls['status'].value;

    this.customerSearchData = this.searchCustomer.controls['searchValue'].value;
    this.customerOffset = 0;
    this.customerLimit = this.customertable.pageSize;
    this.getListofCustomer(this.customerOffset, this.customerLimit, this.customerSearchData, this.customerStatus);
  }

  public onUserSearch() {
    this.userStatus = this.searchUser.controls['status'].value;

    this.userSearchData = this.searchUser.controls['searchValue'].value;
    this.userOffset = 0;
    this.userLimit = this.usertable.pageSize;

    this.getListofUser(this.userOffset, this.userLimit, this.userSearchData, this.userStatus);
  }


  public clear(type) {
    if (type == 'customer') {
      this.searchCustomer.reset();
      this.customerStatus = ''
      this.customerSearchData = "";
      this.customerOffset = 0;
      this.customerLimit = this.customertable.pageSize;
      this.getListofCustomer(this.customerOffset, this.customerLimit, this.customerSearchData, this.customerStatus);
    } else if (type == 'user') {

      this.searchUser.reset();
      this.userStatus = '';
      this.userSearchData = "";
      this.userOffset = 0;
      this.userLimit = this.usertable.pageSize;
      this.getListofUser(this.userOffset, this.userLimit, this.userSearchData, this.userStatus);
    }
  }

  public onLimitCustomerChange(limit) {
    this.customerLimit = limit;
    this.customerOffset = 0;
    this.getListofCustomer(this.customerOffset, this.customerLimit, this.customerSearchData, this.customerStatus);
  }

  public onLimitUserChange(limit) {
    this.userLimit = limit;
    this.userOffset = 0;
    this.getListofUser(this.userOffset, this.userLimit, this.userSearchData, this.userStatus);
  }

  public viewHistory(id, firstChild){
    event.stopPropagation();
    firstChild && firstChild.parentElement && firstChild.parentElement.parentElement &&
      firstChild.parentElement.parentElement.blur();

    //console.log(id)
    this.spinner.show()

    let dataParams = {
      limit: 10,
      page_number: 0,
      search_term: '',
      user_id: id
    }
    
    this.dashboardItemService.getLoginHistory(dataParams).subscribe(
      data => {
       this.userLoginHistoryDetails(data, id)
      },
      error => {
        this.spinner.hide()
      }
    )
  }

  private userLoginHistoryDetails(data, userID){

    this.spinner.hide()
    if(data.success){
      if (data.success) {
        data.user_list.map(item => {
          item['login_time'] = this.datePipe.transform(item['login_time'], 'MM/dd/yyyy hh:mm:ss a');
          item['logout_time'] = this.datePipe.transform(item['logout_time'], 'MM/dd/yyyy hh:mm:ss a');
          let userAgent = item['user_agent']
          if (userAgent.indexOf("MSIE") != -1) {
            item['u_agent'] = 'Internet Explorer'
          } else if (  userAgent.indexOf("Chrome") != -1  && userAgent.indexOf("Safari") != -1 && userAgent.indexOf("Edge") == -1 ) {
            item['u_agent'] = 'chrome'
          } else if (userAgent.indexOf("Firefox") != -1) {
            item['u_agent'] = 'Firefox'
          } else if (userAgent.indexOf("Safari") != -1 && userAgent.indexOf("Chrome") == -1 && userAgent.indexOf("Edge") == -1) {
            item['u_agent'] = 'Safari'
          } else if (userAgent.indexOf("Chrome") != -1 && userAgent.indexOf("Safari") != -1 && userAgent.indexOf("Edge") != -1 ) {
            item['u_agent'] = 'Edge'
          } else { 
            item['u_agent'] = 'Internet Explorer 11'
          }
        })
        //this.userData = data.user_list;
      } else {
        console.log('Error');
      }
      let dataParams = {
            id: userID,
            data: data
          }
          this.modalOption.centered = true;
          const confRef = this.modalService.open(DashboardModalComponent, this.modalOption);
          confRef.componentInstance.dataStatus = dataParams;
          
          confRef.result.then((result) => {
            console.log(result)
            if (result == 'yes') {
      
            } else if (result == 'no') {
      
            }
          }).catch((error) => {
            console.log(error);
          });
    }

  }
  

  // public viewHistory(rowData: any, firstChild: any): void {
  //   event.stopPropagation();
  //   firstChild && firstChild.parentElement && firstChild.parentElement.parentElement &&
  //     firstChild.parentElement.parentElement.blur();

      

  //   let dataParams = {
  //     data: rowData
  //   }
  //   this.modalOption.centered = true;
  //   const confRef = this.modalService.open(DashboardModalComponent, this.modalOption);
  //   confRef.componentInstance.dataStatus = dataParams;

  //   confRef.result.then((result) => {
  //     console.log(result)
  //     if (result == 'yes') {

  //     } else if (result == 'no') {

  //     }
  //   }).catch((error) => {
  //     console.log(error);
  //   });


  // }


  public mostVisitedPages(pageInfo) {
    let dataParams = {
      start_date: '',
      end_date: ''
    }
    this.dashboardItemService.getListOfMostVisitedPages(dataParams).subscribe(
      data => {
        this.mostVisitedPageDetails(data)
        console.log(data)
      }
    )
  }

  private mostVisitedPageDetails(data) {
    this.mostVisitedPageData = data.analytics_data
    this.mostVisitedPageData.map(item => {
      item['average_time'] = this.secondsToTime(item['average_time']);
    })
    console.log(this.mostVisitedPageData)
  }

  public secondsToTime(seconds) {
    var days = Math.floor(seconds / 86400);
    var hours = Math.floor((seconds % 86400) / 3600);
    var mins = Math.floor(((seconds % 86400) % 3600) / 60);
    var secs = ((seconds % 86400) % 3600) % 60;
    return (days > 0 ? days + 'd ' : '') + ('00' + hours).slice(-2) + ':' + ('00' + mins).slice(-2) + ':' + ('00' + secs).slice(-2);
  }

  public setPage(pageInfo) {
    this.acpageNumber = pageInfo.offset
    this.getActiveUsers(this.acpageNumber, this.acpageLimit);
  }

  public getActiveUsers(pNumber, pLimit) {
    let dataParams = {
      limit: pLimit,
      page_number: pNumber
    }

    this.dashboardItemService.getListOfActiveUsers(dataParams).subscribe(data => {
      console.log(data);
      this.listOfActiveUsers(data);
    })
  }

  private listOfActiveUsers(data) {
    this.listOfActiveUsersData = data.active_users;
    this.actotalElements = data.active_users.length;
  }


  chart = new Chart({
    chart: {
      type: 'bar'
    },
    title: {
      text: 'Total Customer'
    },
    xAxis: {
      categories: ['Customer 1', 'Customer 2', 'Customer 3', 'Customer 4', 'Customer 5']
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Active/Inactive Providers'
      }
    },
    legend: {
      reversed: true
    },
    plotOptions: {
      series: {
        stacking: 'normal'
      }
    },
    series: [{
      name: 'Active',
      data: [5, 3, 4, 7, 2]
    }, {
      name: 'Inactive',
      data: [2, 2, 3, 2, 1]
    }]
  });

  //   solidchart = new Chart({

  //         chart: {
  //             type: 'solidgauge'
  //         },

  //         title: null,

  //         tooltip: {
  //             'enabled': false
  //         },

  //         pane: {
  //           'center': ['50%', '50%'],
  //           'size': '500px',
  //           'startAngle': 0,
  //           'endAngle': 360,
  //           'background': {
  //             'backgroundColor': '#EEE',
  //             'innerRadius': '90%',
  //             'outerRadius': '100%',
  //             'borderWidth': 0
  //           }
  //         },

  //         yAxis: {
  //           'min': 0,
  //           'max': 100,
  //           'labels': {
  //             'enabled': false
  //           },

  //           'lineWidth': 0,
  //           'minorTickInterval': null,
  //           'tickPixelInterval': 400,
  //           'tickWidth': 0
  //         },

  //         'plotOptions': {
  //             // 'solidgauge': {
  //             //     'innerRadius': '90%'
  //             // }
  //         },

  //         'series': [{
  //             'name': 'Speed',
  //             'data': [80],
  //             // 'dataLabels': {
  //             //     'enabled': false
  //             // }
  //         }]

  // });

  onSort(event) {

  }
}
