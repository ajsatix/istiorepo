import { browser, element, by, protractor } from 'protractor';

import NavBarPage from './../../../page-objects/navbar-page';
import SignInPage from './../../../page-objects/signin-page';
import NotificationComponentsPage, { NotificationDeleteDialog } from './notification.page-object';
import NotificationUpdatePage from './notification-update.page-object';
import {
  waitUntilDisplayed,
  waitUntilAnyDisplayed,
  click,
  getRecordsCount,
  waitUntilHidden,
  waitUntilCount,
  isVisible
} from '../../../util/utils';

const expect = chai.expect;

describe('Notification e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let notificationComponentsPage: NotificationComponentsPage;
  let notificationUpdatePage: NotificationUpdatePage;
  let notificationDeleteDialog: NotificationDeleteDialog;
  let beforeRecordsCount = 0;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.waitUntilDisplayed();

    await signInPage.username.sendKeys('admin');
    await signInPage.password.sendKeys('admin');
    await signInPage.loginButton.click();
    await signInPage.waitUntilHidden();
    await waitUntilDisplayed(navBarPage.entityMenu);
    await waitUntilDisplayed(navBarPage.adminMenu);
    await waitUntilDisplayed(navBarPage.accountMenu);
  });

  it('should load Notifications', async () => {
    await navBarPage.getEntityPage('notification');
    notificationComponentsPage = new NotificationComponentsPage();
    expect(await notificationComponentsPage.title.getText()).to.match(/Notifications/);

    expect(await notificationComponentsPage.createButton.isEnabled()).to.be.true;
    await waitUntilAnyDisplayed([notificationComponentsPage.noRecords, notificationComponentsPage.table]);

    beforeRecordsCount = (await isVisible(notificationComponentsPage.noRecords))
      ? 0
      : await getRecordsCount(notificationComponentsPage.table);
  });

  it('should load create Notification page', async () => {
    await notificationComponentsPage.createButton.click();
    notificationUpdatePage = new NotificationUpdatePage();
    expect(await notificationUpdatePage.getPageTitle().getAttribute('id')).to.match(
      /storeApp.notificationNotification.home.createOrEditLabel/
    );
    await notificationUpdatePage.cancel();
  });

  it('should create and save Notifications', async () => {
    await notificationComponentsPage.createButton.click();
    await notificationUpdatePage.setDateInput('01/01/2001' + protractor.Key.TAB + '02:30AM');
    expect(await notificationUpdatePage.getDateInput()).to.contain('2001-01-01T02:30');
    await notificationUpdatePage.setDetailsInput('details');
    expect(await notificationUpdatePage.getDetailsInput()).to.match(/details/);
    await notificationUpdatePage.setSentDateInput('01/01/2001' + protractor.Key.TAB + '02:30AM');
    expect(await notificationUpdatePage.getSentDateInput()).to.contain('2001-01-01T02:30');
    await notificationUpdatePage.formatSelectLastOption();
    await notificationUpdatePage.setUserIdInput('5');
    expect(await notificationUpdatePage.getUserIdInput()).to.eq('5');
    await notificationUpdatePage.setProductIdInput('5');
    expect(await notificationUpdatePage.getProductIdInput()).to.eq('5');
    await waitUntilDisplayed(notificationUpdatePage.saveButton);
    await notificationUpdatePage.save();
    await waitUntilHidden(notificationUpdatePage.saveButton);
    expect(await isVisible(notificationUpdatePage.saveButton)).to.be.false;

    expect(await notificationComponentsPage.createButton.isEnabled()).to.be.true;

    await waitUntilDisplayed(notificationComponentsPage.table);

    await waitUntilCount(notificationComponentsPage.records, beforeRecordsCount + 1);
    expect(await notificationComponentsPage.records.count()).to.eq(beforeRecordsCount + 1);
  });

  it('should delete last Notification', async () => {
    const deleteButton = notificationComponentsPage.getDeleteButton(notificationComponentsPage.records.last());
    await click(deleteButton);

    notificationDeleteDialog = new NotificationDeleteDialog();
    await waitUntilDisplayed(notificationDeleteDialog.deleteModal);
    expect(await notificationDeleteDialog.getDialogTitle().getAttribute('id')).to.match(
      /storeApp.notificationNotification.delete.question/
    );
    await notificationDeleteDialog.clickOnConfirmButton();

    await waitUntilHidden(notificationDeleteDialog.deleteModal);

    expect(await isVisible(notificationDeleteDialog.deleteModal)).to.be.false;

    await waitUntilAnyDisplayed([notificationComponentsPage.noRecords, notificationComponentsPage.table]);

    const afterCount = (await isVisible(notificationComponentsPage.noRecords))
      ? 0
      : await getRecordsCount(notificationComponentsPage.table);
    expect(afterCount).to.eq(beforeRecordsCount);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
