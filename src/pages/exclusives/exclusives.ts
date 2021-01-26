import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { Http, RequestOptions, Headers, URLSearchParams } from '@angular/http';
import { NewsLandingPage } from '../news-landing/news-landing';
import { PlayVideoPage } from '../play-video/play-video';
import { ImageViewerPage } from '../image-viewer/image-viewer';

/**
 * Generated class for the ExclusivesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

 
@Component({
  selector: 'page-exclusives',
  templateUrl: 'exclusives.html',
})
export class ExclusivesPage {
  type="News";
  news = [];
  end = 5;
  freeVids = [];
  gallery=[];
  apiURL="https://bt.the-v.net/service/api.aspx";
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private http: Http,
    private loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    this.loadNews();
    this.getFreeVids();
    this.loadGallery();
  }
  ////NEWS FUNCTIONS///////////
  loadNews(){
    let options = new RequestOptions({
      headers: new Headers({
        'Content-Type': 'application/x-www-form-urlencoded'
      })
    });
    let body = new URLSearchParams();
    body.set('action', 'ISBgetExclusive');
    body.set('type', 'News');
    let req;
    let loading = this.loadingCtrl.create({ enableBackdropDismiss: true });
    loading.onDidDismiss(() => {
      req.unsubscribe();
    });
    loading.present().then(() => {
      req = this.http.post(this.apiURL, body, options)
        .subscribe(resp => {
          //console.log(resp.json())
          this.news = resp.json();
          this.news.map(data => {
            return data.newsUrl = data.URL.substring(9);
          });
        }, error=>{
          loading.dismiss();
        }, ()=>{
          loading.dismiss();
        });
    });
  }
  goToNewsLanding(url: string) {
    this.navCtrl.push(NewsLandingPage, {
      url: url
    })
  }
  doInfinite(infiniteScroll) {

    setTimeout(() => {
      this.end += 5;
      infiniteScroll.complete();
    }, 500);
  }
  ////NEWS FUNCTIONS-END///////////
  ///////VIDEOS FUNCTIONS//////////
  getFreeVids() {
    let body = new URLSearchParams();
    body.set('action', 'ISBgetExclusive');
    body.set('type', 'Video');

    let options = new RequestOptions({
      headers: new Headers({
        'Content-Type': 'application/x-www-form-urlencoded'
      })
    });
    let req;
    let loading = this.loadingCtrl.create({ enableBackdropDismiss: true });
    loading.onDidDismiss(()=>{
      req.unsubscribe();
    });
    loading.present().then(()=>{
    req = this.http.post(this.apiURL, body, options)
      .subscribe(response => {
        // this.freeVids = this.freeVids.concat(response.json().filter((v) => {
        //   return v.videoPrivacy === 'public';
        // }));
        this.freeVids=response.json();
        this.freeVids.map(vid=>{
          vid.id = vid.URL.substring(16,vid.URL.length);
          vid.image = vid.image.substring(78,vid.image.length);
        }); 
        //console.log(this.freeVids);
      }, e => {
        //console.log(e);
        loading.dismiss();
      }, () => {
        loading.dismiss();
      });
    });
  }
  playVideo(id){
    this.navCtrl.push(PlayVideoPage,{
      id:id
    });
  }
  ///////VIDEOS FUNCTIONS-END//////////
  ////////GALLERY FUNCTIONS///////////
  loadGallery(){
    let body = new URLSearchParams();
    body.set('action', 'ISBgetExclusive');
    body.set('type', 'Gallery');

    let options = new RequestOptions({
      headers: new Headers({
        'Content-Type': 'application/x-www-form-urlencoded'
      })
    });
    let req;
    let loading = this.loadingCtrl.create({ enableBackdropDismiss: true });
    loading.onDidDismiss(()=>{
      req.unsubscribe();
    });
    loading.present().then(()=>{
    req = this.http.post(this.apiURL, body, options)
      .subscribe(response => {
        this.gallery = response.json();
        //console.log(this.freeVids);
      }, e => {
        //console.log(e);
        loading.dismiss();
      }, () => {
        loading.dismiss();
      });
    });
    // this.gallery = [{
    //   title:"VLC BURKINA FASO 2019",
    //   imgs:[
    //     { imgSrc:"1.jpeg" },
    //     { imgSrc:"2.jpeg" },
    //     { imgSrc:"3.jpeg" },
    //     { imgSrc:"4.jpeg" },
    //     { imgSrc:"5.jpeg" },
    //     { imgSrc:"6.jpeg" },
    //     { imgSrc:"7.jpeg" },
    //     { imgSrc:"8.jpeg" },
    //     { imgSrc:"9.jpeg" },
    //     { imgSrc:"10.jpeg" }
    //   ]
    // }]
  }
  imgPreview(images,index){
    //console.log(images);
    //console.log(index);
    this.navCtrl.push(ImageViewerPage,{
      images:images,
      index:index
    })
  }
  ////////GALLERY FUNCTIONS-END///////
}
