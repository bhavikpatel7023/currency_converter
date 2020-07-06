import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ConverterService } from './converter.service';
import { DatePipe } from '@angular/common';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { startWith, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { MatBottomSheet } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  inputRate: number = null;
  convertedRate: number = null;
  series: string = null;
  submittedValue: any = null;

  title = 'currency-converter';
  converterForm: FormGroup;
  seriesResponse: any;
  currencyCode: any[] = [];
  filteredCurrencyCodeFrom: Observable<any[]>;
  filteredCurrencyCodeTo: Observable<any[]>;

  /**
  * Creates an instance of App Component.
  */
  constructor(
    private converterService: ConverterService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private bottomSheet: MatBottomSheet
  ) {


    this.converterForm = this.formBuilder.group({
      from: new FormControl('USD', [Validators.required]),
      to: new FormControl('CAD', [Validators.required]),
      date: new FormControl('2020-07-03', [Validators.required]),
      value: new FormControl(100, [Validators.required]),
    });
  }

  /**
  * Initialize a component.
  */
  ngOnInit(): void {
    const date = this.datePipe.transform(Date.now(), 'yyyy-MM-dd');
    this.converterService.getSeries().subscribe(res => {
      this.seriesResponse = res;
      this.convertSeriesList();
    });

  }

  /**
  * Value change event of From Input box
  * filters suggestion based on current value
  */
  onFromValueChange(): void {
    this.filteredCurrencyCodeFrom = this.converterForm.get('from').valueChanges
      .pipe(
        map(value => value ? this._filter(value) : this.currencyCode.slice())
      );
  }

  /**
  * Value change event of To Input box
  * filters suggestion based on current value
  */
  onToValueChange(): void {
    this.filteredCurrencyCodeTo = this.converterForm.get('to').valueChanges
      .pipe(
        map(value => value ? this._filter(value) : this.currencyCode.slice())
      );
  }

  private _filter(name: string): string[] {
    const filterValue = name.toLowerCase();
    return this.currencyCode.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

  /**
  * Convert series of Bank of Canada into Currency code
  * Only Applicable for series start with FX
  */
  convertSeriesList(): void {
    for (const [key, value] of Object.entries(this.seriesResponse.series)) {
      if (key.toUpperCase().startsWith('FX') && key.length == 8) {
        console.log(key, value)
        this.currencyCode.push(key.substring(2, 5));
        this.currencyCode.push(key.substring(5, 8));
      }
    }
    this.currencyCode = Array.from(new Set(this.currencyCode));
  }

  /**
  * form submit function
  */
  onSubmit = (customerData): void => {
    const series = 'FX' + customerData.from + customerData.to;
    this.getObservationByDate(customerData, series);
  }

  /**
  * Clear all output
  */
  clearOutput() {
    this.inputRate = null;
    this.convertedRate = null;
    this.series = null;
    this.submittedValue = null;
  }

  /**
  * Call Bank of Canada API to get observation for specific date
  * @param customerData
  * @param series
  * @returns void
  */
  getObservationByDate = (customerData, series): any => {
    this.converterService.getobservationBasedOnDate(customerData.date, series).subscribe(res => {
      if (res.observations.length) {
        this.inputRate = res.observations[0][series].v;
        this.submittedValue = customerData;
        this.convertedRate = this.inputRate * customerData.value;
        this.series = series;
      } else {
        alert("No observation found for specific date")
      }
    })
  }

}
