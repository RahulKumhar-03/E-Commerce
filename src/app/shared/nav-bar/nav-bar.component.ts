import { Component } from '@angular/core';
import {MatSidenavModule} from '@angular/material/sidenav';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { MatButtonModule } from "@angular/material/button";
import { LoginRegisterService } from '../../core/services/auth/login-register.service';

@Component({
  selector: 'app-nav-bar',
  imports: [MatSidenavModule, RouterOutlet, RouterLink, RouterLinkActive, MatButtonModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent {
  constructor(public authService: LoginRegisterService, private router: Router){}

  public onLogout(){
    this.authService.logout();
  }
}
