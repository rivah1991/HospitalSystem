import { Component, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { SidebarComponent } from '../components/sidebar/sidebar.component';
import { MainContentComponent } from '../components/main-content/main-content.component';
import { HeaderComponent } from '../components/header/header.component';

import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    
    // MainContentComponent, 
    // HeaderComponent,
    MatToolbarModule, MatSidenavModule, SidebarComponent,
    MatButtonModule,
    MatIconModule      
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  constructor(private router:Router){}
 
  collapsed = signal(false);
  sidenavwidth = computed(() => this.collapsed() ? '65px': '250px');
}
