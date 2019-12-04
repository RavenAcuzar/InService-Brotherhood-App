import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, Events, LoadingController } from 'ionic-angular';
import { Http, RequestOptions,Headers,URLSearchParams } from '@angular/http';
import { AppHTMLService } from '../../app/services/app.service';
import { LOGGED_IN_KEY, USER_IRID_KEY, USER_DATA_KEY } from '../../app/app.constants';
import { AppStateService } from '../../app/services/app_state.service';
import { PersonalDetailsPage } from '../personal-details/personal-details';
import { HomePage } from '../home/home';
import { Storage } from '@ionic/storage';

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
      req = this.http.post('http://bt.the-v.net/service/api.aspx', body, this.options)
        .subscribe(res => {
          if (res.text() == "True") {
            this.storage.set(LOGGED_IN_KEY, true).then(() => {
              this.storage.set(USER_IRID_KEY, this.irid).then(() => {
                this.saveUserData();
                this.goToHome();
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
      }).catch(() => {
        loading.dismiss();
      })

    });
  }
  goToAppMain() {
    let youralert = this.alertCtrl.create({
      title: "Personal Information Requirement",
      message: `Please note that these personal information, such as gender, birthdate, address, zipcode, and phone number are required details from users to grant exclusive access to the app.
        <br/> There is a designated section that allows registered users to submit applications for events that require the same set of information.`,
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
  goToHome() {
    this.navCtrl.setRoot(HomePage);
  }


}
