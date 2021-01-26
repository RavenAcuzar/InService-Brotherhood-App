import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { Http, RequestOptions, Headers, URLSearchParams } from '@angular/http';

/**
 * Generated class for the NewsLandingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-news-landing',
  templateUrl: 'news-landing.html',
})
export class NewsLandingPage {
  url;
  news = {};
  hasLoaded = false;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private http: Http, private loadingCtrl: LoadingController) {
    this.url = this.navParams.get('url');
    let options = new RequestOptions({
      headers: new Headers({
        'Content-Type': 'application/x-www-form-urlencoded'
      })
    });
    let body = new URLSearchParams();
    body.set('action', 'getNews');
    body.set('URL', this.url);
    body.set('language', 'en');
    let req;
    let loading = this.loadingCtrl.create({ enableBackdropDismiss: true });
    loading.onDidDismiss(() => {
      req.unsubscribe();
    });
    loading.present().then(() => {
      req = this.http.post( 'https://cums.the-v.net/site.aspx', body, options)
        .subscribe(resp => {
          this.hasLoaded = true;
          //console.log(resp.json()[0])
          this.news = resp.json()[0];
        }, error => {
          loading.dismiss();
        }, () => {
          loading.dismiss();
        })
    });
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad NewsLandingPage');
  }

}
