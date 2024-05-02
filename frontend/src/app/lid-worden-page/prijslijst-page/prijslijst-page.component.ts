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
    { label: "minimale bijdrage donateurs", price: 30.00 },
    { label: "contributie gezinslidmaatschap", price: 10.0 },
    { label: "kosten stamboekregistratie", price: 22.00 },
    { label: "basiskosten (voorrijkosten) huiskeuring", price: 45.00 },
    { label: "basiskosten huiskeuring per extra locatie (op afstand)", price: 25 },
    { label: "keuringskosten per ooi", price: 5.50 },
    { label: "keuringskosten per ram", price: 6.50 },
    { label: "keuringskosten per ram vanaf 21 dieren", price: 3.50 },
    { label: "keuringskosen niet aangemeld dier", price: 11 },
    { label: "voorselectie dieren", price: 2.00 },
    { label: "contributie kudde met kudde overeenkomst", price: 45.00 },
    { label: "keuringskosten kudde met kudde overeenkomst (exclusief individuele keuringskosten rammen) en voorrijkosten", price: 150.00 },
    { label: "selectie voor fokkerij (per dagdeel per keurmeester)", price: 45 },
    { label: "voorrijkosten per kilometer", price: 0.3 },
    { label: "afstammingsbewijs op naam van nieuwe eigenaar stellen", price: 0 },
    { label: "extra afstammingsbewijs op verzoek houder", price: 0 },
    { label: "handboek fokkerij 2013, exclusief verzendkosten", price: 15.00 }
  ]);
  columnsToDisplay = ['label', 'price'];

  pricesFokbeleid = new MatTableDataSource([
    { label: "kosten stamboekregistratie", price: 33 },
    { label: "basiskosten (voorrijkosten) huiskeuring", price: 67.5 },
    { label: "keuringskosten per ooi", price: 6.75 },
    { label: "keuringskosten per ram", price: 9.75 }
  ]);

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  onBackClick() {
    this.router.navigate(["/lid-worden"]);
  }
}
