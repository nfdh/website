import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

@Component({
  selector: 'app-prijslijst-page',
  templateUrl: './prijslijst-page.component.html',
  styleUrls: ['./prijslijst-page.component.scss']
})
export class PrijslijstPageComponent implements OnInit {
  pricesStamboeklid = new MatTableDataSource([
    { label: "contributie lidmaatschap", price: 35 },
    { label: "contributie lidmaatschap vanaf tweede kwartaal", price: 17.50 },
    { label: "contributie lidmaatschap vanaf laatste kwartaal", price: 8.75 },
    { label: "minimale bijdrage donateurs", price: 30.00 },
    { label: "contributie gezinslidmaatschap", price: 10.00 },
    { label: "basiskosten (voorrijkosten) huiskeuring", price: 45.00 }
  ]);

  pricesKuddelid = new MatTableDataSource([
    { label: "contributie kudde met kudde overeenkomst", price: 55.00 },
    { label: "basiskosten (voorrijkosten) kuddekeuring met rammen en ooien", price: 150.00 },
    { label: "basiskosten (voorrijkosten) kuddekeuring met alleen rammen", price: 75.00 },
    { label: "audit", price: 75.00 },
    { label: "kosten audit per ooi", price: 1.20 },
    { label: "selectie voor fokkerij bij audit per ooi", price: 2.00 },
  ]);

  pricesStamboekAndKuddeLeden = new MatTableDataSource([
    { label: "kosten stamboekregistratie", price: 30.00 },
    { label: "basiskosten huiskeuring per extra locatie (op afstand)", price: 25.00 },
    { label: "keuringskosten per ooi", price: 5.50 },
    { label: "keuringskosten per ram", price: 6.50 },
    { label: "keuringskosten per ram vanaf 21 dieren", price: 3.50 },
    { label: "keuringskosten niet aangemeld dier", price: 11.00 },
    { label: "selectie voor fokkerij (per dagdeel per keurmeester)", price: 55.00 },
    { label: "voorselectie dieren", price: 2.00 },
    { label: "voorrijkosten per kilometer", price: 0.30 },
    { label: "afstammingsbewijs op naam van nieuwe eigenaar stellen", price: 0.00 },
    { label: "extra afstammingsbewijs op verzoek houder", price: 0.00 },
    { label: "handboek fokkerij 2013, exclusief verzendkosten", price: 15.00 }
  ]); 

  pricesFokbeleid = new MatTableDataSource([
    { label: "kosten stamboekregistratie", price: 45 },
    { label: "basiskosten (voorrijkosten) huiskeuring", price: 67.5 },
    { label: "keuringskosten per ooi", price: 6.75 },
    { label: "keuringskosten per ram", price: 9.75 }
  ]);

  columnsToDisplay = ['label', 'price'];

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  onBackClick() {
    this.router.navigate(["/lid-worden"]);
  }
}
