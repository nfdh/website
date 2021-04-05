import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';

import { DisclaimerPageComponent } from './disclaimer-page/disclaimer-page.component';
import { HomePageComponent } from './home-page/home-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { MemberPageComponent } from './member-page/member-page.component';
import { HomePageComponent as MemberHomePageComponent } from "./member-page/home-page/home-page.component";
import { UsersPageComponent as MemberUsersPageComponent } from './member-page/users-page/users-page.component';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';
import { AddUserPageComponent as MemberAddUserPageComponent } from './member-page/users-page/add-user-page/add-user-page.component';
import { EditUserPageComponent as MemberEditUserPageComponent } from './member-page/users-page/edit-user-page/edit-user-page.component';
import { DekverklaringenPageComponent as MemberDekverklaringenPageComponent } from './member-page/dekverklaringen-page/dekverklaringen-page.component';
import { AddDekverklaringPageComponent as MemberAddDekverklaringPageComponent } from './member-page/dekverklaringen-page/add-dekverklaring-page/add-dekverklaring-page.component';
import { EditDekverklaringPageComponent as MemberEditDekverklaringPageComponent } from './member-page/dekverklaringen-page/edit-dekverklaring-page/edit-dekverklaring-page.component';
import { HuiskeuringenPageComponent as MemberHuiskeuringenPageComponent } from './member-page/huiskeuringen-page/huiskeuringen-page.component';
import { AddHuiskeuringPageComponent as MemberAddHuiskeuringPageComponent } from './member-page/huiskeuringen-page/add-huiskeuring-page/add-huiskeuring-page.component';
import { EditHuiskeuringPageComponent as MemberEditHuiskeuringPageComponent } from './member-page/huiskeuringen-page/edit-huiskeuring-page/edit-huiskeuring-page.component';
import { ContactPageComponent } from './contact-page/contact-page.component';

const routes: Routes = [
  { path: "", component: HomePageComponent },
  { path: "disclaimer", component: DisclaimerPageComponent },
  { path: "contact", component: ContactPageComponent },
  { path: "login", component: LoginPageComponent },
  { path: "ledenportaal", component: MemberPageComponent, canActivate: [AuthGuard], 
    children: [
      { path: "", component: MemberHomePageComponent },
      { path: "formulier-dekverklaring", component: MemberDekverklaringenPageComponent },
      { path: "formulier-dekverklaring/toevoegen", component: MemberAddDekverklaringPageComponent },
      { path: "formulier-dekverklaring/:id", component: MemberEditDekverklaringPageComponent },
      { path: "formulier-huiskeuring", component: MemberHuiskeuringenPageComponent },
      { path: "formulier-huiskeuring/toevoegen", component: MemberAddHuiskeuringPageComponent },
      { path: "formulier-huiskeuring/:id", component: MemberEditHuiskeuringPageComponent },
      { path: "gebruikers", component: MemberUsersPageComponent },
      { path: "gebruikers/toevoegen", component: MemberAddUserPageComponent },
      { path: "gebruikers/:id", component: MemberEditUserPageComponent },
      { path: "**", component: NotFoundPageComponent }
    ]
  },
  { path: "**", component: NotFoundPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
