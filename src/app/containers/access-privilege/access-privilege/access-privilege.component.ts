import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AccessPrivilegeViewService } from '../service/access-privilege-view/access-privilege-view.service';

@Component({
  selector: 'app-access-privilege',
  templateUrl: './access-privilege.component.html',
  styleUrls: ['./access-privilege.component.scss']
})
export class AccessPrivilegeComponent implements OnInit {

  @Input() dataStatus;

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private accessPrivilegeViewService: AccessPrivilegeViewService,
  ) { }

  ngOnInit() {
    console.log(this.dataStatus)   

  }


  actionClicked(data) {
    this.activeModal.close(data)
  }

}


