import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit{
  appPages = [
    {
      title: 'Plugin Tests',
      url: '/plugin-testing',
      icon: 'add',
    },
    {
      title: 'Stud Finder',
      url: '/stud-finder',
      icon: 'add',
    },
    {
      title: 'About',
      url: '/about',
      icon: 'information-circle',
    },
  ];
  loggedIn = false;
  dark = false;

  constructor() {
    this.initializeApp();
    
  }

  async ngOnInit() {
    // await this.storage.create();
    // this.checkLoginStatus();
    // this.listenForLoginEvents();

    // this.swUpdate.versionUpdates.subscribe(async () => {
    //   const toast = await this.toastCtrl.create({
    //     message: 'Update available!',
    //     position: 'bottom',
    //     buttons: [
    //       {
    //         role: 'cancel',
    //         text: 'Reload',
    //       },
    //     ],
    //   });

    //   await toast.present();

    //   toast
    //     .onDidDismiss()
    //     .then(() => this.swUpdate.activateUpdate())
    //     .then(() => window.location.reload());
    // });
  }

  initializeApp() {
    // this.platform.ready().then(() => {
    //   if (this.platform.is('hybrid')) {
    //     StatusBar.hide();
    //     SplashScreen.hide();
    //   }
    // });
  }

  // checkLoginStatus() {
  //   return this.userService.isLoggedIn().then(loggedIn => {
  //     return this.updateLoggedInStatus(loggedIn);
  //   });
  // }

  // updateLoggedInStatus(loggedIn: boolean) {
  //   setTimeout(() => {
  //     this.loggedIn = loggedIn;
  //   }, 300);
  // }

  listenForEvents() {


    window.addEventListener('user:logout', () => {
      // this.updateLoggedInStatus(false);
    });
  }
}
