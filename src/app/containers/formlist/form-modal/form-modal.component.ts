import { Component, OnInit ,Input} from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-form-modal',
  templateUrl: './form-modal.component.html',
  styleUrls: ['./form-modal.component.scss']
})
export class FormModalComponent implements OnInit {
  @Input() dataStatus;
  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
    console.log(this.dataStatus);
  }
  actionClicked(data){
    
    this.activeModal.close(data)
  }
}
