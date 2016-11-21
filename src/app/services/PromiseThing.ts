export class PromiseThing {

  private onResolved: any;
  private onRejected: any;

  constructor() { }

  public then(onResolved, onRejected) {
        this.onResolved = onResolved;
        this.onRejected = onRejected;
    };

    public resolve(value) {
        this.onResolved(value);
    };

    public reject(value) {
        this.onRejected(value);
    };

}
