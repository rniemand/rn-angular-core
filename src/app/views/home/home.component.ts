import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
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
    private _authService: AuthService,
    @Inject(HttpClient)
    private http: HttpClient,
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

    // if(this._authService.currentUser) {
    //   const user = this._authService.currentUser;

    //   console.log('ActiveHomeId',
    //     user.getIntAttribute('ActiveHomeId')
    //   );
    // }
    
    // let url_ = "http://localhost:5000/api/Chore/add";
    // url_ = url_.replace(/[?&]$/, "");
    // const content_ = JSON.stringify({});
    // let options_ : any = {
    //     body: content_,
    //     observe: "response",
    //     responseType: "blob",
    //     headers: new HttpHeaders({
    //         "Content-Type": "application/json",
    //         "Accept": "application/json"
    //     })
    // };

    // this.http.request("post", url_, options_).toPromise().then(
    //   (response: any) => {
    //     console.log(response);
    //   },
    //   (error: any) => {
    //     console.log(error);
    //   }
    // );
  }

}
