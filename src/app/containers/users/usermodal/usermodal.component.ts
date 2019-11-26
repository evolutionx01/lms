import { Component, OnInit,Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-usermodal',
  templateUrl: './usermodal.component.html',
  styleUrls: ['./usermodal.component.scss']
})
export class UsermodalComponent implements OnInit {
  @Input() statustype;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }
  actionClicked(data){
    this.activeModal.close(data)
  }

}
