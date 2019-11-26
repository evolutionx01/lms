import { Component, OnInit,Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-portalmodal',
  templateUrl: './portalmodal.component.html',
  styleUrls: ['./portalmodal.component.scss']
})
export class PortalmodalComponent implements OnInit {
  @Input() dataStatus;
  @Input() datatype;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

  actionClicked(data){
    this.activeModal.close(data)
  }

}
