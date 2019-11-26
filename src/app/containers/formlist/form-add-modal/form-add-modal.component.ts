import { Component, OnInit ,Input} from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-form-add-modal',
  templateUrl: './form-add-modal.component.html',
  styleUrls: ['./form-add-modal.component.scss']
})
export class FormAddModalComponent implements OnInit {

  @Input() dataStatus;
  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
    console.log(this.dataStatus);
  }
  actionClicked(data){
    
    this.activeModal.close(data)
  }
}
