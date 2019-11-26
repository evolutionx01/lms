import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common/common.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  test: string;
  userName: any;
  public toggleStatus:boolean = false;
  constructor(
    private commonService: CommonService,
    private router: Router,
  ) { }

  ngOnInit() {

    this.userName = localStorage.getItem('userEmail')
  }

  clickEvent(): void{
    this.toggleStatus = !this.toggleStatus;
  	this.commonService.toggleClicked(this.toggleStatus);
  }

  logOut(){
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['/signin']);
  }

}
