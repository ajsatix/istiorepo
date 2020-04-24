import { browser, element, by, protractor } from 'protractor';

import NavBarPage from './../../../page-objects/navbar-page';
import SignInPage from './../../../page-objects/signin-page';
import InvoiceComponentsPage, { InvoiceDeleteDialog } from './invoice.page-object';
import InvoiceUpdatePage from './invoice-update.page-object';
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

describe('Invoice e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let invoiceComponentsPage: InvoiceComponentsPage;
  let invoiceUpdatePage: InvoiceUpdatePage;
  let invoiceDeleteDialog: InvoiceDeleteDialog;
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

  it('should load Invoices', async () => {
    await navBarPage.getEntityPage('invoice');
    invoiceComponentsPage = new InvoiceComponentsPage();
    expect(await invoiceComponentsPage.title.getText()).to.match(/Invoices/);

    expect(await invoiceComponentsPage.createButton.isEnabled()).to.be.true;
    await waitUntilAnyDisplayed([invoiceComponentsPage.noRecords, invoiceComponentsPage.table]);

    beforeRecordsCount = (await isVisible(invoiceComponentsPage.noRecords)) ? 0 : await getRecordsCount(invoiceComponentsPage.table);
  });

  it('should load create Invoice page', async () => {
    await invoiceComponentsPage.createButton.click();
    invoiceUpdatePage = new InvoiceUpdatePage();
    expect(await invoiceUpdatePage.getPageTitle().getAttribute('id')).to.match(/storeApp.invoiceInvoice.home.createOrEditLabel/);
    await invoiceUpdatePage.cancel();
  });

  it('should create and save Invoices', async () => {
    await invoiceComponentsPage.createButton.click();
    await invoiceUpdatePage.setCodeInput('code');
    expect(await invoiceUpdatePage.getCodeInput()).to.match(/code/);
    await invoiceUpdatePage.setDateInput('01/01/2001' + protractor.Key.TAB + '02:30AM');
    expect(await invoiceUpdatePage.getDateInput()).to.contain('2001-01-01T02:30');
    await invoiceUpdatePage.setDetailsInput('details');
    expect(await invoiceUpdatePage.getDetailsInput()).to.match(/details/);
    await invoiceUpdatePage.statusSelectLastOption();
    await invoiceUpdatePage.paymentMethodSelectLastOption();
    await invoiceUpdatePage.setPaymentDateInput('01/01/2001' + protractor.Key.TAB + '02:30AM');
    expect(await invoiceUpdatePage.getPaymentDateInput()).to.contain('2001-01-01T02:30');
    await invoiceUpdatePage.setPaymentAmountInput('5');
    expect(await invoiceUpdatePage.getPaymentAmountInput()).to.eq('5');
    await waitUntilDisplayed(invoiceUpdatePage.saveButton);
    await invoiceUpdatePage.save();
    await waitUntilHidden(invoiceUpdatePage.saveButton);
    expect(await isVisible(invoiceUpdatePage.saveButton)).to.be.false;

    expect(await invoiceComponentsPage.createButton.isEnabled()).to.be.true;

    await waitUntilDisplayed(invoiceComponentsPage.table);

    await waitUntilCount(invoiceComponentsPage.records, beforeRecordsCount + 1);
    expect(await invoiceComponentsPage.records.count()).to.eq(beforeRecordsCount + 1);
  });

  it('should delete last Invoice', async () => {
    const deleteButton = invoiceComponentsPage.getDeleteButton(invoiceComponentsPage.records.last());
    await click(deleteButton);

    invoiceDeleteDialog = new InvoiceDeleteDialog();
    await waitUntilDisplayed(invoiceDeleteDialog.deleteModal);
    expect(await invoiceDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/storeApp.invoiceInvoice.delete.question/);
    await invoiceDeleteDialog.clickOnConfirmButton();

    await waitUntilHidden(invoiceDeleteDialog.deleteModal);

    expect(await isVisible(invoiceDeleteDialog.deleteModal)).to.be.false;

    await waitUntilAnyDisplayed([invoiceComponentsPage.noRecords, invoiceComponentsPage.table]);

    const afterCount = (await isVisible(invoiceComponentsPage.noRecords)) ? 0 : await getRecordsCount(invoiceComponentsPage.table);
    expect(afterCount).to.eq(beforeRecordsCount);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
