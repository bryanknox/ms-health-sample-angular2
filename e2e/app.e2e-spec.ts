import { BkNg2MsHealthPage } from './app.po';

describe('bk-ng2-ms-health App', function() {
  let page: BkNg2MsHealthPage;

  beforeEach(() => {
    page = new BkNg2MsHealthPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
