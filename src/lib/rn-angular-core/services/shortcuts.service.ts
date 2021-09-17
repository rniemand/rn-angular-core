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
  private _homeShortcuts: HomeShortcut[] = [];
  private _sideNavShortcuts: SideNavShortcut[] = [];

  // public
  public addHomeShortcut = (shortcut: HomeShortcut) => {
    this._homeShortcuts.push(shortcut);
  }

  public getHomeShortcuts = () => {
    return this._homeShortcuts;
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
