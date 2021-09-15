import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/lib/rn-angular-core/services/auth.service';
import { LoggerFactory } from 'src/lib/rn-angular-core/services/logger';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    private _authService: AuthService,
    private _loggerFactory: LoggerFactory
  ) { }

  ngOnInit(): void {
    this._loggerFactory.getInstance('HomeComponent').warn('HELLO');
    this._authService.login('username', 'password');
  }

}
