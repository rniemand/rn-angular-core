import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';

// RnAngularCore
import { LoggerFactory, LoggerInstance } from '../../logger/logger';
import { AuthService, ShortcutsService, SideNavShortcut } from '../../services/services';

@Component({
  selector: 'rn-shortcuts',
  templateUrl: './shortcuts.component.html',
  styleUrls: ['./shortcuts.component.scss']
})
export class ShortcutsComponent implements OnInit, OnDestroy {
  loggedIn: boolean = false;
  navLinks: SideNavShortcut[] = [];

  private _logger: LoggerInstance;
  
  constructor(
    private loggerFactory: LoggerFactory,
    private authService: AuthService,
    private shortcuts: ShortcutsService
  ) {
    this._logger = this.loggerFactory.getInstance('ShortcutsComponent');
  }
  

  // interface methods
  ngOnInit = () => { }

  ngOnDestroy = () => {  }
}
