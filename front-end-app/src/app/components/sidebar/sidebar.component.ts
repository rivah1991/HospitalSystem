import { CommonModule } from '@angular/common';
import { Component, computed, Input, OnInit, signal } from '@angular/core';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatMenuModule} from '@angular/material/menu';
import { Router, RouterLink } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { ProfileModalComponent } from '../profil/profile-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../shared/services/auth.service';
import { UserService } from '../../shared/services/user.service';

export type MenuItem = {
  icon: string;
  label: string;
  submenu: any;
  route?: any;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule, MatListModule, MatIconModule,MatMenuModule,
    MatSidenavModule,MatExpansionModule, RouterLink, MatDialogModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {

  constructor(
    private dialog: MatDialog,
    private userService: UserService

  ) {}

  currentUser: any;
  isAdmin: boolean = false;
  sideNavCollapsed = signal(false);
  @Input() set collapsed(val: boolean){
    this.sideNavCollapsed.set(val);
  }
  

  menuItems = signal<MenuItem[]>([
    {
      icon: 'dashboard',
      label: 'Dashboard',
      submenu: [],
      route: 'dashboard'
    },
    {
      icon: 'settings',
      label: 'Admin',
      submenu: [
        { label: 'Audit Log', icon: 'history', route: 'admin/audit' },  
        { label: 'Approve', icon: 'check_circle', route: 'admin' }, 
      ],
      
    },
    {
      icon: 'health_and_safety',
      label: 'Doctors',
      submenu: [
        { label: 'Doctors List', icon: 'list_alt', route: 'doctors/list' }, 
       
      ],
      
    },
    {
      icon: 'local_hospital',
      label: 'Patients',
      submenu: [
        { label: 'Patient List', icon: 'list_alt',route: 'patients/list' }, 
        { label: 'Add Patient', icon: 'person_add',route: 'patients/add' } 
      ],
      
    }
]);

ngOnInit(): void {
  this.userService.getCurrentUser().subscribe({
    next: (data) => {
      this.currentUser = data; // Assurez-vous que `data` contient le `username`
      this.isAdmin = this.currentUser?.role === 'Admin';
    },
    error: (error) => {
      console.error('Error fetching user data', error);
    }
  });
}


  profilePicSize = computed(() => this.sideNavCollapsed() ? '40': '65');

  textcollapse = computed(() => this.sideNavCollapsed() ? 'display-none' : 'display-inline');

  openProfileModal(): void {
    this.dialog.open(ProfileModalComponent, {
      width: '50%',  // Ajustez la largeur du modal selon vos besoins
      panelClass: 'top-center-modal'  // Utilisez une classe CSS personnalisée pour le positionnement
    });
  }
  

}
