import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, Events, LoadingController } from 'ionic-angular';
import { Http, RequestOptions,Headers,URLSearchParams } from '@angular/http';
import { AppHTMLService } from '../../app/services/app.service';
import { LOGGED_IN_KEY, USER_IRID_KEY, USER_DATA_KEY } from '../../app/app.constants';
import { AppStateService } from '../../app/services/app_state.service';
import { PersonalDetailsPage } from '../personal-details/personal-details';
import { HomePage } from '../home/home';
import { Storage } from '@ionic/storage';
import { SocialFeedPage } from '../social-feed/social-feed';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

 
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  irid: string;
  password: string;
  private options;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public http: Http,
    public storage: Storage,
    public alertCtrl: AlertController,
    public events: Events,
    private loadingCtrl: LoadingController,
    private AppSvc: AppHTMLService) {
    this.options = new RequestOptions({
      headers: new Headers({
        'Content-Type': 'application/x-www-form-urlencoded'
      })
    });
  }
  checkLogin() {
    let req;
    let loading = this.loadingCtrl.create({ enableBackdropDismiss: true });
    loading.onDidDismiss(() => {
      req.unsubscribe();
    });
    loading.present().then(() => {
      let body = new URLSearchParams();
      body.set('action', 'ISBCheckLogin');
      body.set('irid', this.irid);
      body.set('password', this.password);
      req = this.http.post( 'https://bt.the-v.net/service/api.aspx', body, this.options)
        .subscribe(res => {
          if (res.text() == "True") {
            this.storage.set(LOGGED_IN_KEY, true).then(() => {
              this.storage.set(USER_IRID_KEY, this.irid).then(() => {
                this.saveUserData();
                
              })
            })
          }
          else {
            let youralert = this.alertCtrl.create({
              title: "Invalid Login!",
              buttons: [
                {
                  text: 'OK',
                  role: 'cancel',
                  handler: () => {
                  }
                }
              ]
            });
            youralert.present();
          }
          //return true if login validated, else false
        }, error => {
          loading.dismiss();
        }, () => {
          loading.dismiss();
        })
    });
  }
  saveUserData() {
    let req;
    let loading = this.loadingCtrl.create({ enableBackdropDismiss: true });
    loading.onDidDismiss(() => {
      req.unsubscribe();
    });
    loading.present().then(() => {
      this.AppSvc.getUserDetails(this.irid).then(userDetails => {
        this.storage.set(USER_DATA_KEY, userDetails);
        console.log(userDetails);
        AppStateService.publishAppStateChange(this.events);
        loading.dismiss();
        this.goToHome(userDetails.isb_grad);
      }).catch(() => {
        loading.dismiss();
      })

    });
  }
  goToAppMain() {
    let youralert = this.alertCtrl.create({
      title: "Personal Information Requirement",
      message: `Please note that these personal information, such as gender, birthdate, address, and phone number are optional fields for users who want to register.
        <br/> There is a designated section that allows registered users to submit applications for events where the same set of information is needed. In the case the user didn't provide the set of information, the user will be asked for the following information upon attempting to apply for an event.`,
      buttons: [
        {
          text: 'Agree',
          handler: () => {
            this.navCtrl.push(PersonalDetailsPage);
          }
        },
        {
          text: 'Disagree',
          role: 'cancel',
          handler: () => {
          }
        }
      ]
    });
    youralert.present();
  }
  goToHome(is_grad) {
    if(is_grad=="True"){
      this.navCtrl.setRoot(SocialFeedPage);
    }
    else{
      this.navCtrl.setRoot(HomePage);
    }
  }


}
