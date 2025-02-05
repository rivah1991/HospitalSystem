import { Routes } from '@angular/router';
import { UserComponent } from './user/user.component';
import { RegistrationComponent } from './user/registration/registration.component';
import { LoginComponent } from './user/login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PatientsComponent } from './dashboard/pages/patients/patients.component';
import { AdminComponent } from './dashboard/pages/admin/admin.component';
import { DoctorsComponent } from './dashboard/pages/doctors/doctors.component';

export const routes: Routes = [
    { 
        path: '', 
        redirectTo: '/signin', // Redirige vers '/signin' par défaut
        pathMatch: 'full' // Assure que cette redirection se fait uniquement lorsque l'URL est exactement vide
    },

    {path: '', component:UserComponent,
        children:[
            {path: 'signup', component:RegistrationComponent},
            {path: 'signin', component:LoginComponent}
        ]
    },
    {path:'dashboard', component:DashboardComponent,
        children:[
            {path:'patients', component:PatientsComponent}, 
            {path:'admin', component:AdminComponent},
            {path:'doctors', component:DoctorsComponent}, 
        ]
    },
   
];
