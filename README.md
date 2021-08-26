# ![App Icon](https://github.com/RavenAcuzar/InService-Brotherhood-App/blob/master/resources/android/icon/drawable-xhdpi-icon.png) 
# V Inservice

This app is created for the members of the Inservice Brotherhood of TheV.

Through the all-new ISB mobile app, registered users can easily apply for the ISB Bootcamp and apply to serve during events. It also comes with an exclusive ISB news and updates.

Download now on [Google Play](https://play.google.com/store/apps/details?id=net.thev.isb189315) and [Appstore](https://apps.apple.com/ph/app/v-inservice/id1405341172)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Setup the following requirements to your local machine.

- [Node.js](https://nodejs.org/en/)
- [Setup Ionic](https://ionicframework.com/docs/intro/cli)
- [Setup Git](https://docs.github.com/en/get-started/quickstart/set-up-git)
- [IOS Development](https://ionicframework.com/docs/developing/ios)
- [Android Development](https://ionicframework.com/docs/developing/android)

### Initialize

Create ionic starter app.
```
ionic start ISBApp https://github.com/RavenAcuzar/InService-Brotherhood-App/
```
Initialize node packages.
```
npm i
```
Run the app.
```
ionic serve
```
To add platform (Android/IOS)
```
ionic cordova platform add android
```
```
ionic cordova platform add ios
```

### Build App

Run the following commands for building the app.
(Android) For generating release apk add `--prod --release`
```
ionic cordova build android
```
(IOS) For generating release apk add `--prod`. Open project in XCode then run build, Archive, then upload to Appstore.
```
ionic cordova build ios
```

## Key Features
- Exclusive Social Feed for Inservice Brotherhood members
- Ticket purchasing for ISB related events.
- Exclusive Photo Galleries for members of the ISB
- Exclusive videos related to ISB
- Generate framed photo with social sharing and downloads enabled
- See exclusive ISB Merchandise offered.

## To Do
- Change access of Molpay Payment to production

## Built with

* Ionic 3 (Ionic-Angular Framework)
* Typescript
* HTML, Css/Scss

## Authors and Contributors

* **Rico Raven Acuzar** - [linkedin.com/in/rico-raven/](https://www.linkedin.com/in/rico-raven/)
