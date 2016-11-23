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

    let thirtyDaysAgo = this.getThirtyDaysAgo();

    this.msHealthService.getActivities({
      startTime: thirtyDaysAgo.toISOString(),
      endTime: (new Date()).toISOString()
    })
    .subscribe(activities => {
      console.log('AppComponent mshealth.getActivities().then success start.');
      console.log(`AppComponent mshealth.getActivities().then devices: ${JSON.stringify(activities)}`);

      this.activitiesCount = activities.itemCount;

      console.log('AppComponent mshealth.getActivities().then success end.');
    }, err => {
      console.error(`AppComponent.getActivities() error: ${JSON.stringify(err)}`);
      this.onError(err);
    });
  }

  public getDevices(): void {

    this.msHealthService.getDevices()
      .subscribe(devices => {
        console.log('AppComponent mshealth.getDevices().then success start.');
        console.log(`AppComponent mshealth.getDevices().then devices: ${JSON.stringify(devices)}`);

        this.deviceCount = devices.deviceProfiles.length;

        console.log('AppComponent mshealth.getDevices().then success end.');
      }, err => {
        console.error(`AppComponent.getDevices() error: ${JSON.stringify(err)}`);
        this.onError(err);
      });
  }

  public getProfile(): void {

    this.msHealthService.getProfile()
      .subscribe(profile => {
        console.log(`AppComponent.getProfile() success profile: ${JSON.stringify(profile)}`);
        this.profileFirstName = profile.firstName;
      }, err => {
        console.error(`AppComponent.getProfile() error: ${JSON.stringify(err)}`);
        this.onError(err);
      });
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
    })
    .subscribe(summaries => {
      console.log('AppComponent mshealth.getSummaries().then success start.');
      console.log(`AppComponent mshealth.getSummaries().then summaries: ${JSON.stringify(summaries)}`);

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
    }, err => {
      console.error(`AppComponent.getSummaries() error: ${JSON.stringify(err)}`);
      this.onError(err);
    });

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

    console.log(`AppComponent onError error: ${JSON.stringify(error)}`);

    if (error && error.details) {
      this.errorMessage = error.details[0].message;
    } else if (error && error.message) {
      this.errorMessage = error.message;
    } else {
      this.errorMessage = 'An error occurred';
    }

    console.log(`AppComponent onError errorMessage: ${this.errorMessage}`);
  }

}
