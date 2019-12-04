import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { EventsPage } from '../events/events';
import { AppHTMLService } from '../../app/services/app.service';
import { Storage } from '@ionic/storage';
import { USER_IRID_KEY } from '../../app/app.constants';

/**
 * Generated class for the OnsitePaymentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-onsite-payment',
  templateUrl: 'onsite-payment.html',
})
export class OnsitePaymentPage {
  eventID;
  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl:AlertController,
    private appSvc:AppHTMLService, private storage:Storage) {
    this.eventID = this.navParams.get('id');
  }
  acceptTerms(){
    //call api onsite request
    this.storage.get(USER_IRID_KEY).then(irid=>{
    this.appSvc.updateOnsitePayment(this.eventID, irid).then(resp=>{
      console.log(resp);
      if(resp == "True"){
        let alert = this.alertCtrl.create({
          title: "Onsite Payment Request Sent!",
          message: "Your request to pay onsite has been submitted. We'll review your request and notify you through email.",
          buttons:[{
            text:"OK",
            role: 'cancel',
            handler: () =>{
              this.navCtrl.setRoot(EventsPage);
            }
          }]
        });
        alert.present();
      }
      else{
        let alert = this.alertCtrl.create({
          title: "Something Went wrong!",
          message: "Something went wrong while submitting request. Please try again.",
          buttons:[{
            text:"OK",
            role: 'cancel',
            handler: () =>{
              this.navCtrl.setRoot(EventsPage);
            }
          }]
        });
        alert.present();
      }
    })
  })
  }
  

}
