import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Navbar, AlertController } from 'ionic-angular';
import { UploadPage } from '../upload/upload';
import { Storage } from '@ionic/storage';
import { RECOM_KEY } from '../../app/app.constants';
import { FormControl, FormGroup, Validators } from '@angular/forms';

/**
 * Generated class for the RecommendedPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

 
@Component({
  selector: 'page-recommended',
  templateUrl: 'recommended.html',
})
export class RecommendedPage {
  @ViewChild(Navbar) navBar: Navbar;
  up='';
  v_pos = '';
  allVal = {};
  signupform: FormGroup;
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public storage: Storage,
    public alertCtrl:AlertController) {
      this.storage.get(RECOM_KEY).then(values=>{
        if(values!=null){
          this.up = values.up;
          this.v_pos = values.v_pos;
        }
      })
  }
  ngOnInit(){
    this.signupform = new FormGroup({
      NameUp: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.minLength(2)]),
      VPos: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.minLength(2)])
    });
  }
  next(){
    if(this.formValidate()){
      this.allVal = {
        up:this.up,
        v_pos:this.v_pos
      }
      this.storage.set(RECOM_KEY, this.allVal).then(()=>{
        this.goToUpload();
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
  formValidate(){
    if(this.up=='' && this.v_pos == ''){
      return false;
    }
    else{
      return true;
    }

  }
  goToUpload(){
    this.navCtrl.push(UploadPage);
  }
}
