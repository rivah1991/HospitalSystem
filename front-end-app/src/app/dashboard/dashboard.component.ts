import { Component, computed, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SidebarComponent } from '../components/sidebar/sidebar.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatCardModule} from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ 
    MatToolbarModule, MatSidenavModule, SidebarComponent,
    MatButtonModule, MatCardModule, MatDialogModule,
    MatIconModule, RouterModule,CommonModule
],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  constructor(
    private router:Router, 
    private dialog: MatDialog

  ){}

  
 
  collapsed = signal(false);
  sidenavwidth = computed(() => this.collapsed() ? '65px': '250px');


  logout(){
    localStorage.removeItem('token');
    this.router.navigateByUrl('/signin');
   
  }
}
