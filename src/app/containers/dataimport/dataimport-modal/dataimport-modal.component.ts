import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-dataimport-modal',
  templateUrl: './dataimport-modal.component.html',
  styleUrls: ['./dataimport-modal.component.scss']
})
export class DataimportModalComponent implements OnInit {

  @Input() error_data;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
    console.log(this.error_data)
    this.error_data.map((item, index) => {
      
    })
  }



  actionClicked(data) {
    this.activeModal.close(data)
  }
}
