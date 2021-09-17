import { ActivatedRoute, Params, Router } from "@angular/router";
import { Subject, Subscription } from "rxjs";

enum ParamType {
  Unknown = 'unknown',
  Number = 'number',
  String = 'string'
}

interface ParamCloneOptions {
  remove?: string[];
}

export class CurrentRouteUtil {
  public queryParamsChanged = new Subject<Params>();
  public paramsChanged = new Subject<Params>();
  public queryParams: Params = {};
  public params: Params = {};

  private _queryParamKeys: string[] = [];
  private _paramKeys: string[] = [];
  private _queryParamTypes: { [key: string]: ParamType; } = {};
  private _paramTypes: { [key: string]: ParamType; } = {};
  private _subs: Subscription[] = [];
  private _enableRouteSyncing: boolean = false;
  private _router?: Router;
  private _initialized: boolean = false;

  constructor(
    private _route: ActivatedRoute,
    private _loggingEnabled: boolean = false
  ) { }

  // public
  public dispose = () => {
    this._log('dispose()');
    this._subs?.forEach(s => { s?.unsubscribe(); });
  }

  public trackQueryParams = (queryParams: Params) => {
    return this
      .updateQueryParams(queryParams)
      .updateQueryParams(this._route.snapshot.queryParams);
  }

  public trackParams = (params: Params) => {
    return this
      .updateParams(params)
      .updateParams(this._route.snapshot.params);
  }

  public enableRouteSyncing = (router: Router) => {
    this._router = router;
    this._enableRouteSyncing = true;
    return this;
  }

  public updateQueryParams = (queryParams: Params) => {
    this._log('updateQueryParams()', queryParams);
    
    (Object.getOwnPropertyNames(queryParams) ?? []).forEach(key => {
      // Ensure we are tracking all new parameters
      if(this._queryParamKeys.indexOf(key) === -1) {
        this._queryParamKeys.push(key);
        this._queryParamTypes[key] = this._workType(queryParams[key]);
        this.queryParams[key] = queryParams[key];
        return;
      }

      // Ensure that all parameter values are updated
      this._updateQueryParam(key, queryParams[key]);
    });

    this._syncRoute();
    
    return this;
  }

  public updateParams = (params: Params) => {
    this._log('updateParams()', params);
    
    (Object.getOwnPropertyNames(params) ?? []).forEach(key => {
      // Ensure we are tracking all new parameters
      if(this._paramKeys.indexOf(key) === -1) {
        this._paramKeys.push(key);
        this._paramTypes[key] = this._workType(params[key]);
        this.params[key] = params[key];
        return;
      }

      // Ensure that all parameter values are updated
      this._updateParam(key, params[key]);
    });

    this._syncRoute();
    
    return this;
  }

  public mergeSnapshotQueryParams = () => {
    this.updateQueryParams(this._route.snapshot.queryParams);
    return this;
  }

  public removeQueryParam = (key: string) => {
    if(this._queryParamKeys.indexOf(key) === -1) {
      return this;
    }

    this._queryParamKeys.splice(this._queryParamKeys.indexOf(key), 1);
    delete this._queryParamTypes[key];
    delete this.queryParams[key];
    this._fireQueryParamsChanged();
    this._syncRoute();

    return this;
  }

  public cloneQueryParams = (options?: ParamCloneOptions) => {
    let clone = {...this.queryParams};
    if(!options) { return clone; }

    // Handle the case when you want to remove params
    if((options.remove?.length ?? 0) > 0) {
      options.remove!.forEach(key => {
        if(!clone.hasOwnProperty(key)) return;
        delete clone[key];
      });
    }

    return clone;
  }

  public runWithRouteSyncing = (router: Router) => {
    return this.enableRouteSyncing(router).run();
  }

  public run = () => {
    if(this._initialized) { return this; }
    this._initialized = true;

    setTimeout(() => {
      this._subs.push(this._route.queryParams.subscribe(params => {
        this.updateQueryParams(params);
        this._fireQueryParamsChanged();
      }));

      this._subs.push(this._route.params.subscribe(params => {
        this.updateParams(params);
        this._fireParamsChanged();
      }));
    }, 0);

    return this;
  }


  // Internal methods
  private _log = (...args: any[]) => {
    if(!this._loggingEnabled) {
      return;
    }

    console.log(...args);
  }

  private _logError = (...args: any[]) => {
    if(!this._loggingEnabled) {
      return;
    }

    console.error(...args);
  }
  
  private _workType(paramValue: any) {
    const paramType = typeof paramValue;

    switch(paramType) {
      case 'number':
        return ParamType.Number;

      case 'string':
        return ParamType.String;
      
      default:
        this._logError(`workType(): Unsupported param type: ${paramType}`);
        return ParamType.Unknown;
    }
  }

  private _updateQueryParam = (key: string, rawValue: string) => {
    // this._log('_updateParam()');
    let paramType = this._queryParamTypes[key];

    if(paramType === ParamType.Number) {
      let parsedValue = parseInt(rawValue);
      this.queryParams[key] = isNaN(parsedValue) ? 0 : parsedValue;
      return;
    }

    if(paramType === ParamType.String) {
      this.queryParams[key] = rawValue;
      return;
    }

    this._logError(`updateQueryParam() : Unsupported param type: ${paramType}`);
  }

  private _updateParam = (key: string, rawValue: string) => {
    // this._log('_updateParam()');
    let paramType = this._paramTypes[key];

    if(paramType === ParamType.Number) {
      let parsedValue = parseInt(rawValue);
      this.params[key] = isNaN(parsedValue) ? 0 : parsedValue;
      return;
    }

    if(paramType === ParamType.String) {
      this.params[key] = rawValue;
      return;
    }

    this._logError(`updateParam() : Unsupported param type: ${paramType}`);
  }

  private _syncRoute = () => {
    if(!this._enableRouteSyncing || !this._router) {
      return;
    }

    this._router.navigate([], {
      relativeTo: this._route,
      queryParams: this.queryParams, 
      queryParamsHandling: 'merge',
    });
  }

  private _fireQueryParamsChanged = () => {
    // Delay and fire change event
    setTimeout(() => {
      this._syncRoute();
      this.queryParamsChanged.next(this.queryParams);
    }, 0);
  }

  private _fireParamsChanged = () => {
    // Delay and fire change event
    setTimeout(() => {
      this._syncRoute();
      this.paramsChanged.next(this.params);
    }, 0);
  }
}
