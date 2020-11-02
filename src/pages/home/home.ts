import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { MerchPage } from '../merch/merch';
import { ExclusivesPage } from '../exclusives/exclusives';
import { AboutPage } from '../about/about';
import { EventsViewPage } from '../events-view/events-view';
import { Http, RequestOptions, Headers, URLSearchParams } from '@angular/http';
import { MarkPage } from '../mark/mark';
import { Storage } from '@ionic/storage';
import { USER_DATA_KEY } from '../../app/app.constants';
import { LoginPage } from '../login/login';
import { Fallback2Page } from '../fallback2/fallback2';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  autoplayDelay;
  events: Array<{ id: any, img: any, month: any, day: any, year: any }> = [];
  options;
  isloop:Boolean= false;
  constructor(public navCtrl: NavController, private http: Http, private loadingCtrl: LoadingController,
    private storage:Storage) {
    // this.events = [
    //  {id:"1",img:"./assets/imgs/event.jpg",month:"JAN",day:"31",year:"2099"},
    //   {id:"2",img:"./assets/imgs/event2.jpg",month:"FEB",day:"28",year:"2060"}]
    this.options = new RequestOptions({
      headers: new Headers({
        'Content-Type': 'application/x-www-form-urlencoded'
      })
    });
    let req;
    var v = new Date(Date.now()).getDate();
    var m = new Date(Date.now()).getMonth()+1;
    var y = new Date(Date.now()).getFullYear();
    var date=m+"/"+v+"/"+y;
    let loading = this.loadingCtrl.create({ enableBackdropDismiss: true });
    loading.onDidDismiss(() => {
      req.unsubscribe();
    });
    let body = new URLSearchParams();
    body.set('action', 'ISBGetEventsList');
    body.set('date', date);
    body.set('getPast', 'False');
    loading.present().then(() => {
      req = this.http.post( 'https://bt.the-v.net/service/api.aspx', body, this.options)
        .subscribe(res => {
          var eventsData = res.json();
          eventsData.forEach(data => {
            var dArr = data.startDate2.split(" ");
            if (data.thumbnail == "")
              data.thumbnail = './assets/imgs/icon.png';
            else
              data.thumbnail;
            this.events.push({ id: data.id, img: data.thumbnail, month: dArr[1].toUpperCase(), day: dArr[0], year: dArr[2] });
          });
        }, error => {
          loading.dismiss();
        }, () => {
          loading.dismiss();
        })
    })
    if (this.events.length <= 1) {
      console.log(this.events);
      this.autoplayDelay = null;
      this.isloop = false;
    }
    else {
      this.autoplayDelay = '1500';
      this.isloop=true;
    }

  }
  goToEvent(id) {
    console.log(id);
    this.navCtrl.push(EventsViewPage, {
      id: id,
      past:false
    });
  }
  goToPage(type) {
    
    switch (type) {
      case 'Mark':
        this.checkUser(MarkPage);
        break;
      case 'Merch':
        this.navCtrl.setRoot(MerchPage);
        break;
      case 'Exclusives':
        this.checkUser(ExclusivesPage);
        break;
      case 'About':
        this.navCtrl.setRoot(AboutPage);
        break;
    }
  }
  checkUser(page){
    this.storage.get(USER_DATA_KEY).then(data=>{
      if(data){
        if(page == ExclusivesPage){
          if(data.isb_grad=='True'){
            this.navCtrl.setRoot(page);
          }
          else{
            this.navCtrl.push(Fallback2Page);
          }
        }
        else{
          this.navCtrl.setRoot(page);
        }
      }
      else{
        this.navCtrl.push(LoginPage);
      }
    })
  }
}
