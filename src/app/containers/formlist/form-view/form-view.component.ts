import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModalOptions, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormViewService } from '../services/form-view/form-view.service';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { FormAddComponent } from '../form-add/form-add.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from '../../../shared/services/common/common.service';
import { FormModalComponent } from '../form-modal/form-modal.component';
import { ToasterNotiService } from '../../../shared/services/notifications/toaster-noti.service';
import { EsignModalComponent } from '../esign-modal/esign-modal.component';
import { environment } from '../../../../environments/environment';


@Component({
  selector: 'app-form-view',
  templateUrl: './form-view.component.html',
  styleUrls: ['./form-view.component.scss']
})
export class FormViewComponent implements OnInit {
  public userId: any;
  @ViewChild('formTable') provtable: any;
  public payer;
  public formViewData: Array<object>;
  public payerdata: object;
  public showlist: FormGroup;
  private closeResult: string;
  formtypedata: any;
  statedata: any;
  public totalElements: number;
  public pagelimit: number;
  public pageNumber: number;
  public formBuilderData: any;
  public searchValue: string;
  public selectedpayer: any;
  public selectedstate: any;
  public selectedformtype: any;
  private searchData: string;
  public sort_name: string;
  public sort_by: string;
  showhide: boolean;

  modalOption: NgbModalOptions = {};

  public currentPageLimit: number = 25;
  public pageLimitOptions = [
    { value: 10 },
    { value: 25 },
    { value: 50 },
    { value: 100 },
  ];

  constructor(
    private toast: ToasterNotiService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private router: Router,
    private FormService: FormViewService,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private commonService: CommonService

  ) {
    this.pagelimit = 25;
    this.sort_name = null,
      this.sort_by = null
  }

  ngOnInit() {
    this.userId = localStorage.getItem('userId');
    this.storeRouteData();
    this.buildshowform();
    this.setPage({ offset: 0 });
    // this.showhide = true;
    this.commonService.$custAddObservable.subscribe(data => {
      if (data) {
        this.saveFormViewData(0, this.pagelimit, null, null);
      }
    })
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    this.modalOption.size = "lg";
  }

  storeRouteData() {
    this.activatedRoute.data.subscribe(
      data => {
        this.masterDropdownDetails(data.form_view)
      })
  }

  masterDropdownDetails(data) {
    this.payerdata = data[0]['dropdown_list'];
    this.statedata = data[1]['states_list'];
    this.formtypedata = data[2]['form_types_list'];
  }

  buildshowform() {
    this.showlist = this.formBuilder.group({
      state: new FormControl(null),
      form_type: new FormControl(null),
      payer: new FormControl(null),
      searchValue: new FormControl('')
    });
  }

  setPage(info) {
    this.spinner.show();
    this.pageNumber = info.offset;
    this.saveFormViewData(this.pageNumber, this.pagelimit, this.sort_name, this.sort_by);
  }

  searchformname() {
    this.spinner.show();
    this.pageNumber = 0;
    this.saveFormViewData(this.pageNumber, this.pagelimit, this.sort_name, this.sort_by);
  }

  clearformname() {
    this.spinner.show();
    this.showlist.reset();
    this.pageNumber = 0;
    this.saveFormViewData(this.pageNumber, this.pagelimit, this.sort_name, this.sort_by);
  }

  public onSort(event) {
    this.spinner.show();
    const columnName = event.column.prop;
    const orderType = event.newValue;
    const sortableCols = ['formName', 'payer', 'createdOn'];
    const correctNames = ['form_name', 'payer', 'created_on'];
    let index = sortableCols.indexOf(columnName);
    this.sort_name = correctNames[index];
    this.sort_by = orderType;
    this.pageNumber = 0;
    this.saveFormViewData(this.pageNumber, this.pagelimit, this.sort_name, this.sort_by);
  }

  public saveFormViewData(pNum, pLimit, sort_name, sort_by) {
    this.spinner.show();
    this.searchData = this.showlist.controls['searchValue'].value;
    this.selectedstate = this.showlist.controls['state'].value;
    this.selectedpayer = this.showlist.controls['payer'].value;
    this.selectedformtype = this.showlist.controls['form_type'].value;
    let dataParams = {
      "page_number": pNum,
      "limit_of_page": pLimit,
      "search_form_name": this.searchData,
      "payer_id": this.selectedpayer,
      "state_id": this.selectedstate,
      "status_id": null,
      "form_type_id": this.selectedformtype,
      "sort_by": this.sort_name,
      "sort_order": this.sort_by
    }
    this.FormService.getformdata(dataParams).subscribe(data => {
      this.totalElements = data['total_row'];
      this.formBuilderData = data['forms_list'];
      this.formBuilderData.map(item => {

        if (item['esign_form'] == 1) {
          item['show_file'] = true;
        } else if (item['esign_form'] == 0) {
          item['show_file'] = false;
        }

        if (item['provider_portal_form'] == 1) {
          item['show_portal'] = true;
        } else if (item['provider_portal_form'] == 0) {
          item['show_portal'] = false;
        }
        if (item['form_status'] == 'Published') {
          item['status_class'] = 'badge-success'
        } else if (item['form_status'] == 'Released') {
          item['status_class'] = 'badge-primary'
        } else if (item['form_status'] == 'Pending') {
          item['status_class'] = 'badge-warning'
        }
      })
      this.spinner.hide();
    })
  }

  public openAddform() {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    this.modalOption.size = "lg";
    this.modalService.open(FormAddComponent, this.modalOption);
  }
  public openesignform(rowData) {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    this.modalOption.size = "lg";
    const modalRef = this.modalService.open(EsignModalComponent, this.modalOption);
    modalRef.componentInstance.dataStatus = rowData.form_id;
  }

  public actionClicked(type, rowData, formviewdt) {
    event.stopPropagation();
    formviewdt && formviewdt.parentElement && formviewdt.parentElement.parentElement &&
      formviewdt.parentElement.parentElement.blur();

    if (type == 'edit') {
      this.modalOption.backdrop = 'static';
      this.modalOption.keyboard = false;
      this.modalOption.size = "lg";
      this.modalOption.centered = true;
      const modalRef = this.modalService.open(FormAddComponent, this.modalOption);
      modalRef.componentInstance.dataStatus = rowData.form_id;
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
          let param = {
            form_id: rowData.form_id
          }
          // this.spinner.show();
          this.FormService.formdelete(param).subscribe(
            data => {
              if (data) {
                this.toast.showSuccess("Form Deleted successfully", "", 1000);
                this.saveFormViewData(this.pageNumber, this.pagelimit, this.sort_name, this.sort_by);
              }
            }
          )
        }
        else if (result == 'no') {
        }
      }).catch((error) => {
        console.log(error);
      });
    } else if (type == 'map') {
      if (sessionStorage.getItem('historySearch')) {
        sessionStorage.removeItem('type_id')
        sessionStorage.removeItem('group_id')
        sessionStorage.removeItem('sub_group_id')
        sessionStorage.removeItem('historySearch')
        sessionStorage.removeItem('multipleLocation')
      }
      this.router.navigate(['formlist/view/map', rowData.form_id]);
    }
  }

  onLimitChange(limit) {
    this.pagelimit = limit;
    this.pageNumber = 0;
    this.saveFormViewData(this.pageNumber, this.pagelimit, this.sort_name, this.sort_by);
  }

  onChangetoggle(type, row) {
    let param = {
      form_id: row.form_id,
      status: ''
    }
    if (type) {
      param.status = 'enable'
    } else {
      param.status = 'disable'
    }
    this.FormService.FormEsignStatus(param).subscribe(
      data => {
        if (data['success'] == true) {
          this.toast.showSuccess(data['message'], "", 2000);
        }
        else {
          row.show_file = false;
          this.toast.showError(data['error'], "", 2000);
        }
      },
      error => {
        this.toast.showError(error, "", 3000);
        this.spinner.hide();
      })
  }

  onportalform(type, row) {

    let param = {
      form_id: row.form_id,
      customer_id: row.customer_id,
      created_by: this.userId,
      status: ''
    }
    if (type) {
      param.status = 'enable'
    } else {
      param.status = 'disable'
    }
    this.FormService.portalEsign(param).subscribe(
      data => {
        if (data['success'] == true) {
          this.toast.showSuccess(data['message'], "", 2000);
        }
        else {
          row.show_file = false;
          this.toast.showError(data['error'], "", 2000);
        }
      },
      error => {
        this.toast.showError(error, "", 3000);
        this.spinner.hide();
      })
  }

  public exportExcel(event) {
    event.preventDefault();

    let dataParams = {
      "page_number": 0,
      "limit_of_page": this.totalElements,
      "search_form_name": this.searchData,
      "payer_id": this.selectedpayer,
      "state_id": this.selectedstate,
      "status_id": null,
      "form_type_id": this.selectedformtype,
      "sort_by": this.sort_name,
      "sort_order": this.sort_by
    }

    this.FormService.exportFormList(dataParams).subscribe(
      data => {
        if (data['success']) {
          var downloadLink = window.document.createElement('a');
          downloadLink.href = `${environment.apiDownloadUrl}${data['file_name']}`
          downloadLink.download = data['file_name'];
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
          this.toast.showSuccess('Excel downloaded successfully', '', 4000);
        } else {
          this.toast.showError(data['error'], '', 4000);
        }
      }, error => {
        console.log(error)
      }
    )
  }

}




