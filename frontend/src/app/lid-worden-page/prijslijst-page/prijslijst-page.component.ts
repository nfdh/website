import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

@Component({
  selector: 'app-prijslijst-page',
  templateUrl: './prijslijst-page.component.html',
  styleUrls: ['./prijslijst-page.component.scss']
})
export class PrijslijstPageComponent implements OnInit {
  prices = new MatTableDataSource([
    { label: "contributie lidmaatschap", price: 30 },
    { label: "contributie lidmaatschap vanaf tweede kwartaal", price: 15 },
    { label: "contributie lidmaatschap vanaf laatste kwartaal", price: 7.5 },
    { label: "minimale bijdrage donateurs", price: 25.00 },
    { label: "contributie gezinslidmaatschap", price: 10.0 },
    { label: "kosten stamboekregistratie", price: 20.00 },
    { label: "basiskosten (voorrijkosten) huiskeuring", price: 30.00 },
    { label: "basiskosten huiskeuring per extra locatie (op afstand)", price: 15 },
    { label: "keuringskosten per schaap", price: 4.50 },
    { label: "keuringskosen niet aangemeld schaap", price: 8 },
    { label: "keuringskosten vanaf 31e schaap", price: 2 },
    { label: "keuringskosten vanf 61e schaap", price: 1.00 },
    { label: "voorselectie dieren", price: 2.00 },
    { label: "contributie kudde met kudde overeenkomst ( 01-01-2018)", price: 60.00 },
    { label: "keuringskosten kudde met kudde overeenkomst (exclusief individuele keuringskosten (rammen) en voorrijkosten", price: 105.00 },
    { label: "afstammingsbewijs op naam van nieuwe eigenaar stellen", price: 0 },
    { label: "extra afstammingsbewijs op verzoek houder", price: 0 },
    { label: "handboek fokkerij 2013, exclusief verzendkosten", price: 15.00 }
  ]);
  columnsToDisplay = ['label', 'price'];

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  onBackClick() {
    this.router.navigate(["/lid-worden"]);
  }
}
