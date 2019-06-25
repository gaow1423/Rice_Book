import { AppPage } from './app.po';
import { browser, element, by } from 'protractor';
import { domRendererFactory3 } from '@angular/core/src/render3/interfaces/renderer';
import { doesNotThrow } from 'assert';

describe('Ricebook End to End test', () => {
  let page: AppPage;
  var testUsername;
  var testPassword;

  beforeEach(() => {
    page = new AppPage();
    testUsername = 'test1';
    testPassword = 'password1';
  });

  it('should display welcome message', done => {
    page.navigateToLogin();
    page.resetAllToLogin().then(() => {
      done();
    });

    // expect(page.getParagraphText()).toEqual('Welcome to authUsers!');
    // expect(page.getParagraphText()).toEqual('Welcome to Rice App');
  });

  it('should register new user', () => {
    expect(
      page.PageEnterAllFields(
        'e2e',
        'e2eTest',
        '123@gmail.com',
        '12345',
        '5413688399',
        '08051995',
        '11111'
      )
    ).toEqual('Success!');
  });

  it('should log in a valid user', done => {
    page.login('e2e', '12345').then(() => {
      expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + '/#/main');
      done();
    });
  });

  it('should create a article', done => {
    // page.login('e2e', '12345').then(() => {
    //   expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + '/#/main');
    //   done();
    // });
    page.addArticle('This is new post from e2e').then(() => {
      let firstpost = element.all(by.css('.post_item')).get(0);
      expect(firstpost.element(by.id('post_author')).getText()).toBe('e2e');
      expect(firstpost.element(by.id('feeds')).getText()).toBe(
        'This is new post from e2e'
      );
      done();
    });
  });

  it('should update headline and verify change', done => {
    page.updateheadline('This is new headline from e2e').then(() => {
      expect(element(by.id('user_status')).getText()).toBe(
        'This is new headline from e2e'
      );
      done();
    });
  });

  it('should logout the loggedin user', done => {
    page.logout().then(() => {
      expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + '/#/auth');
      done();
    });
  });

  it('should login the test user', done => {
    page.login(testUsername, testPassword).then(() => {
      expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + '/#/main');
      done();
    });
  });

  it("should Search for a keyword that matches only one of test user's articles and verify only one article shows, and verify the author", done => {
    page.search('how are you today');
    var posts = element.all(by.css('.post_item'));
    expect(element.all(by.css('.post_item')).count()).toBe(1);
    expect(
      element
        .all(by.css('.post_item'))
        .get(0)
        .element(by.id('post_author'))
        .getText()
    ).toBe(testUsername);
    expect(
      posts
        .get(0)
        .element(by.id('feeds'))
        .getText()
    ).toBe('how are you today');
    done();
  });

  it('should logout the test user', done => {
    page.logout().then(() => {
      expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + '/#/auth');
      done();
    });
  });
});
