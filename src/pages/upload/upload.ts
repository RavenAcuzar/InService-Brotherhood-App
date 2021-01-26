import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, PopoverController, Navbar, AlertController, Platform, normalizeURL } from 'ionic-angular';
import { PopoverPage } from '../../app/popover';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { DomSanitizer } from '@angular/platform-browser';
import { AppHTMLService } from '../../app/services/app.service';
import { Storage } from '@ionic/storage';
import { PERSONAL_DETAILS_KEY, EXPERIENCE_DATA_KEY, RECOM_KEY } from '../../app/app.constants';
import { EventsPage } from '../events/events';
import { FilePath } from '@ionic-native/file-path';

/**
 * Generated class for the UploadPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-upload',
  templateUrl: 'upload.html',
})
export class UploadPage {
  @ViewChild(Navbar) navBar: Navbar;
  accept = false;
  passURL = '';
  imgURL = '';
  hasPass = false;
  hasImg = false;
  private win:any = window;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private popoverCtrl: PopoverController,
    private camera: Camera,
    private file: File,
    private sanitizer: DomSanitizer,
    private appSvc: AppHTMLService,
    private storage: Storage,
    private alertCtrl: AlertController,
    private platform: Platform,
    private filePath: FilePath) {
  }

  
  selectPassport() {
    let options: CameraOptions = {
      quality: 70,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      mediaType: this.camera.MediaType.PICTURE
    }
    this.camera.getPicture(options).then(ii => {
      ////console.log(ii);
      if (this.platform.is('android')) {
        this.filePath.resolveNativePath(ii).then(newUrl => {
          this.passURL = newUrl;
          this.hasPass = true;
          //console.log(this.passURL);
        });
      }
      else {
        this.file.resolveLocalFilesystemUrl(ii).then(url => {
          this.passURL = url.nativeURL;
          this.hasPass = true;
          //console.log(url.nativeURL);
        });
      }
    })
  }
  sanitizeUrl(url) {
    ////console.log(url);
    if (this.platform.is('ios')) {
      //console.log(normalizeURL(url));
      return this.sanitizer.bypassSecurityTrustUrl(normalizeURL(url));
    }
    else if (this.platform.is('android')) {
        ////console.log(normalizeURL(url)); 
        return this.win.Ionic.WebView.convertFileSrc(normalizeURL(url));
    }
    else {
      return '';
    }
  }
  selectPassImg() {
    let options: CameraOptions = {
      quality: 70,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      mediaType: this.camera.MediaType.PICTURE
    }
    this.camera.getPicture(options).then(ii => {
      if (this.platform.is('android')) {
        this.filePath.resolveNativePath(ii).then(newUrl => {
          this.imgURL = newUrl;
          this.hasImg = true;
          //console.log(this.imgURL);
        });
      }
      else {
      this.file.resolveLocalFilesystemUrl(ii).then(url => {
        this.imgURL = url.nativeURL;
        this.hasImg = true;
        //console.log(this.imgURL);
      })
    }
    })
  }
  finishReg() {
    if (this.passURL != '' && this.imgURL != '') {
      this.storage.get(PERSONAL_DETAILS_KEY).then(personal => {
        this.storage.get(EXPERIENCE_DATA_KEY).then(experience => {
          this.storage.get(RECOM_KEY).then(recom => {
            let langs;
            let gr;
            if(experience.langOthers){
              langs = experience.language.toString().replace("Others", experience.otherlanguage);
            }else
            {
              langs = experience.language.toString();
            }
            if(experience.groupOthers){
              gr =  experience.othergroup;
            }
            else{
              gr = experience.networkGroup;
            }
            this.appSvc.submitApplicationForm({
              irid: personal.irid,
              email: personal.email_add,
              f_name: personal.f_name,
              l_name: personal.l_name,
              card_name: personal.card_name,
              gender: personal.gender,
              birth: personal.myDate,
              city_address: personal.city_address,
              country_address: personal.country,
              mobile_no: personal.mob_no,
              languages: langs,
              yrs: experience.year,
              net: gr,
              upline: recom.up,
              shirt: experience.size,
              vlcGrad: experience.vlcQ,
              vlcEvent: experience.vlcEvent,
              v_pos: recom.v_pos,
              passportSrc: this.passURL,
              passImgSrc: this.imgURL
            }, experience.exps, EventsPage)
            //this.navCtrl.setRoot(EventsPage);
          })
        })
      })
    }
    else {
      let youralert = this.alertCtrl.create({
        title: "Fill All the Required Fields!",
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
  }
  showPopover() {
    let popover = this.popoverCtrl.create(PopoverPage, {}, { cssClass: 'terms' });
    popover.present();
  }
  removePhoto(type){
    if(type == 'IMAGE'){
      this.hasImg = false;
      this.imgURL = '';
    }else{
      this.hasPass = false;
      this.passURL ='';
    }
  }

}
