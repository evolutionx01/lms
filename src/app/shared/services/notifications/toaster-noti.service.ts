import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';


@Injectable({
  providedIn: 'root'
})
export class ToasterNotiService {

  constructor(private toast:ToastrService) { }

  public showSuccess(message,title?,duration?) {
    this.toast.success(message, title,{
      closeButton:true,
      timeOut:duration,
      progressBar:true,
      positionClass: 'toast-top-right'});
  }
  public showError(message,title?,duration?) {
    this.toast.error(message, title,{
      closeButton:true,
      timeOut:duration,
      progressBar:true,
      positionClass: 'toast-top-right'});
  }
 
}
