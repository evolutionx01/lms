import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { FormViewService } from '../services/form-view/form-view.service';
import { ToasterNotiService } from '../../../shared/services/notifications/toaster-noti.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbModalOptions, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PortalmodalComponent } from '../portalmodal/portalmodal.component';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-portalform',
  templateUrl: './portalform.component.html',
  styleUrls: ['./portalform.component.scss']
})
export class PortalformComponent implements OnInit {
  selectedCustId: any;
  testId: number;
  public showlist: FormGroup;
  public customerdata: any;
  public searchData: any;
  public providerportalform: any;
  public sort_name: string;
  public sort_by: string;
  public pagelimit: number;
  public pageNumber: number;
  public totalElements: number;
  public userId: any;
  public customer_id: number;
  public searchform: string;
  modalOption: NgbModalOptions = {};
  public currentPageLimit: number = 25;
  public pageLimitOptions = [
    { value: 10 },
    { value: 25 },
    { value: 50 },
    { value: 100 },
  ];


  constructor(
    private formBuilder: FormBuilder,
    private FormService: FormViewService,
    private toast: ToasterNotiService,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
    private activatedRoute: ActivatedRoute,
  ) {
    this.pagelimit = 25;
    this.sort_name = null,
      this.sort_by = null
  }

  ngOnInit() {
    this.storeRouteData();
    this.customerdropdown();
    this.userId = localStorage.getItem('userId');
    this.buildform();
    this.changecustomer();
  }

  storeRouteData() {
    this.activatedRoute.data.subscribe(
      data => {
        this.customerDropdownData(data.customer_list);
      }
    )
  }

  customerDropdownData(data){
    this.customerdata = data.customerslist;
    if(data.customerslist != []){
      this.selectedCustId = data.customerslist[0].user_id
    }
  }
  setPage(info) {
    this.pageNumber = info.offset;
    this.providerViewData(this.pageNumber, this.pagelimit, this.sort_name, this.sort_by);
  }

  buildform() {
    this.showlist = this.formBuilder.group({
      customer: new FormControl(this.selectedCustId),
      searchValue: new FormControl('', [Validators.required])
    });
  }

  customerdropdown() {
    this.FormService.getCustomers().subscribe(
      data => {
        this.customerdata = data['customerslist'];
      });
  }

  changecustomer() {
    //this.setPage({offset: 0});
    this.pageNumber = 0;
    this.providerViewData(this.pageNumber, this.pagelimit, this.sort_name, this.sort_by);

  }


  providerViewData(pageNumber, pagelimit, sort_name, sort_by) {
    this.spinner.show();
    this.searchData = this.showlist.controls['customer'].value;
    this.searchform = this.showlist.controls['searchValue'].value;

    let params = {
      customer_id: this.searchData,
      limit_of_page: this.pagelimit,
      page_number: this.pageNumber,
      form_name: this.searchform,
      sort_by: sort_name,
      sort_order: sort_by
    }

    this.FormService.provider_portal_form(params).subscribe(
      data => {
        this.providerportalform = data['forms_list'];
        this.totalElements = data['total_row'];
        this.providerportalform.map(item => {

          if (item['provider_portal_form_access'] == 1) {
            item['show_portal'] = true;
          } else if (item['provider_portal_form_access'] == 0) {
            item['show_portal'] = false;
          }
          if (item['provider_worksheet_access'] == 1) {
            item['show_worksheet'] = true;
          } else if (item['provider_worksheet_access'] == 0) {
            item['show_worksheet'] = false;
          }
          this.spinner.hide();
        })

      },
      error => {
        this.providerportalform = '';
        this.totalElements = null;
      });
    
  }

  onportaltoggle(event, row, type) {
    let dataParams = {
      status: ''
    }

    if (event) {
      dataParams.status = 'enable';
    } else {
      dataParams.status = 'disable';
    }

    const confRef = this.modalService.open(PortalmodalComponent, this.modalOption);
    confRef.componentInstance.dataStatus = dataParams;
    confRef.componentInstance.datatype = row.form_name;

    confRef.result.then((result) => {
      if (result == 'yes') {
        let dataParam = {
          action: dataParams.status,
          setting_type: type,
          customer_id: this.searchData,
          form_id: row.form_id,
          created_by: this.userId
        }

        this.FormService.formsetting(dataParam).subscribe(
          data => {
            if (data['success'] == true) {
              this.toast.showSuccess(data['message'], "", 2000);
            }
            else {
              this.toast.showError(data['error'], "", 2000);
              row.show_portal = !event;
              row.show_worksheet = !event;
            }
          },
          error => {
            this.toast.showError(error, "", 3000);
            this.spinner.hide();
          })


      } else if (result == 'no') {
        row.show_portal = !event;
        row.show_worksheet = !event;


      }
    }).catch((error) => {
      console.log(error);
    });
  }

  onLimitChange(limit) {
    this.pagelimit = limit;
    this.pageNumber = 0;
    this.providerViewData(this.pageNumber, this.pagelimit, this.sort_name, this.sort_by);
  }

  public onSort(event) {
    const columnName = event.column.prop;
    const orderType = event.newValue;
    const sortableCols = ['formName'];
    const correctNames = ['form_name'];
    let index = sortableCols.indexOf(columnName);
    this.sort_name = correctNames[index];
    this.sort_by = orderType;
    this.pageNumber = 0;
    this.providerViewData(this.pageNumber, this.pagelimit, this.sort_name, this.sort_by);
  }

  searchformname() {
    this.pageNumber = 0;
    this.providerViewData(this.pageNumber, this.pagelimit, this.sort_name, this.sort_by);
  }

  clearformname() {
    this.showlist.reset();
    this.pageNumber = 0;

    if (this.searchData) {
      let params = {
        customer_id: this.searchData,
        limit_of_page: this.pagelimit,
        page_number: this.pageNumber,
        form_name: '',
        sort_by: this.sort_name,
        sort_order: this.sort_by
      }

      this.FormService.provider_portal_form(params).subscribe(
        data => {
          this.showlist.patchValue({
            customer: this.searchData,
          });
          this.providerportalform = data['forms_list'];
          this.totalElements = data['total_row'];
          this.providerportalform.map(item => {

            if (item['provider_portal_form_access'] == 1) {
              item['show_portal'] = true;
            } else if (item['provider_portal_form_access'] == 0) {
              item['show_portal'] = false;
            }
            if (item['provider_worksheet_access'] == 1) {
              item['show_worksheet'] = true;
            } else if (item['provider_worksheet_access'] == 0) {
              item['show_worksheet'] = false;
            }
          })
        });

    }
  }



}
