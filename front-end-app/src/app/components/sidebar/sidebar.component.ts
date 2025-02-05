import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';

export type MenuItem = {
  icon: string;
  label: string;
  route?: any;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, MatListModule, MatIconModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  menuItems = signal<MenuItem[]>([
    {
      icon: 'dashboard',
      label: 'Dashboard',
      route: 'dashboard'
    },
    {
      icon: 'video_library',
      label: 'Doctors',
      route: 'doctors'
    },
    {
      icon: 'analytics',
      label: 'Patients',
      route: 'patients'
    }

  ])
}
