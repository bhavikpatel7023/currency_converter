import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {ConverterService} from '../../../shared/services/converter.service';
import {map} from 'rxjs/operators';
import {ConverterForm, ConverterOutput} from '../../../shared/models/converter';

@Component({
  selector: 'converter',
  templateUrl: './converter.component.html',
  styleUrls: ['./converter.component.css']
})

export class ConverterComponent implements OnInit {

  converterForm: FormGroup;
  converterOutput: ConverterOutput;
  currencyCode: string[] = [];
  filteredCurrencyCodeFrom: Observable<any[]>;
  filteredCurrencyCodeTo: Observable<any[]>;

  /**
   * Creates an instance of App Component.
   */
  constructor(
    private converterService: ConverterService,
    private formBuilder: FormBuilder
  ) {
    this.converterForm = this.formBuilder.group({
      from: new FormControl('', [Validators.required]),
      to: new FormControl('', [Validators.required]),
      date: new FormControl('', [Validators.required]),
      value: new FormControl('', [Validators.required]),
    });
  }

  /**
   * Initialize a component.
   */
  ngOnInit(): void {
    this.converterService.getSeries().subscribe(response => {
      this.convertSeriesList(response);
    });
  }

  /**
   * Value change event of From Input box
   * filters suggestion based on current value
   */
  onFromValueChange(): void {
    this.filteredCurrencyCodeFrom = this.converterForm.get('from').valueChanges
      .pipe(
        map(value => value ? this.filter(value) : this.currencyCode.slice())
      );
  }

  /**
   * Value change event of To Input box
   * filters suggestion based on current value
   */
  onToValueChange(): void {
    this.filteredCurrencyCodeTo = this.converterForm.get('to').valueChanges
      .pipe(
        map(value => value ? this.filter(value) : this.currencyCode.slice())
      );
  }

  private filter(name: string): string[] {
    const filterValue = name.toLowerCase();
    return this.currencyCode.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

  /**
   * Convert series of Bank of Canada into Currency code
   * Only Applicable for series start with FX
   */
  convertSeriesList(response: any): void {
    for (const [key, value] of Object.entries(response.series)) {
      if (key.toUpperCase().startsWith('FX') && key.length === 8) {
        this.currencyCode.push(key.substring(2, 5));
        this.currencyCode.push(key.substring(5, 8));
      }
    }
    this.currencyCode = Array.from(new Set(this.currencyCode));
  }

  /**
   * form submit function
   */
  onSubmit(form: ConverterForm): void{
    const series = `FX${form.from.toUpperCase()}${form.to.toUpperCase()}`;
    this.getObservationByDate(form, series);
  }

  /**
   * Call Bank of Canada API to get observation for specific date
   * @param form
   * @param series
   * @returns void
   */
  getObservationByDate(form: ConverterForm, series: string): void {
    this.converterService.getobservationBasedOnDate(form.date, series).subscribe(response => {
      if (response.observations.length > 0) {
        this.converterOutput = new ConverterOutput(form, series, response.observations[0][series].v);
        this.converterOutput.calculate();
      } else {
        alert('No observation found for specific date');
      }
    });
  }

}
