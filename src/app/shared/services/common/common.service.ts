import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, Subject  } from 'rxjs';
import { ApiServiceService } from '../lms-api-service/api-service.service';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  	constructor(
		private apiService: ApiServiceService
	  ) { }
	
	private toggle = new Subject<any>();
	public $toggleObservable = this.toggle.asObservable();
 
	toggleClicked(status:boolean){
		this.toggle.next(status);	
	}

	private custAdd = new Subject<any>();
	public $custAddObservable = this.custAdd.asObservable();

	customerAdded(status:boolean){
		this.custAdd.next(status);	
	}

	private userEmail = new Subject<any>();
	public $userIdObservable = this.userEmail.asObservable();

	userEmailFn(id){
		this.userEmail.next(id);
	}

	public getMenuItem(params) {
		return this.apiService.post('auth/parentMenuModules', params);
	  }




}
