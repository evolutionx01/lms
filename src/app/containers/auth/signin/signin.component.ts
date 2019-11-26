import { Component, OnInit } from '@angular/core';
import { animate } from '@angular/animations';
import { ToasterNotiService } from '../../../shared/services/notifications/toaster-noti.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { SigninService } from './signin.service';
import { JwtService } from '../jwt.service';
import { Router } from '@angular/router';
import { CommonService } from '../../../shared/services/common/common.service';
import * as GibberishAES from  '../../../thirdparty/gibberish-aes-1.0.0.min.js';



@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  key: string;
  value: string;
  showResendButton: boolean;
  public lastNumber: any;
  public mobileNumber: any;
  public otpErrorMessage: boolean;
  public emailId: any;
  public otpView: boolean;
  public loginForm: FormGroup;
  public otpForm: FormGroup;

  public timeLeft: number;
  public interval;
  private special = /^[a-zA-Z0-9]*$/;
  private emailPattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  constructor(
    private toast: ToasterNotiService,
    private formBuilder: FormBuilder,
    private signinService: SigninService,
    private jwtService: JwtService,
    private router: Router,
    private commonService: CommonService
  ) { }

  ngOnInit() {
    
    this.key = 'fjsnwROzrbx/6sFGJ3+YHUqwzK246x8OrkmDycq1090=';
  //   var stringEncrypted = GibberishAES.enc(this.value, this.key);
   
  //  console.log(stringEncrypted);
    this.showResendButton = false;
    localStorage.clear();
    this.otpView = false;
    this.otpErrorMessage = false;
    this.buildLoginForm();
    this.buildOtpForm();
  }

  buildLoginForm() {
    this.loginForm = this.formBuilder.group({
      email: new FormControl('', [Validators.required, Validators.pattern(this.emailPattern)]),
      password: new FormControl('', Validators.required)
    })
  }

  buildOtpForm() {
    this.otpForm = this.formBuilder.group({
      otp: new FormControl('', Validators.required)
    })
  }

  public onLogin() {


    this.loginForm.value.password = GibberishAES.enc(this.loginForm.value.password, this.key);

    this.signinService.login(this.loginForm.value).subscribe(
      data => this.handleLogin(data)
    )

  }
  private handleLogin(data) {
    if (data.success) {
      this.otpView = true;
      this.emailId = this.loginForm.value.email;
      this.mobileNumber = JSON.stringify(data.mobile_num);
      this.lastNumber = this.mobileNumber.slice(5);
      this.timeLeft = 180;
      this.startTimer();
    }
    else {
      this.otpView = false;
      this.loginForm.reset();
      this.toast.showError(data.error, "", 1000);
    }
  }

  public onOtpVerify() {

    let dataParams = {
      email: this.emailId,
      u_otp: this.otpForm.value.otp
    }

    this.signinService.otpValidation(dataParams).subscribe(
      data => this.handleOtp(data)
    )

  }

  private handleOtp(data) {
    if (data.success) {
      this.otpErrorMessage = false;
      localStorage.setItem('userId', data.user);
      localStorage.setItem('userEmail', this.loginForm.value.email)

      this.toast.showSuccess("Logged In Successfully", "", 1000);
      this.jwtService.setToken(data.token);
      this.router.navigate(['/dashboard']);
      clearInterval(this.interval);
    } else {
      this.toast.showError(data.error, "", 1000);
      this.otpErrorMessage = true;
      this.otpForm.reset();
    }
  }

  onChange(event) {
    //console.log(event)
  }

  onOtpChange(event) {
    //console.log(event)
    this.otpErrorMessage = false;
  }

  public startTimer() {
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.showResendButton = true;
      }
    }, 1000)
  }

  public resendOtp(){
    this.showResendButton = false;
    let dataParams = {
      email: this.emailId
    }
    this.signinService.resendOtp(dataParams).subscribe(
      data=>{
        //console.log(data);
        this.resendSuccess(data)
      }
    )
  }
  private resendSuccess(data){
    if(data.success){
      this.timeLeft = 180;
      this.toast.showSuccess('OTP Resent Successfully', "", 1000);
    }else{
      clearInterval(this.interval);
    }
  }

}
