import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { NgbModalOptions, NgbActiveModal, NgbModal, NgbDateStruct, NgbCalendar, NgbDateAdapter, NgbDateNativeAdapter, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { CustomerEditService } from '../services/customer-edit/customer-edit.service';
import { NgOption } from '@ng-select/ng-select';
import { CustomerModalComponent } from '../customer-modal/customer-modal.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToasterNotiService } from '../../../shared/services/notifications/toaster-noti.service';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-customer-edit',
  templateUrl: './customer-edit.component.html',
  styleUrls: ['./customer-edit.component.scss'],
  providers: [DatePipe, { provide: NgbDateAdapter, useClass: NgbDateNativeAdapter }]
})
export class CustomerEditComponent implements OnInit {

  userId: string;
  locationStatusparams: { customer_id: any; practice_info_id: any; activate: string; };
  tinStatusparams: any
  editing = {};
  editingProvider = {}
  provSearchData: any;
  state_total_element: number;
  state_limit: number;
  state_page_number: any;
  payer_total_element: number;
  payer_limit: any;
  payer_page_number: any;
  appUserSearchData: any;
  @ViewChild('provideTable') provtable: any;
  @ViewChild('myAppUserTable') apptable: any;
  public selected: any[] = [];
  public selected_payer: any[] = [];
  listofLocData: any;
  locSearchData: string;
  appSearchData: string;
  tinSearchData: string;

  listofTinsData: any;
  public deleteAccStateArr: Array<string> = [];
  public existingAccStateArr: Array<string> = [];
  appUserStatusparams: { user_id: any; activate: string; };
  aData: any;
  providerStatusparams: { provider_id: any; activate: string; };
  modalOption: NgbModalOptions = {};

  public editCustomer: FormGroup;
  public editState: FormGroup;
  public searchProvider: FormGroup;
  public searchAppUser: FormGroup;
  public searchTin: FormGroup;
  public searchLocation: FormGroup;

  public provCount: number;
  public appCount: number;
  public tinCount: number;
  public locCount: number;
  public provOffset: number;
  public appOffset: any;
  public tinOffset: number;
  public locOffset: any;
  public provLimit: number;
  public tinLimit: number;
  public appLimit: number;
  public locLimit: number;
  public pData: Array<object>;
  providerData: any;
  getPayerData: any;
  payerSelectAll: boolean
  accessibleStateData: any;
  custID: { [key: string]: any; };
  appUserDetails: any;
  payerBtn: boolean;


  selected_payer_id: any = [];

  licID: { [key: string]: any; };
  public prodDetails: Array<object>;
  test: any;
  editData: any;
  date: Date;
  public editCustomerViewData: any;
  public stateDropdownData: Array<object>;

  private ePattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

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
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private customerEditService: CustomerEditService,
    private datePipe: DatePipe,
    private router: Router

  ) {
    this.payer_limit = 25;
    this.state_limit = 25;
  }

  ngOnInit() {
    this.userId = localStorage.getItem('userId');
    this.storeRouteData();
    //this.custID =  this.router.getNavigatedData()
    this.activatedRoute.params.subscribe(
      data => {
        this.custID = data;
      }
    );
    this.getMasterData();
    this.buildStateForm();
    this.buildProviderSearchForm();
    this.buildAppUserSearchForm();
    this.buildTinSearchForm();
    this.buildLocSearchForm();
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    this.modalOption.size = "lg";
    this.modalOption.centered = true;
    this.tinSearchData = '';
    this.appSearchData = '';
    this.locSearchData = '';
    this.spinner.hide();

    this.payerSelectAll = false;
    this.payerBtn = true;
  }
  getMasterData() {
    this.customerEditService.getMasterDeatils().subscribe(
      data => this.stateDetails(data)
    );
  }

  stateDetails(data) {
    this.stateDropdownData = data.state_list;
  }


  storeRouteData() {
    this.activatedRoute.data.subscribe(
      data => {

        this.saveCustomerEditData(data.customer_edit[0], data.customer_edit[1]);
      }
    )
  }

  saveCustomerEditData(edit, lic) {
    this.editData = Object.assign(edit.data.customer_details[0], lic.licenseList[0]);
    this.editData.eff_from = this.datePipe.transform(this.editData.eff_from, 'MM/dd/yyyy');
    this.editData.expires_on = this.datePipe.transform(this.editData.expires_on, 'MM/dd/yyyy');
    this.editData.effective_date_contract = this.datePipe.transform(this.editData.effective_date_contract, 'MM/dd/yyyy');
    this.editData.renewal_date_contract = this.datePipe.transform(this.editData.renewal_date_contract, 'MM/dd/yyyy');
    this.licID = this.editData.license_id;
  }

  public onstatePage(pageInfo) {
    this.state_page_number = pageInfo.offset
    this.getAccessibleStateDetails(this.state_page_number, this.state_limit, this.licID)
  }

  public getAccessibleStateDetails(sNumber, sLimit, sLicId) {
    let licenseData = {
      license_id: sLicId,
      page_number: sNumber,
      limit: sLimit
    }
    this.customerEditService.getAccessibleState(licenseData).subscribe(
      data => this.getAccessibleStateData(data)
    )
  }



  public beforeChange($event: NgbTabChangeEvent) {
    this.provLimit = 25;
    this.tinLimit = 25;
    this.appLimit = 25;
    this.locLimit = 25;

    if ($event.nextId == "appUsers") {
      this.spinner.show();
      this.onAppUserPage({ offset: 0 });

    } else if ($event.nextId == "accessibleState") {
      this.spinner.show();
      this.onstatePage({ offset: 0 })
      // let licenseData = {
      //   license_id: this.licID
      // }
      // this.customerEditService.getAccessibleState(licenseData).subscribe(
      //   data => this.getAccessibleStateData(data)
      // )
    } else if ($event.nextId == "providers") {
      this.spinner.show();
      this.onPage({ offset: 0 });
    } else if ($event.nextId == 'customerTins') {
      this.spinner.show();
      this.onTinPage({ offset: 0 });
    } else if ($event.nextId == 'customerLocation') {
      this.spinner.show();
      this.onLocPage({ offset: 0 });
    }
  }

  onAppUserPage(appPageInfo) {

    this.appOffset = appPageInfo.offset;
    this.getListofAppUsers(this.appOffset, this.appLimit, this.custID.customer_id, this.appSearchData);
  }

  getListofAppUsers(aNumber, alimit, cid, aSearch) {
    this.spinner.show();
    let params = {
      customer_id: cid,
      page_number: aNumber,
      limit: alimit,
      search_term: aSearch
    }

    this.customerEditService.getAppUserData(params).subscribe(
      data => this.appUserData(data)
    );

  }

  onLocPage(locPageinfo) {
    this.locOffset = locPageinfo.offset;
    this.getListofLocation(this.locOffset, this.locLimit, this.custID.customer_id, this.locSearchData);
  }

  getListofLocation(lNumber, llimit, cid, lSearch) {
    this.spinner.show();
    let params = {
      customer_id: cid,
      limit: llimit,
      page_number: lNumber,
      search_term: lSearch
    }
    this.customerEditService.getCustomerLocation(params).subscribe(
      data => {
        this.getListofLocDetails(data);
      }
    )
  }

  getListofLocDetails(data) {
    this.locCount = data.total_count;
    let locData = data.customer_locations;
    locData.map(item => {
      if (item['is_active'] == 1) {
        item['lstatus'] = true;
        item['loc_Active'] = 'Active';
      } else if (item['is_active'] == 0) {
        item['lstatus'] = false;
        item['loc_Active'] = 'Inactive';
      }
    })
    this.listofLocData = locData;

    this.spinner.hide();
  }


  onTinPage(tinPageinfo) {
    this.tinOffset = tinPageinfo.offset;
    this.getListofTins(this.tinOffset, this.tinLimit, this.custID.customer_id, this.tinSearchData);
  }



  getListofTins(tNumber, tlimit, cid, tSearch) {
    let params = {
      customer_id: cid,
      page_number: tNumber,
      limit: tlimit,
      search_term: tSearch
    }
    this.customerEditService.getCustomerTin(params).subscribe(
      data => {
        this.getListofTinDetails(data);
      }
    )
  }

  getListofTinDetails(data) {
    this.tinCount = data.total_count;
    this.listofTinsData = data.customer_tins;
    this.spinner.hide();
  }

  onPage(pageInfo) {
    this.spinner.show();
    this.provOffset = pageInfo.offset;
    this.getListofProvider(this.provOffset, this.provLimit, this.custID.customer_id, this.provSearchData);
  }

  public getListofProvider(pNumber, plimit, cId, searchProv) {
    let params = {
      customer_id: cId,
      page_number: pNumber,
      limit: plimit,
      search_term: searchProv
    }
    this.customerEditService.getProviderDetails(params).subscribe(
      data => {
        this.getProviderData(data);
      }
    )
  }

  public getProviderData(data) {
    this.prodDetails = data.provider_list;
    this.provCount = data.total_row;
    this.prodDetails.map(item => {

      if (item['portal_user_id'] != 0 && item['portal_active_status'] == 1) {
        item['provider_portal_status'] = true
      } else if (item['portal_user_id'] != 0 && item['portal_active_status'] != 1) {
        item['provider_portal_status'] = false
      }
      if (item['prov_active'] == 'Active') {
        item['pstatus'] = true;
      } else if (item['prov_active'] == 'Inactive') {
        item['pstatus'] = false;
      }
    });
    this.pData = this.prodDetails;

    this.spinner.hide();
  }


  buildProviderSearchForm() {
    this.searchProvider = this.formBuilder.group({
      searchValue: new FormControl('', [Validators.required])
    });
  }

  buildAppUserSearchForm() {
    this.searchAppUser = this.formBuilder.group({
      searchValue: new FormControl('', [Validators.required])
    });
  }

  buildTinSearchForm() {
    this.searchTin = this.formBuilder.group({
      searchValue: new FormControl('', [Validators.required])
    });
  }

  buildLocSearchForm() {
    this.searchLocation = this.formBuilder.group({
      searchValue: new FormControl('', [Validators.required])
    });
  }

  buildStateForm() {
    this.editState = this.formBuilder.group({
      accessible_states: new FormControl(null, Validators.required)
    })
  }
  actionAccState(type: string, data: any, accessablestateTable: any, ): void {
    event.stopPropagation();
    accessablestateTable && accessablestateTable.parentElement && accessablestateTable.parentElement.parentElement &&
      accessablestateTable.parentElement.parentElement.blur();

    this.spinner.show();
    this.accessibleStateData.map(item => {
      this.deleteAccStateArr.push(item['state_id']);
    })

    let idx = this.deleteAccStateArr.indexOf(data.state_id);
    this.deleteAccStateArr.splice(idx, 1);

    let deleteStateObj = {
      license_id: this.licID,
      accessible_states: this.deleteAccStateArr
    }

    this.customerEditService.addState(deleteStateObj).subscribe(
      item => this.deleteStateData(item, 'delete', data)
    )

  }

  deleteStateData(data, type, rowData) {

    this.editState.reset();
    this.spinner.hide();
    if (data.success) {
      this.payerBtn = true;
      this.payerSelectAll = false;
      this.selected = []
      this.getPayerData = [];
      this.payer_total_element = 0;
      this.existingAccStateArr = [];
      this.spinner.show();
      let licenseData = {
        license_id: this.licID
      }
      this.customerEditService.getAccessibleState(licenseData).subscribe(
        data => this.getAccessibleStateData(data)
      )
      if (type == 'add') {
        this.notiService.showSuccess("State added successfully", "", 4000);
      } else if (type == 'delete') {
        this.deleteAccStateArr = [];
        this.notiService.showSuccess("State deleted successfully", "", 4000);
      }

    } else {
      this.notiService.showError(data.error, "", 4000);
    }
  }


  public addState() {

    this.spinner.show();

    this.accessibleStateData.map(item => {
      this.existingAccStateArr.push(item['state_id']);
    })
    this.existingAccStateArr = this.existingAccStateArr.concat(this.editState.controls['accessible_states'].value);

    let addStateObj = {
      license_id: this.licID,
      accessible_states: this.existingAccStateArr,
    }

    this.customerEditService.addState(addStateObj).subscribe(
      data => this.addStateData(data, 'add')
    )

  }


  addStateData(data, type) {
    this.editState.reset();
    this.spinner.hide();
    if (data.success) {
      this.selected = []
      this.getPayerData = [];
      this.payer_total_element = 0;
      this.existingAccStateArr = [];
      this.spinner.show();
      let licenseData = {
        license_id: this.licID
      }
      this.customerEditService.getAccessibleState(licenseData).subscribe(
        data => this.getAccessibleStateData(data)
      )
      if (type == 'add') {
        this.notiService.showSuccess("State added successfully", "", 4000);
      } else if (type == 'delete') {
        this.deleteAccStateArr = [];
        this.notiService.showSuccess("State deleted successfully", "", 4000);
      }

    } else {
      this.notiService.showError(data.error, "", 4000);
    }
  }

  getAccessibleStateData(data) {
    this.accessibleStateData = data.licenseList;
    this.state_total_element = data.total_count;
    this.spinner.hide();
  }



  appUserData(data) {
    this.appUserDetails = data.app_user_list;
    this.appCount = data.total_count;
    this.appUserDetails.map(item => {
      item['last_visit'] = this.datePipe.transform(item['last_visit'], 'MM/dd/yyyy');
      if (item['case'] == 'Active') {
        item['astatus'] = true;
      } else if (item['case'] == 'Inactive') {
        item['astatus'] = false;
      }
    });
    this.aData = this.appUserDetails;
    this.spinner.hide();
  }







  public onAppUserChange(event, rowData, secondChild) {
    event.stopPropagation();
    secondChild && secondChild.parentElement && secondChild.parentElement.parentElement &&
      secondChild.parentElement.parentElement.blur();

    this.appUserStatusparams = {
      user_id: rowData.user_id,
      activate: ''
    }

    let actionStatus = '';
    if (rowData.astatus) {
      actionStatus = 'Deactivate'
      this.appUserStatusparams.activate = 'deactive'
    } else {
      actionStatus = 'Activate'
      this.appUserStatusparams.activate = 'active'
    }

    let dataParams = {
      name: rowData.username,
      type: 'App User',
      action: actionStatus
    }
    const confRef = this.modalService.open(CustomerModalComponent, this.modalOption);
    confRef.componentInstance.dataStatus = dataParams;
    confRef.result.then((result) => {

      if (result == 'yes') {

        this.spinner.show();
        this.customerEditService.deactivateAppUsers(this.appUserStatusparams).subscribe(
          data => this.getAppUserStatusData(data, rowData)
        )
      } else if (result == 'no') {

      }
    }).catch((error) => {
      console.log(error);
    });

  }

  getAppUserStatusData(data, rowData) {

    if (data.success) {
      if (!rowData.astatus) {
        this.appUserStatusparams.activate = 'active';
        rowData.case = 'Active';
        rowData.astatus = true;
      } else {
        this.appUserStatusparams.activate = 'deactive';
        rowData.case = 'Inactive';
        rowData.astatus = false;
      }
      this.notiService.showSuccess("App User is " + this.appUserStatusparams.activate + "", " ", 4000);
    } else {
      this.notiService.showError("An error occured!", "", 4000);
    }
    this.spinner.hide();
  }

  public onProviderStatusChange(event, rowData, firstChild) {
    event.stopPropagation();
    firstChild && firstChild.parentElement && firstChild.parentElement.parentElement &&
      firstChild.parentElement.parentElement.blur();

    this.providerStatusparams = {
      provider_id: rowData.provir_id,
      activate: ''
    }
    let actionStatus = '';
    if (rowData.pstatus) {
      actionStatus = 'Deactivate'
      this.providerStatusparams.activate = 'deactive'
    } else {
      actionStatus = 'Activate'
      this.providerStatusparams.activate = 'active'
    }

    let dataParams = {
      name: rowData.f_name + " " + rowData.l_name,
      type: 'provider',
      action: actionStatus
    }
    const confRef = this.modalService.open(CustomerModalComponent, this.modalOption);
    confRef.componentInstance.dataStatus = dataParams;
    confRef.result.then((result) => {

      if (result == 'yes') {

        this.spinner.show();
        this.customerEditService.deactivateProvider(this.providerStatusparams).subscribe(
          data => this.getProviderStatusData(data, rowData)
        )
      } else if (result == 'no') {

      }
    }).catch((error) => {
      console.log(error);
    });


  }

  public getProviderStatusData(data, rowData) {

    if (data.success) {
      if (!rowData.pstatus) {
        this.providerStatusparams.activate = 'active';
        rowData.prov_active = 'Active';
        rowData.pstatus = true;
      } else {
        this.providerStatusparams.activate = 'inactive';
        rowData.prov_active = 'Inactive';
        rowData.pstatus = false;
      }
      this.notiService.showSuccess("Provider is " + this.providerStatusparams.activate + "", " ", 4000);
    } else {
      this.notiService.showError("An error occured!", "", 4000);
    }
    this.spinner.hide();
  }

  public pDelete(type, data, firstChild) {
    event.stopPropagation();
    firstChild && firstChild.parentElement && firstChild.parentElement.parentElement &&
      firstChild.parentElement.parentElement.blur();

    let dataParams = {
      name: data.f_name + " " + data.l_name,
      type: 'provider',
      action: 'delete'
    }

    const confRef = this.modalService.open(CustomerModalComponent, this.modalOption);
    confRef.componentInstance.dataStatus = dataParams;

    confRef.result.then((result) => {
      if (result == 'yes') {
        this.spinner.show();
        let params = {
          provider_id: data.provir_id
        }
        this.customerEditService.deleteProvider(params).subscribe(
          data => this.deletedProvider(data)
        )
      } else if (result == 'no') {

      }
    }).catch((error) => {
      console.log(error);
    });

  }

  public deletedProvider(data) {
    if (data.success) {
      this.spinner.show();
      // this.customerEditService.getProviderDetails(this.custID).subscribe(
      //   data => this.getProviderData(data)
      // )

      this.provLimit = this.provtable.pageSize;
      this.provOffset = this.provtable.offset;
      this.getListofProvider(this.provOffset, this.provLimit, this.custID.customer_id, this.provSearchData);
      this.notiService.showSuccess("Provider deleted successfully", "", 4000);
    } else {
      this.notiService.showError("An error occured!", "", 4000);
    }
    this.spinner.hide();
  }

  public reset() {
    this.editCustomer.reset();
  }

  // public provOffset: number;
  // public appOffset: any;
  // public tinOffset: number;
  // public locOffset: any;


  public onLimitChange(limit, type) {
    if (type == 'provider') {
      this.provLimit = limit;
      this.provOffset = 0;
      this.getListofProvider(0, limit, this.custID.customer_id, this.provSearchData);
    } else if (type == 'appuser') {
      this.appLimit = limit;
      this.appOffset = 0;
      this.getListofAppUsers(0, limit, this.custID.customer_id, this.appSearchData);

    } else if (type == 'tin') {
      this.tinLimit = limit;
      this.tinOffset = 0;
      this.getListofTins(0, limit, this.custID.customer_id, this.tinSearchData);
    } else if (type == 'location') {
      this.locLimit = limit;
      this.locOffset = 0;
      this.getListofLocation(0, limit, this.custID.customer_id, this.locSearchData);
    }
  }

  onTinSearchChange(data) {

    this.spinner.show();
    this.tinOffset = 0;
    this.tinSearchData = this.searchTin.controls['searchValue'].value;
    this.getListofTins(0, this.tinLimit, this.custID.customer_id, this.tinSearchData);
  }

  onAppSearchChange(data) {

    this.spinner.show();
    this.appOffset = 0;
    this.appSearchData = this.searchAppUser.controls['searchValue'].value;
    this.appLimit = this.apptable.pageSize;
    this.getListofAppUsers(0, this.appLimit, this.custID.customer_id, this.appSearchData);

  }

  onProvSearchChange(data) {
    this.spinner.show();

    // this.spinner.show();
    this.provSearchData = this.searchProvider.controls['searchValue'].value;
    this.getListofProvider(this.provOffset, this.provLimit, this.custID.customer_id, this.provSearchData);
    // this.getCustomerData(2, "", this.pagelimit, searchData, this.cOrder);
  }

  onLocationSearchChange() {

    this.spinner.show();
    this.locOffset = 0;
    this.locSearchData = this.searchLocation.controls['searchValue'].value;
    this.getListofLocation(0, this.locLimit, this.custID.customer_id, this.locSearchData);
  }

  clear(type) {
    if (type == "prov") {
      this.spinner.show();
      this.provOffset = 0;
      this.provSearchData = '';
      this.getListofProvider(this.provOffset, this.provLimit, this.custID.customer_id, this.provSearchData);
      this.searchProvider.reset();
    } else if (type == "appuser") {
      this.spinner.show();
      this.appSearchData = '';
      this.appOffset = 0;
      this.getListofAppUsers(0, this.appLimit, this.custID.customer_id, '');
      this.searchAppUser.reset();
    } else if (type == "tin") {
      this.spinner.show();
      this.tinSearchData = '';
      this.tinOffset = 0;
      this.getListofTins(0, this.tinLimit, this.custID.customer_id, '');
      this.searchTin.reset();
    } else if (type == "location") {
      this.spinner.show();
      this.locSearchData = '';
      this.locOffset = 0;
      this.getListofLocation(0, this.locLimit, this.custID.customer_id, '');
      this.searchLocation.reset();
    }
  }

  onSelect({ selected }) {

    this.payerBtn = false;
    this.spinner.show();
    this.onPayerPage({ offset: 0 })
    this.selected_payer_id = []
  }



  public onPayerPage(pageInfo) {
    this.payer_page_number = pageInfo.offset;
    this.getPayerDataDetails(this.payer_page_number, '', this.selected[0].state_id)
  }

  public getPayerDataDetails(pNumber, pLimit, pStateId) {
    let dataParams = {
      state_id: pStateId,
      page_number: pNumber,
      limit: pLimit,
      customer_id: this.custID.customer_id
    }
    this.customerEditService.getPayers(dataParams).subscribe(
      data => this.getPayerDetails(data)
    )
  }

  getPayerDetails(data) {
    this.payerSelectAll = true;
    this.getPayerData = data.license_state_payers;

    this.getPayerData.map(item => {
      if (item['payer_id'] == null || item['payer_id'] == '') {
        item['status'] = false;
      } else {
        item['status'] = true;
      }
    })

    this.getPayerData.map(item => {
      if (item['status']) {
        this.selected_payer_id.push(item['item_id'])
      }
    })

    this.payer_total_element = data.total_count;
    this.spinner.hide();
  }

  onPayerActivate(event) {

  }

  onCheckboxChangeFn(event, data) {
    if (event.target.checked) {
      this.selected_payer_id.push(data.item_id)
    } else {
      let index = this.selected_payer_id.indexOf(data.item_id);
      this.selected_payer_id.splice(index, 1)
    }
  }

  public savePayerList() {
    this.spinner.show()
    let dataParams = {
      state_id: this.selected[0].state_id,
      payer_id: this.selected_payer_id,
      customer_id: this.custID.customer_id,
      user_id: this.userId
    }

    this.customerEditService.postMapPayerState(dataParams).subscribe(item => {
      this.mapPayerToSatate(item)
    })
  }

  public selectAllPayerList() {
    this.selected_payer_id = []
    this.getPayerData.map(item => {
      item['status'] = true;
      this.selected_payer_id.push(item['item_id'])
    })

  }

  private mapPayerToSatate(data) {
    if (data.success) {
      this.notiService.showSuccess(data.message, '', 4000);
    } else {
      this.notiService.showError(data.error, '', 4000);
    }
    this.spinner.hide()
  }

  onPayerSort(event) {

  }

  updateProviderValue(event, cell, rowIndex, rowData) {

    console.log(rowData);

    let dataParams = {
      name: rowData.f_name,
      type: 'email of the provider',
      action: 'update'
    }
    const confRef = this.modalService.open(CustomerModalComponent, this.modalOption);
    confRef.componentInstance.dataStatus = dataParams;
    confRef.result.then((result) => {

      if (result == 'yes') {

        this.editingProvider[rowIndex + '-' + cell] = false;
        this.pData[rowIndex]['email'] = event;

        let dataParams = {
          email: event,
          customer_id: this.custID.customer_id,
          provider_id: rowData.provir_id,
          physician_id: rowData.physicn_id,
          portal_user_id: rowData.portal_user_id
        }

        this.customerEditService.updateProviderEmail(dataParams).subscribe(
          data => this.providerEmailUpdateDetails(data)
        )


      } else if (result == 'no') {

        this.editingProvider[rowIndex + '-' + cell] = false;
        this.pData[rowIndex]['email'] = rowData.email;
      }

    }).catch((error) => {
      console.log(error);
    });
  }

  private providerEmailUpdateDetails(data) {

    if (data.success) {
      this.notiService.showSuccess(data.message, "", 4000);
      this.getListofProvider(this.provOffset, this.provLimit, this.custID.customer_id, this.provSearchData);
    } else {
      this.notiService.showSuccess(data.error, "", 4000)
    }
  }

  updateValue(event, cell, rowIndex, rowData) {

    let dataParams = {
      name: rowData.username,
      type: 'email of the app user',
      action: 'update'
    }
    const confRef = this.modalService.open(CustomerModalComponent, this.modalOption);
    confRef.componentInstance.dataStatus = dataParams;
    confRef.result.then((result) => {

      if (result == 'yes') {

        this.editing[rowIndex + '-' + cell] = false;
        this.aData[rowIndex]['email'] = event;

        let dataParams = {
          user_id: rowData.user_id,
          email: event
        }
        this.customerEditService.updateAppUserEmail(dataParams).subscribe(
          data => this.appUserEmailUpdateDetails(data)
        )


      } else if (result == 'no') {

        this.editing[rowIndex + '-' + cell] = false;
        this.aData[rowIndex]['email'] = rowData.email;
      }
    }).catch((error) => {
      console.log(error);
    });
  }

  private appUserEmailUpdateDetails(data) {

    if (data.success) {
      this.notiService.showSuccess(data.message, "", 4000);
      this.getListofAppUsers(this.appOffset, this.appLimit, this.custID.customer_id, this.appSearchData);
    } else {
      this.notiService.showSuccess(data.error, "", 4000)
    }
  }

  public onTinStatusChange(event, rowData, thirdChild) {
    event.stopPropagation();
    thirdChild && thirdChild.parentElement && thirdChild.parentElement.parentElement &&
      thirdChild.parentElement.parentElement.blur();


    let actionStatus = '';
    if (rowData.case == 'Active') {
      actionStatus = 'Deactivate'
    } else {
      actionStatus = 'Activate'
    }

    let dataParams = {
      name: rowData.tin_group_name,
      type: 'TIN',
      action: actionStatus
    }
    const confRef = this.modalService.open(CustomerModalComponent, this.modalOption);
    confRef.componentInstance.dataStatus = dataParams;
    confRef.result.then((result) => {

      if (result == 'yes') {

        this.tinStatusparams = {
          customer_id: this.custID.customer_id,
          tin_info_id: rowData.id,
          activate: ''
        }

        if (rowData.case == 'Active') {
          this.tinStatusparams.activate = 'inactive'
        } else {
          this.tinStatusparams.activate = 'active'
        }

        this.spinner.show();
        this.customerEditService.deactivateTin(this.tinStatusparams).subscribe(
          data => this.getTinStatusData(data)
        )
      } else if (result == 'no') {

      }
    }).catch((error) => {
      console.log(error);
    });

  }

  getTinStatusData(data) {
    this.spinner.hide();

    if (data.success) {
      this.notiService.showSuccess(data.message, "", 4000);
      this.getListofTins(this.tinOffset, this.tinLimit, this.custID.customer_id, this.tinSearchData);
    } else {
      this.notiService.showError(data.error, "", 4000);
    }
  }

  public onLocationStatusChange(event, rowData, forthChild) {
    event.stopPropagation();
    forthChild && forthChild.parentElement && forthChild.parentElement.parentElement &&
      forthChild.parentElement.parentElement.blur();

    let dataParams = {
      name: rowData.practice_name,
      type: 'Location',
      action: rowData.loc_Active == 'Active' ? 'deactivate' : 'activate'
    }
    const confRef = this.modalService.open(CustomerModalComponent, this.modalOption);
    confRef.componentInstance.dataStatus = dataParams;
    confRef.result.then((result) => {

      if (result == 'yes') {

        this.locationStatusparams = {
          customer_id: this.custID.customer_id,
          practice_info_id: rowData.id,
          activate: rowData.loc_Active == 'Active' ? 'inactive' : 'active'
        }

        this.spinner.show();
        this.customerEditService.deactivateLocation(this.locationStatusparams).subscribe(
          data => this.getLocationStatusData(data)
        )
      } else if (result == 'no') {

      }
    }).catch((error) => {
      console.log(error);
    });

  }

  private getLocationStatusData(data) {
    this.spinner.hide();

    if (data.success) {
      this.notiService.showSuccess(data.message, "", 4000);
      this.getListofLocation(this.locOffset, this.locLimit, this.custID.customer_id, this.locSearchData);
    } else {
      this.notiService.showError(data.error, "", 4000);
    }
  }

  public onPortalProviderChange(event, rowData, fifthChild) {

    fifthChild && fifthChild.parentElement && fifthChild.parentElement.parentElement &&
      fifthChild.parentElement.parentElement.blur();

    let dataParams = {
      name: rowData.email,
      type: 'portal provider access of',
      action: event == true ? 'activate' : 'deactivate'
    }
    const confRef = this.modalService.open(CustomerModalComponent, this.modalOption);
    confRef.componentInstance.dataStatus = dataParams;
    confRef.result.then((result) => {

      if (result == 'yes') {
        this.spinner.show();

        let postParams = {
          user_id: rowData.portal_user_id,
          activate: event == true ? 'active' : 'deactive'
        }

        this.customerEditService.postPortalProviderAccess(postParams).subscribe(
          data => {
            this.portalPoviderStatusDetails(data, rowData);
          }
        )

      } else if (result == 'no') {
        rowData['provider_portal_status'] = !event;
        // if (event) {
        //   rowData.provider_portal_status = false;
        // } else {
        //   rowData.provider_portal_status = true;
        // }
      }
    })


  }

  public portalPoviderStatusDetails(data, rowData) {
    this.spinner.hide();
    if (data.success) {
      this.notiService.showSuccess(data.message, '', 4000)

      this.getListofProvider(this.provOffset, this.provLimit, this.custID.customer_id, this.provSearchData);

    } else {
      this.notiService.showError(data.error, '', 4000)
    }
  }

  public exportProviderExcel() {
    let params = {
      customer_id: this.custID.customer_id,
      search_term: this.provSearchData
    }
    this.customerEditService.exportProviderList(params).subscribe(
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

  public exportAppUserExcel() {
    let params = {
      customer_id: this.custID.customer_id,
      search_term: this.appSearchData
    }
    this.customerEditService.exportAppUserList(params).subscribe(
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

  public exportTinExcel() {
    let params = {
      customer_id: this.custID.customer_id,
      search_term: this.tinSearchData
    }
    this.customerEditService.exportTinList(params).subscribe(
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

  public exportLocationExcel() {
    let params = {
      customer_id: this.custID.customer_id,
      search_term: this.locSearchData
    }
    this.customerEditService.exportLocationList(params).subscribe(
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
