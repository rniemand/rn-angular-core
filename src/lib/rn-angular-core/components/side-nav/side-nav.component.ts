import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { RnCoreComponent } from '../../enums/_enums';

// RnAngularCore
import { LoggerFactory, LoggerInstance } from '../../logger/_logger';
import { AuthService, ShortcutsService, SideNavShortcut } from '../../services/_services';

@Component({
  selector: 'rn-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent implements OnInit, OnDestroy {
  @Output() closeSidenav = new EventEmitter<void>();

  loggedIn: boolean = false;
  navLinks: SideNavShortcut[] = [];

  private _logger: LoggerInstance;
  private _subscriptions: Subscription[] = [];
  
  constructor(
    private loggerFactory: LoggerFactory,
    private authService: AuthService,
    private shortcuts: ShortcutsService
  ) {
    this._logger = this.loggerFactory.getInstance(RnCoreComponent.SideNav);
    this.loggedIn = this.authService.loggedIn;

    this._subscriptions.push(this.authService.authChanged.subscribe(this._onAuthChanged));
    this._refreshNavLinks();
  }

  // interface methods
  ngOnInit() {
    this._logger.traceMethod('ngOnInit');
  }

  ngOnDestroy() {
    this._logger.traceMethod('ngOnDestroy');
    this._subscriptions?.forEach(s => s?.unsubscribe());
  }

  // template methods
  onClose = () => {
    this._logger.traceMethod('onClose');
    this.closeSidenav.emit();
  }

  logout = () => {
    if(!confirm('Log out?')) { return; }
    this._logger.traceMethod('logout');
    this.closeSidenav.emit();
    this.authService.logout();
  }

  // internal methods
  private _onAuthChanged = (loggedIn: boolean) => {
    this._logger.traceMethod('_onAuthChanged');
    this.loggedIn = loggedIn;
    this._refreshNavLinks();
  }

  private _refreshNavLinks = () => {
    this._logger.traceMethod('_refreshNavLinks');
    const loggedIn = this.loggedIn;

    this.navLinks = this.shortcuts.getSideNavShortcuts().reduce((memo: SideNavShortcut[], current) => {
      if(current.loggedIn && !loggedIn) { return memo; }
      memo.push(current);
      return memo;
    }, []);
  }
}
