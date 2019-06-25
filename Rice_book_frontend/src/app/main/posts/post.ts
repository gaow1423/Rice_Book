export class Post {
  name: string;
  image: string;
  text: string;
  timestamp: string;

  constructor(name: string, image: string, text: string, timestamp: string) {
    this.name = name;
    this.image = image;
    this.text = text;
    this.timestamp = timestamp;
  }
}
