// Test suit for auth

const fetch = require('isomorphic-fetch');
const url = path => `https://gwricebook.herokuapp.com${path}`;
// const url = path => `http://localhost:3000${path}`;
describe('Validate auth functionality', () => {
  let myHeaders;
  let testUsername;
  let testPassword;
  let displayname;
  let cookie;

  beforeEach(() => {
    myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    testUsername = 'tu1';
    testPassword = 'testuser1234';
    displayname = 'testUser';
  });

  it('Reset the database with initiate dataset', done => {
    fetch(url('/resetAll'), {
      method: 'GET',
      headers: myHeaders
    })
      .then(r => r.json())
      .then(r => {
        expect(r).toBeDefined();
        expect(r.result).toBe('success');
        done();
      });
  });
  it('should register a new user.', done => {
    fetch(url('/register'), {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify({
        username: testUsername,
        password: testPassword,
        display_name: displayname,
        email_address: '123@gmail.com',
        phone_number: '1111111111',
        DOB: '1999-09-09',
        zipcode: '12345'
      })
    })
      .then(r => r.json())
      .then(r => {
        expect(r).toBeDefined();
        expect(r.result).toBe('success');
        expect(r.username).toBe(testUsername);
        done();
      });
  });

  it('should not register the user already exist', done => {
    fetch(url('/register'), {
      method: 'Post',
      headers: myHeaders,
      body: JSON.stringify({
        username: testUsername,
        password: testPassword,
        display_name: displayname,
        email_address: '123@gmail.com',
        phone_number: '1111111111',
        DOB: '1999-09-09',
        zipcode: '12345'
      })
    })
      .then(r => r.json())
      .then(r => {
        expect(r).toBeDefined();
        expect(r.result).not.toBe('success');
        done();
      });
  });

  it('should not login a user with wrong password', done => {
    fetch(url('/login'), {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify({
        username: testUsername,
        password: testPassword + '11'
      })
    })
      .then(r => r.json())
      .then(r => {
        expect(r).toBeDefined();
        expect(r.result).not.toBe('success');
        done();
      });
  });

  it('should not login a user with wrong username, or the user does not exist', done => {
    fetch(url('/login'), {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify({
        username: testUsername + '11',
        password: testPassword
      })
    })
      .then(r => r.json())
      .then(r => {
        expect(r).toBeDefined();
        expect(r.result).not.toBe('success');
        done();
      });
  });

  it('should login with correct username and password', done => {
    fetch(url('/login'), {
      method: 'Post',
      headers: myHeaders,
      body: JSON.stringify({
        username: testUsername,
        password: testPassword
      })
    })
      .then(r => {
        cookie = r.headers._headers['set-cookie'];
        return r.json();
      })
      .then(r => {
        expect(r).toBeDefined();
        expect(r.result).toBe('success');
        expect(r.username).toBe(testUsername);
        done();
      });
  });

  it('should logout a user if he was logged in.', done => {
    myHeaders.append('Cookie', cookie);
    fetch(url('/logout'), {
      method: 'PUT',
      headers: myHeaders,
      body: JSON.stringify({})
    })
      .then(r => r.json())
      .then(r => {
        expect(r).toBeDefined();
        expect(r.result).toBe('OK');
        done();
      });
  });

  it('should not logout a user if he was not logged in.', done => {
    // myHeaders.append('Cookie', cookie);
    fetch(url('/logout'), {
      method: 'PUT',
      headers: myHeaders,
      body: JSON.stringify({})
    })
      .then(r => r.json())
      .then(r => {
        expect(r).toBeDefined();
        expect(r.result).toBe('failed');
        done();
      });
  });
});
