import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { NavigationExtras, Router } from "@angular/router";

// RnAngularCore
import { LoggerFactory, LoggerInstance } from '../../logger/_logger';

export interface Crumb {
  title?: string;
  icon?: string;
  isIcon?: boolean;
  isText?: boolean;
  isLink?: boolean;
  lastEntry?: boolean;
  routerLink?: any[];
  routerExtras?: NavigationExtras;
}

@Component({
  selector: 'rn-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss']
})
export class BreadcrumbsComponent implements OnInit, OnChanges {
  @Input('crumbs') crumbs: Crumb[] = [];
  @Input('useClass') useClass: string = 'rn-breadcrumbs';

  private _logger: LoggerInstance;

  constructor(
    private router: Router,
    private loggerFactory: LoggerFactory
  ) {
    this._logger = this.loggerFactory.getInstance('BreadcrumbsComponent');
  }
  
  // public
  ngOnInit(): void {
    this._logger.traceInit();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this._logger.traceOnChanges(changes);

    if(changes?.crumbs) {
      this._initCrumbs(changes.crumbs.currentValue);
    }
  }

  follow = (crumb: Crumb) => {
    if(!crumb?.routerLink) { return; }
    this._logger.traceMethod('follow');
    this.router.navigate(crumb.routerLink, crumb.routerExtras);
  }

  setCrumbs = (crumbs: Crumb[]) => {
    this._logger.traceMethod('setCrumbs');
    this._initCrumbs(crumbs);
  }

  updateCrumb = (index: number, crumb: Crumb) => {
    this._logger.traceMethod('updateCrumb');

    if(this.crumbs.length >= (index + 1)) {
      this.crumbs[index] = this._finaliseCrumb({
        ...this.crumbs[index],
        ...crumb
      });

      this._flagLastCrumb(this.crumbs);
    }
  }


  // internal
  private _initCrumbs = (crumbs: Crumb[]) => {
    this._logger.traceMethod('_initCrumbs');
    const parsed: Crumb[] = [];
    
    parsed.push(this._finaliseCrumb({
      icon: 'home',
      routerLink: ['/']
    }));

    (crumbs || []).forEach((crumb: Crumb) => {
      parsed.push(this._finaliseCrumb(crumb));
    });

    this._flagLastCrumb(parsed);
    this.crumbs = parsed;
  }

  private _finaliseCrumb = (crumb: Crumb, forceLast: boolean = false): Crumb => {
    return {
      title: crumb.title,
      icon: crumb.icon,
      isIcon: (crumb?.icon?.length ?? 0) > 0,
      lastEntry: forceLast,
      routerLink: crumb.routerLink,
      isText: (crumb?.title?.length ?? 0) > 0,
      isLink: crumb.routerLink != undefined,
      routerExtras: crumb?.routerExtras
    };
  }

  private _flagLastCrumb = (crumbs: Crumb[]) => {
    this._logger.traceMethod('_flagLastCrumb');

    crumbs.forEach((c: Crumb) => { c.lastEntry = false; });
    crumbs[crumbs.length - 1].lastEntry = true;
  }
}
