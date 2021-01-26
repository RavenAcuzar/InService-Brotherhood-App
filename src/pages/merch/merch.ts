import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, Toast, ToastController } from 'ionic-angular';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import { MERCH_FAVES, LOGGED_IN_KEY } from '../../app/app.constants';
import { FavoritesService } from '../../app/services/favorites.service';
import { timeout } from 'rxjs/operators';

/**
 * Generated class for the MerchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

 
@Component({
  selector: 'page-merch',
  templateUrl: 'merch.html',
})
export class MerchPage {
  myMerchandise = [];
  loggedIn:Boolean=false;
  private isLeaving: Boolean = false;
  private toastReload: Toast;
  private merchHide: Boolean;
  constructor(public navCtrl: NavController, public navParams: NavParams
    ,private loadingController:LoadingController, protected http:Http, private storage:Storage,
    private favCtrl:FavoritesService, private toastCtrl:ToastController) {
  }

  ionViewDidLoad() {
    this.getMerch();
    this.storage.get(LOGGED_IN_KEY).then(data=>{
      this.loggedIn = data;
    })
  }
  getMerch() {
    let loadingPopup = this.loadingController.create({
      content: 'Verifying...',
      enableBackdropDismiss: true
    });
    loadingPopup.present();

    let url =  'https://cums.the-v.net/isbMerch.aspx';
    this.http.request(url)
      .pipe(timeout(4000))
      .subscribe((result: any) => {
        if (result._body == "") {
          this.merchHide = true;
          loadingPopup.dismiss();
        } else {
          this.merchHide = false;
          try {
            this.storage.get(MERCH_FAVES).then(merch=>{
            let val = JSON.parse(result._body).map(e=>{
              e.fave = this.favCtrl.containsObject(e,merch);
              return e;
           })
           ////console.log(val);
            //TODO: Map fave if true/false
            this.setValue(val);
          })
            loadingPopup.dismiss();
          }
          catch (e) {
            let toast = this.toastCtrl.create({
              message: 'Something went wrong! Reload and Try again.',
              position: 'bottom',
              showCloseButton: true,
              closeButtonText: 'Reload'
            });
            toast.onDidDismiss(() => {
              if (!this.isLeaving)
                this.getMerch();
            })
            toast.present();
            this.toastReload = toast;
            loadingPopup.dismiss();
          }
        }
      }, e => {
        let toast = this.toastCtrl.create({
          message: 'Something went wrong! Reload and Try again.',
          position: 'bottom',
          showCloseButton: true,
          closeButtonText: 'Reload'
        });
        toast.onDidDismiss(() => {
          if (!this.isLeaving)
            this.getMerch();
        })
        toast.present();
        this.toastReload = toast;
        loadingPopup.dismiss();
      }, () => {
      });
  }
  private setValue(value) {
      this.myMerchandise =value;
  }
  ionViewDidLeave() {
    this.isLeaving = true;
    if (this.toastReload)
      this.toastReload.dismiss();
  }
  addToFaves(item, index) {
    this.favCtrl.addFavorite(item, 'Merch').then(added => {
      if (added) {
        ////console.log(this.myMerchandise[index])
        this.myMerchandise[index].fave = added;
        //this.cd.markForCheck();
      }
    })
  }
  removeToFaves(item, index) {
    this.favCtrl.removeFavorite(item, 'Merch').then(removed => {
      if (removed) {
        this.myMerchandise[index].fave = !removed;
      }
    })
  }
}
