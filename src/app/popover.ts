import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular/navigation/nav-params';

@Component({
    template: `
    <div padding style="color:#37837E;"><h3 style="text-align:center;">Terms and Conditions</h3>
    <p> By signing up on this Inservice Brotherhood Mobile Application you (Profile Owner) agree
    to be bound by the terms and conditions specified herein and any other provision as maybe
    specified from time to time by the Event/show organizer (‘promoter’). </p>
    <p> 1. Agreeing with all the terms & conditions given below and acknowledging that the details
    entered by you (Profile Owner) are accurate and may be used for database & internal work
    purposes.</p>
    <p> 2. The functionalities in the scope of the project are:<br>&nbsp;&nbsp;&nbsp;&nbsp;ISB Application will:</p>
    <ul>

    <li>
    Enforce the login/registration of the user when accessing the app.
    </li>
    <li>
    Categorize whether the member is an ISB Graduate or Non-ISB Graduate.
    </li>
    <li>
    Restrict the app contents based on the member’s category.
    </li>
    <li>
    Require the member to enter his upline’s name when registering in the app
for the first time.
    </li>
    <li>
    Display the payment history in the member’s account.
    </li>
    </ul>
    <p>3. Non-ISB graduates will have a limited view of the application.</p>
    <p> 4. The ISB graduates will be able to access all the functionalities of the App.</p>
    <p>5.ISB App account registration will be approved within 48 working hours.</p>
<p>6. User shall be logged in to be able to view the contents of the application and to receive new
notification.</p>
<p>7. ISB Member shall get the approval by their Upline prior before joining the event.</p>
<p>8. ISB Graduate shall be able to sign up for ISB Event either as a participant or as a server.
Also, he can be signed up as server for the VCON.</p>
<p>9. Non- ISB Graduates shall only be allowed to join the Events.</p>
<p>10. The Non-ISB Graduate’s account will be upgraded to ISB Graduate upon completion of
the Event by the ISB Admin.</p>
     </div>`,
})

export class PopoverPage{
    constructor(){

    }
}

@Component({
    template: `
    <div style="padding:16px;">
    <h6 style="color:#999999 !important;">Order No. {{content.orderID}}</h6>
    <hr>
    <h2>Event: {{content.EventName}}</h2>
    <ion-item style="padding-left:0 !important; padding-bottom:20px!important;">
      <h3 style="color:#D52730 !important;"> Request Type: {{content.RequestType}}</h3>
      <p style="font-size: 12px;">Status: {{content.status}}</p>
  </ion-item>
  </div>`,
})

export class RequestPopoverPage{
    content;
    constructor(private navParams:NavParams){
        this.content = this.navParams.get('content');
    }
}