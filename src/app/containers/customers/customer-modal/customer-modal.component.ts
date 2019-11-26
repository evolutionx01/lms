import { Component, OnInit, Input  } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-customer-modal',
  templateUrl: './customer-modal.component.html',
  styleUrls: ['./customer-modal.component.scss']
})
export class CustomerModalComponent implements OnInit {

  @Input() dataStatus;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {

  }

  actionClicked(data){
    this.activeModal.close(data)
  }


}
