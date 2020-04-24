import { browser, element, by } from 'protractor';

import NavBarPage from './../../../page-objects/navbar-page';
import SignInPage from './../../../page-objects/signin-page';
import ProductCategoryComponentsPage, { ProductCategoryDeleteDialog } from './product-category.page-object';
import ProductCategoryUpdatePage from './product-category-update.page-object';
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

describe('ProductCategory e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let productCategoryComponentsPage: ProductCategoryComponentsPage;
  let productCategoryUpdatePage: ProductCategoryUpdatePage;
  let productCategoryDeleteDialog: ProductCategoryDeleteDialog;
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

  it('should load ProductCategories', async () => {
    await navBarPage.getEntityPage('product-category');
    productCategoryComponentsPage = new ProductCategoryComponentsPage();
    expect(await productCategoryComponentsPage.title.getText()).to.match(/Product Categories/);

    expect(await productCategoryComponentsPage.createButton.isEnabled()).to.be.true;
    await waitUntilAnyDisplayed([productCategoryComponentsPage.noRecords, productCategoryComponentsPage.table]);

    beforeRecordsCount = (await isVisible(productCategoryComponentsPage.noRecords))
      ? 0
      : await getRecordsCount(productCategoryComponentsPage.table);
  });

  it('should load create ProductCategory page', async () => {
    await productCategoryComponentsPage.createButton.click();
    productCategoryUpdatePage = new ProductCategoryUpdatePage();
    expect(await productCategoryUpdatePage.getPageTitle().getAttribute('id')).to.match(
      /storeApp.productProductCategory.home.createOrEditLabel/
    );
    await productCategoryUpdatePage.cancel();
  });

  it('should create and save ProductCategories', async () => {
    await productCategoryComponentsPage.createButton.click();
    await productCategoryUpdatePage.setNameInput('name');
    expect(await productCategoryUpdatePage.getNameInput()).to.match(/name/);
    await productCategoryUpdatePage.setDescriptionInput('description');
    expect(await productCategoryUpdatePage.getDescriptionInput()).to.match(/description/);
    await waitUntilDisplayed(productCategoryUpdatePage.saveButton);
    await productCategoryUpdatePage.save();
    await waitUntilHidden(productCategoryUpdatePage.saveButton);
    expect(await isVisible(productCategoryUpdatePage.saveButton)).to.be.false;

    expect(await productCategoryComponentsPage.createButton.isEnabled()).to.be.true;

    await waitUntilDisplayed(productCategoryComponentsPage.table);

    await waitUntilCount(productCategoryComponentsPage.records, beforeRecordsCount + 1);
    expect(await productCategoryComponentsPage.records.count()).to.eq(beforeRecordsCount + 1);
  });

  it('should delete last ProductCategory', async () => {
    const deleteButton = productCategoryComponentsPage.getDeleteButton(productCategoryComponentsPage.records.last());
    await click(deleteButton);

    productCategoryDeleteDialog = new ProductCategoryDeleteDialog();
    await waitUntilDisplayed(productCategoryDeleteDialog.deleteModal);
    expect(await productCategoryDeleteDialog.getDialogTitle().getAttribute('id')).to.match(
      /storeApp.productProductCategory.delete.question/
    );
    await productCategoryDeleteDialog.clickOnConfirmButton();

    await waitUntilHidden(productCategoryDeleteDialog.deleteModal);

    expect(await isVisible(productCategoryDeleteDialog.deleteModal)).to.be.false;

    await waitUntilAnyDisplayed([productCategoryComponentsPage.noRecords, productCategoryComponentsPage.table]);

    const afterCount = (await isVisible(productCategoryComponentsPage.noRecords))
      ? 0
      : await getRecordsCount(productCategoryComponentsPage.table);
    expect(afterCount).to.eq(beforeRecordsCount);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
