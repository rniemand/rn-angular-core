import { EventEmitter, Inject, Injectable } from "@angular/core";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from "@angular/material/snack-bar";

// RnAngularCore
import { RnAppConfig, RN_APP_CONFIG } from "../configuration/_configuration";
import { ValidationErrorDialogData, ValidationErrorDialog } from "../dialogs/_dialogs";

export interface NotifyOptions {
  message: string;
  action?: string;
  horizontalPosition?: MatSnackBarHorizontalPosition,
  verticalPosition?: MatSnackBarVerticalPosition,
  duration?: number
}

export interface ValidationError {
  error: string;
  errors: string[];
  isValid: boolean;
  ruleSetsExecuted: string[];
  aspNetError: any;
}

@Injectable()
export class UiService {
  showLoaderChange = new EventEmitter<boolean>();
  loaderVisible: boolean = false;

  private _closeOnError: boolean = false;
  private _dialogDefaults: MatDialogConfig;
  
  constructor(
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    @Inject(RN_APP_CONFIG)
    private config: RnAppConfig
  ) {
    this._dialogDefaults = this.config.dialogDefaults;
  }
  
  notify = (options: NotifyOptions | string, duration?: number) => {
    let castOptions: NotifyOptions = { message: '' };

    if(typeof(options) === 'string') {
      castOptions.message = options;
    } else {
      castOptions = options;
    }

    if(typeof(duration) === 'number' && duration > 0) {
      castOptions.duration = duration;
    }

    this._snackBar.open(castOptions.message, castOptions.action, {
      duration: castOptions?.duration ?? 5 * 1000,
      horizontalPosition: castOptions?.horizontalPosition ?? 'left',
      verticalPosition: castOptions?.verticalPosition ?? 'bottom'
    });
  }

  handleValidationError = (error: ValidationError) => {
    let dialogData: ValidationErrorDialogData = { 
      error: error
    };

    this.dialog.open(ValidationErrorDialog, {
      ...this._dialogDefaults,
      backdropClass: 'validation-error',
      data: dialogData
    });

    this.hideLoader();
  }

  handleClientError = (error: any, ...args: any[]) => {
    // TODO: [COMPLETE] Complete me

    this.notify({
      message: error
    });
    
    if(this._closeOnError) {
      this.hideLoader();
    }
  }

  showLoader(closeOnError: boolean = false) {
    // Address race condition
    setTimeout(() => {
      this._closeOnError = closeOnError;
      this.loaderVisible = true;
      this.showLoaderChange.emit(true);
    }, 1);
  }

  hideLoader() {
    this._closeOnError = false;
    this.loaderVisible = false;
    this.showLoaderChange.emit(false);
  }
}