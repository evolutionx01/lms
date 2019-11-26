import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ApiServiceService } from '../../shared/services/lms-api-service/api-service.service';
import { ToasterNotiService } from '../../shared/services/notifications/toaster-noti.service';
import { SimplePdfViewerComponent, SimplePDFBookmark } from 'simple-pdf-viewer';
import { TestGridService } from '../../shared/services/test-grid-services/test-grid.service';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-test-grid',
  templateUrl: './test-grid.component.html',
  styleUrls: ['./test-grid.component.css']
})
export class TestGridComponent implements OnInit {
  config: object;
  headers: any;
  error: any;
  public filePath: any;
  public pdfForm: FormGroup;
  public selected = [];
  closeResult: string;

  @ViewChild(SimplePdfViewerComponent) private pdfViewer: SimplePdfViewerComponent;

  constructor(private apiService: ApiServiceService,
    private notiService: ToasterNotiService,
    private testService: TestGridService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal) { }

  ngOnInit() {
    this.showConfig();
    this.openDocument("../../../assets/test_pdf.pdf");
    this.buildForm()
  }
  buildForm() {
    this.pdfForm = this.formBuilder.group({
      page: new FormControl('')
    });
    this.pdfForm.controls['page'].setValue(this.pdfViewer.getCurrentPage());
  }
  showConfig() {
    this.testService.getCustomers()
      .subscribe(data => {
        this.config = data['customerslist'];
        console.log(this.config);

      },
        error => {
          this.notiService.showError(error, "", 4000);

        }
      );
    
      this.testService.getDropdownVal().subscribe(
        data=>{
          console.log(data);
        }
      )
  }
  
  // how to open PDF document
  openDocument(document: any) {
    this.pdfViewer.openUrl(document);

  }
  fileChange(event) {
    let fileList: FileList = event.target.files;
    let reader = new FileReader();
    if (fileList.length > 0) {
      let file: File = fileList[0];
      let formData: FormData = new FormData();
      formData.append('uploaded_file_id_val','0');
      formData.append('form_name','New testing form aug 22');
      formData.append('file_format_id_val','1');
      formData.append('created_by','6882');
      formData.append('upload_file', file);

      this.testService.uploadPdfFile(formData).subscribe(
        data => {
          console.log(data);
        },
        error => {
          this.notiService.showError(error, "", 4000);
        }
      );
    }
  }

  pageChanged(val){
    switch (val){
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
  searchPage(event){
    if(event.keyCode == 13){
      this.pdfViewer.navigateToPage(event.target.value);
    }
  }
  edit(rowData){
    console.log(rowData);
  }
  onSelect({ selected }) {
    console.log('Select Event', selected, this.selected);
  }
  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }
}
