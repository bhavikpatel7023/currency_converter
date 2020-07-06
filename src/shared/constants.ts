import { environment } from './../environments/environment';

export class Constants {
  public static readonly GET_OBSERVATION = `${environment.baseUrl}/observations/`;
  public static readonly GET_SERIES = `${environment.baseUrl}/lists/series/json`;
}
