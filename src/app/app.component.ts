import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ConverterService} from './converter.service';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'currency-converter';
  converterForm: FormGroup;
  data;

  constructor(
    private converterService: ConverterService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe
  ) {
    this.converterForm = this.formBuilder.group({
      from: '',
      to: '',
      date: ''
    });
  }

  ngOnInit(): void {
    const date = this.datePipe.transform(Date.now(), 'yyyy-MM-dd');
    this.converterService.getFile(date).subscribe( res => {
      console.log(res);
      this.data = res;
    });
  }

  onSubmit = (customerData): void => {
    console.warn('Your order has been submitted', customerData);
    const filteredData = this.getObservationByDate(customerData.date);
    console.log(filteredData);
  }

  getObservationByDate = (date): any => {
   return this.data.observations.filter(row => row.d === date);
  }

}
