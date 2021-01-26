import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { USER_DATA_KEY } from '../../app/app.constants';
import { AppHTMLService } from '../../app/services/app.service';
import { ForgotPasswordPage } from '../forgot-password/forgot-password';

/**
 * Generated class for the ProfileViewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-profile-view',
  templateUrl: 'profile-view.html',
})
export class ProfileViewPage {
 gender;
  profileDetails = {};
  bday;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage,
    private appScv:AppHTMLService) {
  }

  ionViewDidLoad() {
    this.storage.get(USER_DATA_KEY).then(userDetail => {
      //console.log(userDetail);
      this.profileDetails = userDetail;
      if (userDetail.gender == 'False')
        this.gender = "Male";
      else
        this.gender = "Female";
      this.bday = this.appScv.dateFormatter(userDetail.birth);
    });
  }
  goToCreateAccount(){
    this.navCtrl.push(ForgotPasswordPage);
  }

}
