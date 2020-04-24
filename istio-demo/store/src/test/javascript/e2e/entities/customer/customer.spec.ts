import { browser, element, by } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import CustomerComponentsPage, { CustomerDeleteDialog } from './customer.page-object';
import CustomerUpdatePage from './customer-update.page-object';
import {
  waitUntilDisplayed,
  waitUntilAnyDisplayed,
  click,
  getRecordsCount,
  waitUntilHidden,
  waitUntilCount,
  isVisible
} from '../../util/utils';

const expect = chai.expect;

describe('Customer e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let customerComponentsPage: CustomerComponentsPage;
  let customerUpdatePage: CustomerUpdatePage;
  /* let customerDeleteDialog: CustomerDeleteDialog; */
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

  it('should load Customers', async () => {
    await navBarPage.getEntityPage('customer');
    customerComponentsPage = new CustomerComponentsPage();
    expect(await customerComponentsPage.title.getText()).to.match(/Customers/);

    expect(await customerComponentsPage.createButton.isEnabled()).to.be.true;
    await waitUntilAnyDisplayed([customerComponentsPage.noRecords, customerComponentsPage.table]);

    beforeRecordsCount = (await isVisible(customerComponentsPage.noRecords)) ? 0 : await getRecordsCount(customerComponentsPage.table);
  });

  it('should load create Customer page', async () => {
    await customerComponentsPage.createButton.click();
    customerUpdatePage = new CustomerUpdatePage();
    expect(await customerUpdatePage.getPageTitle().getAttribute('id')).to.match(/storeApp.customer.home.createOrEditLabel/);
    await customerUpdatePage.cancel();
  });

  /*  it('should create and save Customers', async () => {
        await customerComponentsPage.createButton.click();
        await customerUpdatePage.setFirstNameInput('firstName');
        expect(await customerUpdatePage.getFirstNameInput()).to.match(/firstName/);
        await customerUpdatePage.setLastNameInput('lastName');
        expect(await customerUpdatePage.getLastNameInput()).to.match(/lastName/);
        await customerUpdatePage.genderSelectLastOption();
        await customerUpdatePage.setEmailInput('}o@)Y&lt;L.d52\[');
        expect(await customerUpdatePage.getEmailInput()).to.match(/}o@)Y&lt;L.d52\[/);
        await customerUpdatePage.setPhoneInput('phone');
        expect(await customerUpdatePage.getPhoneInput()).to.match(/phone/);
        await customerUpdatePage.setAddressLine1Input('addressLine1');
        expect(await customerUpdatePage.getAddressLine1Input()).to.match(/addressLine1/);
        await customerUpdatePage.setAddressLine2Input('addressLine2');
        expect(await customerUpdatePage.getAddressLine2Input()).to.match(/addressLine2/);
        await customerUpdatePage.setCityInput('city');
        expect(await customerUpdatePage.getCityInput()).to.match(/city/);
        await customerUpdatePage.setCountryInput('country');
        expect(await customerUpdatePage.getCountryInput()).to.match(/country/);
        await customerUpdatePage.userSelectLastOption();
        await waitUntilDisplayed(customerUpdatePage.saveButton);
        await customerUpdatePage.save();
        await waitUntilHidden(customerUpdatePage.saveButton);
        expect(await isVisible(customerUpdatePage.saveButton)).to.be.false;

        expect(await customerComponentsPage.createButton.isEnabled()).to.be.true;

        await waitUntilDisplayed(customerComponentsPage.table);

        await waitUntilCount(customerComponentsPage.records, beforeRecordsCount + 1);
        expect(await customerComponentsPage.records.count()).to.eq(beforeRecordsCount + 1);
    }); */

  /*  it('should delete last Customer', async () => {

        const deleteButton = customerComponentsPage.getDeleteButton(customerComponentsPage.records.last());
        await click(deleteButton);

        customerDeleteDialog = new CustomerDeleteDialog();
        await waitUntilDisplayed(customerDeleteDialog.deleteModal);
        expect(await customerDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/storeApp.customer.delete.question/);
        await customerDeleteDialog.clickOnConfirmButton();

        await waitUntilHidden(customerDeleteDialog.deleteModal);

        expect(await isVisible(customerDeleteDialog.deleteModal)).to.be.false;

        await waitUntilAnyDisplayed([customerComponentsPage.noRecords,
        customerComponentsPage.table]);
    
        const afterCount = await isVisible(customerComponentsPage.noRecords) ? 0 : await getRecordsCount(customerComponentsPage.table);
        expect(afterCount).to.eq(beforeRecordsCount);
    }); */

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
