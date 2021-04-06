import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FokkenPageComponent } from './fokken-page.component';
import { InleidingPageComponent } from './inleiding-page/inleiding-page.component';
import { KeuringenPageComponent } from './keuringen-page/keuringen-page.component';
import { RegelgevingPageComponent } from './regelgeving-page/regelgeving-page.component';
import { VoedingPageComponent } from './voeding-page/voeding-page.component';
import { GezondheidPageComponent } from './gezondheid-page/gezondheid-page.component';
import { DrachtEnGeboortePageComponent } from './dracht-en-geboorte-page/dracht-en-geboorte-page.component';
import { WormbestrijdingPageComponent } from './wormbestrijding-page/wormbestrijding-page.component';
import { DrentsHeideschaapKenmerkenComponent } from './drents-heideschaap-kenmerken/drents-heideschaap-kenmerken.component';
import { DrentsHeideschaapHistorieComponent } from './drents-heideschaap-historie/drents-heideschaap-historie.component';
import { SchoonebeekerKenmerkenComponent } from './schoonebeeker-kenmerken/schoonebeeker-kenmerken.component';
import { SchoonebeekerHistorieComponent } from './schoonebeeker-historie/schoonebeeker-historie.component';
import { NotFoundPageComponent } from '../not-found-page/not-found-page.component';

const routes: Routes = [
  { path: '', component: FokkenPageComponent,
    children: [
      { path: "", redirectTo: "inleiding", pathMatch: "full" },
      { path: "inleiding", component: InleidingPageComponent },
      { path: "keuringen", component: KeuringenPageComponent },
      { path: "regelgeving", component: RegelgevingPageComponent },
      { path: "gezondheid", component: GezondheidPageComponent },
      { path: "voeding", component: VoedingPageComponent },
      { path: "dracht-en-geboorte", component: DrachtEnGeboortePageComponent },
      { path: "wormbestrijding", component: WormbestrijdingPageComponent },
      { path: "drents-heideschaap-kenmerken", component: DrentsHeideschaapKenmerkenComponent },
      { path: "drents-heideschaap-historie", component: DrentsHeideschaapHistorieComponent },
      { path: "schoonebeeker-kenmerken", component: SchoonebeekerKenmerkenComponent },
      { path: "schoonebeeker-historie", component: SchoonebeekerHistorieComponent },
      { path: "**", component: NotFoundPageComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FokkenPageRoutingModule { }
