import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorIntlImpl } from './localization/MatPaginator';

import { environment } from '../environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatTableModule } from "@angular/material/table";
import { VerticalMenuModule } from './vertical-menu/vertical-menu.module';
import { AuthenticationService } from './services/authentication.service';
import { ToolbarModule } from "./toolbar/toolbar.module";
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar'; 
import { MatDialogModule } from "@angular/material/dialog";
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FormModule } from './form/form.module';
import { MatRadioModule } from "@angular/material/radio";
import { MatCardModule } from '@angular/material/card'
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { GalleryModule } from 'ng-gallery';
import { LightboxModule } from  'ng-gallery/lightbox';
import { MatTooltipModule } from '@angular/material/tooltip';

import { AppComponent } from './app.component';
import { HomePageComponent } from './home-page/home-page.component';
import { DisclaimerPageComponent } from './disclaimer-page/disclaimer-page.component';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { MemberPageComponent } from './member-page/member-page.component';
import { UsersPageComponent } from './member-page/users-page/users-page.component';
import { DeleteConfirmationDialogComponent } from './delete-confirmation-dialog/delete-confirmation-dialog.component';
import { AddUserPageComponent } from './member-page/users-page/add-user-page/add-user-page.component';
import { EditUserPageComponent } from './member-page/users-page/edit-user-page/edit-user-page.component';
import { UserFormComponent } from './member-page/users-page/user-form/user-form.component';

import { TableDataSourceFactory } from './services/table-data-source.service';
import { MessageComponent } from './message/message.component';
import { DekverklaringenPageComponent } from './member-page/dekverklaringen-page/dekverklaringen-page.component';
import { AddDekverklaringPageComponent } from './member-page/dekverklaringen-page/add-dekverklaring-page/add-dekverklaring-page.component';
import { DekverklaringFormComponent } from './member-page/dekverklaringen-page/dekverklaring-form/dekverklaring-form.component';
import { EditDekverklaringPageComponent } from './member-page/dekverklaringen-page/edit-dekverklaring-page/edit-dekverklaring-page.component';
import { HuiskeuringenPageComponent } from './member-page/huiskeuringen-page/huiskeuringen-page.component';
import { AddHuiskeuringPageComponent } from './member-page/huiskeuringen-page/add-huiskeuring-page/add-huiskeuring-page.component';
import { HuiskeuringFormComponent } from './member-page/huiskeuringen-page/huiskeuring-form/huiskeuring-form.component';
import { EditHuiskeuringPageComponent } from './member-page/huiskeuringen-page/edit-huiskeuring-page/edit-huiskeuring-page.component';
import { BaseUrlInterceptor } from './base-url.interceptor';
import { ContactPageComponent } from './contact-page/contact-page.component';
import { VerenigingPageComponent } from './vereniging-page/vereniging-page.component';
import { OverDeVerenigingPageComponent } from './vereniging-page/over-de-vereniging-page/over-de-vereniging-page.component';
import { BestuurEnCommissiesPageComponent } from './vereniging-page/bestuur-en-commissies-page/bestuur-en-commissies-page.component';
import { CalamiteitenplanPageComponent } from './vereniging-page/calamiteitenplan-page/calamiteitenplan-page.component';
import { MonitoringService } from './services/monitoring.service';
import { ErrorHandlerService } from './services/error-handler.service';
import { LidWordenPageComponent } from './lid-worden-page/lid-worden-page.component';
import { IntlDatePipe } from './intl-date.pipe';
import { IntlDateTimePipe } from './intl-date-time.pipe';
import { IntlDateService } from './services/intl-date.service';
import { IntlDateTimeService } from './services/intl-date-time.service';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    DisclaimerPageComponent,
    NotFoundPageComponent,
    LoginPageComponent,
    MemberPageComponent,
    UsersPageComponent,
    DeleteConfirmationDialogComponent,
    AddUserPageComponent,
    EditUserPageComponent,
    UserFormComponent,
    MessageComponent,
    DekverklaringenPageComponent,
    AddDekverklaringPageComponent,
    DekverklaringFormComponent,
    EditDekverklaringPageComponent,
    HuiskeuringenPageComponent,
    AddHuiskeuringPageComponent,
    HuiskeuringFormComponent,
    EditHuiskeuringPageComponent,
    ContactPageComponent,
    VerenigingPageComponent,
    OverDeVerenigingPageComponent,
    BestuurEnCommissiesPageComponent,
    CalamiteitenplanPageComponent,
    LidWordenPageComponent,
    IntlDatePipe,
    IntlDateTimePipe
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,

    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatDialogModule,
    MatSnackBarModule,
    MatRadioModule,
    MatCardModule,
    MatDividerModule,
    MatSelectModule,
    GalleryModule,
    LightboxModule,
    MatTooltipModule,

    VerticalMenuModule,
    ToolbarModule,
    FormModule
  ],
  providers: [
    AuthenticationService,
    { provide: MatPaginatorIntl, useClass: MatPaginatorIntlImpl },
    TableDataSourceFactory,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: BaseUrlInterceptor,
      multi: true,
    },
    { provide: "BASE_API_URL", useValue: environment.apiUrl },
    MonitoringService,
    { provide: ErrorHandler, useClass: ErrorHandlerService },
    IntlDateService,
    IntlDateTimeService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
