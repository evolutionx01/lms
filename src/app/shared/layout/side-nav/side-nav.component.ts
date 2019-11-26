import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common/common.service';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent implements OnInit {

  public selectedMenu: boolean;
  public toggledStatus: boolean;
  public menuItem: any;
  constructor(private commonService: CommonService) { }

  public menuArray = [
    {
      id: 1,
      link: "/dashboard",
      title: "Dashboard",
      class: 'fas fa-layer-group',
      children: null
    },
    {
      id: 2,
      link: "/customer",
      title: "Customers",
      class: 'fas fa-layer-group',
      children: null
    },
    {
      id: 'groups',
      link: "",
      title: "Groups",
      class: 'fas fa-layer-group',
      children: [
        {
          id: 4,
          link: "/groups",
          title: "Form Group",
          class: 'fas fa-layer-group',
          children: null
        },
        {
          id: 5,
          link: "/dropdown",
          title: "Drop Down",
          class: 'fas fa-layer-group',
          "children": null
        }
      ]
    },
    {
      id: 'formlist',
      link: "",
      title: "Form Builder",
      class: 'fas fa-layer-group',
      children: [
        {
          id: 7,
          link: "/formlist/view",
          title: "Forms",
          class: 'fas fa-layer-group',
          children: null
        },
        {
          id: 8,
          link: "/formlist/portalform",
          title: "Provider Portal Forms",
          class: 'fas fa-layer-group',
          "children": null
        }
      ]
    },
    {
      id: 9,
      link: "/dataupload",
      title: "Data Upload",
      class: 'fas fa-layer-group',
      children: null
    },
    {
      id: 11,
      link: "/access_privilege",
      title: "Access Privilege",
      class: 'fas fa-layer-group',
      children: null
    },
    {
      id: 'user',
      link: "",
      title: "User Management",
      class: 'fas fa-layer-group',
      children: [
        {
          id: 13,
          link: "/user/user_details",
          class: 'fas fa-layer-group',
          title: "Users",
          children: null
        },
        {
          id: 14,
          link: "/user/role_details",
          class: 'fas fa-layer-group',
          title: "Roles",
          "children": null
        }
      ]
    },
    {
      id: 15,
      link: "/audit",
      title: "Audit",
      class: 'fas fa-layer-group',
      children: null
    }
  ]

  public menuTest = [
    {
      "prv_id": 5,
      "module_id": 1,
      "module_name": "Dashboard",
      "feature_id": 17,
      "feature_name": "List",
      "f_module_id": null,
      "is_leveled": 0,
      "is_hidden": 1,
      "role_id": 7,
      "parent_prv_id": 0,
      "modules": null,
      "url": "/dashboard",
      "class": "fas fa-tachometer-alt"
    },
    {
      "prv_id": 5,
      "module_id": 1,
      "module_name": "Customers",
      "feature_id": 17,
      "feature_name": "List",
      "f_module_id": null,
      "is_leveled": 0,
      "is_hidden": 1,
      "role_id": 7,
      "parent_prv_id": 0,
      "modules": null,
      "url": "/customer",
      "class": "fas fa-users"
    },
    {
      "module_name": "Groups",
      "module_id":"group",
      "class": "fas fa-folder",
      "modules": [
        {
          "prv_id": 31,
          "module_id": 8,
          "module_name": "Form Group",
          "feature_id": 17,
          "feature_name": "List",
          "f_module_id": null,
          "is_leveled": 0,
          "is_hidden": 1,
          "role_id": 7,
          "parent_prv_id": 0,
          "modules": null,
          "url": "/groups",
          "class": "fas fa-layer-group"
        },
        {
          "prv_id": 34,
          "module_id": 9,
          "module_name": "Drop Down",
          "feature_id": 17,
          "feature_name": "List",
          "f_module_id": null,
          "is_leveled": 0,
          "is_hidden": 1,
          "role_id": 7,
          "parent_prv_id": 0,
          "modules": null,
          "url": "/dropdown",
          "class": "fas fa-caret-square-down"
        }
      ]
    },
    {
      "module_name": "Form Builder",
      "module_id":"formbuilder",
      "class": "fab fa-wpforms",
      "modules": [
        {
          "prv_id": 31,
          "module_id": 8,
          "module_name": "Forms",
          "feature_id": 17,
          "feature_name": "List",
          "f_module_id": null,
          "is_leveled": 0,
          "is_hidden": 1,
          "role_id": 7,
          "parent_prv_id": 0,
          "modules": null,
          "url": "/formlist/view",
          "class": "fas fa-file-alt"
        },
        {
          "prv_id": 34,
          "module_id": 9,
          "module_name": "Provider Portal Forms",
          "feature_id": 17,
          "feature_name": "List",
          "f_module_id": null,
          "is_leveled": 0,
          "is_hidden": 1,
          "role_id": 7,
          "parent_prv_id": 0,
          "modules": null,
          "url": "/formlist/portalform",
          "class": "fas fa-id-badge"
        }
      ]
    },
    {
      "prv_id": 73,
      "module_id": 4,
      "module_name": "CAQH",
      "feature_id": 17,
      "feature_name": "List",
      "f_module_id": null,
      "is_leveled": 0,
      "is_hidden": 1,
      "role_id": 7,
      "parent_prv_id": 18,
      "modules": null,
      "url": "/caqh",
      "class": "fas fa-file-upload"
    },
    {
      "prv_id": 72,
      "module_id": 4,
      "module_name": "Data Import",
      "feature_id": 17,
      "feature_name": "List",
      "f_module_id": null,
      "is_leveled": 0,
      "is_hidden": 1,
      "role_id": 7,
      "parent_prv_id": 15,
      "modules": null,
      "url": "/dataimport",
      "class": "fas fa-file-upload"
    },
    {
      "prv_id": 73,
      "module_id": 4,
      "module_name": "Access Privilege",
      "feature_id": 17,
      "feature_name": "List",
      "f_module_id": null,
      "is_leveled": 0,
      "is_hidden": 1,
      "role_id": 7,
      "parent_prv_id": 15,
      "modules": null,
      "url": "/access_privilege",
      "class": "fas fa-user-cog"
    },
    // {
    //   "module_name": "User Management",
    //   "module_id":"usermodule",
    //   "class": "fas fa-user-edit",
    //   "modules": [
    //     {
    //       "prv_id": 31,
    //       "module_id": 8,
    //       "module_name": "Users",
    //       "feature_id": 17,
    //       "feature_name": "List",
    //       "f_module_id": null,
    //       "is_leveled": 0,
    //       "is_hidden": 1,
    //       "role_id": 7,
    //       "parent_prv_id": 0,
    //       "modules": null,
    //       "url": "/user/user_details",
    //       "class": "fas fa-user-tie"
    //     },
    //     {
    //       "prv_id": 34,
    //       "module_id": 9,
    //       "module_name": "Roles",
    //       "feature_id": 17,
    //       "feature_name": "List",
    //       "f_module_id": null,
    //       "is_leveled": 0,
    //       "is_hidden": 1,
    //       "role_id": 7,
    //       "parent_prv_id": 0,
    //       "modules": null,
    //       "url": "/user/role_details",
    //       "class": "fas fa-user-cog"
    //     }
    //   ]
    // },
    {
      "prv_id": 73,
      "module_id": 4,
      "module_name": "Audit",
      "feature_id": 17,
      "feature_name": "List",
      "f_module_id": null,
      "is_leveled": 0,
      "is_hidden": 1,
      "role_id": 7,
      "parent_prv_id": 15,
      "modules": null,
      "url": "/audit",
      "class": "fab fa-stack-exchange"
    },
    // {
    //   "prv_id": 73,
    //   "module_id": 4,
    //   "module_name": "Reports",
    //   "feature_id": 17,
    //   "feature_name": "List",
    //   "f_module_id": null,
    //   "is_leveled": 0,
    //   "is_hidden": 1,
    //   "role_id": 7,
    //   "parent_prv_id": 15,
    //   "modules": null,
    //   "url": "/reports",
    //   "class": "fas fa-chart-bar"
    // }
  ]



  ngOnInit() {
    //this.getMenuItemDetails();
    this.selectedMenu = false;
    this.commonService.$toggleObservable.subscribe(
      data => {
        this.toggledStatus = data;
      }
    )

  }

  public getMenuItemDetails() {
    let params = {
      role_id: 7,
      module_id: 0
    }

    this.commonService.getMenuItem(params).subscribe(
      data => {
        this.getMenuItemData(data)
      }
    )
  }

  private getMenuItemData(data){
    this.menuItem = data.auth_modules;
    console.log(this.menuItem)
  }

  activateClass(subModule) {
    subModule.active = !subModule.active;
  }
  clickEvent(event) {
    // event.target.addClass('active')
    //this.selectedMenu = !this.selectedMenu;
    console.log(event)
    console.log(event.target)
  }
}
