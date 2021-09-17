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
  public addHomeShortcut = (shortcut: HomeShortcut): ShortcutsService => {
    this.addShortcut(shortcut, 'home');
    return this;
  }

  public addShortcut = (shortcut: HomeShortcut, category: string): ShortcutsService => {
    if(!this._shortcuts.hasOwnProperty(category)) {
      this._shortcuts[category] = [];
    }

    this._shortcuts[category].push(shortcut);
    return this;
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

  public addSideNavShortcut = (shortcut: SideNavShortcut): ShortcutsService => {
    this._sideNavShortcuts.push({
      ...shortcut,
      loggedIn: shortcut?.loggedIn ?? false,
      routerLinkActiveOptions: shortcut?.routerLinkActiveOptions ?? {}
    });

    return this;
  }

  public getSideNavShortcuts = () => {
    return this._sideNavShortcuts;
  }
}
