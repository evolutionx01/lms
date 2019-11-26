import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToasterNotiService } from '../../../shared/services/notifications/toaster-noti.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModalOptions, NgbModal, NgbPanelChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { RoleAccessService } from '../services/role-access/role-access.service';

@Component({
  selector: 'app-role-access',
  templateUrl: './role-access.component.html',
  styleUrls: ['./role-access.component.scss']
})
export class RoleAccessComponent implements OnInit {

  public activeIds: string[] = [];
  public panels = [0, 1, 2, 3];
  public panelData: any;

  constructor(
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private router: Router,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private toast: ToasterNotiService,
    private roleAccessService: RoleAccessService
  ) { }

  ngOnInit() {
    this.getModuleData()

  }

  public getModuleData() {
    let getModuleData = {
      module_id: 0
    }
    this.roleAccessService.getModuleDetails(getModuleData).subscribe(
      data => {
        console.log(data);
        this.moduleData(data)
      })
  }

  private moduleData(data) {
    console.log(data)
    this.panelData = data.auth_modules;
    console.log(this.panelData)
  }


  public openAll() {
    this.activeIds = this.panelData.map(p => "preventchange-" + p.module_id);
    console.log(this.activeIds);
  }

  public openPanel(data){
    this.activeIds.push(data);
    console.log(this.activeIds)
  }

}
