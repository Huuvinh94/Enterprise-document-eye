import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CareerService } from '@core/services/career.service';
import { DialogService } from '@core/services/dialog.service';


@Component({
  selector: 'app-career-form',
  templateUrl: './career-form.component.html',
  styleUrls: ['./career-form.component.scss']
})
export class CareerFormComponent implements OnInit {

  @ViewChild('careerName', { static: true }) careerName: ElementRef;
  careerForm: FormGroup;
  loading: boolean;
  selectedCareer: any;
  listCareer: any = [];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public careerService: CareerService,
    public dialogRef: MatDialogRef<CareerFormComponent>,
    private fb: FormBuilder,
    private dialogService: DialogService,
  ) {
    this.careerForm = this.fb.group({
      _id: [''],
      careerName: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.careerName.nativeElement.autofocus = true;
    // Mode edit
    if (this.data.isEdit) {
      this.careerForm.setValue(JSON.parse(this.data.careerDetail));
    }
  }

  onBack() {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.careerForm.valid) {
      const strConfirm = !this.data.isEdit ? 'create' : 'edit';
      this.dialogService.openConfirmDialog('Are you sure ' + strConfirm + ' ?', () => {
        if (this.data.isEdit) {
          this.careerService.editCareer(this.careerForm.value)
            .subscribe(
              res => {
                if (res) {
                  this.dialogRef.close(true);
                }
              }
            );
        } else {
          this.loading = true;
          this.careerService.createCareer(this.careerForm.value)
            .subscribe(
              res => {
                this.loading = false;
                if (res) {
                  this.dialogRef.close(true);
                }
              }
            );
        }
      });
    }
  }
}
