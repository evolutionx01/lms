import { Component, OnInit, ViewChild } from '@angular/core';
import { AuditViewService } from '../services/audit-view/audit-view.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-audit-view',
  templateUrl: './audit-view.component.html',
  styleUrls: ['./audit-view.component.scss'],
  providers: [DatePipe]
})
export class AuditViewComponent implements OnInit {

  @ViewChild('myTable') table: any;
  field: any;
  module: string;
  AuditFieldArray: any[];
  fieldsData: any;
  moduleDropdown: any;
  public pageLimit: number;
  public pageNumber: any;
  public totalElements: any;
  auditData: any;
  public moduleArray = [];
  public currentPageLimit: number = 25;
  public pageLimitOptions = [
    { value: 10 },
    { value: 25 },
    { value: 50 },
    { value: 100 },
  ];

  public filterAudit: FormGroup;

  constructor(
    private auditViewService: AuditViewService,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {

    this.buildSearchForm();
    this.getDropdownData();
    this.pageLimit = 25;
    this.setPage({ offset: 0 });


  }

  buildSearchForm() {
    this.filterAudit = this.formBuilder.group({
      module: new FormControl(null, [Validators.required]),
      field: new FormControl(null)
    });
  }

  public getDropdownData() {
    this.auditViewService.getAuditModules().subscribe(data => {
      this.getDropdowndetails(data)
    })
  }

  private getDropdowndetails(data) {
    this.moduleDropdown = data.modules
    let array = []
    this.moduleDropdown.map((item, index) => {
      array.push({ name: item, id: item })
      //this.moduleArray.push(item);
    })

    this.moduleArray = array;
  }

  public setPage(pageInfo) {
    this.pageNumber = pageInfo.offset;
    this.getAuditData(this.pageNumber, this.pageLimit, this.module, this.field);
  }

  getAuditData(pNumber, pLimit, aModule, aField) {
    this.spinner.show();
    let postParams = {
      module: aModule,
      field: aField,
      page_number: pNumber,
      limit_of_page: pLimit
    }
    this.auditViewService.getAuditDetails(postParams).subscribe(
      data => {
        //console.log(data);
        this.auditViewDetails(data);
      })
  }

  auditViewDetails(data) {
    this.auditData = data.audit_list;
    //console.log(this.auditData)
    this.totalElements = data.total_row;
    this.auditData.map(item => {
      item['created_at'] = this.datePipe.transform(item['created_at'], 'MM/dd/yyyy hh:mm:ss a');
      if (item['display_new_values'] != null) {
        item['new_value_key'] = Object.keys(item['display_new_values']);
      } else {
        item['new_value_key'] = []
      }
      if (item['display_old_values'] != null) {
        item['old_value_key'] = Object.keys(item['display_old_values']);
      } else {
        item['old_value_key'] = []
      }
      if (item['user_has_one'] == null) {
        item['user_has_one'] = { admin_id: '', first_name: '', last_name: '' }
      }
      item['user_data_key'] = Object.keys(item['user_has_one']);
    })
    this.spinner.hide();
    //console.log(this.auditData);
    //console.log(data);
  }

  onLimitChange(limit) {
    this.pageLimit = limit;
    this.pageNumber = 0;
    this.getAuditData(this.pageNumber, this.pageLimit, this.module, this.field);
  }

  onSelectChange(event) {
    if(event){
      let params = {
        module: event.name,
        field: null
      }
      this.AuditFieldArray = []
      this.filterAudit.patchValue(params);
      let dataParams = { module: event.name }
      this.auditViewService.getAuditModulesFields(dataParams).subscribe(data => {
        //console.log(data)
        this.getAuditModuleFieldsDetails(data)
      })
    }else{
      let params = {
        module: null,
        field: null
      }
      this.AuditFieldArray = []
      this.filterAudit.patchValue(params);
    }


  }

  private getAuditModuleFieldsDetails(data) {
    this.fieldsData = data.fields;
    let fieldArray = []
    for (let item in this.fieldsData) {
      fieldArray.push({ label: this.fieldsData[item], id: item })
      //console.log(item)
     // console.log(this.fieldsData[item]);
    }
    // this.fieldsData.filter(item=>{
    //   fieldArray.push({label:Object.values(item),id:Object.keys(item)})
    // })
    this.AuditFieldArray = fieldArray
    //console.log(fieldArray);
  }

  search() {
    this.module = this.filterAudit.value.module;
    this.field = this.filterAudit.value.field;
    //console.log(this.filterAudit.value);
    this.pageNumber = 0;
    this.pageLimit = this.table.pageSize;
    this.getAuditData(this.pageNumber, this.pageLimit, this.module, this.field);

  }

  clear() {
    this.filterAudit.reset();
    this.pageNumber = 0;
    this.pageLimit = this.table.pageSize;
    this.module = '';
    this.field = '';
    this.getAuditData(this.pageNumber, this.pageLimit, this.module, this.field);
  }

  public exportExcel() {
    let postParams = {
      module: this.filterAudit.value.module,
      field: this.filterAudit.value.field
    }

    console.log(postParams)
    this.auditViewService.exportDataToExcel(postParams).subscribe(
      data => {

        console.log(data)

        var downloadLink = window.document.createElement('a');
        downloadLink.href = `${environment.apiDownloadUrl}${data['file_name']}`
        downloadLink.download = data['file_name'];
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

      }, error => {
        console.log(error)
      }
    )
  }

}
