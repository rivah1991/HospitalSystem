import { Component, computed, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SidebarComponent } from '../components/sidebar/sidebar.component';
import { HeaderComponent } from '../components/header/header.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatCardModule} from '@angular/material/card';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ 
    // HeaderComponent,
    MatToolbarModule, MatSidenavModule, SidebarComponent,
    MatButtonModule, MatCardModule,
    MatIconModule, RouterModule,
    // MainContentComponent
],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  constructor(private router:Router){}
 
  collapsed = signal(false);
  sidenavwidth = computed(() => this.collapsed() ? '65px': '250px');
}
