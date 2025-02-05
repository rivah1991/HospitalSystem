import { CommonModule } from '@angular/common';
import { Component, computed, Input, signal } from '@angular/core';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
export type MenuItem = {
  icon: string;
  label: string;
  submenu: any;
  route?: any;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, MatListModule, MatIconModule,MatMenuModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {


  sideNavCollapsed = signal(false);
  @Input() set collapsed(val: boolean){
    this.sideNavCollapsed.set(val);
  }
  
  menuRefs: { [key: string]: any } = {};

  menuItems = signal<MenuItem[]>([
    {
      icon: 'dashboard',
      label: 'Dashboard',
      submenu: null,
      route: 'dashboard'
    },
    {
      icon: 'video_library',
      label: 'Doctors',
      submenu: null,
      route: 'doctors'
    },

    {
      icon: 'analytics',
      label: 'Doctors',
      submenu: [
        { label: 'Doctors List', icon: 'Doctors_list' },
        { label: 'Add Doctors', icon: 'Doctors_add' }
      ],
      route: 'patients'
    },
    {
      icon: 'analytics',
      label: 'Patients',
      submenu: [
        { label: 'Patient List', icon: 'patient_list' },
        { label: 'Add Patient', icon: 'patient_add' }
      ],
      route: 'patients'
    }

    

  ])

  profilePicSize = computed(() => this.sideNavCollapsed() ? '40': '65');

  textcollapse = computed(() => this.sideNavCollapsed() ? 'display-none' : 'display-inline');

}
