import { Component, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from '../../../shared/services/common/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModalOptions, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { UsersviewService } from '../services/userview/usersview.service';
import { UseraddComponent } from '../useradd/useradd.component';
import { UsermodalComponent } from '../usermodal/usermodal.component';
import { ToasterNotiService } from '../../../shared/services/notifications/toaster-noti.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-usersview',
  templateUrl: './usersview.component.html',
  styleUrls: ['./usersview.component.scss']
})
export class UsersviewComponent implements OnInit {

  @ViewChild('myTable') usertable: any;
  modalOption: NgbModalOptions = {};
  appUserStatusparams: { user_id: any; activate: string; };
  public pagelimit: number;
  public pageNumber: number;
  public userViewData: any;
  public searchuser: FormGroup;
  public totalElements: number;
  private searchData: string;
  public order: string;
  public order_by: string;
  public pageLimitOptions = [
    { value: 10 },
    { value: 25 },
    { value: 50 },
    { value: 100 },
  ];
  constructor(
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private router: Router,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private commonService: CommonService,
    private UsersviewService: UsersviewService,
    private notiService: ToasterNotiService,

  ) {
    this.pagelimit = 10;
    this.order = null,
      this.order_by = null
  }

  ngOnInit() {
    this.buildshowform();
    this.setPage({ offset: 0 });
    this.commonService.$custAddObservable.subscribe(data => {
      this.userviewdata(0, this.pagelimit, this.order, this.order_by);
    })
  }
  buildshowform() {
    this.searchuser = this.formBuilder.group({
      searchValue: new FormControl('')
    });
  }

  setPage(info) {
    this.pageNumber = info.offset;
    this.userviewdata(this.pageNumber, this.pagelimit, this.order, this.order_by);
  }

  userviewdata(pNum, pLimit, order, order_by) {
    this.spinner.show();
    this.searchData = this.searchuser.controls['searchValue'].value;
    let dataParams = {
      "page_number": pNum,
      "limit": pLimit,
      "search_term": this.searchData,
      "order_by": this.order,
      "order": this.order_by
    }
    this.UsersviewService.getUsers(dataParams).subscribe(data => {
      this.totalElements = data['total_count'];
      this.userViewData = data['user_data'];
      this.userViewData.map(item => {
        if (item['case'] == 'Active') {
          item['pstatus'] = true;
        } else if (item['case'] == 'Inactive') {
          item['pstatus'] = false;
        }
      })
      this.spinner.hide();
    })
  }

  clearuser() {
    this.spinner.show();
    this.searchuser.reset();
    this.pageNumber = 0;
    this.userviewdata(this.pageNumber, this.pagelimit, '', '');
    this.spinner.hide();
  }

  searchusers() {
    this.spinner.show();
    this.pageNumber = 0;
    this.userviewdata(this.pageNumber, this.pagelimit, this.order, this.order_by);
    this.spinner.hide();
  }

  public onSort(event) {
    this.spinner.show();
    const columnName = event.column.prop;
    const orderType = event.newValue;
    const sortableCols = ['userName'];
    const correctNames = ['username'];
    let index = sortableCols.indexOf(columnName);
    this.order = correctNames[index];
    this.order_by = orderType;
    this.pageNumber = 0;
    this.userviewdata(this.pageNumber, this.pagelimit, this.order, this.order_by);
  }
  onLimitChange(limit) {
    this.pagelimit = limit;
    this.pageNumber = 0;
    this.userviewdata(this.pageNumber, this.pagelimit, this.order, this.order_by);
  }
  openAddUser() {
    let adduserparam = {
      type: 'add'
    }
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    this.modalOption.size = "lg";
    const adduserpopup = this.modalService.open(UseraddComponent, this.modalOption);
    adduserpopup.componentInstance.popupType = adduserparam.type;
  }

  public actionClicked(type, rowData, firstChild) {
    event.stopPropagation();
    firstChild && firstChild.parentElement && firstChild.parentElement.parentElement &&
      firstChild.parentElement.parentElement.blur();
    if (type == 'edit') {
      let adduserparam = {
        type: 'edit'
      }
      this.modalOption.backdrop = 'static';
      this.modalOption.keyboard = false;
      this.modalOption.size = "lg";
      this.modalOption.centered = true;
      const modalRef = this.modalService.open(UseraddComponent, this.modalOption);
      modalRef.componentInstance.dataStatus = rowData.user_id;
      modalRef.componentInstance.popupType = adduserparam.type;

    }
  }

  public userstatuschange(event, data, firstChild) {
    event.stopPropagation();
    firstChild && firstChild.parentElement && firstChild.parentElement.parentElement &&
      firstChild.parentElement.parentElement.blur();
    this.appUserStatusparams = {
      user_id: data.user_id,
      activate: ''
    }
    let actionStatus = '';
    if (data.pstatus) {
      actionStatus = 'inactivate'
    } else {
      actionStatus = 'activate'
    }

    let dataparamstatus = {
      name: data.username,
      action: actionStatus,
      type: 'user'
    }
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    this.modalOption.size = "lg";
    this.modalOption.centered = true;
    const modalRef = this.modalService.open(UsermodalComponent, this.modalOption);
    modalRef.componentInstance.statustype = dataparamstatus;
    modalRef.result.then((result) => {

      if (result == 'yes') {
        if (!data.pstatus) {
          this.appUserStatusparams.activate = 'active';
          data.pstatus = true;
        } else {
          this.appUserStatusparams.activate = 'inactive';
          data.pstatus = false;
        }
        this.spinner.show();
        this.UsersviewService.userdelete(this.appUserStatusparams).subscribe(
          data => {
            if (data) {
              this.notiService.showSuccess(data['message'], " ", 4000);
              this.pageNumber = this.usertable.offset;
              this.pagelimit = this.usertable.pageSize;
              this.userviewdata(this.pageNumber, this.pagelimit, this.order, this.order_by);
            } else {
              this.notiService.showError(data['error'], "", 4000);
            }
            this.spinner.hide();
          }
        )
      }
      else if (result == 'no') {
      }
    }).catch((error) => {
      console.log(error);
    });
  }

  public exportExcel() {
    let params = {
      search_term: this.searchData
    }
    this.UsersviewService.exportUserList(params).subscribe(
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




