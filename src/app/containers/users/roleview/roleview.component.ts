import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from '../../../shared/services/common/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModalOptions, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { UsersviewService } from '../services/userview/usersview.service';
import { ToasterNotiService } from '../../../shared/services/notifications/toaster-noti.service';
import { RoleaddComponent } from '../roleadd/roleadd.component';
@Component({
  selector: 'app-roleview',
  templateUrl: './roleview.component.html',
  styleUrls: ['./roleview.component.scss']
})
export class RoleviewComponent implements OnInit {
  modalOption: NgbModalOptions = {};
  public pagelimit: number;
  public pageNumber: number;
  public roleViewData: any;
  public searchrole: FormGroup;
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
    private toast: ToasterNotiService
  ) {
    this.pagelimit = 10;
    this.order = null,
      this.order_by = null
  }

  ngOnInit() {
    this.buildshowform();
    this.setPage({ offset: 0 });
    this.commonService.$custAddObservable.subscribe(data => {
      this.userroleviewdata(0, this.pagelimit, this.order_by, this.order);
    })
  }

  buildshowform() {
    this.searchrole = this.formBuilder.group({
      searchValue: new FormControl('')
    });
  }

  setPage(info) {
    this.pageNumber = info.offset;
    this.userroleviewdata(this.pageNumber, this.pagelimit, this.order_by, this.order);
  }


  userroleviewdata(pNum, pLimit, order_by, order) {
    this.spinner.show();
    this.searchData = this.searchrole.controls['searchValue'].value;
    let dataParams = {
      "page_number": pNum,
      "limit": pLimit,
      "search_term": this.searchData,
      "order_by": this.order_by,
      "order": this.order

    }
    this.UsersviewService.getuserroledetails(dataParams).subscribe(data => {
      this.totalElements = data['total_count'];
      this.roleViewData = data['user_data'];
      this.spinner.hide();
    })
  }

  clearrole() {
    this.spinner.show();
    this.searchrole.reset();
    this.pageNumber = 0;
    this.userroleviewdata(this.pageNumber, this.pagelimit, '', '');
    this.spinner.hide();
  }

  searchuserrole() {
    this.spinner.show();
    this.pageNumber = 0;
    this.userroleviewdata(this.pageNumber, this.pagelimit, this.order_by, this.order);
    this.spinner.hide();
  }
  onLimitChange(limit) {
    this.pagelimit = limit;
    this.pageNumber = 0;
    this.userroleviewdata(this.pageNumber, this.pagelimit, '', '');
  }

  openAddrole() {
    let adduserparam = {
      type: 'add'
    }
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    this.modalOption.size = "lg";
    const adduserpopup = this.modalService.open(RoleaddComponent, this.modalOption);
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
      const modalRef = this.modalService.open(RoleaddComponent, this.modalOption);
      modalRef.componentInstance.dataStatus = rowData.role_id;
      modalRef.componentInstance.popupType = adduserparam.type;
    }
  }


  public onSort(event) {
    this.spinner.show();
    const columnName = event.column.prop;
    const orderType = event.newValue;
    const sortableCols = ['UserRole'];
    const correctNames = ['role',];
    let index = sortableCols.indexOf(columnName);
    this.order_by = correctNames[index];
    this.order = orderType;
    this.pageNumber = 0;
    this.userroleviewdata(this.pageNumber, this.pagelimit, this.order_by, this.order);
  }

  public openAccess(){
    this.router.navigate(['user/role_details/access']);
  }
}
