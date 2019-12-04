import { Injectable } from "@angular/core";
import { Http, Headers, RequestOptions, URLSearchParams } from "@angular/http";
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { AlertController, LoadingController } from "ionic-angular";
import { PERSONAL_DETAILS_KEY, EXPERIENCE_DATA_KEY, RECOM_KEY, NOTIFCOUNTS, USER_IRID_KEY, USER_DATA_KEY } from "../app.constants";
import { Storage } from "@ionic/storage";
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/toPromise'

export type ApplicationDetails = {
    irid: string,
    email: string,
    f_name: string,
    m_name: string,
    l_name: string,
    card_name: string,
    gender: string,
    birth: string,
    h_address: string,
    city_address: string,
    state_address: string,
    zip_code: string,
    country_address: string,
    tel_no: string,
    mobile_no: string,
    languages: string,
    yrs: string,
    net: string,
    upline: string,
    shirt: string,
    vlcGrad: string,
    vlcEvent: string,
    v_pos: string,
    passportSrc: string,
    passImgSrc: string
};

export type PaymentDetails = {
    paymentStat: string,
    chksum: string,
    orderID: string,
    channel: string,
    txnID: string
}

@Injectable()
export class AppHTMLService {

    private static API_URL = 'http://bt.the-v.net/service/api.aspx';
    private options;
    private fileTransfer: FileTransferObject;
    constructor(
        private http: Http,
        private transfer: FileTransfer,
        private file: File,
        private alertCtrl: AlertController,
        private storage: Storage,
        private loadingCtrl: LoadingController
    ) {
        this.options = new RequestOptions({
            headers: new Headers({
                'Content-Type': 'application/x-www-form-urlencoded'
            })
        });
    }


    submitUserRequest(eventId: string, irid: string, requestType: string, eventName: string, eventDate: string, eventVenue: string, userEmail:string) {
        let body = new URLSearchParams();
        body.set('action', 'ISBSubmitAction');
        body.set('eventID', eventId);
        body.set('irid', irid);
        body.set('requestType', requestType);
        body.set('eventName', eventName);
        body.set('eventDate', eventDate);
        body.set('eventVenue', eventVenue);
        let req;
        let loading = this.loadingCtrl.create({ enableBackdropDismiss: true });
        loading.onDidDismiss(() => {
            req.unsubscribe();
        });
        //console.log(body);
        loading.present().then(() => {
            req = this.http.post(AppHTMLService.API_URL, body, this.options)
                .subscribe(res => {
                    // console.log(res);
                    if (res.text() == "True") {
                        let body2 = new URLSearchParams();
                        body2.set('action', 'ISBSendEmailRequest');
                        body2.set('irid', irid);
                        body2.set('email', userEmail);
                        this.http.post(AppHTMLService.API_URL, body2,this.options).subscribe(res=>{
                            console.log(res.text());
                        })
                        let youralert = this.alertCtrl.create({
                            title: "Request Submitted!",
                            message:"We will respond to you as soon one of our team is able, usually this will be within 48 hours as our office hours allow.",
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
                    else {

                        let youralert2 = this.alertCtrl.create({
                            title: "Error submitting request!",
                            buttons: [
                                {
                                    text: 'OK',
                                    role: 'cancel',
                                    handler: () => {
                                    }
                                }
                            ]
                        });
                        youralert2.present();
                    }

                    //return true if request submitted, else false
                }, error => {
                    loading.dismiss();
                }, () => {
                    loading.dismiss();
                })
        })
    }


    submitApplicationForm(formData: ApplicationDetails, expData: any) {
        console.log(formData);
        let body = new URLSearchParams();
        body.set('action', 'ISBSubmitApplication');
        body.set('IRID', formData.irid);
        body.set('email', formData.email);
        body.set('f_name', formData.f_name);
        body.set('m_name', formData.m_name);
        body.set('l_name', formData.l_name);
        body.set('card_name', formData.card_name);
        body.set('gender', formData.gender);
        body.set('birth', formData.birth);
        body.set('h_address', formData.h_address);
        body.set('city_address', formData.city_address);
        body.set('state_address', formData.state_address);
        body.set('zip_code', formData.zip_code);
        body.set('country_address', formData.country_address);
        body.set('tel_no', formData.tel_no);
        body.set('mobile_no', formData.mobile_no);
        body.set('language', formData.languages);
        body.set('yrs_business', formData.yrs);
        body.set('net_name', formData.net);
        body.set('upline_name', formData.upline);
        body.set('shirt_size', formData.shirt);
        body.set('v_position', formData.v_pos);
        body.set('vlc_grad', formData.vlcGrad);
        body.set('vlcEvent', formData.vlcEvent);
        let req;
        let loading = this.loadingCtrl.create({ enableBackdropDismiss: true });
        loading.onDidDismiss(() => {
            req.unsubscribe();
        });
        loading.present().then(() => {
            req = this.http.post(AppHTMLService.API_URL, body, this.options)
                .subscribe(res => {
                    if (res.text() == "True") {
                        this.uploadImages('UploadPassport', 'Passport.jpg', formData.passportSrc, formData.irid)
                            .then(r => {
                                console.log(r);
                                this.uploadImages('UploadPhoto', 'Photo.jpg', formData.passImgSrc, formData.irid)
                                    .then(r => {
                                        console.log(r);
                                        console.log(expData.length);
                                        if (expData.length > 0)
                                            this.submitUserExperience(expData, formData.irid);
                                        this.storage.set(PERSONAL_DETAILS_KEY, null);
                                        this.storage.set(EXPERIENCE_DATA_KEY, null);
                                        this.storage.set(RECOM_KEY, null);
                                        let youralert2 = this.alertCtrl.create({
                                            title: "Application Submitted Successfully!",
                                            subTitle: "Password will be emailed to you once your request has been aprroved.",
                                            buttons: [
                                                {
                                                    text: 'OK',
                                                    role: 'cancel',
                                                    handler: () => {
                                                        //this.navCtrl.setRoot(EventsPage);
                                                    }
                                                }
                                            ]
                                        });
                                        youralert2.present();
                                    },
                                        error => {
                                            console.log("ERROR UPLOADING IMAGES! " + error);
                                        })
                                    .catch(() => {
                                        console.log("ERROR UPLOADING IMAGES!")
                                    })
                            },
                                error => {
                                    console.log("ERROR UPLOADING IMAGES! " + error);
                                })
                            .catch(() => {
                                console.log("ERROR UPLOADING IMAGES!")
                            })
                    }
                    else {
                        console.log("ERROR!!!")
                    }
                }, error => {
                    loading.dismiss();
                }, () => {
                    loading.dismiss()
                });
        });
    }
    private uploadImages(fileKey: string, fileName: string, imagSource: string, irid: string) {

        let uri = encodeURI('http://bt.the-v.net/ISBUpload.aspx');
        let lastIndexOfSlash = imagSource.lastIndexOf('/');
        let trueFileName = imagSource.substring(lastIndexOfSlash + 1);
        let fileContainingDirectory = imagSource.substring(0, lastIndexOfSlash);


        let options: FileUploadOptions = {
            fileKey: fileKey,//UploadPassport or UploadPhoto
            fileName: fileName, // Passport or photo
            chunkedMode: false,
            mimeType: "image/jpeg",
            params: {
                type: 'Image',
                action: 'ImageUpload',
                irid: irid
            }
        }
        this.fileTransfer = this.transfer.create();
        return this.fileTransfer.upload(imagSource, uri, options);
        // .then(r => {
        //     console.log(r);
        // }, error => {
        //     console.log("ERROR UPLOADING IMAGES! " + error);
        // })
        // .catch(() => {
        //     console.log("ERROR UPLOADING IMAGES!")
        // })
    }
    private submitUserExperience(userExpData: any, irid: string) {
        userExpData.map(exp => {
            let body = new URLSearchParams();
            body.set('action', 'ISBSubmitExperience');
            body.set('v_event', exp.v_event);
            body.set('country', exp.country);
            body.set('event_date', exp.date);
            body.set('inservice', exp.netname);
            body.set('participant_irid', irid);
            body.set('deptartment', exp.v_dept);
            this.http.post(AppHTMLService.API_URL, body, this.options)
                .subscribe(() => { });
        });
    }

    resetPasswordRequest(irid: string) {

    }
    getRequest(eventID: string, irid: string) {
        let body = new URLSearchParams();
        body.set('action', 'ISBGetRequest');
        body.set('eventID', eventID);
        body.set('irid', irid);
        return this.http.post(AppHTMLService.API_URL, body, this.options)
            .map(resp => {
                let reqData = resp.json();
                if (reqData.length > 0) {
                    return reqData[0];
                }
                else {
                    return null;
                }
            }).toPromise();
    }
    getUserDetails(irid) {
        let body = new URLSearchParams();
        body.set('action', 'ISBGetUserData');
        body.set('irid', irid);
        return this.http.post(AppHTMLService.API_URL, body, this.options)
            .map(resp => {
                return resp.json()[0];
            }).toPromise();
    }
    getEventImages(eventID){
        let body = new URLSearchParams();
        body.set('action', 'ISBGetEventImages');
        body.set('eventID', eventID);
        return this.http.post(AppHTMLService.API_URL, body, this.options)
            .map(resp => {
                return resp.json()[0];
            }).toPromise();
    }
    updatePersonalInfo(personalInfos){
        let body = new URLSearchParams();
        body.set('action', 'ISBUpdateUserInfo');
        body.set('id', personalInfos.id);
        body.set('irid', personalInfos.irid);
        body.set('gender', personalInfos.gender);
        body.set('bday', personalInfos.bday);
        body.set('house', personalInfos.house);
        body.set('city', personalInfos.city);
        body.set('state', personalInfos.state);
        body.set('zip', personalInfos.zip);
        body.set('country', personalInfos.country);
        body.set('tel', personalInfos.tel);
        body.set('mob', personalInfos.mob);
        return this.http.post(AppHTMLService.API_URL, body, this.options)
            .map(resp => {
                return resp.text();
            }).toPromise();
    }
    updatePaymentDetails(eventID: string, irid: string, pD: PaymentDetails) {
        let body = new URLSearchParams();
        body.set('action', 'ISBUpdatePayment');
        body.set('eventID', eventID);
        body.set('irid', irid);
        body.set('paymentStat', pD.paymentStat);
        body.set('chksum', pD.chksum);
        body.set('orderID', pD.orderID);
        body.set('channel', pD.channel);
        body.set('txnID', pD.txnID);
        console.log(body);
        return this.http.post(AppHTMLService.API_URL, body, this.options)
            .map(resp => {
                return resp.text();
            }).toPromise();
    }
    updateOnsitePayment(eventID: string, irid: string) {
        let body = new URLSearchParams();
        body.set('action', 'ISBOnsitePaymentRequest');
        body.set('eventID', eventID);
        body.set('irid', irid);
        console.log(body);
        return this.http.post(AppHTMLService.API_URL, body, this.options)
            .map(resp => {
                console.log(resp);
                return resp.text();
            }).toPromise();
    }

    dateFormatter(date) {
        var monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];
        var d = new Date(date);
        var day = d.getDay();
        var month = monthNames[d.getMonth()];
        var year = d.getFullYear();

        return month + ' ' + day + ', ' + year;
    }
}