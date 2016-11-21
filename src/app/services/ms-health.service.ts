import { Injectable } from '@angular/core';
import { PromiseThing } from './PromiseThing';

const apiTemplateUrl = 'https://api.microsofthealth.net/v1/me/{path}?{parameters}';

const authHeaderTemplate = 'Bearer {access_token}';

const clientId = 'your-client-id-goes-here';

// tslint:disable-next-line:max-line-length
const loginUrlTemplate = 'https://login.live.com/oauth20_authorize.srf?client_id={client_id}&scope={scope}&response_type=token&redirect_uri={redirect_uri}';

const logoutUrlTemplate = 'https://login.live.com/oauth20_logout.srf?client_id={client_id}&redirect_uri={redirect_uri}';

const redirectUri = 'http://localhost:4200';

const scope = 'mshealth.ReadProfile mshealth.ReadDevices mshealth.ReadActivityHistory mshealth.ReadActivityLocation';

@Injectable()
export class MsHealthService {

  private accessToken: string;

  constructor() { }

  public getActivities(options) {
    return this.query({
      path: 'Activities',
      method: 'GET',
      parameters: {
        activityIds: options.activityIds,
        activityTypes: options.activityTypes,
        activityIncludes: options.activityIncludes,
        splitDistanceType: options.splitDistanceType,
        startTime: options.startTime,
        endTime: options.endTime,
        deviceIds: options.deviceIds,
        maxPageSize: options.maxPageSize
      }
    });
  };

  // Don't pass in a deviceId to get all devices.
  public getDevices(deviceId?: string) {
    console.log(`MsHealthService.getDevices(${deviceId}) calls query(..).`);
    let path = deviceId ? 'Devices/' + encodeURIComponent(deviceId) : 'Devices';
    return this.query({
      path: path,
      method: 'GET'
    });
  };

  public getProfile() {
    console.log('MsHealthService.getProfile() calls query(..).');
    return this.query({
      path: 'Profile',
      method: 'GET'
    });
  };

  public getSummaries(options?) {
    if (!options || !options.period) {
      console.log('MsHealthService.getSummaries() bad args - A period is required to call the summaries API.');
      throw 'A period is required to call the summaries API';
    }

    console.log('MsHealthService.getSummaries() calls query(..).');

    return this.query({
      path: 'Summaries/' + options.period,
      method: 'GET',
      parameters: {
        startTime: options.startTime,
        endTime: options.endTime,
        deviceIds: options.deviceIds,
        maxPageSize: options.maxPageSize
      }
    });
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

  private getAuthorizationHeader(): string {
    return authHeaderTemplate.replace('{access_token}', this.accessToken);
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

  private getParametersFromQueryOptions(optionsParameters): string {

    let queryParameters = '';

    if (optionsParameters) {
      for (let p in optionsParameters) {
        if (optionsParameters[p]) {
          queryParameters = queryParameters.concat(encodeURI(p) + '=' + encodeURI(optionsParameters[p]) + '&');
        }
      }
    }

    return queryParameters.substring(0, queryParameters.length - 1);
  }

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

  private query(options): PromiseThing {
    console.log(`MsHealthService.query(..) options.path: ${options.path} ${options.method}`);

    if (!this.accessToken) {
      console.log('MsHealthService.query(..) throw: User is not authenticated, call login function first');
      throw 'User is not authenticated, call login function first';
    }

    let queryParameters = options.parameters ? this.getParametersFromQueryOptions(options.parameters) : '';

    let url = apiTemplateUrl.replace('{path}', options.path).replace('{parameters}', queryParameters);

    let promiseThing = new PromiseThing();

    let xmlHttpRequest = new XMLHttpRequest();
    xmlHttpRequest.open(options.method, url, true);
    xmlHttpRequest.setRequestHeader('Authorization', this.getAuthorizationHeader());

    xmlHttpRequest.onload = function () {
      let request = this; // WTF?

      if (request.status >= 200 && request.status < 300) {
        promiseThing.resolve(JSON.parse(request.responseText));
      } else {
        promiseThing.reject(request.responseText ? JSON.parse(request.responseText) : {});
      }
    };

    xmlHttpRequest.onerror = function () {
      let request = this; // WTF?

      promiseThing.reject(request.responseText ? JSON.parse(request.responseText) : {});
    };

    xmlHttpRequest.send();

    console.log('MicrosoftHealth.query(..) end. promise: ' + promiseThing);

    return promiseThing;
  }

}
