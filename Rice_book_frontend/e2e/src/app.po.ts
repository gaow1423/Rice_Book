import { browser, by, element } from 'protractor';
import { HttpBackend } from '@angular/common/http';

export class AppPage {
  // constructor(private http: HttpClient) {}
  navigateToLogin() {
    return browser.get('/#/auth') as Promise<any>;
  }

  resetAllToLogin() {
    // this.http.get<any>('http://localhost:3000/resetAll').subscribe(() => {});
    // return browser.get('/resetAll') as Promise<any>;
    return element(by.id('reset')).click();
  }

  // getParagraphText() {
  //   return 'Welcome to Rice App';
  // }

  PageEnterAllFields(
    username: string,
    display_name: string,
    email: string,
    password: string,
    phone: string,
    dob: string,
    zipcode: string
  ) {
    element(by.id('username')).sendKeys(username);
    element(by.id('display_name')).sendKeys(display_name);
    element(by.id('email')).sendKeys(email);
    element(by.id('password')).sendKeys(password);
    element(by.id('phone')).sendKeys(phone);
    element(by.id('birth')).sendKeys(dob);
    element(by.id('zipcode')).sendKeys(zipcode);
    element(by.id('sign_on')).click();
    return element(by.id('regis_result')).getText();
  }

  login(username, password) {
    element(by.id('login_username')).sendKeys(username);
    element(by.id('login_password')).sendKeys(password);
    return element(by.id('loginbtn')).click();
  }

  addArticle(text: string) {
    element(by.id('post_text')).sendKeys(text);
    return element(by.id('post_btn')).click();
  }

  updateheadline(headline: string) {
    element(by.id('status_text')).sendKeys(headline);
    return element(by.id('udbtn')).click();
  }

  logout() {
    return element(by.id('logoutbtn')).click();
  }

  search(text: string) {
    element(by.id('searchBar')).sendKeys(text);
  }
}
