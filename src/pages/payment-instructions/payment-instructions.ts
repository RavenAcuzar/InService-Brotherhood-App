import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, AlertController, Slides, LoadingController, Platform } from 'ionic-angular';
import { MolpayPage } from '../molpay/molpay';
import { FileTransfer } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { OnsitePaymentPage } from '../onsite-payment/onsite-payment';
import { AppHTMLService } from '../../app/services/app.service';
import { Base64ToGallery } from '@ionic-native/base64-to-gallery';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { PhotoLibrary } from '@ionic-native/photo-library';

/**
 * Generated class for the PaymentInstructionsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var cordova: any;

@Component({
  selector: 'page-payment-instructions',
  templateUrl: 'payment-instructions.html',
})
export class PaymentInstructionsPage {
  @ViewChild(Slides) slides: Slides;

  eventID;
  paymentImages = [];
  price;
  paymentStat;
  orderID;
  retype: boolean = false;
  showSlides: boolean = false;
  participant: boolean = false;
  pending: boolean = false;
  downloadLocation: string = '';
  storageDirectory: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController,
    private transfer: FileTransfer, private file: File, private svc: AppHTMLService, private base64ToGallery: Base64ToGallery,
    private loadingCtrl: LoadingController, private platform: Platform,
    private androidPermissions: AndroidPermissions, private photoLibrary:PhotoLibrary) {
    this.orderID = this.navParams.get('orderID');
    this.eventID = this.navParams.get('id');
    this.price = this.navParams.get('price');
    this.paymentStat = this.navParams.get('pStat');
    if (this.paymentStat == '11' || !this.paymentStat) {
      this.retype = true;
    }
    else {
      this.retype = false;
    }
    if (!this.retype) {
      //show slides for paid or onsite inservice requests
      if ((this.navParams.get('requestType') == 'Serve' && (this.paymentStat == '00' || this.paymentStat == '22'))) {
        this.svc.getEventImages(this.eventID).then(items => {
          console.log(items);
          if(items.moUrl !=""){
            this.paymentImages.push(items.moUrl);
          }
          if(items.thingsUrl !=""){
             this.paymentImages.push(items.thingsUrl);}

          if(items.mapUrl !=""){
            this.paymentImages.push(items.mapUrl);
          }
          this.showSlides = true;
        })
        if (this.platform.is('cordova')) {
          this.downloadLocation = this.file.cacheDirectory;
        }

      }
      else {
        this.showSlides = false;
      }
      //participant request state
      if (this.navParams.get('requestType') == 'Participate') {
        if (this.paymentStat == '00') {
          this.svc.getEventImages(this.eventID).then(items => {
            console.log(items);
            if(items.participantMoUrl !=""){
              this.paymentImages.push(items.participantMoUrl);
            }
            if(items.participantThingsUrl !=""){
               this.paymentImages.push(items.participantThingsUrl);}
  
            if(items.mapUrl !=""){
              this.paymentImages.push(items.mapUrl);
            }
            this.showSlides = true;
          })
          if (this.platform.is('cordova')) {
            this.downloadLocation = this.file.cacheDirectory;
          }
        }
        if (this.paymentStat == '22') {
          this.pending = true;
        } else {
          this.pending = false;
        }
      }
      else {
        this.showSlides = false;
      }
    }

    //TODO: API fetch confirmation,MO,Things to bring, and Map
    // this.paymentImages = [
    //   "./assets/imgs/general.jpg",
    //   "./assets/imgs/mission.jpg",
    //   "./assets/imgs/things.jpg",
    //   "./assets/imgs/map.jpg",
    // ]
  }
  ionViewDidEnter() {
    if ((this.navParams.get('requestType') == 'Serve' && (this.paymentStat == '00' || this.paymentStat == '22'))) {
      this.checkPermission();
    }
    else if(this.navParams.get('requestType') == 'Participate' && (this.paymentStat == '00')){
      this.checkPermission(); 
    }
  }

  slideChange() {
    let paymentAlert;
    if (this.slides.getActiveIndex() == (this.paymentImages.length - 1)) {
      if (this.paymentStat == '11' || !this.paymentStat) {
        paymentAlert = this.alertCtrl.create({
          title: "Proceed to Payment",
          message: "Please choose your payment method.",
          buttons: [{
            text: "Credit Card",
            handler: () => {
              this.goToMolPay();
            }
          }, {
            text: "Onsite Payment",
            handler: () => {
              this.onSitePayment();
            }
          }, {
            text: "Cancel",
            role: 'cancel',
            handler: () => {
            }
          }]
        });
        paymentAlert.present();
      }
    }
  }
  checkPermission() {
    if (this.platform.is('android')) {
      return this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE).then(result => {
        if (result.hasPermission) {
          return true;
        } else {
          return this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE).then(a => {
            if (!a.hasPermission) {
              let alert = this.alertCtrl.create({
                title: 'Permission not allowed',
                subTitle: 'You cannot access this app\'s feature without allowing the storage permission.',
                buttons: [{
                  text: 'Ok',
                  handler: () => {
                    alert.dismiss();
                    return false;
                  }
                }],
                cssClass: 'alertDanger'
              });
              alert.present();
            }
            return a.hasPermission;
          }).catch(e => {
            console.log(JSON.stringify(e));
            let alert = this.alertCtrl.create({
              title: 'Permission not allowed',
              subTitle: 'You cannot access this app\'s feature without allowing the storage permission.',
              buttons: [{
                text: 'Ok',
                handler: () => {
                  alert.dismiss();
                  return false;
                }
              }],
              cssClass: 'alertDanger'
            });
            alert.present();
            return false;
          });
        }
      }).catch(e => {
        return this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE);
      });
    } else {
      return this.photoLibrary.requestAuthorization().then(re=>{
        return re;
      })
    }
  }
  onSitePayment() {
    this.navCtrl.push(OnsitePaymentPage, { orderID: this.orderID, id: this.eventID, price: this.price });
  }
  goToMolPay() {
    this.navCtrl.push(MolpayPage, {
      orderID: this.orderID,
      id: this.eventID,
      price: this.price,
      title:this.navParams.get('title')
    });
  }
  download(url: string) {

      let loadingPopup = this.loadingCtrl.create({
        content: 'Downloading...',
        enableBackdropDismiss: true
      });
      loadingPopup.present();
      const fileTransferObject = this.transfer.create();
      let imagePath = this.downloadLocation + 'isb_'+Date.now().toString()+'.png';
      console.log(url);
      fileTransferObject.download(url, imagePath, true).then((entry) => {
        entry.file((file) => {
          let image = new Image();
          image.src = imagePath;
          image.onload = () => {
            let canvas = document.createElement('canvas');
            let context = canvas.getContext('2d');

            canvas.height = image.height;
            canvas.width = image.width;

            context.drawImage(image, 0, 0, image.width, image.height);
            this.base64ToGallery.base64ToGallery(canvas.toDataURL(), { prefix: '_img', mediaScanner:true  }).then(libraryItem => {
              loadingPopup.dismiss();
              //canvas.remove();

              let alert = this.alertCtrl.create({
                title: 'Download successful!',
                subTitle: 'The image has now been downloaded to your photo library.',
                buttons: [{
                  text: 'Ok',
                  handler: () => {
                    alert.dismiss();
                    return false;
                  }
                }],
                cssClass: 'alert'
              });
              alert.present();
            }).catch(e => {
              loadingPopup.dismiss();
              console.log(e);
              this.onErrorWithWallpaperDownload(e);
            });
          };
          image.onerror = (error) => {
            console.log(error);
            loadingPopup.dismiss();
            let alert = this.alertCtrl.create({
              title: 'Cannot download!',
              subTitle: 'Something went wrong.',
              buttons: [{
                text: 'Ok',
                handler: () => {
                  alert.dismiss();
                  return false;
                }
              }],
              cssClass: 'alertDanger'
            });
            alert.present();
          };
          
        }, e => {
          loadingPopup.dismiss();
          this.onErrorWithWallpaperDownload(e);
        });
      }).catch((error) => {
        loadingPopup.dismiss();
        let alert = this.alertCtrl.create({
          title: 'Error occurred!',
          subTitle: 'The image was not downloaded successfully. Please try again.',
          buttons: [{
            text: 'Ok',
            handler: () => {
              alert.dismiss();
              return false;
            }
          }],
          cssClass: 'alertDanger'
        });
        alert.present();
      });
  }

  saveImage() {
    this.download(this.paymentImages[this.slides.getActiveIndex()]);
  }
  private onErrorWithWallpaperDownload(error) {
    let alert = this.alertCtrl.create({
      title: 'Error occurred!',
      subTitle: 'Cannot open the downloaded image. Please try again.',
      buttons: [{
        text: 'Ok',
        handler: () => {
          alert.dismiss();
          return false;
        }
      }],
      cssClass: 'alertDanger'
    });
    alert.present();
  }
}
