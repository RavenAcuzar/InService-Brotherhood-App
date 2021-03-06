import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { USER_DATA_KEY } from '../../app/app.constants';
import { SelectionPage } from '../selection/selection';
import { AppHTMLService } from '../../app/services/app.service';
import { initTransferState } from '@angular/platform-browser/src/browser/transfer_state';

/**
 * Generated class for the UpdatePersonalInfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-update-personal-info',
  templateUrl: 'update-personal-info.html',
})
export class UpdatePersonalInfoPage {
  irid = '';
  email_add = '';
  f_name = '';
  l_name = '';
  card_name = '';
  gender = '';
  myDate = '';
  city_address = '';
  country = '';
  mob_no = '';
  allValues = {};
  signupform: FormGroup;
  iridIsValid = null;
  id='';
  constructor(public navCtrl: NavController, public navParams: NavParams, private storage:Storage,
    private appSvc:AppHTMLService, private loadingCtrl:LoadingController, private alertCtrl:AlertController) {
    this.storage.get(USER_DATA_KEY).then(details => {
      //console.log(details);
      if (details != null) {
        this.id=details.id;
        this.irid = details.IRID.replace(/\s/g, '');
        this.email_add = details.email;
        this.f_name = details.f_name;
        this.l_name = details.l_name;
        this.card_name = details.card_name;
        if(details.gender == "False"){
          this.gender = "Male";
        }
        else{
          this.gender= "Female";
        }
        this.myDate = new Date(details.birth).toISOString();
        this.city_address = details.city_address;
        this.country = details.country;
      }
    })
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad UpdatePersonalInfoPage');
  }
  ngOnInit() {
    let EMAILPATTERN = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;
    
      this.signupform = new FormGroup({
        irid: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.required, Validators.pattern(EMAILPATTERN)]),
        f_name: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.minLength(2)]),
        l_name: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.minLength(2)]),
        card_name: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.minLength(4)]),
        city: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.minLength(2)]),
        country: new FormControl('', [Validators.required]),
        bday: new FormControl('', [Validators.required]),
        mob_no: new FormControl('', [Validators.required, Validators.pattern('[0-9]*'),Validators.minLength(8),Validators.maxLength(15)]),
      });
  }
  loadSelectionPage(value) {
    this.navCtrl.push(SelectionPage, {
      type: value
    })
  }
  ionViewWillEnter() {
    if (this.navParams.get('selection')) {
      var val = this.navParams.get('selection');
      this.country = val.value;
    }
  }
  //api update info
  updateData(){
    let loading = this.loadingCtrl.create();
    let alert = this.alertCtrl.create({
      message:"Information has been updated successfuly! You can now try to submit your request again.",
      buttons:[{
        text:'OK',
        handler: ()=>{ this.navCtrl.pop()}
      }]
    });
    let alert2 = this.alertCtrl.create({
      message:"Error! Something went wrong! Please try again.",
      buttons:[{
        text:'OK',
        handler: ()=>{ this.navCtrl.pop()}
      }]
    });
    loading.present().then(()=>{
      this.appSvc.updatePersonalInfo({
        id: this.id,
        irid:this.irid,
        gender: this.gender,
        bday: this.myDate,
        city: this.city_address,
        country: this.country,
        mob: this.mob_no
      }).then(resp=>{
        if(resp=="True"){
          this.appSvc.getUserDetails(this.irid).then(resp=>{
            this.storage.set(USER_DATA_KEY, resp);
            loading.dismiss();
            alert.present();
          });
        }
        else{
          loading.dismiss();
          alert2.present();
        }
      })
    })
  }

}
