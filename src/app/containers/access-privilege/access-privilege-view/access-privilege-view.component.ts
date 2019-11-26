import { Component, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { AccessPrivilegeViewService } from '../service/access-privilege-view/access-privilege-view.service';
import { NgbModalOptions, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AccessPrivilegeComponent } from '../access-privilege/access-privilege.component';
import { ToasterNotiService } from '../../../shared/services/notifications/toaster-noti.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AccessPrivilegeEditComponent } from '../access-privilege-edit/access-privilege-edit.component';

@Component({
  selector: 'app-access-privilege-view',
  templateUrl: './access-privilege-view.component.html',
  styleUrls: ['./access-privilege-view.component.scss']
})
export class AccessPrivilegeViewComponent implements OnInit {

  cOrder: any;
  privilegeStatus: any;
  privilegeArray: any[];
  public SearchData: any;
  public userId: string;
  @ViewChild('myTable') table: any;

  modalOption: NgbModalOptions = {};
  expanded: any = {};
  public totalElements: any;
  public customerData: any;
  public privilegesArrayData: any;
  public pageLimit: number;
  public pageNumber: number;

  public searchCustomer: FormGroup;

  public testArray = [{ "title": "Expand \/ Collapse", "fields": { "is_collapsible": "Expand \/ Collapse" } }, { "title": "Practice Management", "fields": { "is_managing_contact": "Practice Management" } }, { "title": "Map Providers", "fields": { "is_map_provider": "Map Providers" } }, { "title": "Payer Setting", "fields": { "is_payer_show": "Payer Setting" } }, { "title": "Payer View Setting", "fields": { "is_new_payer_view": "New View", "is_old_comments_view": "Show Old Comment" } }]
  public status = [{ name: 'Active', id: 1 }, { name: 'Inactive', id: 0 }]
  public currentPageLimit: number = 25;
  public pageLimitOptions = [
    { value: 10 },
    { value: 25 },
    { value: 50 },
    { value: 100 },
  ];

  public customerListArray = [{ "is_collapsible": 0, "is_managing_contact": "0", "is_map_provider": "0", "is_payer_show": "0", "is_new_payer_view": "0", "is_old_comments_view": "0", "user_id": 7565, "customer": "" }, { "is_collapsible": 0, "is_managing_contact": "0", "is_map_provider": "0", "is_payer_show": "0", "is_new_payer_view": "0", "is_old_comments_view": "0", "user_id": 7566, "customer": "" }, { "is_collapsible": 0, "is_managing_contact": "0", "is_map_provider": "0", "is_payer_show": "0", "is_new_payer_view": "0", "is_old_comments_view": "0", "user_id": 7563, "customer": "" }, { "is_collapsible": 0, "is_managing_contact": "0", "is_map_provider": "0", "is_payer_show": "0", "is_new_payer_view": "0", "is_old_comments_view": "0", "user_id": 7554, "customer": "" }, { "is_collapsible": 0, "is_managing_contact": "0", "is_map_provider": "0", "is_payer_show": "0", "is_new_payer_view": "0", "is_old_comments_view": "0", "user_id": 7564, "customer": "" }, { "is_collapsible": 0, "is_managing_contact": "0", "is_map_provider": "0", "is_payer_show": "0", "is_new_payer_view": "0", "is_old_comments_view": "0", "user_id": 7575, "customer": "" }, { "is_collapsible": 0, "is_managing_contact": "0", "is_map_provider": "0", "is_payer_show": "0", "is_new_payer_view": "0", "is_old_comments_view": "0", "user_id": 7567, "customer": "" }, { "is_collapsible": 0, "is_managing_contact": "0", "is_map_provider": "0", "is_payer_show": "0", "is_new_payer_view": "0", "is_old_comments_view": "0", "user_id": 7581, "customer": "" }, { "is_collapsible": 0, "is_managing_contact": "0", "is_map_provider": "0", "is_payer_show": "0", "is_new_payer_view": "0", "is_old_comments_view": "0", "user_id": 7573, "customer": "" }, { "is_collapsible": 0, "is_managing_contact": "0", "is_map_provider": "0", "is_payer_show": "0", "is_new_payer_view": "0", "is_old_comments_view": "0", "user_id": 7560, "customer": "" }, { "is_collapsible": 0, "is_managing_contact": "0", "is_map_provider": "0", "is_payer_show": "0", "is_new_payer_view": "0", "is_old_comments_view": "0", "user_id": 7574, "customer": "" }, { "is_collapsible": 0, "is_managing_contact": "0", "is_map_provider": "0", "is_payer_show": "0", "is_new_payer_view": "0", "is_old_comments_view": "0", "user_id": 7580, "customer": "" }, { "is_collapsible": 0, "is_managing_contact": "0", "is_map_provider": "1", "is_payer_show": "1", "is_new_payer_view": "0", "is_old_comments_view": "0", "user_id": 6523, "customer": "Abhra Cloud" }, { "is_collapsible": 1, "is_managing_contact": "0", "is_map_provider": "1", "is_payer_show": "1", "is_new_payer_view": "0", "is_old_comments_view": "0", "user_id": 7233, "customer": "Acclaim Radiology Management" }, { "is_collapsible": 0, "is_managing_contact": "0", "is_map_provider": "0", "is_payer_show": "1", "is_new_payer_view": "0", "is_old_comments_view": "0", "user_id": 6658, "customer": "Acuity Eyecare Group" }, { "is_collapsible": 0, "is_managing_contact": "0", "is_map_provider": "1", "is_payer_show": "0", "is_new_payer_view": "1", "is_old_comments_view": "1", "user_id": 924, "customer": "Adamas Healthcare Consulting" }, { "is_collapsible": 0, "is_managing_contact": "0", "is_map_provider": "0", "is_payer_show": "0", "is_new_payer_view": "0", "is_old_comments_view": "0", "user_id": 7651, "customer": "Add cmd customer" }, { "is_collapsible": 0, "is_managing_contact": "0", "is_map_provider": "0", "is_payer_show": "1", "is_new_payer_view": "0", "is_old_comments_view": "0", "user_id": 5906, "customer": "Adelante Healthcare" }, { "is_collapsible": 0, "is_managing_contact": "0", "is_map_provider": "0", "is_payer_show": "1", "is_new_payer_view": "0", "is_old_comments_view": "0", "user_id": 4205, "customer": "Advanced Centers for Cancer Care Michiana Hematology Oncology, PC" }, { "is_collapsible": 0, "is_managing_contact": "0", "is_map_provider": "0", "is_payer_show": "0", "is_new_payer_view": "0", "is_old_comments_view": "0", "user_id": 5848, "customer": "Advanced Pain Care" }, { "is_collapsible": 0, "is_managing_contact": "0", "is_map_provider": "0", "is_payer_show": "1", "is_new_payer_view": "1", "is_old_comments_view": "0", "user_id": 2341, "customer": "Advanced Quality Compliance  CVO" }, { "is_collapsible": 0, "is_managing_contact": "0", "is_map_provider": "0", "is_payer_show": "0", "is_new_payer_view": "1", "is_old_comments_view": "0", "user_id": 791, "customer": "Alabama Cardiovascular Group, PC" }, { "is_collapsible": 0, "is_managing_contact": "0", "is_map_provider": "0", "is_payer_show": "0", "is_new_payer_view": "0", "is_old_comments_view": "0", "user_id": 2102, "customer": "Alabama Medical Group, P.C" }, { "is_collapsible": 0, "is_managing_contact": "0", "is_map_provider": "0", "is_payer_show": "1", "is_new_payer_view": "1", "is_old_comments_view": "0", "user_id": 1070, "customer": "Allergy Partners" }, { "is_collapsible": 0, "is_managing_contact": "0", "is_map_provider": "0", "is_payer_show": "0", "is_new_payer_view": "0", "is_old_comments_view": "0", "user_id": 6321, "customer": "Alliance Coding and Consulting" }]

  public keyArray = ["is_collapsible", "is_managing_contact", "is_map_provider", "is_payer_show", "is_new_payer_view", "is_old_comments_view"]

  constructor(
    private notiService: ToasterNotiService,
    private modalService: NgbModal,
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private accessPrivilegeViewService: AccessPrivilegeViewService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.storeRouteData();
    //this.getAccessKey()
    this.buildSearchForm();
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    this.modalOption.size = "lg";
    this.userId = localStorage.getItem('userId');
    this.pageLimit = 25;

    this.setPage({ offset: 0 })
    this.cOrder = '';
  }

  storeRouteData() {
    this.activatedRoute.data.subscribe(
      data => {
        this.privilegesArrayDetails(data.accessPrivilegeData)
      }
    )
  }


  // public getAccessKey() {
  //   this.accessPrivilegeViewService.getAccessPrivilegeKey().subscribe(data => {
  //     console.log(data);
  //     this.privilegesArrayDetails(data);
  //   })
  // }

  private privilegesArrayDetails(data) {
    this.privilegesArrayData = data.privileges
  }

  buildSearchForm() {
    this.searchCustomer = this.formBuilder.group({
      searchValue: new FormControl(''),
      privilege: new FormControl(null),
      status: new FormControl(null)
    });
  }

  public setPage(pageInfo) {
    this.pageNumber = pageInfo.offset;
    this.getAccessPrivilegeDetail(this.pageNumber, this.pageLimit, this.SearchData, this.privilegeArray, this.privilegeStatus, this.cOrder);
  }

  public getAccessPrivilegeDetail(pNumber, pLimit, searchText, pArray, pStaus, sOrder) {
    this.spinner.show();
    let dataParams = {
      page_number: pNumber,
      limit_of_page: pLimit,
      search_by_privilege: pArray,
      privilege_status: pStaus,
      customer: searchText,
      sort_by: "customer",
      sort_order: sOrder
    }

    this.accessPrivilegeViewService.getAccessPrivilegeDetails(dataParams).subscribe(data => {
      this.customerDeatails(data)
    })
  }



  private customerDeatails(data) {
    this.customerData = data.customer_list;
    this.totalElements = data.total_row;


    let key;
    var newArr = []
    this.privilegesArrayData.map(item => {
      let temp = Object.keys(item['fields']);
      if (temp.length == 1) {
        key = temp.toString();
        newArr.push(key)
      } else {
        newArr = newArr.concat(temp)
      }

    })

    for (let i = 0; i < this.customerData.length; i++) {

      for (let j = 0; j < newArr.length; j++) {
        if (this.customerData[i][newArr[j]] == 0) {
          this.customerData[i][newArr[j]] = false;
        } else {
          this.customerData[i][newArr[j]] = true;
        }
      }
    }

    this.spinner.hide();

    this.customerData.map(item => {
      item['privileges_key'] = newArr;
      item['privileges_value'] = this.privilegesArrayData
    })

    console.log(this.customerData)

  }



  toggleExpandRow(row) {

    this.table.rowDetail.toggleExpandRow(row);
  }

  onDetailToggle(event) {

  }

  public editApiAccess(row) {
    let dataParams = {
      api_access: 1,
      user_id: row.user_id
    }

    this.accessPrivilegeViewService.apiAccessFetchData(dataParams).subscribe(
      data => {
        this.apiAccessEditRequest(data, row)
      })
  }

  private apiAccessEditRequest(data, row) {
    console.log(data)
    if (data.success) {
      this.editDomainNamePopUp(data.data, row)
    } else {
      this.notiService.showError('Something Went wrong', '', 4000)
    }
  }

  public addDomainNamePopUp(domain, row) {

    let dataParams = {
      domain_name: domain
    }


    const confRef = this.modalService.open(AccessPrivilegeEditComponent, this.modalOption);
    confRef.componentInstance.dataStatus = dataParams;

    confRef.result.then((result) => {
      console.log(result)

      if (result.action == 'yes') {

        this.spinner.show()

        let params = {
          api_access: 1,
          domain: result.updated_domain,
          user_id: row.user_id
        }

        this.accessPrivilegeViewService.apiAccess(params).subscribe(data => {
          this.apiAccessEditDetails(data)
        })

      } else {
        console.log(row)
        row['api_access'] = false;
      }

    }).catch((error) => {
      console.log(error);
    });
  }

  public editDomainNamePopUp(domain, row) {
    console.log(row)

    let dataParams = {
      domain_name: domain
    }


    const confRef = this.modalService.open(AccessPrivilegeEditComponent, this.modalOption);
    confRef.componentInstance.dataStatus = dataParams;

    confRef.result.then((result) => {
      console.log(result)

      if (result.action == 'yes') {

        this.spinner.show()

        let params = {
          api_access: 1,
          domain: result.updated_domain,
          user_id: row.user_id
        }

        this.accessPrivilegeViewService.apiAccessUpdate(params).subscribe(data => {
          this.apiAccessEditDetails(data)
        })

      } else {
        console.log(row)
        
      }

    }).catch((error) => {
      console.log(error);
    });
  }

  private apiAccessEditDetails(data) {
    this.spinner.hide()
    if (data.success) {
      this.notiService.showSuccess(data.message, '', 4000)
    } else {
      this.notiService.showError(data.error, '', 4000)
    }
  }



  openToAddDomain(event, type, title, rowData) {

    let result = {
      event: event,
      type: type,
      title: title,
      row: rowData
    }

    let dataParams = {
      api_access: event ? 1 : 0,
      user_id: rowData.user_id
    }

    if (event) {
      this.accessPrivilegeViewService.apiAccessFetchData(dataParams).subscribe(data => {
        this.apiAccessRequest(data, result)
      })
    } else {
      this.onApiAccessStatusChange(result, '')
    }

  }

  public apiAccessRequest(data, details) {
    console.log(data)
    console.log(details)

    if (data.success && data.data != '') {
      this.onApiAccessStatusChange(details, data.data)
    } else {
      this.addDomainNamePopUp('', details.row)
      //this.onApiAccessStatusChange(details, '')
    }

  }

  public onApiAccessStatusChange(details, domainName) {

    let dataParams = {
      name: details.title,
      customer: details.row.customer,
      action: '',
      domain: domainName
    }

    if (details.event) {
      dataParams.action = 'Activate';
    } else {
      dataParams.action = 'Inactivate';
    }

    const confRef = this.modalService.open(AccessPrivilegeComponent, this.modalOption);
    confRef.componentInstance.dataStatus = dataParams;

    confRef.result.then((result) => {
      console.log(result)

      if (result == 'yes') {
        this.spinner.show()
        let dataParams = {
          api_access: 1,
          domain: domainName,
          user_id: details.row.user_id
        }

        if (details.event) {
          dataParams.api_access = 1;
        } else {
          dataParams.api_access = 0;
        }

        this.accessPrivilegeViewService.apiAccess(dataParams).subscribe(data => {
          this.apiAccessDetails(data)
        })

      } else if (result == 'no') {
        details.row[details.type] = !details.event;

      }
    }).catch((error) => {
      console.log(error);
    });
  }

  private apiAccessDetails(data) {
    this.spinner.hide();
    if (data.success) {
      this.notiService.showSuccess(data.message, "", 4000);
    } else {
      this.notiService.showError(data.error, "", 4000);
    }
  }

  public onChange(event, type, title, rowData) {
    console.log(rowData)

    let dataParams = {
      name: title,
      customer: rowData.customer,
      action: '',
      display: true
    }
    if (event) {
      dataParams.action = 'Activate';
    } else {
      dataParams.action = 'Inactivate';
    }
    const confRef = this.modalService.open(AccessPrivilegeComponent, this.modalOption);
    confRef.componentInstance.dataStatus = dataParams;

    confRef.result.then((result) => {
      if (result == 'yes') {
        let dataParams = {
          user_id: rowData.user_id,
          privilege_field: type,
          flag: null
        }

        if (event) {
          dataParams.flag = 1;
        } else {
          dataParams.flag = 0;
        }

        this.accessPrivilegeViewService.accessPrivilegeStatus(dataParams).subscribe(data => {
          this.accessPrivilegesStatusConfirmation(data)
        })
      } else if (result == 'no') {
        rowData[type] = !event;

      }
    }).catch((error) => {
      console.log(error);
    });


  }

  private accessPrivilegesStatusConfirmation(data) {
    if (data.success) {
      this.notiService.showSuccess(data.message, "", 4000);
    } else {
      this.notiService.showError("An error occured!", "", 4000);
    }
  }

  search() {

    this.privilegeStatus = this.searchCustomer.value.status;
    this.pageNumber = 0;
    if (this.searchCustomer.value.privilege) {
      this.privilegeArray = Object.keys(this.searchCustomer.value.privilege)
    } else {
      this.privilegeArray = []
    }

    this.SearchData = this.searchCustomer.controls['searchValue'].value

    this.getAccessPrivilegeDetail(this.pageNumber, this.pageLimit, this.SearchData, this.privilegeArray, this.privilegeStatus, this.cOrder);
  }

  clear() {
    this.pageNumber = 0;
    this.searchCustomer.reset();
    this.SearchData = '';
    this.privilegeArray = [];
    this.privilegeStatus = '';
    this.getAccessPrivilegeDetail(this.pageNumber, this.pageLimit, this.SearchData, this.privilegeArray, this.privilegeStatus, this.cOrder);
  }

  onLimitChange(value) {
    this.pageLimit = value;
    this.pageNumber = 0;
    this.getAccessPrivilegeDetail(this.pageNumber, this.pageLimit, this.SearchData, this.privilegeArray, this.privilegeStatus, this.cOrder);
  }

  onSort(event) {

    if (event.column.name == "Customer Name") {
      this.cOrder = event.newValue;
      //this.spinner.show();
      this.pageNumber = 0;
      this.pageLimit = this.table.pageSize;
      this.getAccessPrivilegeDetail(this.pageNumber, this.pageLimit, this.SearchData, this.privilegeArray, this.privilegeStatus, this.cOrder);
      //this.getCustomerData(2, this.pageNumber, this.pagelimit, this.searchData, this.cOrder);
    }
  }

  getRowHeight(row) {
    if (!row) return 50;
    if (row.height === undefined) return 50;
    return row.height;
  }
}
