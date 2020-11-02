import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ViewController, AlertController, Platform } from 'ionic-angular';
import { ExperiencePage } from '../experience/experience';
import { RECOM_KEY, EXPERIENCE_DATA_KEY, PERSONAL_DETAILS_KEY, GROUPS, LANGUAGES, VLCEVENTS, VEVENTS, UPLINES, COUNTRIES } from '../../app/app.constants';
import { Storage } from '@ionic/storage';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SelectionPage } from '../selection/selection';
import { Http, RequestOptions, Headers, URLSearchParams } from '@angular/http';
import { AppHTMLService } from '../../app/services/app.service';

/**
 * Generated class for the PersonalDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
	selector: 'page-personal-details',
	templateUrl: 'personal-details.html'
})
export class PersonalDetailsPage implements OnInit {
	irid = '';
	email_add = '';
	f_name = '';
	l_name = '';
	card_name = '';
	gender = '';
	myDate;
	city_address = '';
	country = '';
	mob_no = '';
	allValues = {};
	signupform: FormGroup;
	iridIsValid = true;
	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public storage: Storage,
		public alertCtrl: AlertController,
		private viewCtrl: ViewController,
		private http: Http,
		private platform: Platform,
		private appSvc:AppHTMLService
	) {
		this.storage.get(PERSONAL_DETAILS_KEY).then((details) => {
			if (details != null) {
				this.irid = details.irid;
				this.email_add = details.email_add;
				this.f_name = details.f_name;
				this.l_name = details.l_name;
				this.card_name = details.card_name;
				this.gender = details.gender;
				this.myDate = details.myDate;
				this.city_address = details.city_address;
				this.country = details.country;
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
				irid: new FormControl('', [ Validators.required ]),
				email: new FormControl('', [ Validators.required, Validators.pattern(EMAILPATTERN) ]),
				f_name: new FormControl('', [
					Validators.required,
					Validators.pattern('[a-zA-Z ]*'),
					Validators.minLength(2)
				]),
				l_name: new FormControl('', [
					Validators.required,
					Validators.pattern('[a-zA-Z ]*'),
					Validators.minLength(2)
				]),
				card_name: new FormControl('', [
					Validators.required,
					Validators.pattern('[a-zA-Z ]*'),
					Validators.minLength(4)
				]),
				city: new FormControl('', [ Validators.pattern('[a-zA-Z ]*'), Validators.minLength(2) ]),
				bday: new FormControl(''),
				mob_no: new FormControl('', [
					Validators.pattern('[+ ()0-9]*'),
					Validators.minLength(8),
					Validators.maxLength(18)
				])
			});
		} else {
			this.signupform = new FormGroup({
				irid: new FormControl('', [ Validators.required ]),
				email: new FormControl('', [ Validators.required, Validators.pattern(EMAILPATTERN) ]),
				f_name: new FormControl('', [
					Validators.required,
					Validators.pattern('[a-zA-Z ]*'),
					Validators.minLength(2)
				]),
				l_name: new FormControl('', [
					Validators.required,
					Validators.pattern('[a-zA-Z ]*'),
					Validators.minLength(2)
				]),
				card_name: new FormControl('', [
					Validators.required,
					Validators.pattern('[a-zA-Z ]*'),
					Validators.minLength(4)
				]),
				city: new FormControl('', [
					Validators.required,
					Validators.pattern('[a-zA-Z ]*'),
					Validators.minLength(2)
				]),
				bday: new FormControl('', [ Validators.required ]),
				mob_no: new FormControl('', [
					Validators.required,
					Validators.pattern('[+ ()0-9]*'),
					Validators.minLength(8),
					Validators.maxLength(18)
				])
			});
		}
	}
	ionViewDidLoad() {
		this.viewCtrl.showBackButton(false);
		this.loadSelection();
	}
	ionViewWillEnter() {
		if (this.navParams.get('selection')) {
			var val = this.navParams.get('selection');
			this.country = val.value;
		}
	}
	loadSelection() {
		let options = new RequestOptions({
			headers: new Headers({
				'Content-Type': 'application/x-www-form-urlencoded'
			})
		});
		let body = new URLSearchParams();
		body.set('action', 'ISBGetSelection');
		body.set('type', 'groups');
		this.http.post( 'https://bt.the-v.net/service/api.aspx', body, options).subscribe((resp) => {
			this.storage.set(GROUPS, resp.json());
		});
		let body2 = new URLSearchParams();
		body2.set('action', 'ISBGetSelection');
		body2.set('type', 'language');
		this.http.post( 'https://bt.the-v.net/service/api.aspx', body2, options).subscribe((resp) => {
			this.storage.set(LANGUAGES, resp.json());
		});
		let body3 = new URLSearchParams();
		body3.set('action', 'ISBGetSelection');
		body3.set('type', 'vlc');
		this.http.post( 'https://bt.the-v.net/service/api.aspx', body3, options).subscribe((resp) => {
			let i = [];
			let c=0;
			resp.json().forEach(e => {
				i.push(e.data);
				c++;
				if(c==resp.json().length)
				{
					this.storage.set(VLCEVENTS, i);
				}
			});	
		});
		let body4 = new URLSearchParams();
		body4.set('action', 'ISBGetSelection');
		body4.set('type', 'thev');
		this.http.post( 'https://bt.the-v.net/service/api.aspx', body4, options).subscribe((resp) => {
			let i = [];
			let c=0;
			resp.json().forEach(e => {
				i.push(e.data);
				c++;
				if(c==resp.json().length)
				{
					this.storage.set(VEVENTS, i);
				}
			});
    });
    let body5 = new URLSearchParams();
		body5.set('action', 'ISBGetSelection');
		body5.set('type', 'upline');
		this.http.post( 'https://bt.the-v.net/service/api.aspx', body5, options).subscribe((resp) => {
			console.log("done");
			let i = [];
			let c=0;
			resp.json().forEach(e => {
				i.push(e.data);
				c++
				if(c==resp.json().length)
				{
					this.storage.set(UPLINES, i);
				}
			});	
		});
		this.http.get('https://restcountries.eu/rest/v2/all?fields=name;')
		.subscribe(resp=>{
			let i = [];
			let c=0;
			resp.json().forEach(e => {
				i.push(e.name);
				c++
				if(c==resp.json().length)
				{
					this.storage.set(COUNTRIES, i);
				}
			});	
		});
	}
	logOut() {
		this.storage.set(PERSONAL_DETAILS_KEY, null);
		this.storage.set(EXPERIENCE_DATA_KEY, null);
		this.storage.set(RECOM_KEY, null);
		this.navCtrl.pop();
	}
	next() {
		if (this.irid != '' && this.email_add != '' && this.f_name != '' && this.l_name != '' && this.card_name != '' && this.country != '') {
			this.checkIfIRDuplicate();
		} else {
			let youralert = this.alertCtrl.create({
				title: 'Fill All the Required Fields!',
				buttons: [
					{
						text: 'OK',
						role: 'cancel',
						handler: () => {}
					}
				]
			});
			youralert.present();
		}
	}
	goodEnough(){
		this.allValues = {
			irid: this.irid,
			email_add: this.email_add,
			f_name: this.f_name,
			l_name: this.l_name,
			card_name: this.card_name,
			gender: this.gender,
			myDate: this.myDate,
			city_address: this.city_address,
			country: this.country,
			mob_no: this.mob_no
		};
		this.storage.set(PERSONAL_DETAILS_KEY, this.allValues).then(() => {
			this.goToExperience();
		});
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
		});
	}
	assignVal(val) {
		this.iridIsValid = val;
	}
	checkIfIRDuplicate(){
		this.http.get('https://bt.the-v.net/checkir.aspx?irid=' + this.irid).subscribe((res) => {
			console.log(res.text());
			try {
				let x = res.json();
				if (x.length > 0) {
					this.appSvc.getUserDetails(this.irid).then(resp=>{
						if(resp){
							let youralert = this.alertCtrl.create({
								title: 'IRID Duplicate!',
								message: 'Oops! Looks like IRID is already registered. Please use another IRID to register.',
								buttons: [
									{
										text: 'OK',
										role: 'cancel',
										handler: () => {}
									}
								]
							});
							youralert.present();
						}
						else{
							this.goodEnough();
						}
					});
				} else {
					let youralert1 = this.alertCtrl.create({
						title: 'Invalid IRID!',
						message: 'Oops! Please use a valid IRID.',
						buttons: [
							{
								text: 'OK',
								role: 'cancel',
								handler: () => {}
							}
						]
					});
					youralert1.present();
				}
			} catch (ex) {
				let youralert1 = this.alertCtrl.create({
					title: 'Invalid IRID!',
					message: 'Oops! Please use a valid IRID.',
					buttons: [
						{
							text: 'OK',
							role: 'cancel',
							handler: () => {}
						}
					]
				});
				youralert1.present();
			}
		});
		
	}
	checkIrid() {
		console.log('event Fired!');
		//set to outer variable isIridValid;

		this.http.get('https://bt.the-v.net/checkir.aspx?irid=' + this.irid).subscribe((res) => {
			console.log(res.text());
			try {
				let x = res.json();
				if (x.length > 0) {
					this.assignVal(true);
				} else {
					this.assignVal(false);
				}
			} catch (ex) {
				this.assignVal(false);
			}
		});
	}
}
