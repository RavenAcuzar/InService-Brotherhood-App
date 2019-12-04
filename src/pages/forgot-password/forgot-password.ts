import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { ConfirmationPage } from '../confirmation/confirmation';
import { Storage } from '@ionic/storage';
import { USER_IRID_KEY } from '../../app/app.constants';
import { RequestOptions, Http, Headers, URLSearchParams } from '@angular/http';

/**
 * Generated class for the ForgotPasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html',
})
export class ForgotPasswordPage {
  c_pass = '';
  n_pass = '';
  cn_pass = '';
  options;
  not_confirmed: boolean = true;
  submit_enabled = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController,
    public storage: Storage, public http: Http, private alterCtrl: AlertController) {
    this.options = new RequestOptions({
      headers: new Headers({
        'Content-Type': 'application/x-www-form-urlencoded'
      })
    });
  }
  inputchange() {
    console.log("text change!");
    if (this.not_confirmed) {
      if (this.c_pass == '') {

        this.submit_enabled = false;
      }
      else {
        this.submit_enabled = true;
      }
    }
    else {
      if (this.n_pass == '' || this.cn_pass == '') {
        this.submit_enabled = false;
      }
      else if (this.n_pass == this.cn_pass) {
        this.submit_enabled = true;
      }
      else {
        this.submit_enabled = false;
      }
    }

  }

  //check account
  //show loading modal
  //if true show additional two inputs for new password and confirm password
  //then if success go to confirmation page
  goToConfirmation() {
    if (this.not_confirmed) {
      let req;
      let loading = this.loadingCtrl.create({ enableBackdropDismiss: true });
      loading.onDidDismiss(() => {
        req.unsubscribe();
      });
      this.storage.get(USER_IRID_KEY).then(irid => {
        loading.present().then(() => {
          let body = new URLSearchParams();
          body.set('action', 'ISBCheckLogin');
          body.set('irid', irid);
          body.set('password', this.c_pass);
          req = this.http.post('http://bt.the-v.net/service/api.aspx', body, this.options)
            .subscribe(res => {
              if (res.text() == "True") {
                this.not_confirmed = false;
                this.submit_enabled = false;
              }
              else {
                this.not_confirmed = true;
                this.c_pass = '';
                let alert = this.alterCtrl.create({
                  title: "Wrong Password entered!",
                  buttons: [
                    {
                      text: "OK",
                      role: 'cancel',
                      handler: () => {
                        alert.dismiss();
                        return false;
                      }
                    }
                  ]
                })
                alert.present();
              }
              //return true if login validated, else false
            }, error => {
              loading.dismiss();
            }, () => {
              loading.dismiss();
            })
        });
      });
    }
    else {

      console.log("Change password clicked!")
      //change password
      //redirect confirmation
      let req;
      let loading = this.loadingCtrl.create({ enableBackdropDismiss: true });
      loading.onDidDismiss(() => {
        req.unsubscribe();
      });
      this.storage.get(USER_IRID_KEY).then(irid => {
        loading.present().then(() => {
          let body = new URLSearchParams();
          body.set('action', 'ISBChangePassword');
          body.set('irid', irid);
          body.set('password', this.c_pass);
          body.set('n_password', this.n_pass);
          req = this.http.post('http://bt.the-v.net/service/api.aspx', body, this.options)
            .subscribe(res => {
              if (res.text() == "True") {
                //redirect to confirm
                this.navCtrl.push(ConfirmationPage, {'irid':irid});
              }
              else {
                //show error
                let alert = this.alterCtrl.create({
                  title: "Error encountered while trying to change password!",
                  buttons: [
                    {
                      text: "OK",
                      role: 'cancel',
                      handler: () => {
                        alert.dismiss();
                        return false;
                      }
                    }
                  ]
                })
                alert.present();
              }
              //return true if login validated, else false
            }, error => {
              loading.dismiss();
            }, () => {
              loading.dismiss();
            })
        });
      });

    }

  }


}