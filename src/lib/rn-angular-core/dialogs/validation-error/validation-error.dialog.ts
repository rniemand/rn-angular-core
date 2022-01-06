import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

// AnAngularCore
import { ValidationError } from '../../services/ui.service';

export interface ValidationErrorDialogData {
  error: ValidationError;
}

@Component({
  selector: 'validation-error-dialog',
  templateUrl: './validation-error.dialog.html',
  styleUrls: ['./validation-error.dialog.scss']
})
export class ValidationErrorDialog implements OnInit {
  error!: ValidationError;
  isAspError: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<ValidationErrorDialog>,
    @Inject(MAT_DIALOG_DATA) public data: ValidationErrorDialogData
  ) { }

  ngOnInit(): void {
    this.error = this.data.error;
    this.isAspError = (this.error?.aspNetError ?? undefined) !== undefined;

    this._processAspNetError();
  }

  private _processAspNetError = () => {
    if(!this.isAspError) { return; }
    this.error.error = this.error.aspNetError.title;

    (Object.getOwnPropertyNames(this.error.aspNetError.errors) ?? []).forEach(key => {
      let joined = (this.error.aspNetError.errors[key] as string[]).join(', ');
      this.error.errors.push(`${key}: ${joined}`);
    });
  }

}
