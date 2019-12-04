import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ViewController, AlertController, Platform } from 'ionic-angular';
import { ExperiencePage } from '../experience/experience';
import { RECOM_KEY, EXPERIENCE_DATA_KEY, PERSONAL_DETAILS_KEY } from '../../app/app.constants';
import { Storage } from '@ionic/storage';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SelectionPage } from '../selection/selection';
import { Http } from "@angular/http";

/**
 * Generated class for the PersonalDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

 
@Component({
  selector: 'page-personal-details',
  templateUrl: 'personal-details.html',
})
export class PersonalDetailsPage implements OnInit{
irid = '';
  email_add = '';
  f_name = '';
  m_name = '';
  l_name = '';
  card_name = '';
  gender = '';
  myDate;
  h_address = '';
  city_address = '';
  state_address = '';
  zip_code = '';
  country = '';
  tel_no = '';
  mob_no = '';
  allValues = {};
  signupform: FormGroup;
  iridIsValid = null;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage,
    public alertCtrl: AlertController,
    private viewCtrl: ViewController,
    private http: Http,
    private platform: Platform) {
    this.storage.get(PERSONAL_DETAILS_KEY).then(details => {
      if (details != null) {
        this.irid = details.irid;
        this.email_add = details.email_add;
        this.f_name = details.f_name;
        this.m_name = details.m_name;
        this.l_name = details.l_name;
        this.card_name = details.card_name;
        this.gender = details.gender;
        this.myDate = details.myDate;
        this.h_address = details.h_address;
        this.city_address = details.city_address;
        this.state_address = details.state_address;
        this.zip_code = details.zip_code;
        this.country = details.country;
        this.tel_no = details.tel_no;
        this.mob_no = details.mob_no;
      }
    });

  }
  /*- Gender
- Date of birth
- Address
- Zip code
- Phone number
 */
  ngOnInit() {
    let EMAILPATTERN = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;
    if (this.platform.is('ios')) {
      this.signupform = new FormGroup({
        irid: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.required, Validators.pattern(EMAILPATTERN)]),
        f_name: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.minLength(2)]),
        m_name: new FormControl('', [Validators.pattern('[a-zA-Z .]*'), Validators.maxLength(4)]),
        l_name: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.minLength(2)]),
        card_name: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.minLength(4)]),
        house_street: new FormControl('', [Validators.pattern('[a-zA-Z0-9 .-]*'), Validators.minLength(4)]),
        city: new FormControl('', [Validators.pattern('[a-zA-Z ]*'), Validators.minLength(2)]),
        state: new FormControl('', [Validators.pattern('[a-zA-Z ]*'), Validators.minLength(2)]),
        zip_code: new FormControl('', [Validators.pattern('[0-9]*')]),
        country: new FormControl(''),
        bday: new FormControl(''),
        tel_no: new FormControl('', [Validators.pattern('[0-9]*'), Validators.minLength(8), Validators.maxLength(15)]),
        mob_no: new FormControl('', [Validators.pattern('[0-9]*'), Validators.minLength(8), Validators.maxLength(15)]),
      });
    }
    else{
      this.signupform = new FormGroup({
        irid: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.required, Validators.pattern(EMAILPATTERN)]),
        f_name: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.minLength(2)]),
        m_name: new FormControl('', [Validators.pattern('[a-zA-Z .]*'), Validators.maxLength(4)]),
        l_name: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.minLength(2)]),
        card_name: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.minLength(4)]),
        house_street: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z0-9 .-]*'), Validators.minLength(4)]),
        city: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.minLength(2)]),
        state: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.minLength(2)]),
        zip_code: new FormControl('', [Validators.required, Validators.pattern('[0-9]*')]),
        country: new FormControl('', [Validators.required]),
        bday: new FormControl('', [Validators.required]),
        tel_no: new FormControl('', [Validators.required, Validators.pattern('[0-9]*'),Validators.minLength(8),Validators.maxLength(15)]),
        mob_no: new FormControl('', [Validators.required, Validators.pattern('[0-9]*'),Validators.minLength(8),Validators.maxLength(15)]),
      });
    }
  }
  ionViewDidLoad() {
    this.viewCtrl.showBackButton(false);
  }
  ionViewWillEnter() {
    if (this.navParams.get('selection')) {
      var val = this.navParams.get('selection');
      this.country = val.value;
    }
  }

  logOut() {
    this.storage.set(PERSONAL_DETAILS_KEY, null);
    this.storage.set(EXPERIENCE_DATA_KEY, null);
    this.storage.set(RECOM_KEY, null);
    this.navCtrl.pop();
  }
  next() {
    if (this.irid != '' && this.email_add != '' && this.f_name != '' && this.l_name != '' && this.card_name != '') {
      this.allValues = {
        irid: this.irid,
        email_add: this.email_add,
        f_name: this.f_name,
        m_name: this.m_name,
        l_name: this.l_name,
        card_name: this.card_name,
        gender: this.gender,
        myDate: this.myDate,
        h_address: this.h_address,
        city_address: this.city_address,
        state_address: this.state_address,
        zip_code: this.zip_code,
        country: this.country,
        tel_no: this.tel_no,
        mob_no: this.mob_no
      }
      this.storage.set(PERSONAL_DETAILS_KEY, this.allValues).then(() => {
        this.goToExperience();
      });
    }
    else {
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
  // formValidate() {
  //   if (this.irid != '' && this.email_add != '' && this.f_name != '' && this.m_name != '' && this.l_name != '' && this.card_name != '' && this.gender != '' && this.h_address != '' && this.city_address != '' && this.state_address != '' && this.zip_code != '' && this.country != '' && this.tel_no != '' && this.mob_no != '') {
  //     return false;
  //   }
  //   else
  //   return true;
  // }
  goToExperience() {
    this.navCtrl.push(ExperiencePage);
  }
  loadSelectionPage(value) {
    this.navCtrl.push(SelectionPage, {
      type: value
    })
  }
  assignVal(val) {
    this.iridIsValid = val;
  }
  checkIrid() {
    console.log("event Fired!")
    //set to outer variable isIridValid;

    this.http.get("https://vregistration.the-v.net/checkir.aspx?irid=" + this.irid)
      .subscribe(res => {
        console.log(res.text());
        try {
          let x = res.json();
          if (x.length > 0) {
            this.assignVal(true);
          }
          else {
            this.assignVal(false);
          }
        }
        catch{
          this.assignVal(false);
        }
      })
  }

}
