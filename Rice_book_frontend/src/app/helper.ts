export class URL {
  public static frontendurl: string = "http://married-amount.surge.sh/"
  // public static server: string = 'http://localhost:3000';
  public static server: string = 'https://ricebookgw1423.herokuapp.com';
  public static test: string = URL.server + '/test';
  public static postNewUser: string = URL.server + '/register';
  public static postLogin: string = URL.server + '/login';
  public static putLogout: string = URL.server + '/logout';
  public static getemail: string = URL.server + '/email';
  public static getphone_number: string = URL.server + '/phone_number';
  public static getdob: string = URL.server + '/dob';
  public static getzipcode: string = URL.server + '/zipcode';
  public static putpassword: string = URL.server + '/password';
  public static putemail: string = URL.server + '/email';
  public static putPhoneNumber: string = URL.server + '/phone_number';
  public static putZipcode: string = URL.server + '/zipcode';
  public static getheadline: string = URL.server + '/headlines';
  public static putheadline: string = URL.server + '/headline';
  public static getfollowers: string = URL.server + '/following';
  public static getprofiles: string = URL.server + '/profiles';
  public static putfollower: string = URL.server + '/following';
  public static deleteFollower: string = URL.server + '/following';
  public static getAllPosts: string = URL.server + '/articles';
  public static postPost: string = URL.server + '/article';
  public static resetAll: string = URL.server + '/resetAll';
  public static putArticle: string = URL.server + '/articles';
  public static postImage: string = URL.server + "/image";
  public static getAvatar: string = URL.server + "/avatars";
  public static putAvatar: string = URL.server + "/avatar";
  public static fbLogin: string = URL.server + "/login/facebook";
  public static getName: string = URL.server + "/username";
  public static getFacebookId: string = URL.server + "/facebookId";
  public static linkcheck: string = URL.server + '/link';
  public static linkfblocal: string = URL.server + "/link/facebook_link_local";
  public static unlinkcheck: string = URL.server + '/unlink';
  public static unlinkservice: string = URL.server + '/unlink/facebook';
}
