import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DashboardItemService } from '../service/dashboard-item/dashboard-item.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DatePipe } from '@angular/common';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ToasterNotiService } from '../../../shared/services/notifications/toaster-noti.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-dashboard-modal',
  templateUrl: './dashboard-modal.component.html',
  styleUrls: ['./dashboard-modal.component.scss'],
  providers: [DatePipe]
})
export class DashboardModalComponent implements OnInit {

  @Input() dataStatus;

  public loginData: any;
  public loginCount: number;
  public loginLimit: number;
  public userId: number;
  public searchData: any;
  public searchCustomer: FormGroup;
  public pageNumber: number;
  public pagelimit: number;
  private closeResult: string;
  public userOffset: number;
  public pageCall: boolean;

  constructor(
    private notiService: ToasterNotiService,
    private dashboardItemService: DashboardItemService,
    public activeModal: NgbActiveModal,
    private spinner: NgxSpinnerService,
    private datePipe: DatePipe,
    private formBuilder: FormBuilder
  ) {

  }

  ngOnInit() {
    console.log(this.dataStatus.id)
    this.buildSearchForm();
    this.loginCount = this.dataStatus.data.total_count
    this.loginData = this.dataStatus.data.user_list
    this.loginLimit = 10
    this.userOffset = 0;
    this.pageCall = false
    this.searchData = ''
    this.userId = this.dataStatus.id
    this.onHistoryPage({ offset: 0 })
    //this.loginData = this.userLoginHistoryDetails(this.dataStatus.data.user_list)
    this.searchData = ''

    //this.getLoginHistoryDetail(this.loginCount, this.loginLimit, this.userId, this.searchData);
  }

  public onHistoryPage(pageInfo) {
    console.log(pageInfo)
    if (this.pageCall) {
      this.userOffset = pageInfo.offset
      this.getLoginHistoryDetail(this.userOffset, this.loginLimit, this.userId, this.searchData);
    } else {
      this.pageCall = true
    }
  }

  actionClicked(data) {
    this.activeModal.close(data)
  }
  public buildSearchForm() {
    this.searchCustomer = this.formBuilder.group({
      searchValue: new FormControl('', [Validators.required])
    });
  }

  public getLoginHistoryDetail(offset, limit, userId, searchData) {
    this.spinner.show()

    let dataParams = {
      limit: limit,
      page_number: offset,
      search_term: searchData,
      user_id: userId
    }

    console.log(dataParams)

    this.dashboardItemService.getLoginHistory(dataParams).subscribe(
      data => {
        this.userLoginHistoryDetails(data)
      },
      error => {
        this.spinner.hide()
      }
    )

  }
  public clear() {
    this.spinner.show();
    this.searchCustomer.reset();
    this.searchData = ''
    this.userOffset =0
    this.getLoginHistoryDetail(this.userOffset, this.loginLimit, this.userId, this.searchData);

  }

  public search() {
    this.spinner.show();
    this.searchData = this.searchCustomer.controls['searchValue'].value;
    this.userOffset = 0;
    this.getLoginHistoryDetail(this.userOffset, this.loginLimit, this.userId, this.searchData);
  }
  private userLoginHistoryDetails(data) {
    this.spinner.hide()
    if (data.success) {
      this.loginCount = data.total_count;
      data.user_list.map(item => {
        item['login_time'] = this.datePipe.transform(item['login_time'], 'MM/dd/yyyy hh:mm:ss a');
        item['logout_time'] = this.datePipe.transform(item['logout_time'], 'MM/dd/yyyy hh:mm:ss a');
        let userAgent = item['user_agent']
        if (userAgent.indexOf("MSIE") != -1) {
          item['u_agent'] = 'Internet Explorer'
        } else if (userAgent.indexOf("Chrome") != -1 && userAgent.indexOf("Safari") != -1 && userAgent.indexOf("Edge") == -1) {
          item['u_agent'] = 'chrome'
        } else if (userAgent.indexOf("Firefox") != -1) {
          item['u_agent'] = 'Firefox'
        } else if (userAgent.indexOf("Safari") != -1 && userAgent.indexOf("Chrome") == -1 && userAgent.indexOf("Edge") == -1) {
          item['u_agent'] = 'Safari'
        } else if (userAgent.indexOf("Chrome") != -1 && userAgent.indexOf("Safari") != -1 && userAgent.indexOf("Edge") != -1) {
          item['u_agent'] = 'Edge'
        } else {
          item['u_agent'] = 'Internet Explorer 11'
        }
      })

      this.loginData = data.user_list
    } else {

    }
  }
  // public onHistoryPage(userOffset) {
  //   console.log(userOffset)
  //   // this.searchData = '';
  //   // this.loginLimit = 25;
  //   // this.userOffset = userOffset;
  //   // this.userId = this.dataStatus.id;
  //   // this.getLoginHistoryDetail(this.userOffset, this.loginLimit, this.userId, this.searchData);
  // }
  public exportExcelHistory() {

    let params = {
      limit: this.loginLimit,
      page_number: this.userOffset,
      search_term: this.searchData,
      user_id: this.dataStatus.id
    }

    this.dashboardItemService.exportExcelHistory(params).subscribe(
      data => {
        if (data['success']) {
          var downloadLink = window.document.createElement('a');
          downloadLink.href = `${environment.apiDownloadUrl}${data['file_name']}`
          downloadLink.download = data['file_name'];
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
          this.notiService.showSuccess('Excel downloaded successfully', '', 4000);
        } else {
          this.notiService.showError(data['error'], '', 4000);
        }

      }, error => {
        console.log(error)
      }
    )
  }
}
