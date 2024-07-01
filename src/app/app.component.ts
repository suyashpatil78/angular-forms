import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  fg: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.fg = this.fb.group({
      firstName: [, Validators.required],
      lastName: [],
      dateOfBirth: [, Validators.required],
      age: [],
      hobbies: this.fb.array([]),
    });

    // Subscribe to the dateOfBirth value changes to calculate the age
    this.fg.controls['dateOfBirth'].valueChanges.subscribe((dateOfBirth: string) => {
      const age = this.calculateAge(dateOfBirth);
      this.fg.controls['age'].setValue(age);
    });
  }

  calculateAge(dateOfBirth: string): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  get formHobbies(): FormArray {
    return this.fg.controls['hobbies'] as FormArray;
  }

  isFieldInvalid(field: string): boolean {
    const control = this.fg.get(field);
    return control.invalid && control.touched;
  }

  submit(): void {
    if (this.fg.valid) {
      // Consoling the result to pass to the API
      console.log(this.fg.value);
    } else {
      this.fg.markAllAsTouched();
    }
  }

  addHobby(): void {
    this.formHobbies.push(
      this.fb.group({
        hobby: [, Validators.required],
      })
    );
  }

  removeHobby(index: number): void {
    this.formHobbies.removeAt(index);
  }
}
