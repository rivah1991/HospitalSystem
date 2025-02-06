import { Component, computed, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SidebarComponent } from '../components/sidebar/sidebar.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatCardModule} from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ 
    MatToolbarModule, MatSidenavModule, SidebarComponent,
    MatButtonModule, MatCardModule, MatDialogModule,
    MatIconModule, RouterModule,
],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  constructor(
    private router:Router, 
    private dialog: MatDialog

  ){}

  profileMenuOpened = false;

   // Open men profil
   openProfileMenu(event: MouseEvent): void {
    this.profileMenuOpened = !this.profileMenuOpened;
  }

  navigateToProfileUpdate(): void {
    this.router.navigate(['/profile-update']); 
    this.profileMenuOpened = false;
  }
 
  collapsed = signal(false);
  sidenavwidth = computed(() => this.collapsed() ? '65px': '250px');


  logout(){
    localStorage.removeItem('token');
    this.router.navigateByUrl('/signin');
    this.profileMenuOpened = false;
  }
}
