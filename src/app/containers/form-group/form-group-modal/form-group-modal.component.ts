import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-form-group-modal',
  templateUrl: './form-group-modal.component.html',
  styleUrls: ['./form-group-modal.component.scss']
})
export class FormGroupModalComponent implements OnInit {
 
  @Input() dataStatus;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {


  }

  actionClicked(data) {
    this.activeModal.close(data)
  }

}
