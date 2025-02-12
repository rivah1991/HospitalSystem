import { Routes } from '@angular/router';
import { UserComponent } from './user/user.component';
import { RegistrationComponent } from './user/registration/registration.component';
import { LoginComponent } from './user/login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PatientsComponent } from './dashboard/pages/patients/patients.component';
import { AdminComponent } from './dashboard/pages/admin/admin.component';
import { DoctorsComponent } from './dashboard/pages/doctors/doctors.component';
import { AddPatientComponent } from './dashboard/pages/patients/add/add.component';
import { AuditlogsComponent } from './dashboard/pages/admin/auditlogs/auditlogs.component';
import { ProfilComponent } from './components/profil/profil.component';
import { AddRecommandationsComponent } from './dashboard/pages/patients/add-recommandations/add-recommandations.component';
import { RecommandationsComponent } from './dashboard/pages/patients/recommandations/recommandations.component';
import { DetailPatientComponent } from './dashboard/pages/patients/detail/detail.component';
import { authGuard } from './auth.guard';
import { AssignDoctorComponent } from './dashboard/pages/doctors/assign/assign-doctor.component';

export const routes: Routes = [
    { 
        path: '', 
        redirectTo: '/signin', // Redirige vers '/signin' par défaut
        pathMatch: 'full' // Assure que cette redirection se fait uniquement lorsque l'URL est exactement vide
    },

    { path: '', component: UserComponent,
        children: [
            { path: 'signup', component: RegistrationComponent },
            { path: 'signin', component: LoginComponent }
        ]
    },
    {
        path: 'dashboard', 
        component: DashboardComponent,
        canActivate: [authGuard],
        children: [
            { path: '', redirectTo: 'patients', pathMatch: 'full' },  
            { path: 'patients/list', component: PatientsComponent }, 
            { path: 'patients/add', component: AddPatientComponent },
            { path: 'patients/detail/:id', component: DetailPatientComponent },
            { path: 'patients/update/:id', component: AddPatientComponent },
            { path: 'patients/addrecommendation', component: AddRecommandationsComponent }, 
            { path: 'patients/recommendations/:id', component: RecommandationsComponent }, 
            { path: 'doctors/list', component: DoctorsComponent },
            { path: 'doctors/assign/:id', component: AssignDoctorComponent },
            { path: 'admin', component: AdminComponent } ,
            { path: 'admin/audit', component:  AuditlogsComponent} 
        ]
    },

    { 
        path: 'profile-update', 
        component: ProfilComponent       
    },
];
