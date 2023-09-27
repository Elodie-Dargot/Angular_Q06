import { Component, OnInit, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-search-movie',
  templateUrl: './search-movie.component.html',
  styleUrls: ['./search-movie.component.scss']
})
export class SearchMovieComponent implements OnInit, OnDestroy {

  searchMovieForm!: FormGroup
  isSubmit: boolean = false
  isIdValid: boolean = false
  minYear = 1900;
  maxYear = new Date().getFullYear();

  searchMovieFormListener!: Subscription;

  constructor(private formBuilder: FormBuilder){}

  ngOnInit(): void {
    this.searchMovieForm = this.formBuilder.group({
      infos: this.formBuilder.group({
        id: [null],
        titre: [null],
      }, { validator: this.isRequiredValidator('id', 'title')}),      
      type: ['série'],
      anneeDeSortie: [null, [Validators.required, this.rangeDateValidator(this.minYear, this.maxYear)]],
      fiche: [null]
    });

    this.searchMovieFormListener = this.searchMovieForm.valueChanges.subscribe(value => {
      console.log(value)
    });

    this.searchMovieForm.valueChanges.subscribe( value => {
      if ( this.searchMovieForm.value.infos.id.length > 0 ){
        this.isIdValid = true
      } else {
        this.isIdValid = false
      }

    })

    this.searchMovieForm.patchValue({fiche:'courte'})
  }

  ngOnDestroy(): void{
    this.searchMovieFormListener.unsubscribe()
  }

  isRequiredValidator(titre: string, id: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {

      const idControl = control.get(id);
      const titreControl =control.get(titre);

      if (idControl?.value || titreControl?.value){
        return null;
      } else {
        return { 'isRequired': true }
      }

    }
  }

  rangeDateValidator(min: number, max: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const inputYear = control.value;
      if (inputYear >= min && inputYear <= max){
        console.log(control.value)
        return null
      } else {
        console.log(control.value)
        return { 'min': {min, max}}
      }
    }
  }

  IdValid(){
    if ( this.searchMovieForm.value.infos.id.length >= 0 ){
      this.isIdValid = true
    } else {
      this.isIdValid = false
    }
  }

  onSubmit(){
    this.isSubmit = true
    const form = this.searchMovieForm.value
    console.log(JSON.stringify(form))
  }
}