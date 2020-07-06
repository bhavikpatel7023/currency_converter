export class ConverterForm {
  from: string;
  to: string;
  date: string;
  value: number;
}

export class ConverterOutput {
  from: string;
  to: string;
  date: string;
  value: number;
  conversionFactor: number;
  series: string;
  calculatedAmount: string;

  constructor(converterForm: ConverterForm, series: string, factor: number) {
    Object.assign(this, converterForm);
    this.series = series;
    this.conversionFactor = factor;
  }

  calculate(): void {
    this.calculatedAmount = (this.value * this.conversionFactor).toFixed(4);
  }

}

