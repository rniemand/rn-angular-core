import { Injectable } from "@angular/core";

export interface HomeShortcutAction {
  title: string;
  btnClass?: string;
  routerLink: string[];
}

export interface HomeShortcut {
  title: string;
  icon: string;
  actions: HomeShortcutAction[];
}

export interface SideNavShortcut {
  title: string;
  icon: string;
  routerLink: string[];
  loggedIn?: boolean;
  routerLinkActiveOptions?: any;
}

@Injectable()
export class ShortcutsService {
  private _shortcuts: { [key:string]: HomeShortcut[] } = {};
  private _homeShortcuts: HomeShortcut[] = [];
  private _sideNavShortcuts: SideNavShortcut[] = [];

  // public
  public addHomeShortcut = (shortcut: HomeShortcut) => {
    this.addShortcut(shortcut, 'home');
  }

  public addShortcut = (shortcut: HomeShortcut, category: string) => {
    if(!this._shortcuts.hasOwnProperty(category)) {
      this._shortcuts[category] = [];
    }

    this._shortcuts[category].push(shortcut);
  }

  public getHomeShortcuts = () => {
    return this.getShortcuts('home');
  }

  public getShortcuts = (category: string) => {
    if(!this._shortcuts.hasOwnProperty(category)) {
      return [];
    }

    return this._shortcuts[category];
  }

  public addSideNavShortcut = (shortcut: SideNavShortcut) => {
    this._sideNavShortcuts.push({
      ...shortcut,
      loggedIn: shortcut?.loggedIn ?? false,
      routerLinkActiveOptions: shortcut?.routerLinkActiveOptions ?? {}
    });
  }

  public getSideNavShortcuts = () => {
    return this._sideNavShortcuts;
  }
}
