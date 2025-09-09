import { Component, OnInit } from '@angular/core';
import { MainFooterComponent } from "./main-footer/main-footer.component";
import { ControlSidebarComponent } from "./control-sidebar/control-sidebar.component";

@Component({
  standalone:false,
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],

})
export class LayoutComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
