import { browser, element, by, protractor } from 'protractor';

import NavBarPage from './../../../page-objects/navbar-page';
import SignInPage from './../../../page-objects/signin-page';
import ShipmentComponentsPage, { ShipmentDeleteDialog } from './shipment.page-object';
import ShipmentUpdatePage from './shipment-update.page-object';
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

describe('Shipment e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let shipmentComponentsPage: ShipmentComponentsPage;
  let shipmentUpdatePage: ShipmentUpdatePage;
  /* let shipmentDeleteDialog: ShipmentDeleteDialog; */
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

  it('should load Shipments', async () => {
    await navBarPage.getEntityPage('shipment');
    shipmentComponentsPage = new ShipmentComponentsPage();
    expect(await shipmentComponentsPage.title.getText()).to.match(/Shipments/);

    expect(await shipmentComponentsPage.createButton.isEnabled()).to.be.true;
    await waitUntilAnyDisplayed([shipmentComponentsPage.noRecords, shipmentComponentsPage.table]);

    beforeRecordsCount = (await isVisible(shipmentComponentsPage.noRecords)) ? 0 : await getRecordsCount(shipmentComponentsPage.table);
  });

  it('should load create Shipment page', async () => {
    await shipmentComponentsPage.createButton.click();
    shipmentUpdatePage = new ShipmentUpdatePage();
    expect(await shipmentUpdatePage.getPageTitle().getAttribute('id')).to.match(/storeApp.invoiceShipment.home.createOrEditLabel/);
    await shipmentUpdatePage.cancel();
  });

  /*  it('should create and save Shipments', async () => {
        await shipmentComponentsPage.createButton.click();
        await shipmentUpdatePage.setTrackingCodeInput('trackingCode');
        expect(await shipmentUpdatePage.getTrackingCodeInput()).to.match(/trackingCode/);
        await shipmentUpdatePage.setDateInput('01/01/2001' + protractor.Key.TAB + '02:30AM');
        expect(await shipmentUpdatePage.getDateInput()).to.contain('2001-01-01T02:30');
        await shipmentUpdatePage.setDetailsInput('details');
        expect(await shipmentUpdatePage.getDetailsInput()).to.match(/details/);
        await shipmentUpdatePage.invoiceSelectLastOption();
        await waitUntilDisplayed(shipmentUpdatePage.saveButton);
        await shipmentUpdatePage.save();
        await waitUntilHidden(shipmentUpdatePage.saveButton);
        expect(await isVisible(shipmentUpdatePage.saveButton)).to.be.false;

        expect(await shipmentComponentsPage.createButton.isEnabled()).to.be.true;

        await waitUntilDisplayed(shipmentComponentsPage.table);

        await waitUntilCount(shipmentComponentsPage.records, beforeRecordsCount + 1);
        expect(await shipmentComponentsPage.records.count()).to.eq(beforeRecordsCount + 1);
    }); */

  /*  it('should delete last Shipment', async () => {

        const deleteButton = shipmentComponentsPage.getDeleteButton(shipmentComponentsPage.records.last());
        await click(deleteButton);

        shipmentDeleteDialog = new ShipmentDeleteDialog();
        await waitUntilDisplayed(shipmentDeleteDialog.deleteModal);
        expect(await shipmentDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/storeApp.invoiceShipment.delete.question/);
        await shipmentDeleteDialog.clickOnConfirmButton();

        await waitUntilHidden(shipmentDeleteDialog.deleteModal);

        expect(await isVisible(shipmentDeleteDialog.deleteModal)).to.be.false;

        await waitUntilAnyDisplayed([shipmentComponentsPage.noRecords,
        shipmentComponentsPage.table]);
    
        const afterCount = await isVisible(shipmentComponentsPage.noRecords) ? 0 : await getRecordsCount(shipmentComponentsPage.table);
        expect(afterCount).to.eq(beforeRecordsCount);
    }); */

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
