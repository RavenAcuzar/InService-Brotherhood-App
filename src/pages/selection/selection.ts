import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { COUNTRIES, VLCEVENTS, VEVENTS, UPLINES } from '../../app/app.constants';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the SelectionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
 
@Component({
  selector: 'page-selection',
  templateUrl: 'selection.html',
})
export class SelectionPage {
  items=[];
  callback;
  title;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private storage:Storage) {
    
    
  }
  ionViewDidEnter(){
    this.title = this.navParams.get('type');
    //console.log(this.title);
    if(this.title == 'COUNTRY'){
      this.storage.get(COUNTRIES).then(ev=>{
        //console.log(ev);
       this.items = ev;
      });
    } else if(this.title == 'VLC EVENTS'){
      this.storage.get(VLCEVENTS).then(ev=>{
        //console.log(ev);
       this.items = ev;
      });
    } else if(this.title == 'THE V EVENTS'){
      this.storage.get(VEVENTS).then(ev=>{
        //console.log(ev);
        this.items = ev;
      });
    } else if(this.title == 'UPLINES'){
      //console.log("correct!")
      this.storage.get(UPLINES).then(ev=>{
        //console.log(ev);
        this.items = ev;
      });
    }
  }
  radioChecked(value){
      this.navCtrl.getPrevious().data.selection = {type:this.title,value:value};
      this.navCtrl.pop();
  }
  
}
