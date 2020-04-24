import { browser, element, by, protractor } from 'protractor';

import NavBarPage from './../../../page-objects/navbar-page';
import SignInPage from './../../../page-objects/signin-page';
import ProductOrderComponentsPage, { ProductOrderDeleteDialog } from './product-order.page-object';
import ProductOrderUpdatePage from './product-order-update.page-object';
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

describe('ProductOrder e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let productOrderComponentsPage: ProductOrderComponentsPage;
  let productOrderUpdatePage: ProductOrderUpdatePage;
  let productOrderDeleteDialog: ProductOrderDeleteDialog;
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

  it('should load ProductOrders', async () => {
    await navBarPage.getEntityPage('product-order');
    productOrderComponentsPage = new ProductOrderComponentsPage();
    expect(await productOrderComponentsPage.title.getText()).to.match(/Product Orders/);

    expect(await productOrderComponentsPage.createButton.isEnabled()).to.be.true;
    await waitUntilAnyDisplayed([productOrderComponentsPage.noRecords, productOrderComponentsPage.table]);

    beforeRecordsCount = (await isVisible(productOrderComponentsPage.noRecords))
      ? 0
      : await getRecordsCount(productOrderComponentsPage.table);
  });

  it('should load create ProductOrder page', async () => {
    await productOrderComponentsPage.createButton.click();
    productOrderUpdatePage = new ProductOrderUpdatePage();
    expect(await productOrderUpdatePage.getPageTitle().getAttribute('id')).to.match(/storeApp.productProductOrder.home.createOrEditLabel/);
    await productOrderUpdatePage.cancel();
  });

  it('should create and save ProductOrders', async () => {
    await productOrderComponentsPage.createButton.click();
    await productOrderUpdatePage.setPlacedDateInput('01/01/2001' + protractor.Key.TAB + '02:30AM');
    expect(await productOrderUpdatePage.getPlacedDateInput()).to.contain('2001-01-01T02:30');
    await productOrderUpdatePage.statusSelectLastOption();
    await productOrderUpdatePage.setCodeInput('code');
    expect(await productOrderUpdatePage.getCodeInput()).to.match(/code/);
    await productOrderUpdatePage.setInvoiceIdInput('5');
    expect(await productOrderUpdatePage.getInvoiceIdInput()).to.eq('5');
    await productOrderUpdatePage.setCustomerInput('customer');
    expect(await productOrderUpdatePage.getCustomerInput()).to.match(/customer/);
    await waitUntilDisplayed(productOrderUpdatePage.saveButton);
    await productOrderUpdatePage.save();
    await waitUntilHidden(productOrderUpdatePage.saveButton);
    expect(await isVisible(productOrderUpdatePage.saveButton)).to.be.false;

    expect(await productOrderComponentsPage.createButton.isEnabled()).to.be.true;

    await waitUntilDisplayed(productOrderComponentsPage.table);

    await waitUntilCount(productOrderComponentsPage.records, beforeRecordsCount + 1);
    expect(await productOrderComponentsPage.records.count()).to.eq(beforeRecordsCount + 1);
  });

  it('should delete last ProductOrder', async () => {
    const deleteButton = productOrderComponentsPage.getDeleteButton(productOrderComponentsPage.records.last());
    await click(deleteButton);

    productOrderDeleteDialog = new ProductOrderDeleteDialog();
    await waitUntilDisplayed(productOrderDeleteDialog.deleteModal);
    expect(await productOrderDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/storeApp.productProductOrder.delete.question/);
    await productOrderDeleteDialog.clickOnConfirmButton();

    await waitUntilHidden(productOrderDeleteDialog.deleteModal);

    expect(await isVisible(productOrderDeleteDialog.deleteModal)).to.be.false;

    await waitUntilAnyDisplayed([productOrderComponentsPage.noRecords, productOrderComponentsPage.table]);

    const afterCount = (await isVisible(productOrderComponentsPage.noRecords))
      ? 0
      : await getRecordsCount(productOrderComponentsPage.table);
    expect(afterCount).to.eq(beforeRecordsCount);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
