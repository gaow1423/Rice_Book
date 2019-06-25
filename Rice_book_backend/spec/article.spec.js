// Test suit for article
const Utility = require('../src/Utility.js');
const fetch = require('isomorphic-fetch');
const url = path => `https://gwricebook.herokuapp.com${path}`;
// const url = path => `http://localhost:3000${path}`;
describe('Validate article functionality', () => {
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

  it('should return at least 5 articles if test user is logged in user', done => {
    myHeaders.append('Cookie', cookie);
    fetch(url('/articles'), {
      method: 'Get',
      headers: myHeaders
    })
      .then(r => r.json())
      .then(r => {
        // console.log(r);
        expect(r).toBeDefined();
        expect(r.article.length).toBe(5);
        done();
      });
  });

  it('should get the post with invalid id', done => {
    myHeaders.append('Cookie', cookie);
    fetch(url('/articles' + '/-1'), {
      method: 'Get',
      headers: myHeaders
    })
      .then(r => r.json())
      .then(r => {
        // console.log(r);
        // expect(r).toBeDefined();
        // expect(r.article.length).toBe(5);
        expect(r).toBeDefined();
        expect(r.article.length).toBe(0); //indicate that it does not find any post with invalid id.
        done();
      });
  });

  it('should get the post with valid id', done => {
    myHeaders.append('Cookie', cookie);
    fetch(url('/articles' + '/0'), {
      method: 'Get',
      headers: myHeaders
    })
      .then(r => r.json())
      .then(r => {
        expect(r).toBeDefined();
        expect(r.article.length).toBe(1); //indicate that it find the post with valid id.
        done();
      });
  });

  it('should add a article for logged in user', done => {
    myHeaders.append('Cookie', cookie);
    fetch(url('/article'), {
      method: 'Post',
      headers: myHeaders,
      body: JSON.stringify({
        text: 'This is the new post'
      })
    })
      .then(r => r.json())
      .then(r => {
        expect(r).toBeDefined();
        expect(r.article.length).toBe(Utility.posts.length + 1);
        expect(r.article[0].text).toBe('This is the new post');
        done();
      });
  });
});
