import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BoardsComponent } from './boards/boards.component';
import { UsersComponent } from './users/users.component';

const routes: Routes = [
  
  {path:'user',component:UsersComponent},
  {path:'board',component:BoardsComponent},
  {path:'',pathMatch:'full',redirectTo:'/user'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
