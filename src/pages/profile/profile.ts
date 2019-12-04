import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, PopoverController, ToastController, Toast } from 'ionic-angular';
import { ProfileViewPage } from '../profile-view/profile-view';
import { Http, RequestOptions, Headers, URLSearchParams } from '@angular/http';
import { Storage } from '@ionic/storage';
import { USER_IRID_KEY, USER_DATA_KEY, MERCH_FAVES } from '../../app/app.constants';
import { RequestPopoverPage } from '../../app/popover';
import { FavoritesService } from '../../app/services/favorites.service';
import { FeedService } from '../../app/services/feed.service';
import { PostViewPage } from '../post-view/post-view';
/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  type = "Posts";
  exp = [];
  hasExp = true;
  options;
  reqs = [];
  hesReq = true;
  merchFaves = [];
  name;
  irid;
  email;
  feeds = [];
  toastReload: Toast;
  end = 1;
  isRtl = "ltr"
  private isLeaving: boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private http: Http, private toastCtrl: ToastController, private storage: Storage, private loadingCtrl: LoadingController,
    private popoverCtrl: PopoverController, private faveSvc: FavoritesService, private feedSvc: FeedService) {
    this.options = new RequestOptions({
      headers: new Headers({
        'Content-Type': 'application/x-www-form-urlencoded'
      })
    });
    this.storage.get(USER_DATA_KEY).then(userDetails => {
      console.log(userDetails.isb_grad);
      this.name = userDetails.f_name + ' ' + userDetails.m_name + ' ' + userDetails.l_name;
      this.irid = userDetails.IRID;
      this.email = userDetails.email;
      let loadingPopup = this.loadingCtrl.create();
      loadingPopup.present();
      this.loadPersonalFeed(this.end, loadingPopup);
    });
  }

  ionViewDidLoad() {
    this.loadExp();
    this.loadReq();
    this.loadMerch();
  }
  ionViewDidLeave() {
    this.isLeaving = true;
    if (this.toastReload)
      this.toastReload.dismiss();
  }
  goToProfile() {
    this.navCtrl.push(ProfileViewPage);
  }
  public loadPersonalFeed(page, loadingPopup?) {
    var d = new Date().toLocaleString("en-US");//load date value from initial load to prvent overlap with paging
    console.log(d + this.irid + this.email);
    return this.feedSvc.loadPersonalFeed(this.irid, this.email, d, page).then(feedArry => {
      console.log(feedArry);
      if (feedArry.length > 0) {
        let proms = feedArry.map(e => {
          return this.faveSvc.checkIfFave(e.Id, 'Feed').then(val => {
            e.fave = val;
            console.log(val);
            return this.faveSvc.checkIfLike(e.Id, e.irid).then(liked => {
              e.isLiked = liked;
              console.log(liked);
              return e;
            })
          })
        })
        Promise.all(proms).then(val => {
          this.setValue(val);
          //TODO: Map selected if favorite or not
          loadingPopup.dismiss();
          //console.log(val);
        })
      }
      else{
        //no posts
        loadingPopup.dismiss();
      }
    }).catch(() => {
      let toast = this.toastCtrl.create({
        message: 'Something went wrong! Reload and Try again.',
        position: 'bottom',
        showCloseButton: true,
        closeButtonText: 'Reload'
      });
      toast.onDidDismiss(() => {
        if (!this.isLeaving)
          this.loadPersonalFeed(page);
      })
      toast.present();
      this.toastReload = toast;
      loadingPopup.dismiss();
    })
  }
  goToFeed(id) {
    this.navCtrl.push(PostViewPage, { id: id, details: {name:this.name, irid:this.irid, email:this.email}, permited: true });
  }
  loadExp() {
    let req;
    let loading = this.loadingCtrl.create({ enableBackdropDismiss: true });
    loading.onDidDismiss(() => {
      req.unsubscribe();
    });
    loading.present().then(() => {
      this.storage.get(USER_IRID_KEY).then(irid => {
        let body = new URLSearchParams();
        body.set('action', 'ISBGetUserExperience');
        body.set('irid', irid);
        req = this.http.post('http://bt.the-v.net/service/api.aspx', body, this.options)
          .subscribe(resp => {
            console.log(resp.json())
            this.exp = resp.json();
            if (this.exp.length > 0)
              this.hasExp = true;
            else
              this.hasExp = false;
          }, error => {
            loading.dismiss();
          },
            () => {
              loading.dismiss();
            })
      })
    });
  }
  private setValue(value) {
    this.feeds = this.feeds.concat(value);

  }
  loadReq() {
    this.storage.get(USER_IRID_KEY).then(irid => {
      let body = new URLSearchParams();
      body.set('action', 'ISBGetUserRequestList');
      body.set('irid', irid);
      let req;
      let loading = this.loadingCtrl.create({ enableBackdropDismiss: true });
      loading.onDidDismiss(() => {
        req.unsubscribe();
      });
      loading.present().then(() => {
        req = this.http.post('http://bt.the-v.net/service/api.aspx', body, this.options)
          .subscribe(resp => {
            console.log(resp.json());
            this.reqs = resp.json();
            if (this.reqs.length > 0)
              this.hesReq = true;
            else
              this.hesReq = false;
          }, error => {
            loading.dismiss();
          }, () => {
            loading.dismiss();
          })
      })
    })
  }
  showPopover(req) {
    let popover = this.popoverCtrl.create(RequestPopoverPage, {
      content: req
    }, { cssClass: 'terms' });
    popover.present();
  }
  removeFavorite(item) {
    this.faveSvc.removeFavorite(item, 'Merch').then(rem => {
      console.log(rem);
      //reload view
      if (rem) {
        this.storage.get(MERCH_FAVES).then(m => { this.merchFaves = m });
      }
    })
  }
  loadMerch() {
    this.storage.get(MERCH_FAVES).then(merch => {
      this.merchFaves = merch;
    });
  }
  doInfinite(infiniteScroll) {

    setTimeout(() => {
      this.end += 1;
      this.loadPersonalFeed(this.end).then(() => {
        infiniteScroll.complete();
      });
    }, 800);
  }
}
