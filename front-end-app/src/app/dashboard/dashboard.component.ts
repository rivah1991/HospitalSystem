import { Component, computed, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SidebarComponent } from '../components/sidebar/sidebar.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common'; 
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ 
    MatToolbarModule, MatSidenavModule, SidebarComponent,
    MatButtonModule, MatCardModule, MatDialogModule,
    MatIconModule, RouterModule, CommonModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  collapsed = signal(false);  
  sidenavOpened = signal(this.isLargeScreen());

  constructor(
    private router: Router, 
    private dialog: MatDialog,
    public breakpointObserver: BreakpointObserver 
  ) {}

  isLargeScreen(): boolean {
    return !this.breakpointObserver.isMatched('(max-width: 430px)');
  }

  sidenavwidth = computed(() => 
    this.isLargeScreen()
      ? (this.sidenavOpened() ? '250px' : '65px') 
      : (this.sidenavOpened() ? '250px' : '0px') 
  );

  toggleSidenav() {
    this.sidenavOpened.set(!this.sidenavOpened());
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigateByUrl('/signin');
  }
}
