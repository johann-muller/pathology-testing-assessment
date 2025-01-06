import { Routes } from '@angular/router';
import { PatientTestCreateComponent } from './routes/patient-test-management/patient-test-create/patient-test-create.component';
import { PatientTestReadComponent } from './routes/patient-test-management/patient-test-read/patient-test-read.component';
import { PatientTestUpdateComponent } from './routes/patient-test-management/patient-test-update/patient-test-update.component';

export const routes: Routes = [
  { path: 'patient-test/create', title: 'Create Patient Test', component: PatientTestCreateComponent },
  { path: 'patient-test/read', title: 'Read Patient Tests', component: PatientTestReadComponent },
  { path: 'patient-test/update/:requisitionId', title: 'Update Patient Test', component: PatientTestUpdateComponent },
  { path: '',   redirectTo: 'patient-test/read', pathMatch: 'full' },
];
