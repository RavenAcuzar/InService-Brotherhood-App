import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { Http, RequestOptions, Headers, URLSearchParams } from '@angular/http';
import { Storage } from '@ionic/storage';
import { LOGGED_IN_KEY } from '../../app/app.constants';
import { EventsViewPage } from '../events-view/events-view';
import { LoginPage } from '../login/login';
import { ProfilePage } from '../profile/profile';
/**
 * Generated class for the EventsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
 
@Component({
  selector: 'page-events',
  templateUrl: 'events.html',
})
export class EventsPage {
  loggedIn;
  private options;
  private eventsData;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public http: Http,
    private storage: Storage,
    private loadingCtrl: LoadingController) {
    this.storage.get(LOGGED_IN_KEY).then(loggedIn => {
      this.loggedIn = loggedIn;
    })
  }
  ionViewDidEnter(){
    this.options = new RequestOptions({
      headers: new Headers({
        'Content-Type': 'application/x-www-form-urlencoded'
      })
    });
    let req;
    let loading = this.loadingCtrl.create({ enableBackdropDismiss: true });
    loading.onDidDismiss(() => {
      req.unsubscribe();
    });
    let body = new URLSearchParams();
    body.set('action', 'ISBGetEventsList');
    loading.present().then(() => {
      req = this.http.post('http://bt.the-v.net/service/api.aspx', body, this.options)
        .subscribe(res => {
          this.eventsData = res.json();
          this.eventsData.map(data => {
            if (data.thumbnail == "")
              return data.thumbnail = './assets/imgs/icon.png';
            else
              return data.thumbnail;
          })
        }, error => {
          loading.dismiss();
        }, () => {
          loading.dismiss();
        })
    })
  }

  goToEventView(id: string) {
    this.storage.get(LOGGED_IN_KEY).then(isLoggedIn=>{
      if(isLoggedIn){
    this.navCtrl.push(EventsViewPage, {
      id: id
    });
  }
  else{
    this.navCtrl.push(LoginPage); 
  }
  })
  }
  goToProfile() {
    this.storage.get(LOGGED_IN_KEY).then(isLogged => {
      if (isLogged) {
        this.navCtrl.push(ProfilePage);
      }
      else {
        this.navCtrl.push(LoginPage);
      }
    })

  }
}
