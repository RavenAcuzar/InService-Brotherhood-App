import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SocialFeedPage } from '../pages/social-feed/social-feed';
import { EventsPage } from '../pages/events/events';
import { ExclusivesPage } from '../pages/exclusives/exclusives';
import { ProfilePage } from '../pages/profile/profile';
import { MarkPage } from '../pages/mark/mark';
import { MerchPage } from '../pages/merch/merch';
import { SurveyPage } from '../pages/survey/survey';
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { LoginPage } from '../pages/login/login';
import { ConfirmationPage } from '../pages/confirmation/confirmation';
import { EventsViewPage } from '../pages/events-view/events-view';
import { ExperiencePage } from '../pages/experience/experience';
import { Fallback2Page } from '../pages/fallback2/fallback2';
import { FallbackPage } from '../pages/fallback/fallback';
import { ForgotPasswordPage } from '../pages/forgot-password/forgot-password';
import { MolpayPage } from '../pages/molpay/molpay';
import { NewsLandingPage } from '../pages/news-landing/news-landing';
import { OnsitePaymentPage } from '../pages/onsite-payment/onsite-payment';
import { PaymentInstructionsPage } from '../pages/payment-instructions/payment-instructions';
import { PersonalDetailsPage } from '../pages/personal-details/personal-details';
import { PlayVideoPage } from '../pages/play-video/play-video';
import { PostViewPage } from '../pages/post-view/post-view';
import { PostingPage } from '../pages/posting/posting';
import { ProfileViewPage } from '../pages/profile-view/profile-view';
import { RecommendedPage } from '../pages/recommended/recommended';
import { SelectionPage } from '../pages/selection/selection';
import { UpdatePersonalInfoPage } from '../pages/update-personal-info/update-personal-info';
import { UploadPage } from '../pages/upload/upload';
import { SearchPipe } from '../pipes/search/search';
import { AppHTMLService } from './services/app.service';
import { FileTransfer } from '@ionic-native/file-transfer';
import { FilePath } from '@ionic-native/file-path';
import { File } from '@ionic-native/file';
import { Camera } from '@ionic-native/camera';
import { Base64ToGallery } from '@ionic-native/base64-to-gallery';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { PhotoLibrary } from "@ionic-native/photo-library";
import { IonicStorageModule } from '@ionic/storage';
import { HttpModule } from '@angular/http';
import { Crop } from "@ionic-native/crop";
import { SocialSharing } from "@ionic-native/social-sharing";
import { FavoritesService } from './services/favorites.service';
import { SQLite } from '@ionic-native/sqlite';
import { ImageViewerPage } from '../pages/image-viewer/image-viewer';
import { RequestPopoverPage, PopoverPage } from './popover';
import { FeedService } from './services/feed.service';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    SocialFeedPage,
    EventsPage,
    ExclusivesPage,
    ProfilePage,
    MarkPage,
    MerchPage,
    SurveyPage,
    AboutPage,
    ContactPage,
    LoginPage,
    ConfirmationPage,
    EventsViewPage,
    ExperiencePage,
    Fallback2Page,
    FallbackPage,
    ForgotPasswordPage,
    MolpayPage,
    NewsLandingPage,
    OnsitePaymentPage,
    PaymentInstructionsPage,
    PersonalDetailsPage,
    PlayVideoPage,
    PostViewPage,
    PostingPage,
    ProfileViewPage,
    RecommendedPage,
    SelectionPage,
    UpdatePersonalInfoPage,
    UploadPage,
    SearchPipe,
    ImageViewerPage,
    RequestPopoverPage,
    PopoverPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp,{navExitApp:false}),
    IonicStorageModule.forRoot(),
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    SocialFeedPage,
    EventsPage,
    ExclusivesPage,
    ProfilePage,
    MarkPage,
    MerchPage,
    SurveyPage,
    AboutPage,
    ContactPage,
    LoginPage,
    ConfirmationPage,
    EventsViewPage,
    ExperiencePage,
    Fallback2Page,
    FallbackPage,
    ForgotPasswordPage,
    MolpayPage,
    NewsLandingPage,
    OnsitePaymentPage,
    PaymentInstructionsPage,
    PersonalDetailsPage,
    PlayVideoPage,
    PostViewPage,
    PostingPage,
    ProfileViewPage,
    RecommendedPage,
    SelectionPage,
    UpdatePersonalInfoPage,
    UploadPage,
    ImageViewerPage,
    RequestPopoverPage,
    PopoverPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AppHTMLService,
    FileTransfer,
    File,
    FilePath,
    Camera,
    Base64ToGallery,
    AndroidPermissions,
    PhotoLibrary,
    Crop,
    SocialSharing,
    FavoritesService,
    SQLite,
    FeedService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
