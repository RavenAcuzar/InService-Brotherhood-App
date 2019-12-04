import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { Http, RequestOptions, Headers, URLSearchParams } from '@angular/http';
import { Storage } from '@ionic/storage';
import { HAS_ANSWERED_SURVEY, SURVEY_FORM_Q, USER_DATA_KEY } from '../../app/app.constants';
import { HomePage } from '../home/home';

/**
 * Generated class for the SurveyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-survey',
  templateUrl: 'survey.html',
})
export class SurveyPage {
  pollQuestions = [];
  options;
  api_url = "http://bt.the-v.net/service/api.aspx";
  viewContent: boolean = false;
  hasAnswered: boolean;
  details = { name: "", irid: "", email: "" };
  surveyNotAvailable: boolean = true;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private http: Http,
    private loadCtrl: LoadingController,
    private storage: Storage,
    private alertCtrl: AlertController) {
    this.options = new RequestOptions({
      headers: new Headers({
        'Content-Type': 'application/x-www-form-urlencoded'
      })
    });
  }

  ionViewDidLoad() {
    this.storage.get(USER_DATA_KEY).then(details => {
      this.details.name = details.f_name + " " + details.m_name + " " + details.l_name;
      this.details.irid = details.irid;
      this.details.email = details.email;
      this.loadQuestions();
    })
  }
  checkUpdates(load) {
    return new Promise<boolean>((resolve, reject) => {
      let body = new URLSearchParams();
      body.set('action', 'VCONPollQuestions');
      body.set('lang', 'en');
      this.http.post(this.api_url, body, this.options)
        .subscribe(resp => {
          this.storage.get(SURVEY_FORM_Q).then(poll => {
            if (JSON.stringify(poll) !== JSON.stringify(resp.json())) {
              this.storage.set(SURVEY_FORM_Q, resp.json());
              this.storage.set(HAS_ANSWERED_SURVEY, null);
            }
            load.dismiss();
            resolve(true);
          })
        },
          error => {
            load.dismiss();
            reject(false);
          });

    });
  }
  loadQuestions() {
    let load: any = this.loadCtrl.create({
      spinner: "crescent",
      content: "Loading...",
      enableBackdropDismiss: true
    });
    load.present();
    this.checkUpdates(load).then(res => {
      if (res) {
        this.storage.get(HAS_ANSWERED_SURVEY).then(check => {
          if (check != null) {
            this.hasAnswered = check;
            this.surveyNotAvailable = false;
          } else {
            this.hasAnswered = false;
          }
          if (!this.hasAnswered) {

            this.storage.get(SURVEY_FORM_Q).then(poll => {
              if (poll) {
                this.pollQuestions = poll;
                if (this.pollQuestions.length > 0) {
                  this.viewContent = true;
                  this.surveyNotAvailable = false;
                }
                load.dismiss();
              }
              else {
                this.fetchQ(load);
              }
            });
          }
        })
      }
    })
  }
  validate(data) {
    if (data.name != '' && data.irid != '' && data.email != '') {
      var re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
      return re.test(String(data.email).toLowerCase());
    }
    else {
      return false;
    }
  }
  fetchQ(load?) {
    let body = new URLSearchParams();
    body.set('action', 'VCONPollQuestions');
    body.set('lang', 'en')
    this.http.post(this.api_url, body, this.options)
      .subscribe(resp => {
        console.log(resp.json());
        this.pollQuestions = resp.json();
      },
        error => {
          if (load) {
            load.dismiss();
          }
        },
        () => {
          if (load) {
            load.dismiss();
          }
          if (this.pollQuestions.length > 0) {
            this.viewContent = true;
            this.surveyNotAvailable = false;
          }
        })
  }

  submitPoll() {
    if (this.answerChecker()) {
      let load: any = this.loadCtrl.create({
        spinner: "crescent",
        content: "Loading...",
        enableBackdropDismiss: true
      });
      load.present();
      this.viewContent = false;
      for (let i = 0; i < this.pollQuestions.length; i++) {
        let b = new URLSearchParams();
        b.set('action', 'VCONSubmitPollAnswers');
        b.set('id', this.pollQuestions[i].answerID);
        //TODO: Add details on body, update api to record every answer on pledge
        this.http.post(this.api_url, b, this.options)
          .subscribe(resp => {
            console.log(resp.text());
          });
        if (i == this.pollQuestions.length - 1) {
          this.storage.set(HAS_ANSWERED_SURVEY, true).then(() => {
            this.hasAnswered = true;
            load.dismiss();
            console.log("Loop Finished!");
          });
        }
      }
    }
    else {
      let alert = this.alertCtrl.create({
        title: 'Oops!',
        subTitle: 'Please answer all the questions before submitting.',
        buttons: ['Ok']
      });

      alert.present();
    }
  }
  answerChecker() {
    let canSubmit = this.pollQuestions.every(answer => {
      if (answer.answerID == "") {
        return false;
      } else
        return true;
    });
    return canSubmit;
  }

  //fetch storage if answered key
  //if false, show load poll questions and answers
  //else, show thank you message for answering the poll
}
