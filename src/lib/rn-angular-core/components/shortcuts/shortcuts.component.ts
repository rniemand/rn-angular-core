import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

// RnAngularCore
import { LoggerFactory, LoggerInstance } from '../../logger/logger';
import { AuthService, HomeShortcut, HomeShortcutAction, ShortcutsService } from '../../services/services';

@Component({
  selector: 'rn-shortcuts',
  templateUrl: './shortcuts.component.html',
  styleUrls: ['./shortcuts.component.scss']
})
export class ShortcutsComponent implements OnInit, OnDestroy {
  @Input('category') category: string = 'home';
  loggedIn: boolean = false;
  shortcuts: HomeShortcut[] = [];
  hasShortcuts: boolean = false;

  private _logger: LoggerInstance;
  private _subscriptions: Subscription[] = [];
  
  constructor(
    private _loggerFactory: LoggerFactory,
    private _authService: AuthService,
    private _shortcuts: ShortcutsService,
    private _router: Router
  ) {
    this._logger = this._loggerFactory.getInstance('ShortcutsComponent');
  }
  
  // interface
  ngOnInit = () => {
    this._logger.traceInit();

    this.shortcuts = this._shortcuts.getShortcuts(this.category).map((entry) => {
      entry.actions.map(action => {
        action.btnClass = action?.btnClass ?? 'default';
        return action;
      });

      return entry;
    });

    this._subscriptions.push(this._authService.authChanged.subscribe(
      (loggedIn: boolean) => {
        this.loggedIn = loggedIn;
      }
    ));

    this.loggedIn = this._authService.loggedIn;
    this.hasShortcuts = this.shortcuts.length > 0;
  }

  ngOnDestroy(): void {
    this._logger.traceDestroy();
    this._subscriptions?.forEach(s => s?.unsubscribe());
  }

  // template
  handleAction = (action: HomeShortcutAction) => {
    this._router.navigate(action.routerLink);
  }
}
