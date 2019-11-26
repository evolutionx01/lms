import { Component, OnInit, Input  } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-dataupload-modal',
  templateUrl: './dataupload-modal.component.html',
  styleUrls: ['./dataupload-modal.component.scss']
})
export class DatauploadModalComponent implements OnInit {



  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {

  }

  public actionClicked(data){
    this.activeModal.close(data)
  }



}
