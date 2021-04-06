import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-voeding-page',
  templateUrl: './voeding-page.component.html',
  styleUrls: ['./voeding-page.component.scss']
})
export class VoedingPageComponent implements OnInit {
  voederbehoefte = new MatTableDataSource([
    { label: "Ooien", header: true },
    { label: "Drent", ds: "1,0", vem: "550", dve: "35" },
    { label: "Schoonebeeker", ds: "1,3", vem: "625", dve: "40" },
    { label: "Eerste helft dracht", header: true },
    { label: "Drent", ds: "1,2", vem: "570", dve: "37" },
    { label: "Schoonebeeker", ds: "1,6", vem: "650", dve: "42" },
    { label: "Tweede helft dracht", header: true },
    { label: "Drent", ds: "1,4", vem: "910", dve: "91" },
    { label: "Schoonebeeker", ds: "1,8", vem: "1010", dve: "110" },
    { label: "Zogende ooien; 1 lam", header: true },
    { label: "Drent", ds: "1,6", vem: "1500", dve: "140" },
    { label: "Schoonebeeker", ds: "2,1", vem: "1920", dve: "165" },
    { label: "Zogende ooien; 2 lammeren", header: true },
    { label: "Drent", ds: "2,0", vem: "2000", dve: "195" },
    { label: "Schoonebeeker", ds: "2,5", vem: "2460", dve: "245" }
  ]);
  columnsToDisplay = ['label', 'ds', 'vem', 'dve'];

  voederwaarde = new MatTableDataSource([
    { label: "Hooi van gemiddelde kwaliteit", ds: "830", vem: "790", dve: "78" },
    { label: "Kuilgras van gemiddelde kwaliteit", ds: "350", vem: "820", dve: "65" },
    { label: "Kuilmaïs van gemiddelde kwaliteit", ds: "350", vem: "909", dve: "47" },
    { label: "A-brok (rundveebiks)", ds: "950", vem: "940", dve: "90" },
    { label: "Schapenbrok", ds: "950", vem: "900", dve: "90" },
    { label: "Droge bietenpulp", ds: "902", vem: "927", dve: "90" },
    { label: "Vers gras", ds: "160", vem: "980", dve: "98" }
  ]);

  constructor() { }

  ngOnInit(): void {
  }

}
