import { Component, OnInit } from '@angular/core';
import { LoggerFactory } from 'src/lib/public_api';
import { AuthService } from 'src/lib/rn-angular-core/services/auth.service';

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
    // this._authService.login('username', 'password');

    console.log('here');
  }

}
