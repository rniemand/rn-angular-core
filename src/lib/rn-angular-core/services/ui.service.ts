import { EventEmitter, Injectable } from "@angular/core";

@Injectable()
export class UiService {
  showLoaderChange = new EventEmitter<boolean>();
  loaderVisible: boolean = false;

  private _closeOnError: boolean = false;
  
  constructor(
    private _snackBar: MatSnackBar,
    public dialog: MatDialog
  ) { }
  
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
      ...DIALOG_DEFAULTS,
      backdropClass: 'validation-error',
      data: dialogData
    });

    this.hideLoader();
  }

  handleClientError = (error: any, ...args: any[]) => {
    // TODO: [COMPLETE] Complete me
    
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