import { Component, OnInit } from '@angular/core';
import { AuthService, Crumb, ShortcutsService } from 'src/lib/public_api';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  category: string = 'home';
  crumbs: Crumb[] = [
    { title: 'Home', routerLink: ['/'] }
  ];

  constructor(
    private _shortcuts: ShortcutsService,
    private _authService: AuthService
  ) {
    this._shortcuts.addHomeShortcut({
      icon: 'home',
      title: 'Home 2',
      actions: [
        {
          title: 'Action',
          routerLink: ['']
        }
      ]
    }).addShortcut({
      icon: 'home',
      title: 'Test',
      actions: [
        {
          title: 'Action',
          routerLink: ['']
        }
      ]
    }, 'test');
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.category = 'test';
    }, 2000);

    console.log('ActiveHomeId',
      this._authService.getIntUserAttribute('ActiveHomeId')
    );
  }

}
