import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { Http, RequestOptions, Headers, URLSearchParams } from '@angular/http';
import { DomSanitizer } from '@angular/platform-browser';
/**
 * Generated class for the PlayVideoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-play-video',
  templateUrl: 'play-video.html',
})
export class PlayVideoPage {
  id;
  videoDetails;
  options;
  safeVideoUrl;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private http: Http, private sanitize:DomSanitizer, private loadingCtrl:LoadingController) {
    this.options = new RequestOptions({
      headers: new Headers({
        'Content-Type': 'application/x-www-form-urlencoded'
      })
    });
    this.id = this.navParams.get('id');
    this.getVidInfo(this.id);
  }
  getVidInfo(id) {
    let body = new URLSearchParams();
    body.set('action', 'Video_GetDetails');
    body.set('idorname', id);
    let req;
    let loading = this.loadingCtrl.create({ enableBackdropDismiss: true });
    loading.onDidDismiss(()=>{
      req.unsubscribe();
    });
    loading.present().then(()=>{
    req = this.http.post( 'https://cums.the-v.net/site.aspx', body, this.options)
    .subscribe(resp=>{
      this.videoDetails = resp.json()[0];
      this.safeVideoUrl = this.sanitize.bypassSecurityTrustResourceUrl( 'http://players.brightcove.net/3745659807001/67a68b89-ec28-4cfd-9082-2c6540089e7e_default/index.html?videoId='+id);
      console.log(this.videoDetails);
    }, error=>{
      loading.dismiss();
    }, ()=>{
      loading.dismiss();
    })
  })
  }

}
