import { Component, OnInit } from '@angular/core';
import { CaqhViewService } from '../services/caqh-view/caqh-view.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToasterNotiService } from '../../../shared/services/notifications/toaster-noti.service';
import { environment } from '../../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-caqh-view',
  templateUrl: './caqh-view.component.html',
  styleUrls: ['./caqh-view.component.scss']
})
export class CaqhViewComponent implements OnInit {

  public selectedListItem: string
  public imgUrl: any
  public provider_id: any
  public imageContent: any;
  public baseUrl: any;
  public showSlider: boolean;
  public selectedItem: any;

  public listOfMenu = [
    { id: 0, name: 'Personal Information', type: 'personal_info' },
    { id: 1, name: 'Professional IDS', type: 'professional_ids' },
    { id: 2, name: 'Education', type: 'education' },
    { id: 3, name: 'Professional Traning', type: 'professional_training' },
    { id: 4, name: 'Specialties', type: 'specialities' },
    { id: 5, name: 'Hospital Affiliation', type: 'hospital_affialation' },
    { id: 6, name: 'Professional Liability Insurance', type: 'professional_insurance' },
    { id: 7, name: 'Employment Information', type: 'employment_information' },
    { id: 8, name: 'Professional References', type: 'professional_reference' }
  ]

  constructor(
    private caqhViewService: CaqhViewService,
    private spinner: NgxSpinnerService,
    private notiService: ToasterNotiService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.baseUrl = `${environment.apiDownloadUrl}`

    this.activatedRoute.params.subscribe(
      data => {
        console.log(data)
        this.provider_id = data.id;
      }
    );
    this.selectedListItem = 'personal_info'
    this.onLoad()

  }

  public onLoad() {
    this.selectedItem = 0
    this.spinner.show()
    let dataParams = {
      url_code: 'personal_info',
      provider_id:  this.provider_id,
      is_save: 0
    }

    this.caqhViewService.getCaqh(dataParams).subscribe(
      data => {
        this.caqhPreviewDetails(data)
      }
    )
  }

  public save() {
    this.spinner.show()
    let dataParams = {
      url_code: this.selectedListItem,
      provider_id:  this.provider_id,
      is_save: 1
    }

    this.caqhViewService.getCaqh(dataParams).subscribe(
      data => {
        console.log(data)
        this.caqhSaveDetails(data)
        this.spinner.hide()
      }
    )
  }
  private caqhSaveDetails(data) {
    this.spinner.hide();
    if (data.success) {
      this.notiService.showSuccess(data.message, '', 4000)
    } else {
      this.notiService.showSuccess(data.error, '', 4000)
    }
  }

  public actionClicked(type, id) {

    this.selectedItem = id;

    if (type) {
      this.spinner.show()
      this.selectedListItem = type
      let dataParams = {
        url_code: this.selectedListItem,
        provider_id:  this.provider_id,
        is_save: 0
      }

      this.caqhViewService.getCaqh(dataParams).subscribe(
        data => {
          console.log(data)
          this.caqhPreviewDetails(data)
        }
      )
    }

  }

  private caqhPreviewDetails(data) {
    this.spinner.hide();

    if (data.success) {

      if (data.message.length > 1) {
        this.showSlider = true
        this.imageContent = data.message
      } else {
        this.showSlider = false
        this.imgUrl = `${environment.apiDownloadUrl}` + data.message[0]
      }
    } else {
      this.notiService.showError(data.error, '', 4000)
      this.router.navigate(['/caqhview']);
    }
  } 4

  customOptions: any = {
    loop: true,
    autoplay: false,
    autoplayTimeout: 3000,
    autoplayHoverPause: true,

    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    navText: ["<i class='fas fa-chevron-circle-left'></i>", "<i class='fas fa-chevron-circle-right'></i>"],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 1
      },
      940: {
        items: 1
      },
      1200: {
        items: 1
      }
    },
    nav: true
  }

  public menuClicked(event, id) {
    console.log(id)
    // this.selectedItem = id;
  }

}
