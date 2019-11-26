import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ToasterNotiService } from '../../../shared/services/notifications/toaster-noti.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { DatamigrationService } from '../service/datamigration/datamigration.service';
import { NgbTabsetConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-datamigration',
  templateUrl: './datamigration.component.html',
  styleUrls: ['./datamigration.component.scss'],
  providers: [DatePipe, NgbTabsetConfig]
})
export class DatamigrationComponent implements OnInit {

  public steps = [
    { id: 1, title: 'Select Customer', icon: 'fa fa-building' },
    { id: 2, title: 'Transfer Provider', icon: 'fa fa-building' },
    { id: 3, title: 'Save', icon: 'fa fa-building' },
  ]

  public typeData = [
    { id: 1, item_name: 'TIN' },
    { id: 2, item_name: 'Location' },
    { id: 3, item_name: 'Provider' }
  ];

  @ViewChild('tabset') stepTabChage: any;

  public displayCheck: any;
  public customerList: any;
  public dataFromList: any;
  public dataToList: any;
  public originalToList: any;
  public selected = [];
  public selectedItem = [];
  public moveToOtherCustomer = []
  public dataMigrationCustomer: FormGroup;
  public dataMigrationType: FormGroup;
  public dataMigrationTin: FormGroup

  public showType: boolean;
  public showCustomer: boolean;
  public showList: boolean;

  public fromTinDropdown: any;
  public toTinDropdown: any;

  public index: number;
  public isPreviousDisabled: boolean;
  public isNextDisabled: boolean;
  public showSave: boolean;
  public isDisabled: boolean;

  public fromCustomer: any;
  public toCustomer: any;

  public showTinList: boolean;
  public showLocationList: boolean;
  public showProviderList: boolean;

  public isCustomerDisabled: boolean;
  public isTinDisabled: boolean;
  public isListDisabled: boolean;

  public tableTitle: any;
  public dataFlag: any;
  
  public fromTin: any;
  public toTin: any;

  public isTinTitleDisabled: boolean

  public checkModel: boolean;


  // public isDisabledMoveCopy: any;

  public modalOption: NgbModalOptions = {};

  constructor(
    private formBuilder: FormBuilder,
    private datamigrationService: DatamigrationService,
    private notiService: ToasterNotiService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private modalService: NgbModal,
    private datePipe: DatePipe,
    private config: NgbTabsetConfig
  ) {
    config.justify = 'center';
    config.type = 'pills';
  }

  ngOnInit() {
    this.buildSelectType();
    this.buildSelectTin();

    this.buildSelectCustomer();
    this.getCustomerList();
    this.showType = true;
    this.showCustomer = false;
    this.showList = false;
    this.index = 0;
    this.isPreviousDisabled = true;
    this.isNextDisabled = true;
    this.showSave = false;
    this.isDisabled = true;

    this.isCustomerDisabled = true;
    this.isTinDisabled = true;
    this.isListDisabled = true;

    this.isTinTitleDisabled = false;

    this.checkModel = false

    // this.isDisabledMoveCopy = false;
  }
  //dataMigrationTin

  public buildSelectTin() {
    this.dataMigrationTin = this.formBuilder.group({
      from_tin: new FormControl(null, [Validators.required]),
      to_tin: new FormControl(null, [Validators.required])
    });
  }


  public buildSelectType() {
    this.dataMigrationType = this.formBuilder.group({
      type: new FormControl(null, [Validators.required]),
      // is_document: new FormControl(false)
    });
  }

  public buildSelectCustomer() {
    this.dataMigrationCustomer = this.formBuilder.group({
      from_customer: new FormControl(null, [Validators.required]),
      to_customer: new FormControl(null, [Validators.required])
    });
  }

  public onchangeDocument(event) {
    console.log(event.target.checked)
    console.log(this.dataMigrationType.value)
  }

  public getCustomerList() {
    this.spinner.show();
    this.datamigrationService.getCustomer().subscribe(
      data => {
        console.log(data);
        this.customerDetails(data);
      },
      error => {
        console.log(error)
      }
    )
  }

  private customerDetails(data) {
    this.spinner.hide();
    if(data.success){
      this.customerList = data.customer_list;
    }
    
  }



  public onActivate(event) {
    //console.log(event)
  }

  public onSelect(event) {

    this.selectedItem = event.selected;
    console.log(this.selectedItem)
  }

  public transferDatatoAnother(data) {

    this.dataFlag = data

    this.selectedItem.map(item => {
      this.dataToList.unshift(item)
    })
    this.isDisabled = false;
    // this.isDisabledMoveCopy = true;
  }

  public transfer() {
    this.spinner.show();

    if (this.dataMigrationType.value.type == 1) {
      let selected_id = [];

      this.selectedItem.map(item => {
        selected_id.push(item['tin_id']);
      })

      let postParams = {
        from_customer: this.dataMigrationCustomer.value.from_customer,
        to_customer: this.dataMigrationCustomer.value.to_customer,
        tin_id: selected_id,
        move_or_copy: this.dataFlag,
        // is_document: this.dataMigrationType.value.is_document ? '1' : '0'
      }

      this.datamigrationService.postTinDataTransfer(postParams).subscribe(
        data => {
          console.log(data)
          this.dataMigratedDetails(data);
        }
      )
    } else if (this.dataMigrationType.value.type == 2) {

      let toTin_id = [];
      toTin_id.push(this.dataMigrationTin.value.to_tin)

      let selected_id = [];
      this.selectedItem.map(item => {
        selected_id.push(item['location_id']);
      })

      let postParams = {
        from_customer: this.dataMigrationCustomer.value.from_customer,
        to_customer: this.dataMigrationCustomer.value.to_customer,
        location_id: selected_id,
        move_or_copy: this.dataFlag,
        tin_id: toTin_id,
        from_tin: this.dataMigrationTin.value.from_tin,
        // is_document: this.dataMigrationType.value.is_document ? '1' : '0'
      }

      this.datamigrationService.postLocationDataTransfer(postParams).subscribe(
        data => {
          console.log(data)
          this.dataMigratedDetails(data);
        }
      )

    } else if (this.dataMigrationType.value.type == 3) {
      let selected_id = [];

      this.selectedItem.map(item => {
        selected_id.push(item['provider_id']);
      })

      let postParams = {
        from_customer: this.dataMigrationCustomer.value.from_customer,
        to_customer: this.dataMigrationCustomer.value.to_customer,
        provider_id: selected_id,
        move_or_copy: this.dataFlag,
        // is_document: this.dataMigrationType.value.is_document ? '1' : '0'
      }

      this.datamigrationService.postProviderDataTransfer(postParams).subscribe(
        data => {
          console.log(data)
          this.dataMigratedDetails(data);
        }
      )
    }
  }

  private dataMigratedDetails(data) {
    this.spinner.hide();
    if (data.success) {
      this.stepTabChage.select('tab-type')
      this.notiService.showSuccess(data.message, '', 4000);
      this.dataMigrationType.reset();
      this.dataMigrationCustomer.reset();
      this.dataMigrationTin.reset();
      this.dataFromList = [];
      this.dataToList = [];
      this.selectedItem = [];
      this.selected = [];
      // this.isDisabledMoveCopy = false;
      
    } else {
      this.notiService.showError(data.error, '', 4000);
    }
  }

  public cleardownload() {

  }

  public downloadPDF() {

  }

  public onSort(event) {

  }

  public onTypeChage(event) {

    if(!this.dataMigrationType.invalid){
      this.isCustomerDisabled = false;
    }

    if (event == 1) {
      this.showTinList = true;
      this.showLocationList = false;
      this.showProviderList = false;
      this.isTinDisabled = true;
      this.tableTitle = 'TIN Name'
      this.isTinTitleDisabled = false;

    } else if (event == 2) {
      this.showTinList = false;
      this.showLocationList = true;
      this.showProviderList = false;
      this.isTinDisabled = true;
      this.tableTitle = 'Practice Name'
      this.isTinTitleDisabled = true;
    } else if (event == 3) {
      this.showTinList = false;
      this.showLocationList = false;
      this.showProviderList = true;
      this.isTinDisabled = true;
      this.tableTitle = 'Provider Name'
      this.isTinTitleDisabled = false;
    }
  }

  public onFromCustomerChage(event) {
    console.log(event)
    this.fromCustomer = event.customer
    if(!this.dataMigrationCustomer.invalid){
      this.isListDisabled = false;
    }
    if(!this.dataMigrationCustomer.invalid && this.dataMigrationType.value.type == 2){
      this.isTinDisabled = false;
    }
  }

  public onToCustomerChage(event) {
    console.log(event)
    this.toCustomer = event.customer
    if(!this.dataMigrationCustomer.invalid && this.dataMigrationType.value.type != 2){
      this.isListDisabled = false;
    }
    if(!this.dataMigrationCustomer.invalid && this.dataMigrationType.value.type == 2){
      this.isTinDisabled = false;
    }
  }

  public onFromTinChage(event){
    console.log(event)
    this.fromTin = event.tin_group_name
    if(!this.dataMigrationTin.invalid){
      this.isListDisabled = false;
    }
  }

  public onToTinChage(event){
    console.log(event)
    this.toTin = event.tin_group_name
    if(!this.dataMigrationTin.invalid){
      this.isListDisabled = false;
    }
  }

  public nextTypeBtn() {
    console.log(this.stepTabChage)
    console.log(this.dataMigrationType.value)

    this.stepTabChage.select('tab-customer');
    

  }

  public previousCustomerBtn() {
    console.log(this.stepTabChage)
    this.stepTabChage.select('tab-type')
  }

  public nextCustomerBtn() {
    if (this.dataMigrationType.value.type == 2) {
      
      this.stepTabChage.select('tab-tin');
      this.getTinDetails();
    } else {
      this.selected = []
      
      console.log(this.stepTabChage)
      this.stepTabChage.select('tab-list');
      this.dataTransferList();
    }
    
    


  }

  public getTinDetails() {
    this.spinner.show()
    let fromParams = {
      user_id: this.dataMigrationCustomer.value.from_customer,
      is_active: 1
    }
    let toParams = {
      user_id: this.dataMigrationCustomer.value.to_customer,
      is_active: 1
    }

    this.datamigrationService.getTinList(fromParams, toParams).subscribe(
      data => {
        console.log(data)
        this.tinDetails(data)
      }
    )
  }

  private tinDetails(data) {
    this.spinner.hide();
    if (data[0].success && data[1].success) {
      this.fromTinDropdown = data[0].dropdown_list;
      this.toTinDropdown = data[1].dropdown_list;
    }
  }

  public nextTinBtn() {
    this.stepTabChage.select('tab-list');
    this.dataTransferList();
  }

  public previousTinBtn(){
    this.stepTabChage.select('tab-customer');
  }

  public previousListBtn() {
    console.log(this.stepTabChage)
   
    if (this.dataMigrationType.value.type == 2) {
      this.stepTabChage.select('tab-tin')
    }else{
      this.stepTabChage.select('tab-customer')
    }
  }

  public dataTransferList() {
    this.spinner.show()

    let fromParams = {
      user_id: this.dataMigrationCustomer.value.from_customer,
      is_active: 1
    }
    let toParams = {
      user_id: this.dataMigrationCustomer.value.to_customer,
      is_active: 1
    }
    // seleceted Tin
    if (this.dataMigrationType.value.type == 1) {

      this.datamigrationService.postTinList(fromParams, toParams).subscribe(
        data => {
          console.log(data)
          this.dataTransferDetails(data)
        }
      )
    } else if (this.dataMigrationType.value.type == 3) {
      // selected Provider
      this.datamigrationService.postProviderList(fromParams, toParams).subscribe(
        data => {
          console.log(data)
          this.dataTransferDetails(data)
        }
      )
    } else if (this.dataMigrationType.value.type == 2) {


      let fromLocParams = {
        tin_id: this.dataMigrationTin.value.from_tin,
        is_active: 1
      }
      let toLocParams = {
        tin_id: this.dataMigrationTin.value.to_tin,
        is_active: 1
      }
      // selected Provider
      this.datamigrationService.postLocationList(fromLocParams, toLocParams).subscribe(
        data => {
          console.log(data)
          this.dataTransferDetails(data)
        }
      )
    }
  }

  private dataTransferDetails(data) {
    console.log(data)
    this.spinner.hide()

    this.dataFromList = []
    this.dataToList = []
    this.selectedItem = []

    if (data[0].success && data[1].success) {
      this.dataFromList = data[0].dropdown_list;
      this.dataToList = data[1].dropdown_list;
      //this.originalToList = data[1].dropdown_list
    }
  }

  public resetToList() {
    this.selected = [];
    // this.isDisabledMoveCopy = false;
    this.dataTransferList()
  }



}
