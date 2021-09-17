import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LoggerFactory, LoggerInstance } from 'src/lib/public_api';
import { AuthResult, AuthService, UserDto } from 'src/lib/rn-angular-core/services/auth.service';
import { UiService } from 'src/lib/rn-angular-core/services/ui.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  username = new FormControl('', [Validators.required, Validators.minLength(1)]);
  password = new FormControl('', [Validators.required, Validators.minLength(1)]);
  loggedIn: boolean = false;
  currentUser?: UserDto;
  loginError: string = '';

  private _subscriptions: Subscription[] = [];
  private _logger: LoggerInstance;

  constructor(
    private authService: AuthService,
    private loggerFactory: LoggerFactory,
    private router: Router,
    private uiService: UiService
  ) {
    this._logger = this.loggerFactory.getInstance('Login');
  }


  // Interface methods
  ngOnInit(): void {
    this._logger.traceMethod('ngOnInit');
    this.loggedIn = this.authService.loggedIn;
    this.currentUser = this.authService.currentUser;

    this._subscriptions.push(this.authService.authChanged.subscribe(
      (loggedIn: boolean) => {
        this.loggedIn = loggedIn;
        this.currentUser = this.authService.currentUser;
      }
    ));
  }

  ngOnDestroy(): void {
    this._logger.traceMethod('ngOnDestroy');
    this._subscriptions.forEach((sub) => {
      sub?.unsubscribe();
    });
  }


  // Template methods
  validCreds = () => {
    if(this.username.invalid || this.password.invalid)
      return true;

    return false;
  }

  login = () => {
    this._logger.traceMethod('login');
    
    this.loginError = '';
    this.authService.login(this.username.value, this.password.value).then(
      (result: AuthResult) => {
        if(result?.error) {
          this.loginError = `Error logging in: ${result.error}`;
        }

        if(result.loggedIn) {
          this.router.navigate(['/home']);
          this.uiService.notify('Logged in');
        }
      }
    );
  }

  logout = () => {
    this._logger.traceMethod('logout');
    this.authService.logout();
  }

  userFullName = () => {
    if(!this?.currentUser?.firstName) {
      return '';
    }

    return `${this.currentUser.firstName} ${this.currentUser.lastName}`;
  }
}
