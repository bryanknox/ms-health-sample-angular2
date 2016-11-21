import { Component, OnInit } from '@angular/core';
import { MsHealthService } from './services/ms-health.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  private msHealthService: MsHealthService;

  public activitiesCount: number;
  public deviceCount: number;
  public errorMessage = '';
  public profileFirstName = '';
  public title = 'bk-ng2-ms-health';
  public totalCalories: number;
  public totalSteps: number;

  constructor(msHealthService: MsHealthService) {

    console.log(`AppComponent constructor start.`);

    this.msHealthService = msHealthService;

    this.msHealthService.login();

    console.log(`AppComponent constructor end.`);
  }

  ngOnInit() {
    if (this.isLoggedIn()) {
      this.getStuff();
    }
  }

  public getActivities(): void {

    let that = this;

    let thirtyDaysAgo = this.getThirtyDaysAgo();

    this.msHealthService.getActivities({
      startTime: thirtyDaysAgo.toISOString(),
      endTime: (new Date()).toISOString()
    }).then(
      function (activities) {
        console.log('AppComponent mshealth.getActivities().then success start.');

        console.log(`AppComponent mshealth.getActivities().then success activities.itemCount: ${activities.itemCount}`);

        that.activitiesCount = activities.itemCount;

        console.log(`AppComponent mshealth.getActivities().then success activities: ${JSON.stringify(activities)}`);

        console.log('AppComponent mshealth.getActivities().then success end.');
      },
      function (error) {
        console.log('AppComponent mshealth.getActivities().then error start.');
        that.onError(error.error);
        console.log('AppComponent mshealth.getActivities().then error end.');
      }
      );
  }

  public getDevices(): void {

    let that = this;

    this.msHealthService.getDevices().then(
      function (devices) {
        console.log('AppComponent mshealth.getDevices().then success start.');
        console.log(`AppComponent mshealth.getProfile().then devices.deviceProfiles.length: ${devices.deviceProfiles.length}`);

        that.deviceCount = devices.deviceProfiles.length;

        console.log('AppComponent mshealth.getDevices().then success end.');
      },
      function (error) {
        console.log('AppComponent mshealth.getDevices().then error start.');
        that.onError(error.error);
        console.log('AppComponent mshealth.getDevices().then error end.');
      }
    );
  }

  public getProfile(): void {

    let that = this;

    this.msHealthService.getProfile().then(
      function (profile) {
        console.log('AppComponent mshealth.getProfile().then success start.');
        console.log('AppComponent mshealth.getProfile().then success profile.firstName: ' + profile.firstName);

        that.profileFirstName = profile.firstName;

        console.log('AppComponent mshealth.getProfile().then success end.');
      },
      function (error) {
        console.log('AppComponent mshealth.getProfile().then error start.');
        that.onError(error.error);
        console.log('AppComponent mshealth.getProfile().then error end.');
      }
    );
  }

  public getStuff(): void {
    this.getProfile();
    this.getDevices();
    this.getSummaries();
    this.getActivities();
  }

  public getSummaries(): void {

    let that = this;

    let thirtyDaysAgo = this.getThirtyDaysAgo();

    this.msHealthService.getSummaries({
      period: 'daily',
      startTime: thirtyDaysAgo.toISOString(),
      endTime: (new Date()).toISOString()
    }).then(
      function (summaries) {
        console.log('AppComponent mshealth.getSummaries().then success start.');

        let totalSteps = 0;
        let totalCalories = 0;

        let sumariesList = summaries.summaries;
        for (let summary of sumariesList) {

          console.log(`AppComponent mshealth.getSummaries().then success summary: ${JSON.stringify(summary)}.`);

          if (!!summary.caloriesBurnedSummary
            && !!summary.caloriesBurnedSummary.totalCalories) {

            totalCalories += summary.caloriesBurnedSummary.totalCalories;

            totalSteps += summary.stepsTaken;
          }
        }

        that.totalSteps = totalSteps;
        that.totalCalories = totalCalories;

        console.log('AppComponent mshealth.getSummaries().then success end.');
      },
      function (error) {
        console.log('AppComponent mshealth.getSummaries().then error start.');
        that.onError(error.error);
        console.log('AppComponent mshealth.getSummaries().then error end.');
      }
      );

  }

  public isLoggedIn(): boolean {
    return this.msHealthService.isLoggedIn();
  }

  public logout() {
    this.msHealthService.logout();
  }

  private getThirtyDaysAgo() {
    let dateThrityDaysAgo = new Date();
    dateThrityDaysAgo.setDate(dateThrityDaysAgo.getDate() - 30);
    return dateThrityDaysAgo;
  }

  private onError(error) {

    if (error && error.details) {
      this.errorMessage = error.details[0].message;
    } else if (error) {
      this.errorMessage = error.message;
    } else {
      this.errorMessage = 'An error occurred';
    }

    console.log(`AppComponent onError errorMessage: ${this.errorMessage}`);
  }

}
