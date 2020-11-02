import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Navbar, AlertController } from 'ionic-angular';
import { RecommendedPage } from '../recommended/recommended';
import { Http, Headers, RequestOptions, URLSearchParams } from "@angular/http";
import { Storage } from '@ionic/storage';
import { PERSONAL_DETAILS_KEY, EXPERIENCE_DATA_KEY, LANGUAGES, GROUPS } from '../../app/app.constants';
import { SelectionPage } from '../selection/selection';

/**
 * Generated class for the ExperiencePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

 export type Exp = {
  v_event: string,
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
  language = '';
  year = '';
  networkGroup = '';
  expQ = '';
  inservice='';
  langOthers = false;
  groupOthers=false;
  otherlanguage='';
  othergroup='';
  addExpHide: boolean = true;
  hideForm: boolean = true;
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
      let y = new Date;
      for (let i = 1998; i <= y.getFullYear(); i++) {
        this.noYears.push((i.toString()));
      }
      
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
          this.langOthers=expData.langOthers;
          this.otherlanguage=expData.otherlanguage;
          this.groupOthers=expData.groupOthers;
          this.othergroup=expData.othergroup;
          
        }
      }).then(()=>{
        this.storage.get(LANGUAGES).then(lang=>{
          console.log(lang);
          this.languages = lang;
        }).then(()=>{
          this.storage.get(GROUPS).then(g=>{
            console.log(g);
            this.uplines = g;
          })
        })
      })
  }
  checkIfOthers(type){
    if(type==='lang'){
      console.log(this.language.indexOf('Others'));
      if(this.language.indexOf('Others') >= 0){
        this.langOthers = true;
      }
      else{
        this.langOthers = false;
        this.otherlanguage = '';
      }
    }
    else{
      if(this.networkGroup==='Others'){
        this.groupOthers = true;
      }
      else{
        this.groupOthers=false;
        this.othergroup='';
      }
    }
    //if language includes 'Others', show otherLanguages input, 
    // if(type == 'group' && this.networkGroup=='c105cc46-127d-4fd2-bd10-28dd73267cd0'){
    //   this.groupOthers = true;
    // }
    // else{
    //   this.groupOthers = false;
    //   this.othergroup = '';
    // }


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
      case '2XL': {
        this.blength = '48';
        this.chest = '46';
        this.shoulder = '25';
        break;
      }
      case '3XL': {
        this.blength = '52';
        this.chest = '50';
        this.shoulder = '27';
        break;
      }
      case '4XL': {
        this.blength = '56';
        this.chest = '54';
        this.shoulder = '29';
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
        exps: this.exps,
        langOthers:this.langOthers,
        otherlanguage:this.otherlanguage,
        groupOthers: this.groupOthers,
        othergroup:this.othergroup
      }
      
        // if(this.langOthers){
        //   if(this.otherlanguage!=''){
        //     this.continue(this.allVal);
        //   }
        //   else{
        //     this.showAlert();
        //   }
        // }
        // else
        //   this.continue(this.allVal);
      if( this.checkOthersValue('lang') && this.checkOthersValue('group') )
        this.continue(this.allVal);
      else
       this.showAlert();
    }
    else{
      this.showAlert();
    }
  }
  checkOthersValue(type){
    if(type==='lang'){
      if(this.langOthers){
        if(this.otherlanguage=='')
          return false;
        else
          return true;
      }
      else{
        return true;
      }
    }
    else{
      if(this.groupOthers){
        if(this.othergroup=='')
          return false;
        else
          return true;
      }
      else{
        return true;
      }
    }
  }
  showAlert(){
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
  continue(vals){
    this.storage.set(EXPERIENCE_DATA_KEY, vals)
    .then(() => {
     this.navCtrl.push(RecommendedPage);
    })
  }
  showForm() {
    this.hideForm = false;
    this.v_event = '';
    this.inservice = '';
    this.v_dept = '';
    this.addExpHide = true;
  }
  saveExp() {
    this.addExpHide = false;
    this.hideForm = true;
    if (this.v_event != '' && this.networkGroup != '') {
      this.storage.get(PERSONAL_DETAILS_KEY).then(pd => {
        let ex: Exp = {
          v_event: this.v_event,
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
      }
    }
  }
  loadSelectionPage(value){
    this.navCtrl.push(SelectionPage,{type:value});
  }

}
