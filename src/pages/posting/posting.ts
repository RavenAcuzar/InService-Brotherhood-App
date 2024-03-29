import { Component } from '@angular/core';
import { NavController, NavParams, Platform, normalizeURL, LoadingController } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { FeedService } from '../../app/services/feed.service';
import { SocialFeedPage } from '../social-feed/social-feed';
import { FilePath } from '@ionic-native/file-path';

/**
 * Generated class for the PostingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

 
@Component({
  selector: 'page-posting',
  templateUrl: 'posting.html',
})
export class PostingPage {
details = { name: "", irid: "", email: "" };
  selectedImgs: { imgSrc: any }[]=[];
  message="";
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private platform: Platform, private sanitizer: DomSanitizer,
    private camera: Camera, private file: File,
    private feedSvc:FeedService, private loadingCtrl:LoadingController,
    private filePath:FilePath) {
    this.details = this.navParams.get('details');
  }

  selectPhoto() {
    if (this.selectedImgs.length < 3) {
      let options: CameraOptions = {
        quality: 75,
        targetWidth:720,
        correctOrientation: true,
        destinationType: this.camera.DestinationType.FILE_URI,
        sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
        mediaType: this.camera.MediaType.PICTURE
      }
      this.camera.getPicture(options).then(ii => {
        //console.log(ii);
        if (this.platform.is('android')) {
          this.filePath.resolveNativePath('file://'+ii).then(newUrl => {
            //console.log(newUrl);
            this.selectedImgs.push({ imgSrc: newUrl });
            
          }).catch(e=>{
            //console.log(e);
          });
        }
        else {
          this.file.resolveLocalFilesystemUrl(ii).then(url => {
            this.selectedImgs.push({ imgSrc: url.nativeURL });
            //console.log(url.nativeURL);
          });
        }
      })
    }
  }
  postFeed(){
    if(this.message !="" || this.selectPhoto.length>0){
    let loadingPopup = this.loadingCtrl.create();
    loadingPopup.present();
    this.feedSvc.postFeed(this.details,this.message,this.selectedImgs).then(res=>{
      //console.log(res);
      if(res){
        this.navCtrl.setRoot(SocialFeedPage);
        loadingPopup.dismiss();
      }
      else{
        this.navCtrl.setRoot(SocialFeedPage,{showError:true});
        loadingPopup.dismiss();
      }
    })
  }
  }
  sanitizeUrl(url) {
    ////console.log(url);
    if (this.platform.is('ios')) {
      //console.log(normalizeURL(url));
      return this.sanitizer.bypassSecurityTrustUrl(normalizeURL(url));
    }
    else if (this.platform.is('android')) {
      ////console.log(normalizeURL(url)); 
      return this.sanitizer.bypassSecurityTrustUrl(url);
    }
    else {
      return '';
    }
  }


}
