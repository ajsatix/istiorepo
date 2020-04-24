import { browser, element, by } from 'protractor';

import NavBarPage from './../../../page-objects/navbar-page';
import SignInPage from './../../../page-objects/signin-page';
import OrderItemComponentsPage, { OrderItemDeleteDialog } from './order-item.page-object';
import OrderItemUpdatePage from './order-item-update.page-object';
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

describe('OrderItem e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let orderItemComponentsPage: OrderItemComponentsPage;
  let orderItemUpdatePage: OrderItemUpdatePage;
  /* let orderItemDeleteDialog: OrderItemDeleteDialog; */
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

  it('should load OrderItems', async () => {
    await navBarPage.getEntityPage('order-item');
    orderItemComponentsPage = new OrderItemComponentsPage();
    expect(await orderItemComponentsPage.title.getText()).to.match(/Order Items/);

    expect(await orderItemComponentsPage.createButton.isEnabled()).to.be.true;
    await waitUntilAnyDisplayed([orderItemComponentsPage.noRecords, orderItemComponentsPage.table]);

    beforeRecordsCount = (await isVisible(orderItemComponentsPage.noRecords)) ? 0 : await getRecordsCount(orderItemComponentsPage.table);
  });

  it('should load create OrderItem page', async () => {
    await orderItemComponentsPage.createButton.click();
    orderItemUpdatePage = new OrderItemUpdatePage();
    expect(await orderItemUpdatePage.getPageTitle().getAttribute('id')).to.match(/storeApp.productOrderItem.home.createOrEditLabel/);
    await orderItemUpdatePage.cancel();
  });

  /*  it('should create and save OrderItems', async () => {
        await orderItemComponentsPage.createButton.click();
        await orderItemUpdatePage.setQuantityInput('5');
        expect(await orderItemUpdatePage.getQuantityInput()).to.eq('5');
        await orderItemUpdatePage.setTotalPriceInput('5');
        expect(await orderItemUpdatePage.getTotalPriceInput()).to.eq('5');
        await orderItemUpdatePage.statusSelectLastOption();
        await orderItemUpdatePage.productSelectLastOption();
        await orderItemUpdatePage.orderSelectLastOption();
        await waitUntilDisplayed(orderItemUpdatePage.saveButton);
        await orderItemUpdatePage.save();
        await waitUntilHidden(orderItemUpdatePage.saveButton);
        expect(await isVisible(orderItemUpdatePage.saveButton)).to.be.false;

        expect(await orderItemComponentsPage.createButton.isEnabled()).to.be.true;

        await waitUntilDisplayed(orderItemComponentsPage.table);

        await waitUntilCount(orderItemComponentsPage.records, beforeRecordsCount + 1);
        expect(await orderItemComponentsPage.records.count()).to.eq(beforeRecordsCount + 1);
    }); */

  /*  it('should delete last OrderItem', async () => {

        const deleteButton = orderItemComponentsPage.getDeleteButton(orderItemComponentsPage.records.last());
        await click(deleteButton);

        orderItemDeleteDialog = new OrderItemDeleteDialog();
        await waitUntilDisplayed(orderItemDeleteDialog.deleteModal);
        expect(await orderItemDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/storeApp.productOrderItem.delete.question/);
        await orderItemDeleteDialog.clickOnConfirmButton();

        await waitUntilHidden(orderItemDeleteDialog.deleteModal);

        expect(await isVisible(orderItemDeleteDialog.deleteModal)).to.be.false;

        await waitUntilAnyDisplayed([orderItemComponentsPage.noRecords,
        orderItemComponentsPage.table]);
    
        const afterCount = await isVisible(orderItemComponentsPage.noRecords) ? 0 : await getRecordsCount(orderItemComponentsPage.table);
        expect(afterCount).to.eq(beforeRecordsCount);
    }); */

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
