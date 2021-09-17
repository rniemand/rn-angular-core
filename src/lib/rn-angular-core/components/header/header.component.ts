import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { RnAppConfig, RN_APP_CONFIG } from 'src/lib/public_api';

@Component({
  selector: 'rn-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Output() sidenavToggle = new EventEmitter<void>();
  loggedIn: boolean = false;
  appName: string = 'RnAngularCore';

  constructor(@Inject(RN_APP_CONFIG) private config: RnAppConfig) {
    this.appName = this.config.appName;
  }
  
  ngOnInit(): void { /* placeholder: ngOnInit() */ }

  onToggleSidenav() {
    this.sidenavToggle.emit();
  }

}
