import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { USER_DATA_KEY } from '../../app/app.constants';

/**
 * Generated class for the AboutPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
})
export class AboutPage {
  hideThis=true;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public storage:Storage) {
  }

  ionViewDidLoad() {
    this.storage.get(USER_DATA_KEY).then(userDetails => {
      //console.log(userDetails.isb_grad);
      if (userDetails.isb_grad == 'True') {
        this.hideThis=false;
      }
    });
  }

}
