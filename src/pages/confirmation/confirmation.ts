import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, AlertController, Navbar } from 'ionic-angular';
import { ProfilePage } from '../profile/profile';
import { RequestOptions, Http, Headers, URLSearchParams } from '@angular/http';

/**
 * Generated class for the ConfirmationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
 
@Component({
  selector: 'page-confirmation',
  templateUrl: 'confirmation.html',
})
export class ConfirmationPage {
  @ViewChild(Navbar) navBar: Navbar;
  irid;
  options;
  name;
  email;
  constructor(public navCtrl: NavController, public navParams: NavParams, private http:Http, private alertCtrl:AlertController) {
   this.irid = this.navParams.get('irid'); 
   this.options = new RequestOptions({
    headers: new Headers({
        'Content-Type': 'application/x-www-form-urlencoded'
    })
});
  }

  ionViewDidLoad(){
    this.navBar.backButtonClick = () => {
      this.navCtrl.setRoot(ProfilePage);
    }
    this.getUserData();
  }
  getUserData(){
    let body = new URLSearchParams();
    body.set('action', 'ISBGetUserData');
    body.set('irid', this.irid);
    this.http.post('http://bt.the-v.net/service/api.aspx', body,this.options)
    .subscribe(resp=>{
      if((resp.json()[0] != null)&&(resp.json()[0].status=='Approved')){
        this.email=resp.json()[0].email;
        this.name=resp.json()[0].f_name.toUpperCase();
        this.sendEmail(this.email,this.irid);
      }
    });
  }
  sendEmail(email,irid){
    let params = new URLSearchParams();
        params.set('action', 'ISBSendEmail');
        params.set('irid', irid);
        params.set('email',email);
        this.http.post('http://bt.the-v.net/service/api.aspx', params,this.options)
        .subscribe(respon=>{
          console.log(respon.text());
          if(respon.text()!='Email Sent!')
          {
            let youralert = this.alertCtrl.create({
              title: "Error Sending Email!",
              message:  "Error occured while sending your email. Please Try again.",
              buttons: [
                {
                  text: 'OK',
                  role: 'cancel',
                  handler: () => {
                    youralert.dismiss()
                    return false;
                  }
                }
              ]
            });
            youralert.present();
          }
        })
  }
}
