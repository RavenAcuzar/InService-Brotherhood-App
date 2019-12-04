import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Navbar, AlertController } from 'ionic-angular';
import { RecommendedPage } from '../recommended/recommended';
import { Http, Headers, RequestOptions, URLSearchParams } from "@angular/http";
import { Storage } from '@ionic/storage';
import { PERSONAL_DETAILS_KEY, EXPERIENCE_DATA_KEY } from '../../app/app.constants';
import { SelectionPage } from '../selection/selection';

/**
 * Generated class for the ExperiencePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

 export type Exp = {
  v_event: string,
  country: string,
  date: string,
  netname: string,
  v_dept:string,
  irid: string
}

@Component({
  selector: 'page-experience',
  templateUrl: 'experience.html',
})
export class ExperiencePage {
@ViewChild(Navbar) navBar: Navbar;
  noYears = [];
  size = 'XS';
  blength = '23';
  chest = '24';
  shoulder = '15';
  v_event = '';
  country = '';
  language = '';
  year = '';
  myDate = new Date().toISOString();
  networkGroup = '';
  expQ = '';
  inservice='';
  addExpHide: boolean = true;
  hideForm: boolean = true;
  private options;
  uplines;
  languages;
  exps: Exp[] = [];
  allVal = {};
  vlcEventHide:boolean = true;
  vlcGrad='';
  vlcEvent='';
  v_dept='';
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private http: Http,
    private storage: Storage,
    private alertCtrl:AlertController) {
      for (let i = 1; i <= 80; i++) {
        this.noYears.push((i.toString()));
      }
      this.options = new RequestOptions({
        headers: new Headers({
          'Content-Type': 'application/x-www-form-urlencoded'
        })
      });
      this.loadSelection();
      this.storage.get(EXPERIENCE_DATA_KEY)
      .then(expData=>{
        if(expData!=null)
        {
          this.language = expData.language;
          this.year= expData.year;
          this.networkGroup=expData.networkGroup;
          this.size=expData.size;
          this.expQ=expData.expQ;
          this.exps=expData.exps;
          this.vlcGrad = expData.vlcQ;
          this.vlcEvent = expData.vlcEvent;
          this.v_dept=expData.v_dept;
        }
      })
  }
  loadSelection() {
    let body = new URLSearchParams();
    body.set('action', 'ISBGetSelection');
    body.set('type', 'groups')
    this.http.post('http://bt.the-v.net/service/api.aspx', body, this.options)
      .subscribe(resp => {
        this.uplines = resp.json();
      });
    let body2 = new URLSearchParams();
    body2.set('action', 'ISBGetSelection');
    body2.set('type', 'language')
    this.http.post('http://bt.the-v.net/service/api.aspx', body2, this.options)
      .subscribe(resp => {
        this.languages = resp.json();
      })
  }

  sizeChange() {
    switch (this.size) {
      case 'XS': {
        this.blength = '23';
        this.chest = '24';
        this.shoulder = '15';
        break;
      }
      case 'S': {
        this.blength = '25';
        this.chest = '26';
        this.shoulder = '17';
        break;
      }
      case 'M': {
        this.blength = '28';
        this.chest = '27';
        this.shoulder = '19';
        break;
      }
      case 'L': {
        this.blength = '30';
        this.chest = '29';
        this.shoulder = '21';
        break;
      }
      case 'XL': {
        this.blength = '32';
        this.chest = '31';
        this.shoulder = '23';
        break;
      }
    }
  }
  deleteMsg(msg: Exp) {
    const index: number = this.exps.indexOf(msg);
    if (index !== -1) {
      this.exps.splice(index, 1);
    }
  }

  next() {
    if (this.language != '' && this.year != '' && this.networkGroup != '' && this.size != '' && this.expQ!='' && this.vlcGrad !='') {
      this.allVal = {
        language: this.language,
        year: this.year,
        networkGroup: this.networkGroup,
        size: this.size,
        vlcQ:this.vlcGrad,
        vlcEvent:this.vlcEvent,
        expQ:this.expQ,
        exps: this.exps
      }
      this.storage.set(EXPERIENCE_DATA_KEY, this.allVal)
        .then(() => {
         this.navCtrl.push(RecommendedPage);
        })
    }
    else{
      let youralert = this.alertCtrl.create({
        title: "Fill All the Required Fields!",
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
  }
  showForm() {
    this.hideForm = false;
    this.v_event = '';
    this.country = '';
    this.myDate = '';
    this.inservice = '';
    this.v_dept = '';
    this.addExpHide = true;
  }
  saveExp() {
    this.addExpHide = false;
    this.hideForm = true;
    if (this.v_event != '' && this.country != '' && this.myDate != '' && this.networkGroup != '') {
      this.storage.get(PERSONAL_DETAILS_KEY).then(pd => {
        let ex: Exp = {
          v_event: this.v_event,
          country: this.country,
          date: this.myDate,
          netname: this.inservice,
          v_dept: this.v_dept,
          irid: pd.irid
          
        };
        this.exps.push(ex);
      })
    }
  }
  vlcChange(value){
    if(value=="true")
      this.vlcEventHide = false;
    else
      this.vlcEventHide = true;
  }
  selectChange(value) {
    if (value == "true") {
      this.addExpHide = false;
    }
    else {
      this.addExpHide = true;
      this.hideForm = true;
    }
  }
  ionViewWillEnter() {
    if(this.navParams.get('selection')){
      let val = this.navParams.get('selection');
      if(val.type == "VLC EVENTS"){
        this.vlcEvent = val.value;
      } else if(val.type=="THE V EVENTS"){
        this.v_event = val.value;
      } else{
        this.country = val.value;
      }
    }
  }
  loadSelectionPage(value){
    this.navCtrl.push(SelectionPage,{type:value});
  }

}
