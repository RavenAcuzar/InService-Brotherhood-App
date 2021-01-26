import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { AppHTMLService } from '../../app/services/app.service';
import { Storage } from '@ionic/storage';
import { USER_IRID_KEY, LOGGED_IN_KEY, USER_DATA_KEY } from '../../app/app.constants';
import { PaymentInstructionsPage } from '../payment-instructions/payment-instructions';
import { UpdatePersonalInfoPage } from '../update-personal-info/update-personal-info';

/**
 * Generated class for the EventsViewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-events-view',
  templateUrl: 'events-view.html'
})
export class EventsViewPage {
  private eventURL;
  private options;
  private eventDetails = [];
  private subEvents;
  private hasSub: boolean = false;
  subs: any;
  disabled: boolean = false;
  disabled2: boolean = false;
  userEmail;
  title: string;
  showalert: boolean;
  fromPast: boolean;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public http: Http,
    public appSvc: AppHTMLService,
    public storage: Storage,
    public alertCtrl: AlertController,
    private loadingCtrl: LoadingController
  ) {
    this.eventURL = this.navParams.get('id');
    this.fromPast = this.navParams.get('past');
    this.options = new RequestOptions({
      headers: new Headers({
        'Content-Type': 'application/x-www-form-urlencoded'
      })
    });
  }

  getAlert(alert) {
    if (this.showalert) {
      alert.present();
    }
  }
  setDetails(val) {
    this.eventDetails = val;
    this.title = val.title;
  }
  setEmail(val) {
    this.userEmail = val;
  }
  ionViewWillEnter() { }
  ionViewDidEnter() {
    let req;
    let loading = this.loadingCtrl.create({ enableBackdropDismiss: true });
    loading.onDidDismiss(() => {
      req.unsubscribe();
    });
    let body = new URLSearchParams();
    body.set('action', 'ISBGetSingleEvent');
    body.set('id', this.eventURL);
    loading.present().then(() => {
      req = this.http.post('https://bt.the-v.net/service/api.aspx', body, this.options).subscribe(
        (event) => {
          let dataMapped = [];
          dataMapped = event.json();
          dataMapped.map((data) => {
            if (data.thumbnail == '') return (data.thumbnail = './assets/imgs/icon.png');
            else return data.thumbnail;
          });
          this.setDetails(dataMapped[0]);
          this.showalert = true;
          this.storage.get(LOGGED_IN_KEY).then((isLogged) => {
            this.storage.get(USER_DATA_KEY).then((userdetails) => {
              if (isLogged) {
                this.setEmail(userdetails.email);
                this.subs = this.appSvc
                  .getRequest(this.eventURL, userdetails.IRID)
                  .then((requestData) => {
                    if (requestData) {
                      this.disabled = true;
                      this.disabled2 = true;
                      if (
                        requestData.status == 'Approved' ||
                        requestData.status == 'Paid' ||
                        requestData.status == 'Onsite Payment'
                      ) {
                        var title;
                        var mess;
                        var btn;
                        if (requestData.status == 'Approved') {
                          if (dataMapped[0].isFoc == 'True') {
                            title = 'Your Request has been Approved!';
                            mess = "Your request in this event has been approved! Click 'Proceed' to see intructions on how to join event and see your MO.";
                            btn = 'Proceed';
                          } else {
                            title = 'Your Request has been Approved!';
                            mess = "Your request in this event has been approved! Click 'Payment Instructions' to see how you will pay for your requested event.";
                            btn = 'Payment Instructions';
                          }
                        }
                        if (requestData.status == 'Paid') {
                          title = 'Ticket has been Paid!';
                          mess = "Your ticket purchase has been successfully processed! Click 'Proceed' to view your things to bring and map of the event.";
                          btn = 'Proceed';
                        }
                        if (requestData.status == 'Onsite Payment') {
                          title = 'You have Opted to Pay Onsite!';
                          mess =
                            "Prepare your payment onsite. Click 'Proceed' to view your things to bring and map of the event.";
                          btn = 'Proceed';
                        }
                        let youralert = this.alertCtrl.create({
                          title: title,
                          message: mess,
                          buttons: [
                            {
                              text: btn,
                              handler: () => {
                                this.goToPaymentInstructions(
                                  requestData.orderID,
                                  requestData.price,
                                  requestData.paymentStatus,
                                  requestData.RequestType
                                );
                              }
                            },
                            {
                              text: 'Cancel',
                              role: 'cancel',
                              handler: () => { }
                            }
                          ]
                        });
                        this.getAlert(youralert);
                        //youralert.present();
                      }
                    } else {
                      this.appSvc.getUserDetails(userdetails.IRID).then((current) => {
                        if (current.isb_grad == 'True') {
                          this.disabled = false;
                          if (dataMapped[0].isFoc == 'True') {
                            this.disabled2 = true;
                          } else {
                            this.disabled2 = false;
                          }
                        } else {
                          this.disabled = false;
                          this.disabled2 = true;
                        }
                      });
                    }
                  });
              } else {
                this.disabled = true;
                this.disabled2 = true;
              }
            });
          });
        },
        (error) => {
          loading.dismiss();
        },
        () => {
          loading.dismiss();
        }
      );
    });
  }
  ionViewDidLeave() {
    this.showalert = false;
  }
  goToPaymentInstructions(orderID, price, paymentStatus, reqtype) {
    this.navCtrl.push(PaymentInstructionsPage, {
      orderID: orderID,
      id: this.eventURL,
      price: price,
      pStat: paymentStatus,
      requestType: reqtype,
      title: this.title,
      eventDetails: this.eventDetails
    });
  }
  submitRequest(eventID: string, reqType: string, eventName: string, eventDate: string, eventVenue: string) {
		/*
      check user details if complete or not
      if not complete prompt user to complete personal details
        - Gender
        - Date of birth
        - Address
        - Zip code
        - Phone number
    */
    this.storage.get(USER_DATA_KEY).then((data) => {
      if (
        data.city_address == '' ||
        data.country_address == '' ||
        data.gender == '' ||
        data.h_address == '' ||
        data.mobile_no == '' ||
        data.state_address == '' ||
        data.birth == '' ||
        data.zip_code == '' ||
        data.tel_no == ''
      ) {
        let alert = this.alertCtrl.create({
          title: 'Please complete your personal details',
          message: 'Please complete your personal details to submit your request.',
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
              handler: () => { }
            },
            {
              text: 'Ok',
              handler: () => {
                //push to personal details form
                this.navCtrl.push(UpdatePersonalInfoPage);
              }
            }
          ]
        });
        alert.present();
      } else {
        let req;
        let loading = this.loadingCtrl.create({ enableBackdropDismiss: true });
        loading.onDidDismiss(() => {
          req.unsubscribe();
        });
        loading.present().then(() => {
          this.storage.get(USER_IRID_KEY).then((user) => {
            let body = new URLSearchParams();
            body.set('action', 'ISBGetRequest');
            body.set('eventID', eventID);
            body.set('irid', user);
            req = this.http.post('https://bt.the-v.net/service/api.aspx', body, this.options).subscribe(
              (res) => {
                let resp = [res.json()];
                ////console.log(resp);
                if (resp[0].length == 0) {
                  ////console.log(eventDate);
                  ////console.log(eventVenue);
                  this.appSvc.submitUserRequest(
                    eventID,
                    user,
                    reqType,
                    eventName,
                    eventDate,
                    eventVenue,
                    this.userEmail
                  );
                } else {
                  let youralert = this.alertCtrl.create({
                    title: 'Request Already submitted!',
                    buttons: [
                      {
                        text: 'OK',
                        role: 'cancel',
                        handler: () => { }
                      }
                    ]
                  });
                  this.getAlert(youralert);
                  //youralert.present();
                }
              },
              (error) => {
                loading.dismiss();
              },
              () => {
                loading.dismiss();
              }
            );
          });
        });
      }
    });
  }
}
