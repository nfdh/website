import { Component, OnInit } from '@angular/core';
import { GalleryItem, ImageItem } from 'ng-gallery';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {
  images: GalleryItem[];

  constructor() { 
    this.images = [
      new ImageItem({ src: "assets/slideshow/image1.jpg", thumb: "assets/slideshow/thumb.image1.jpg" }),
      new ImageItem({ src: "assets/slideshow/image2.jpg", thumb: "assets/slideshow/thumb.image2.jpg" }),
      new ImageItem({ src: "assets/slideshow/image3.jpg", thumb: "assets/slideshow/thumb.image3.jpg" }),
      new ImageItem({ src: "assets/slideshow/image4.jpg", thumb: "assets/slideshow/thumb.image4.jpg" }),
      new ImageItem({ src: "assets/slideshow/image5.jpg", thumb: "assets/slideshow/thumb.image5.jpg" }),
      new ImageItem({ src: "assets/slideshow/image6.jpg", thumb: "assets/slideshow/thumb.image6.jpg" }),
      new ImageItem({ src: "assets/slideshow/image7.jpg", thumb: "assets/slideshow/thumb.image7.jpg" }),
      new ImageItem({ src: "assets/slideshow/image8.jpg", thumb: "assets/slideshow/thumb.image8.jpg" }),
      new ImageItem({ src: "assets/slideshow/image9.jpg", thumb: "assets/slideshow/thumb.image9.jpg" }),
      new ImageItem({ src: "assets/slideshow/image10.jpg", thumb: "assets/slideshow/thumb.image10.jpg" }),
      new ImageItem({ src: "assets/slideshow/image11.jpg", thumb: "assets/slideshow/thumb.image11.jpg" }),
      new ImageItem({ src: "assets/slideshow/image12.jpg", thumb: "assets/slideshow/thumb.image12.jpg" }),
      new ImageItem({ src: "assets/slideshow/image13.jpg", thumb: "assets/slideshow/thumb.image13.jpg" }),
      new ImageItem({ src: "assets/slideshow/image14.jpg", thumb: "assets/slideshow/thumb.image14.jpg" })
    ];
  }

  ngOnInit(): void {
  }

}
