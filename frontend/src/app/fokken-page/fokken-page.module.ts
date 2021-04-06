import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FokkenPageRoutingModule } from './fokken-page-routing.module';
import { FokkenPageComponent } from './fokken-page.component';
import { VerticalMenuModule } from '../vertical-menu/vertical-menu.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InleidingPageComponent } from './inleiding-page/inleiding-page.component';
import { KeuringenPageComponent } from './keuringen-page/keuringen-page.component';
import { RegelgevingPageComponent } from './regelgeving-page/regelgeving-page.component';
import { GezondheidPageComponent } from './gezondheid-page/gezondheid-page.component';
import { VoedingPageComponent } from './voeding-page/voeding-page.component';
import { DrachtEnGeboortePageComponent } from './dracht-en-geboorte-page/dracht-en-geboorte-page.component';
import { WormbestrijdingPageComponent } from './wormbestrijding-page/wormbestrijding-page.component';
import { DrentsHeideschaapHistorieComponent } from './drents-heideschaap-historie/drents-heideschaap-historie.component';
import { DrentsHeideschaapKenmerkenComponent } from './drents-heideschaap-kenmerken/drents-heideschaap-kenmerken.component';
import { SchoonebeekerKenmerkenComponent } from './schoonebeeker-kenmerken/schoonebeeker-kenmerken.component';
import { SchoonebeekerHistorieComponent } from './schoonebeeker-historie/schoonebeeker-historie.component';


@NgModule({
  declarations: [
    FokkenPageComponent,
    InleidingPageComponent,
    KeuringenPageComponent,
    RegelgevingPageComponent,
    GezondheidPageComponent,
    VoedingPageComponent,
    DrachtEnGeboortePageComponent,
    WormbestrijdingPageComponent,
    DrentsHeideschaapKenmerkenComponent,
    DrentsHeideschaapHistorieComponent,
    SchoonebeekerKenmerkenComponent,
    SchoonebeekerHistorieComponent
  ],
  imports: [
    CommonModule,
    FokkenPageRoutingModule,
    VerticalMenuModule,
    MatTooltipModule,
    MatTableModule
  ]
})
export class FokkenPageModule { }
