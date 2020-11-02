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
  type='e';
  private options;
  private eventsData;
  private eventsData2;
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
    let req2;
    var v = new Date(Date.now()).getDate();
    var m = new Date(Date.now()).getMonth()+1;
    var y = new Date(Date.now()).getFullYear();
    var date=m+"/"+v+"/"+y;
    let loading = this.loadingCtrl.create({ enableBackdropDismiss: true });
    loading.onDidDismiss(() => {
      req.unsubscribe();
    });
    let loading2 = this.loadingCtrl.create({ enableBackdropDismiss: true });
    loading2.onDidDismiss(() => {
      req2.unsubscribe();
    });
    let body = new URLSearchParams();
    body.set('action', 'ISBGetEventsList');
    body.set('date', date);
    body.set('getPast', 'False');
    loading.present().then(() => {
      req = this.http.post( 'https://bt.the-v.net/service/api.aspx', body, this.options)
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
    let body2 = new URLSearchParams();
    body2.set('action', 'ISBGetEventsList');
    body2.set('date', date);
    body2.set('getPast', 'True');
    loading2.present().then(() => {
      req2 = this.http.post( 'https://bt.the-v.net/service/api.aspx', body2, this.options)
        .subscribe(res => {
          this.eventsData2 = res.json();
          this.eventsData2.map(data => {
            if (data.thumbnail == "")
              return data.thumbnail = './assets/imgs/icon.png';
            else
              return data.thumbnail;
          })
        }, error => {
          loading2.dismiss();
        }, () => {
          loading2.dismiss();
        })
    })
  }

  goToEventView(id: string,isPast:boolean) {
    this.storage.get(LOGGED_IN_KEY).then(isLoggedIn=>{
      if(isLoggedIn){
    this.navCtrl.push(EventsViewPage, {
      id: id,
      past:isPast
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
