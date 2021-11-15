import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';

// RnAngularCore
import { RnAppConfig, RN_APP_CONFIG } from '../../configuration/_configuration';

@Component({
  selector: 'rn-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Output() sidenavToggle = new EventEmitter<void>();
  loggedIn: boolean = false;
  appName: string = 'RnAngularCore';

  constructor(
    @Inject(RN_APP_CONFIG)
    private config: RnAppConfig
  ) {
    this.appName = this.config.appName;
  }
  
  // interfaces
  ngOnInit(): void { /* placeholder: ngOnInit() */ }

  // custom
  onToggleSidenav() {
    this.sidenavToggle.emit();
  }

  setAppName = (appName: string) => {
    this.appName = appName;
  }
}
