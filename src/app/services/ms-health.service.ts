import { Http, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

const apiTemplateUrl = 'https://api.microsofthealth.net/v1/me/{path}?{parameters}';

const authHeaderTemplate = 'Bearer {access_token}';

const clientId = 'your-clientId-goes-here';

// tslint:disable-next-line:max-line-length
const loginUrlTemplate = 'https://login.live.com/oauth20_authorize.srf?client_id={client_id}&scope={scope}&response_type=token&redirect_uri={redirect_uri}';

const logoutUrlTemplate = 'https://login.live.com/oauth20_logout.srf?client_id={client_id}&redirect_uri={redirect_uri}';

const redirectUri = 'http://localhost:4200';

const scope = 'mshealth.ReadProfile mshealth.ReadDevices mshealth.ReadActivityHistory mshealth.ReadActivityLocation';

@Injectable()
export class MsHealthService {

  private accessToken: string;
  private http: Http;

  constructor(http: Http) {

    this.http = http;
  }

  public getActivities(options) {
    console.log(`MsHealthService.getActivities(..) start options: ${options}.`);

    let parameterObject = {
      activityIds: options.activityIds,
      activityTypes: options.activityTypes,
      activityIncludes: options.activityIncludes,
      splitDistanceType: options.splitDistanceType,
      startTime: options.startTime,
      endTime: options.endTime,
      deviceIds: options.deviceIds,
      maxPageSize: options.maxPageSize
    };

    let parameters = this.getParametersFromObject(parameterObject);

    let response = this.httpGet('Activities', parameters);

    console.log('MsHealthService.getActivities() end.');

    return response;

  };

  // Don't pass in a deviceId to get all devices.
  public getDevices(deviceId?: string) {

    console.log(`MsHealthService.getDevices(${deviceId}) start.`);

    let path = deviceId ? `Devices/${encodeURIComponent(deviceId)}` : 'Devices';

    let response = this.httpGet(path, '');

    console.log('MsHealthService.getProfile() end.');

    return response;
  };

  public getProfile() {
    console.log('MsHealthService.getProfile() start.');

    let response = this.httpGet('Profile', '');

    console.log('MsHealthService.getProfile() end.');

    return response;
  };

  public getSummaries(options?) {
    if (!options || !options.period) {
      console.log('MsHealthService.getSummaries() bad args - A period is required to call the summaries API.');
      throw 'A period is required to call the summaries API';
    }
    console.log('MsHealthService.getProfile() start.');

    let parameterObject = {
      startTime: options.startTime,
      endTime: options.endTime,
      deviceIds: options.deviceIds,
      maxPageSize: options.maxPageSize
    };

    let path = `Summaries/${options.period}`;

    let parameters = this.getParametersFromObject(parameterObject);

    let response = this.httpGet(path, parameters);

    console.log('MsHealthService.getProfile() end.');

    return response;
  };

  public isLoggedIn(): boolean {
    return !!this.accessToken;
  }

  public login() {
    console.log('MsHealthService.login() start.');

    let hash = window.location.hash;
    console.log(`MsHealthService.login() hash: ${hash}`);

    if (hash) {
      console.log(`MsHealthService.login() has hash`);

      this.accessToken = this.parseAccessTokenFromHash(hash);

      console.log(`MsHealthService.login() accessToken: ${this.accessToken}`);

    } else {
      let url = this.getLoginUrl();

      console.log(`MsHealthService.login() no hash, change window.location to url: ${url}`);

      window.location.href = url;
    }
    console.log('MsHealthService.login() end.');
  };

  public logout() {

    this.accessToken = undefined;

    let url = this.getLogoutUrl();

    console.log(`MsHealthService.logout() no hash, change window.location to url: ${url}`);

    window.location.href = url;
  }

  private getApiUrl(path: string, parameters: string): string {
    let url = apiTemplateUrl.replace('{path}', path)
      .replace('{parameters}', parameters);

    return url;
  }

  private getAuthorizationHeader(): string {
    return authHeaderTemplate.replace('{access_token}', this.accessToken);
  }

  private getRequestHeaders(): Headers {
    let authorizationHeader = this.getAuthorizationHeader();
    let headers = new Headers();
    headers.append('Authorization', authorizationHeader);
    return headers;
  }

  private getLoginUrl(): string {
    let url = loginUrlTemplate.replace('{client_id}', clientId)
      .replace('{scope}', scope)
      .replace('{redirect_uri}', encodeURIComponent(redirectUri));

    return url;
  }

  private getLogoutUrl(): string {
    let url = logoutUrlTemplate.replace('{client_id}', clientId)
      .replace('{redirect_uri}', encodeURIComponent(redirectUri));

    return url;
  }

  private getParametersFromObject(parametersObject): string {

    let queryParameters = '';

    if (parametersObject) {
      for (let p in parametersObject) {
        if (parametersObject[p]) {
          queryParameters = queryParameters.concat(encodeURI(p) + '=' + encodeURI(parametersObject[p]) + '&');
        }
      }
    }

    return queryParameters.substring(0, queryParameters.length - 1);
  }

  private httpGet(path: string, parameters: string) {
    console.log(`MsHealthService.httpGet() start path: ${path}, ${parameters}`);

    let url = this.getApiUrl(path, parameters);

    let headers = this.getRequestHeaders();

    let response = this.http.get(url, { headers: headers })
      .map(res => res.json());

    console.log('MsHealthService.httpGet() end.');

    return response;
  };

  private parseAccessTokenFromHash(hash: string): string {

    // Skip the '#' at the beginning of the hash.
    let parameters = this.parseParametersFromHashSubString(hash.substring(1));

    let accessToken = parameters['access_token'];

    return accessToken;
  }

  private parseParametersFromHashSubString(hashSubString: string): any {

    let dictionary = {};
    let split = hashSubString.split('&');

    for (let i = 0; i < split.length; i++) {
      let param = split[i].split('=');
      if (param.length === 2) {
        dictionary[param[0]] = param[1];
      }
    }
    return dictionary;
  }

}
