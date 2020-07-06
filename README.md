# CurrencyConverter

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 10.0.1.

## Installation

Use the node package manager [npm](https://www.npmjs.com/) to install dependencies.

```bash
npm install
 or 
npm i
```

## Run it locally
Just hit
```bash
npm start
```
If you already have angular cli in local machine the just run
Run 
```bash
ng serve --open
```

## My assumption
 -   I used https://www.bankofcanada.ca/valet link as there were no listed url in requirement document for bank of canada foreign exchange API.
 - I'm only considering series that startwith 'FX'. More information about series you can find here: https://www.bankofcanada.ca/valet/lists/series/json
```typescript
  convertSeriesList(response: any): void {
    for (const [key, value] of Object.entries(response.series)) {
      if (key.toUpperCase().startsWith('FX') && key.length === 8) {
        this.currencyCode.push(key.substring(2, 5));
        this.currencyCode.push(key.substring(5, 8));
      }
    }
    this.currencyCode = Array.from(new Set(this.currencyCode));
  }
```
 - I'm assuming that, there will be only one observation per day. I noticed that, there will be always on observation per day.

```typescript
    this.converterService.getobservationBasedOnDate(form.date, series).subscribe(response => {
      if (response.observations.length > 0) {
        this.converterOutput = new ConverterOutput(form, series, response.observations[0][series].v);
        this.converterOutput.calculate();
      } else {
        alert('No observation found for specific date');
      }
    });
```
 - As we are looking for 4 floating point value. I'm assuming that lower value for conversion would be 0.0001
 - Not acceptable: 0.00009
 - Acceptable 0.00012



