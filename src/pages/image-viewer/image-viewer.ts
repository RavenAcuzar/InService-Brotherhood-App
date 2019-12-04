import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Slides } from 'ionic-angular';

/**
 * Generated class for the ImageViewerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-image-viewer',
  templateUrl: 'image-viewer.html',
})
export class ImageViewerPage {
  images=[];
  index=0;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.images=this.navParams.get("images");
    this.index=this.navParams.get("index");
  }

}
