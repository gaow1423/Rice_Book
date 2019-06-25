// Test suit for auth
const Utility = require('../src/Utility.js');
const fetch = require('isomorphic-fetch');
const url = path => `https://gwricebook.herokuapp.com${path}`;
// const url = path => `http://localhost:3000${path}`;
describe('Validate profile functionality', () => {
  let myHeaders;
  let testUsername;
  let testPassword;
  let displayname;
  let cookie;

  beforeEach(() => {
    myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    testUsername = Utility.testuser.username;
    testPassword = Utility.testuser.password;
    displayname = Utility.testuser.display_name;
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
        // console.log('login' + r);
        expect(r).toBeDefined();
        expect(r.result).toBe('success');
        expect(r.username).toBe(testUsername);
        done();
      });
  });

  it('should get the headline of loggedin User', done => {
    myHeaders.append('Cookie', cookie);
    fetch(url('/headlines/'), {
      method: 'GET',
      headers: myHeaders
      //   body: JSON.stringify({})
    })
      .then(r => r.json())
      .then(r => {
        // console.log('hello');
        // console.log(r);
        expect(r).toBeDefined();
        expect(r.headlines[0].username).toBe(testUsername);
        expect(r.headlines[0].headline).toBe(Utility.testuser.status);
        done();
      });
  });

  it('should be able to update the headline of logged in user', done => {
    myHeaders.append('Cookie', cookie);
    fetch(url('/headline'), {
      method: 'PUT',
      headers: myHeaders,
      body: JSON.stringify({ headline: 'This is the updated headline' })
    })
      .then(r => r.json())
      .then(r => {
        // console.log(r);
        expect(r).toBeDefined();
        expect(r.username).toBe(testUsername);
        expect(r.headline).toBe('This is the updated headline');
        done();
      });
  });
});
