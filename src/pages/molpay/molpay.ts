import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, Navbar} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { USER_DATA_KEY } from '../../app/app.constants';
import { EventsPage } from '../events/events';
import { AppHTMLService } from '../../app/services/app.service';
declare var molpay: any;
/**
 * Generated class for the MolPayPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
export type PaymentDetails = {
  // Mandatory String. Values obtained from MOLPay.
  'mp_dev_mode'?: boolean,
  'mp_username': string,
  'mp_password': string,
  'mp_merchant_ID': string,
  'mp_app_name': string,
  'mp_verification_key': string,
  'mp_amount': string, // Minimum 1.01
  'mp_order_ID': string,
  'mp_currency': string,
  'mp_country': string,
  'mp_channel':string,
  'mp_bill_description': string,
  'mp_bill_name': string,
  'mp_bill_email': string,
  'mp_bill_mobile_edit_disabled': boolean,
  'mp_advanced_email_validation_enabled': boolean
}

@Component({
  selector: 'page-molpay',
  templateUrl: 'molpay.html',
})
export class MolpayPage {
  eventID;
  eventPrice;
  orderID;
  paymentDetails: PaymentDetails;
  popAlert = true;
  @ViewChild(Navbar) navBar: Navbar;
  title;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private storage: Storage, 
    private alertCtrl: AlertController, 
    private appSvc: AppHTMLService,
    private loadingCtrl: LoadingController) {
    this.orderID = this.navParams.get('orderID');
    this.eventID = this.navParams.get('id');
    this.eventPrice = this.navParams.get('price');
    this.title = this.navParams.get('title');
  }
  ionViewDidLoad() {
    this.navBar.backButtonClick = () =>{
      this.navCtrl.pop();
      this.popAlert = false;
      molpay.closeMolpay();
    }
    this.storage.get(USER_DATA_KEY).then(userdetails => {
      this.paymentDetails = {
        'mp_dev_mode': true,
        'mp_username': 'api_SB_vglobal',
        'mp_password': 'api_LG2802BaLv#',
        'mp_merchant_ID': 'SB_vglobal',
        'mp_app_name': 'vglobal',
        'mp_verification_key': '861d91c19e7e027bcaad392b8343f53e',
        'mp_amount': this.eventPrice, // Minimum 1.01
        'mp_order_ID': this.orderID,
        'mp_currency': 'MYR',
        'mp_country': 'MY',
        'mp_channel': 'credit',
        'mp_bill_description': this.title +' ticket purchase',
        'mp_bill_name': userdetails.f_name + ' ' + userdetails.m_name + '. ' + userdetails.l_name,
        'mp_bill_email': userdetails.email,
        'mp_bill_mobile_edit_disabled': false,
        'mp_advanced_email_validation_enabled': true
      }
      molpay.startMolpay(this.paymentDetails, callback => {
        //document.getElementById('expinput').removeAttribute('readonly');
        let cl = JSON.parse(callback);
        console.log(cl);
        if (cl.Error) {
          this.showAlert({
            Title: "Error!",
            Message: cl.Error
          }, this.popAlert);
        }
        else {
          this.showResult(cl, userdetails.IRID);
        }
      })
      //console.log(molpay);
    })
    
    // this.molpayView.startMolpay(paymentDetails, (error, success)=>{
    //   (error) ? console.error('Error!', error) : console.log('!Success', success);
    //   });
  }
  showResult(molpayMessage, irid) {
    switch (molpayMessage.status_code) {
      case "00":
        //success
        //call api update - paymentStatus, chksum, paydate, orderID, channel, txnID
        //TODO: API send invoice via email
        let loading = this.loadingCtrl.create({ enableBackdropDismiss: true });
        loading.present().then(() => {
          this.appSvc.updatePaymentDetails(this.eventID, irid, {
            paymentStat: molpayMessage.status_code,
            orderID: molpayMessage.order_id,
            chksum: molpayMessage.chksum,
            channel: molpayMessage.channel,
            txnID: molpayMessage.txn_ID
          }).then(resp => {
            loading.dismiss();
            //console.log(resp);
            if (resp == 'True') {
              this.showAlert({
                Title: 'Payment Success!',
                Message: 'Payment submission for Transaction #' + molpayMessage.txn_ID + ' has successfully been processed! To see your order details, go to Profile > Requests.'
              }, this.popAlert)
            }
            else {
              this.showAlert({
                Title: 'Something went wrong!',
                Message: 'Something went wrong. Please try again.'
              }, this.popAlert);
            }
          })
        })
        break;

      case "11":
        //failed
        //call api update - paymentStatus, chksum, paydate, orderID, channel, txnID
        let loading2 = this.loadingCtrl.create({ enableBackdropDismiss: true });
        loading2.present().then(() => {
          this.appSvc.updatePaymentDetails(this.eventID, irid, {
            paymentStat: molpayMessage.status_code,
            orderID: molpayMessage.order_id,
            chksum: molpayMessage.chksum,
            channel: molpayMessage.channel,
            txnID: molpayMessage.txn_ID
          }).then(resp => {
            loading2.dismiss();
            //console.log(resp);
            if (resp == 'True') {
              this.showAlert({
                Title: 'Payment Failed!',
                Message: 'Our system has detected a problem with the payment. Please try again.'
              }, this.popAlert);
            }
            else {
              this.showAlert({
                Title: 'Something went wrong!',
                Message: 'Something went wrong. Please try again.'
              }, this.popAlert);
            }
          })
        })
        break;

      default:
        //something went wrong
        this.showAlert({
          Title: 'Something went wrong!',
          Message: 'Something went wrong. Please try again.'
        }, this.popAlert);
        break;

    }
  }
  showAlert(alertType, isBack?) {
    if(isBack){
      let alert = this.alertCtrl.create({
        title: alertType.Title,
        message: alertType.Message,
        buttons: [{
          text: 'OK',
          role: 'cancel',
          handler: () => {
            this.navCtrl.setRoot(EventsPage);
          }
        }],
        enableBackdropDismiss: false
      });
      alert.present();
    }
  }
}
