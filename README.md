# ms-health-sample-angular2
Angular 2 and Typescript implementation of the Microsoft Health Sample JavaScript web application. 

The Microsoft Health Sample JavaScript web application that this is based on can be found at: http://developer.microsofthealth.com/cloudAPI

## Microsoft Account ClientId
The app requires a Microsoft Account with a registered application clientId.

See the [Microsoft Health API Getting Started.pdf](http://developer.microsofthealth.com/Content/docs/MS%20Health%20API%20Getting%20Started.pdf) for more information.

### Configure the ClientId
Edit the `clientId` const near the top of the `src\app\services\ms-health.service.ts` file to set your clientId before serving the application.

You may also need to change the `redirectUri` const if you are serving the app from a port number other than `4200`. 
The redirectUri, including the port number you use will also need to be registered for your clientId. 

# angular-cli
This project was generated with [angular-cli](https://github.com/angular/angular-cli) version 1.0.0-beta.19-3.

To get more help on the `angular-cli` use `ng --help` or go check out the [Angular-CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## Development server
Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

