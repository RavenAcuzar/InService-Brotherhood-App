import { Injectable, ViewChild, NgZone } from "@angular/core";
import { Http, Headers, RequestOptions, URLSearchParams } from "@angular/http";
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { AlertController, LoadingController, App } from "ionic-angular";
import { PERSONAL_DETAILS_KEY, EXPERIENCE_DATA_KEY, RECOM_KEY, NOTIFCOUNTS, USER_IRID_KEY, USER_DATA_KEY } from "../app.constants";
import { Storage } from "@ionic/storage";
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/toPromise'
import { BoundTextAst } from "@angular/compiler";






export type ApplicationDetails = {
    irid: string,
    email: string,
    f_name: string,
    l_name: string,
    card_name: string,
    gender: string,
    birth: string,
    city_address: string,
    country_address: string,
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
    private static API_URL = 'https://bt.the-v.net/service/api.aspx';
    private options;
    private fileTransfer: FileTransferObject;
    constructor(
        private http: Http,
        private transfer: FileTransfer,
        private file: File,
        private alertCtrl: AlertController,
        private storage: Storage,
        private loadingCtrl: LoadingController,
        private appCtrl: App,
        public ngZone: NgZone
    ) {
        this.options = new RequestOptions({
            headers: new Headers({
                'Content-Type': 'application/x-www-form-urlencoded'
            })
        });
    }


    submitUserRequest(eventId: string, irid: string, requestType: string, eventName: string, eventDate: string, eventVenue: string, userEmail: string) {
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
                        this.http.post(AppHTMLService.API_URL, body2, this.options).subscribe(res => {
                            console.log(res.text());
                        })
                        let youralert = this.alertCtrl.create({
                            title: "Request Submitted!",
                            message: "We will respond to you as soon one of our team is able, usually this will be within 48 hours as our office hours allow.",
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


    submitApplicationForm(formData: ApplicationDetails, expData: any, redirect: any) {
        console.log(formData);
        let body = new URLSearchParams();
        body.set('action', 'ISBSubmitApplication');
        body.set('IRID', formData.irid);
        body.set('email', formData.email);
        body.set('f_name', formData.f_name);
        body.set('l_name', formData.l_name);
        body.set('card_name', formData.card_name);
        body.set('gender', formData.gender);
        body.set('birth', formData.birth);
        body.set('city_address', formData.city_address);
        body.set('country_address', formData.country_address);
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
        //DEBUG PURPOSES

        let loading = this.loadingCtrl.create({ content: "Sending Application...", enableBackdropDismiss: true, });
        loading.onDidDismiss(() => {
            req.unsubscribe();
        });
        loading.present().then(() => {
            req = this.http.post(AppHTMLService.API_URL, body, this.options)
                .subscribe(res => {
                    if (res.text() == "True") {

                        let loading2 = this.loadingCtrl.create({ content: "Uploading Passport" });
                        this.uploadImages('UploadPassport', 'Passport.jpg', formData.passportSrc, formData.irid, loading2)
                            .then(r => {
                                console.log(r);
                                loading2.dismiss();
                                let loading3 = this.loadingCtrl.create({ content: "Uploading Passport" });
                                loading2.data.content = "Uploading Photo: 0%";
                                this.uploadImages('UploadPhoto', 'Photo.jpg', formData.passImgSrc, formData.irid, loading3)
                                    .then(r => {
                                        console.log(r);
                                        console.log(expData.length);
                                        loading3.dismiss();
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
                                                        this.appCtrl.getRootNav().setRoot(redirect);
                                                    }
                                                }
                                            ]
                                        });
                                        youralert2.present();
                                    },
                                        error => {
                                            loading3.dismiss();
                                            console.log("Error!! ", error);
                                        })
                                    .catch(() => {
                                        console.log("ERROR UPLOADING IMAGES!")
                                    })
                            },
                                error => {
                                    loading2.dismiss();
                                    console.log("Error!! ", error);
                                })
                            .catch(() => {
                                console.log("ERROR UPLOADING IMAGES!")
                            })
                    }
                    else {
                        this.showErrorAlert("Something went wrong while submitting your application.");
                    }
                }, error => {
                    loading.dismiss();
                    this.showErrorAlert("Something went wrong! Please Try again.");
                }, () => {
                    loading.dismiss()
                });
        });
    }
    //debug purposes///
    showErrorAlert(error) {
        let errorAlert = this.alertCtrl.create({
            title: "ERROR OCCURED!",
            message: error,
            buttons: [
                {
                    text: "OK",
                    role: 'Cancel'
                }
            ]
        })
        errorAlert.present();
    }

    private uploadImages(fileKey: string, fileName: string, imagSource: string, irid: string, loader: any) {

        let uri = encodeURI('https://bt.the-v.net/ISBUpload.aspx');
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
        loader.present();
        this.fileTransfer = this.transfer.create();
        this.fileTransfer.onProgress(e => {
            this.ngZone.run(() => {
                loader.setContent("Uploading " + fileName + ": " + (Math.round((e.loaded / e.total) * 100)) + "%");
            })
            //loader.data.content = "Uploading "+ fileName +": " + (Math.round((e.loaded / e.total) * 100))+"%";
            //console.log("Uploaded " + e.loaded.toString() + " of " + e.total.toString());
        });

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
            body.set('inservice', exp.netname);
            body.set('participant_irid', irid);
            body.set('deptartment', exp.v_dept);
            this.http.post(AppHTMLService.API_URL, body, this.options)
                .subscribe(() => { });
        });
    }

    // resetPasswordRequest(irid: string) {

    // }

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
    getEventImages(eventID) {
        let body = new URLSearchParams();
        body.set('action', 'ISBGetEventImages');
        body.set('eventID', eventID);
        return this.http.post(AppHTMLService.API_URL, body, this.options)
            .map(resp => {
                return resp.json()[0];
            }).toPromise();
    }
    updatePersonalInfo(personalInfos) {
        let body = new URLSearchParams();
        body.set('action', 'ISBUpdateUserInfo');
        body.set('id', personalInfos.id);
        body.set('irid', personalInfos.irid);
        body.set('gender', personalInfos.gender);
        body.set('bday', personalInfos.bday);
        body.set('city', personalInfos.city);
        body.set('country', personalInfos.country);
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