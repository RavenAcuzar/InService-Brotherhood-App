import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { AppHTMLService } from './services/app.service';
import { Storage } from '@ionic/storage';
import { AppStateService } from './services/app_state.service';
import { USER_DATA_KEY, LOGGED_IN_KEY, USER_IRID_KEY, NOTIFCOUNTS, MERCH_FAVES } from './app.constants';
import { ExclusivesPage } from '../pages/exclusives/exclusives';
import { Fallback2Page } from '../pages/fallback2/fallback2';
import { LoginPage } from '../pages/login/login';
import { EventsPage } from '../pages/events/events';
import { SocialFeedPage } from '../pages/social-feed/social-feed';
import { ProfilePage } from '../pages/profile/profile';
import { MarkPage } from '../pages/mark/mark';
import { MerchPage } from '../pages/merch/merch';
import { SurveyPage } from '../pages/survey/survey';
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { isSyntaxError } from '@angular/compiler';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;
pages: Array<{title: string, component?: any,  icon: string}>=[];
pageState: boolean;
  activePage: any;
  name:string;
  irid:string;
  constructor(private platform: Platform, private statusBar: StatusBar, private splashScreen: SplashScreen,
    private event: Events, private storage: Storage, private alertCtrl: AlertController, private AppSvc: AppHTMLService) {
    this.initializeApp();
 this.updateMenu();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.event.subscribe(AppStateService.UPDATE_MENU_STATE_EVENT, () => {
        this.updateMenu();
      });
      this.storage.get(MERCH_FAVES).then(merch=>{
        if(!merch){
          this.storage.set(MERCH_FAVES, []);
        }
      })
    });
  }

  openPage(page) {
    //check isb grad status for Exclusive feat
    if (page.title == 'EXCLUSIVES') {
      this.storage.get(LOGGED_IN_KEY).then(loggedin => { //check if loggedin
        if (loggedin) {
          this.storage.get(USER_DATA_KEY).then(user => {//check current isb grad status
            //console.log(user);
            if (user.isb_grad != 'True') { //if false, verify, else do nothing
              this.AppSvc.getUserDetails(user.IRID).then(updateDetails => {//fetch user data
                this.storage.set(USER_DATA_KEY, updateDetails);//save to storage
                this.storage.get(USER_DATA_KEY).then(newData => {//verify new data
                  if (newData.isb_grad == 'True') { //if new status is true, update storage value, else do nothing
                    this.nav.setRoot(ExclusivesPage); //enable exclusive feat
                    this.activePage = page;
                  }
                  else {//when false
                    this.nav.push(Fallback2Page); //go to fallback
                    this.activePage = page;
                  }
                })
              })
            }
            else{
              this.nav.setRoot(ExclusivesPage); //enable exclusive feat
                    this.activePage = page;
            }
          })
        }
      })
    }
    if (page.component) {
      if (page.component == LoginPage) {
        this.nav.push(page.component);
      }
      else {
        this.nav.setRoot(page.component);
        this.activePage = page;
      }
    }
  }
  updateMenu() {
    this.storage.get(LOGGED_IN_KEY).then(isLoggedIn => {
      if (isLoggedIn) {
        this.storage.get(USER_DATA_KEY).then(userDetails => {
          console.log(userDetails.isb_grad);
          this.name = userDetails.f_name +' '+userDetails.m_name+' '+userDetails.l_name;
          this.irid = userDetails.IRID;
          if (userDetails.isb_grad == 'True') {
            this.pages = [
              { title: 'HOME', component: HomePage, icon: "md-home" },
              { title: 'SOCIAL FEED', component: SocialFeedPage, icon: "md-people" },
              { title: 'EVENTS', component: EventsPage, icon: "md-flash" },
              { title: 'EXCLUSIVES', component: ExclusivesPage, icon: "md-flame" },
              { title: 'PROFILE', component: ProfilePage, icon: "md-person" },
              { title: 'ISB MARK', component: MarkPage, icon: "md-aperture" },
              { title: 'ISB MERCHANDISE', component: MerchPage, icon: "md-shirt" },
              { title: 'SURVEY', component: SurveyPage, icon: "md-analytics" },
              { title: 'ABOUT ISB', component: AboutPage, icon: "md-information-circle" },
              { title: 'CONTACT US', component: ContactPage, icon: "md-mail" }
            ];
          }
          else {
            this.pages = [
              { title: 'HOME', component: HomePage, icon: "md-home" },
              { title: 'SOCIAL FEED', component: SocialFeedPage, icon: "md-people" },
              { title: 'EVENTS', component: EventsPage, icon: "md-flash" },
              { title: 'EXCLUSIVES', icon: "md-flame" },
              { title: 'PROFILE', component: ProfilePage, icon: "md-person" },
              { title: 'ISB MARK', component: MarkPage, icon: "md-aperture" },
              { title: 'ISB MERCHANDISE', component: MerchPage, icon: "md-shirt" },
              { title: 'SURVEY', component: SurveyPage, icon: "md-analytics" },
              { title: 'ABOUT ISB', component: AboutPage, icon: "md-information-circle" },
              { title: 'CONTACT US', component: ContactPage, icon: "md-mail" }
            ];
          }
        });
      }
      else {
        this.pages = [
          { title: 'HOME', component: HomePage, icon: "md-home" },
              { title: 'SOCIAL FEED', component: LoginPage, icon: "md-people" },
              { title: 'EVENTS', component: EventsPage, icon: "md-flash" },
              { title: 'EXCLUSIVES', component: LoginPage, icon: "md-flame" },
              { title: 'PROFILE', component: LoginPage, icon: "md-person" },
              { title: 'ISB MARK', component: LoginPage, icon: "md-aperture" },
              { title: 'ISB MERCHANDISE', component: MerchPage, icon: "md-shirt" },
              { title: 'SURVEY', component: LoginPage, icon: "md-analytics" },
              { title: 'ABOUT ISB', component: AboutPage, icon: "md-information-circle" },
              { title: 'CONTACT US', component: ContactPage, icon: "md-mail" }
        ];
      }
      this.pageState = isLoggedIn;
    })
  }
  checkActive(page) {
    return page == this.activePage;
  }
  logoutAlert() {
    let alert = this.alertCtrl.create({
      title: 'Are you sure you want to Log out?',
      buttons: [{
        text: 'Logout',
        handler: () => {
          this.logout();
          alert.dismiss();
          return false;
        }
      },
      {
        text: 'Cancel',
        handler: () => {
          alert.dismiss();
          return false;
        }
      }
      ]
    })
    alert.present();
  }
  logout() {
    this.storage.set(LOGGED_IN_KEY, false).then(() => {
      this.storage.set(USER_IRID_KEY, null).then(() => {
        this.storage.set(USER_DATA_KEY, null).then(() => {
          this.storage.set(NOTIFCOUNTS, null).then(() => {
            AppStateService.publishAppStateChange(this.event);
            this.pageState = false;
            this.nav.setRoot(HomePage);
          });
        });
      });
    });
  }
  login() {
    this.nav.push(LoginPage);
  }
}
