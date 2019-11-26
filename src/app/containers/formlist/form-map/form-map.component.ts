import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SimplePdfViewerComponent, SimplePDFBookmark } from 'simple-pdf-viewer';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbModalOptions, NgbActiveModal, NgbModal, NgbDateStruct, NgbCalendar, NgbDateAdapter, NgbDateNativeAdapter, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { FormMapModalComponent } from '../form-map-modal/form-map-modal.component';
import { FormMapService } from '../services/form-map/form-map.service';
import { ToasterNotiService } from '../../../shared/services/notifications/toaster-noti.service';
import { FormModalComponent } from '../form-modal/form-modal.component';
import { environment } from '../../../../environments/environment';


@Component({
  selector: 'app-form-map',
  templateUrl: './form-map.component.html',
  styleUrls: ['./form-map.component.scss']
})
export class FormMapComponent implements OnInit {

  public isProdEnvironment: any;
  public currentPdf;
  field_Order: any;
  formFieldLimit: any;
  displayCheck: any;
  isPublishDisable: boolean;
  field_unmap_idArr: Array<string> = [];
  selectArr: any;
  testArray: Set<string>;
  isDisabled: boolean;
  isSelected: boolean;
  formID: { [key: string]: any; };
  formUrl: any;
  formName: any;
  field_map_idArr: Array<string> = [];
  mapButtonEnabled: boolean;
  formFieldMapData: any;
  public searchFieldName: FormGroup;
  public pdfForm: FormGroup;
  modalOption: NgbModalOptions = {};
  selected = [];
  public base64: any;

  @ViewChild(SimplePdfViewerComponent) private pdfViewer: SimplePdfViewerComponent;

  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
    private formMapService: FormMapService,
    private notiService: ToasterNotiService
  ) {
    this.isProdEnvironment = activatedRoute.snapshot.data[0]['isPreview'];
  }

  ngOnInit() {
    console.log(this.isProdEnvironment);


    this.activatedRoute.params.subscribe(
      data => {
        console.log(data)
        this.formID = data;
      }
    );


    this.formFieldLimit = null

    //this.storeRouteData();


    let params = {
      form_id: this.formID
    }
    this.spinner.show();
    this.formMapService.getbaseurl(params).subscribe(
      data => {
        if (data['success']) {
          this.base64 = data['base64_file'];
          let url = "data:application/pdf;base64," + data['base64_file'];
          this.openDocument(url);
        }

      }
    )

    this.formFieldMapDataList()


    this.buildSearchForm();
    if(this.isProdEnvironment){
      this.buildPdfForm()
    } 
  
    //
    this.isDisabled = true;
    this.isSelected = true;

  }

  public formFieldMapDataList() {
    this.formMapService.getFormList(this.formID).subscribe(data => {
      this.formFieldMapDetails(data)
      console.log(data)
    })
  }

  public downloadPdf() {

    // decode base64 string, remove space for IE compatibility
    var binary = atob(this.base64.replace(/\s/g, ''));
    var len = binary.length;
    var buffer = new ArrayBuffer(len);
    var view = new Uint8Array(buffer);
    for (var i = 0; i < len; i++) {
      view[i] = binary.charCodeAt(i);
    }

    // create the blob object with content-type "application/pdf"               
    var blob = new Blob([view], { type: "application/pdf" });
    var linkSource = URL.createObjectURL(blob);



    // let blob = new Blob([this.base64], {type: 'application/pdf'});
    // var blobUrl = URL.createObjectURL(blob);
    // window.open(blobUrl)

    // const linkSource = `data:application/pdf;base64,${this.base64}`;

    const downloadLink = document.createElement("a");
    let title = this.formUrl.split('/');
    const fileName = title[title.length - 1];

    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
  }


  buildPdfForm() {
    this.pdfForm = this.formBuilder.group({
      page: new FormControl('')
    });
   // 

  }


  openDocument(document: any) {

    this.pdfViewer.openUrl(document);
    this.pdfForm.controls['page'].setValue(this.pdfViewer.getCurrentPage());

    this.spinner.hide();
  }

  storeRouteData() {
    this.spinner.show();

    this.activatedRoute.data.subscribe(
      data => {

        this.formFieldMapDetails(data.form_field_map)
        console.log("entered ts file");
        console.log(data.form_field_map);
      }
    )
  }

  public onSort(event) {
    this.spinner.show();
    console.log(event);
    if (event.column.name == "Field Name") {
      this.field_Order = event.newValue;
      this.getsubGroupFormFieldsData(this.field_Order);
    }
  }

  public getsubGroupFormFieldsData(order) {
    let params = {
      form_id: this.formID.form_id,
      sort_by: 'field_name',
      sort_order: order
    }
    this.formMapService.getFormList(params).subscribe(data => {
      this.formFieldMapDetails(data)
    })
  }



  formFieldMapDetails(data) {

    console.log(data);
    if (data.form_status_id == 3) {

      this.isPublishDisable = true;
      console.log(this.isPublishDisable)
    } else {
      this.isPublishDisable = false;
      console.log(this.isPublishDisable)
    }

    this.formName = data.form_name;
    this.formUrl = data.form_url;
    this.formFieldMapData = data.result;

    
    console.log(this.formFieldMapData);
    this.spinner.hide();

  }

  buildSearchForm() {
    this.searchFieldName = this.formBuilder.group({
      searchValue: new FormControl('', [Validators.required])
    });
  }

  public onSearchChange(data) {
    console.log(data)
  }

  public searchPage(event) {
    if (event.keyCode == 13) {
      this.pdfViewer.navigateToPage(event.target.value);
    }
  }

  pageChanged(val) {
    switch (val) {
      case "next":
        this.pdfViewer.nextPage();
        break;
      case "prev":
        this.pdfViewer.prevPage();
        break;
      case "first":
        this.pdfViewer.firstPage();
        break;
      case "last":
        this.pdfViewer.lastPage();
        break;

    }
    this.pdfForm.controls['page'].setValue(this.pdfViewer.getCurrentPage());
  }

  private getMappedHistoryData(data) {
    console.log(data.details[0])
    this.selectArr.map(item => {
      this.field_map_idArr.push(item['field_map_id']);
    })
    let dataParams = {
      form_id: this.formID.form_id,
      field_map_id: this.field_map_idArr,
      field_history: data.details[0]
    }
    const confRef = this.modalService.open(FormMapModalComponent, this.modalOption);
    confRef.componentInstance.formFieldData = dataParams;

    confRef.result.then((result) => {
      console.log(result);
      if (result == 'yes') {
        this.notiService.showSuccess("Field mapped successfully", "", 4000);

        let params = {
          form_id: this.formID.form_id
        }

        this.formMapService.getFormList(params).subscribe(
          data => {
            console.log('success');
            console.log(data);
            this.formFieldMapDetails(data);
            this.selected = [];
            this.selectArr = [];
            this.field_map_idArr = [];
            this.isDisabled = true;
          }
        )

      } else {
        this.selected = [];
        this.selectArr = [];
        this.field_map_idArr = [];
        this.isDisabled = true;
      }

    }).catch((error) => {
      console.log(error);
    });

  }

  public actionClicked(event, type) {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    this.modalOption.size = "lg";

    if (type == 'map') {
      if (this.selectArr.length == 1 && this.selectArr[0].column_name) {
        let dataparams = {
          field_map_id: this.selectArr[0].field_map_id
        }
        this.formMapService.getMappedFieldData(dataparams).subscribe(
          data => {
            console.log(data)
            this.getMappedHistoryData(data);
          }
        )
      } else {
        console.log('not satsia');
        this.field_map_idArr = [];
        console.log("map");
        console.log(this.selectArr);
        this.selectArr.map(item => {
          this.field_map_idArr.push(item['field_map_id']);
        })
        console.log(this.field_map_idArr);

        let dataParams = {
          form_id: this.formID.form_id,
          field_map_id: this.field_map_idArr

        }

        const confRef = this.modalService.open(FormMapModalComponent, this.modalOption);
        confRef.componentInstance.formFieldData = dataParams;

        confRef.result.then((result) => {
          console.log(result);
          if (result == 'yes') {
            this.notiService.showSuccess("Field mapped successfully", "", 4000);

            let params = {
              form_id: this.formID.form_id
            }

            this.formMapService.getFormList(params).subscribe(
              data => {
                console.log('success');
                console.log(data);
                this.formFieldMapDetails(data);
                this.selected = [];
                this.selectArr = [];
                this.field_map_idArr = [];
                this.isDisabled = true;
              }
            )

          } else {
            this.selected = [];
            this.selectArr = [];
            this.field_map_idArr = [];
            this.isDisabled = true;
          }

        }).catch((error) => {
          console.log(error);
        });
      }

    } else if (type == 'unmap') {
      console.log('unmaparra')
      this.field_unmap_idArr = [];
      console.log(this.field_unmap_idArr);
      console.log(this.selectArr[0].field_name)
      console.log(this.selectArr);
      this.selectArr.map(item => {
        this.field_unmap_idArr.push(item['field_map_id']);
      })
      console.log('unmap array')
      console.log(this.field_unmap_idArr);

      let dataItem = {
        name: "",
        type: 'field',
        action: 'unmap'
      };
      const confRef = this.modalService.open(FormModalComponent, this.modalOption);
      confRef.componentInstance.dataStatus = dataItem;

      confRef.result.then((result) => {
        console.log(result);
        if (result == 'yes') {
          let dataParams = {
            form_id: this.formID.form_id,
            field_map_id: this.field_unmap_idArr,
            field_id: '',
            order_id: 0
          }

          this.formMapService.postUnmapFields(dataParams).subscribe(
            data => this.formUnmapResult(data)
          )

        } else {
          this.selected = [];
          this.selectArr = [];
          this.field_unmap_idArr = [];
          this.isDisabled = true;
        }
      }).catch((error) => {
        console.log(error);
      });
    }
  }

  formUnmapResult(data) {
    console.log(data)
    if (data.success) {
      this.notiService.showSuccess("Field unmapped successfully", "", 4000);
      // this.formID
      this.formMapService.getFormList(this.formID).subscribe(
        data => {
          console.log('success');
          console.log(data);
          this.formFieldMapDetails(data);
          this.selected = [];
          this.selectArr = [];
          this.field_map_idArr = [];
          this.isDisabled = true;
        }
      )

    }
  }

  onCheckBoxChange(event) {
    console.log(event)
  }



  onCheckboxChangeFn(data, event) {

    console.log(data);
    console.log(event.target.checked);

    if (event.target.checked) {
      this.isDisabled = false;
      this.field_map_idArr.push(data.field_map_id);
      console.log(this.field_map_idArr);
    } else {
      let idx = this.field_map_idArr.indexOf(data.field_map_id);
      this.field_map_idArr.splice(idx, 1);
      console.log(this.field_map_idArr);
    }

    if (this.field_map_idArr.length == 0) {
      this.isDisabled = true;
    }

  }

  onActivate(event) {

  }

  onSelect(event) {
    console.log(event)
    if (event.selected.length == 0) {
      this.isDisabled = true;
      this.selectArr = event.selected;
    } else {
      this.isDisabled = false;
      this.selectArr = event.selected;
    }
  }

  public publishForm() {

    let dataItem = {
      name: this.formName,
      type: 'form',
      action: 'publish'
    };

    const confRef = this.modalService.open(FormModalComponent, this.modalOption);
    confRef.componentInstance.dataStatus = dataItem;

    confRef.result.then((result) => {
      console.log(result);
      if (result == 'yes') {
        this.formMapService.postPublishForm(this.formID).subscribe(
          data => this.publishFormDetails(data)
        )
      }
    }).catch((error) => {
      console.log(error);
    });


  }

  private publishFormDetails(data) {
    if (data.success) {
      this.isPublishDisable = true;
      this.notiService.showSuccess("Form published successfully", "", 4000);
    } else {
      this.notiService.showError("An error occured", "", 4000);
    }
  }

  // onSelect(event){
  //   console.log('select starte');
  //   console.log(event.selected);
  //   console.log('select end');

  //   if(event.selected.length == 0){
  //     this.isDisabled = true;

  //   }else{
  //     this.isDisabled = false;
  //     event.selected.map(item=>{
  //       this.field_map_idArr.push(item['field_map_id']);
  //     })
  //    // this.field_map_idArr.push(event.selected.field_map_id);
  //    console.log(this.field_map_idArr);
  //    this.field_map_idArr = Array.from(new Set(this.field_map_idArr));
  //     console.log(this.field_map_idArr);

  //   }
  // }

}
