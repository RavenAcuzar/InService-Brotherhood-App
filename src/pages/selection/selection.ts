import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { COUNTRIES, VLCEVENTS, VEVENTS } from '../../app/app.constants';

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
  items: any[];
  callback;
  title;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.title = this.navParams.get('type');
    if(this.title == 'COUNTRY'){
      this.items = COUNTRIES;
    } else if(this.title == 'VLC EVENTS'){
      this.items = VLCEVENTS;
    } else if(this.title = 'THE V EVENTS'){
      this.items = VEVENTS;
    }
  }
  radioChecked(value){
      this.navCtrl.getPrevious().data.selection = {type:this.title,value:value};
      this.navCtrl.pop();
  }
  
}
