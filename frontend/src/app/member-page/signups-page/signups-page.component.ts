import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { supportsPDFs } from 'pdfobject';
import { AppTitleService } from 'src/app/services/app-title.service';
import { SelectionMap } from 'src/app/services/selection';
import { TableDataSource, TableDataSourceFactory } from 'src/app/services/table-data-source.service';

interface Signup {
  id: number,
  name: string,
  email: string,
  membershipType: number,
  date_sent: Date
}

@Component({
  selector: 'app-signups-page',
  templateUrl: './signups-page.component.html',
  styleUrls: ['./signups-page.component.scss']
})
export class SignupsPageComponent implements OnInit {
  signups: TableDataSource<Signup>;
  columnsToDisplay = ['select', 'name', 'email', 'membershipType', 'date_sent'];
  selection = new SelectionMap<number>();

  supportsPDFs = supportsPDFs;

  constructor(    
    private dataSourceFactory: TableDataSourceFactory,
    titleService: AppTitleService,
    private router: Router,
    private route: ActivatedRoute
  ) { 
    this.signups = dataSourceFactory.create("/api/signups", f => {
      f.date_sent = new Date(f.date_sent);
      f.preferred_date = new Date(f.preferred_date);
      return f;
    });

    titleService.setTitle("Aanmeldingen - Ledenportaal");
  }

  ngOnInit(): void {
  }

  onUpdateClick() {
    const key = this.selection.items.values().next().value;
    this.openDetail(key);
  }

  onDoubleClick(id: number) {
    this.openDetail(id);
  }

  openDetail(id: number) {
    if(this.supportsPDFs) {
      this.router.navigate([id], { relativeTo: this.route });
    }
    else {
      var element = document.createElement('a');
      element.setAttribute('href', '/api/huiskeuringen/' + id + "?download");
      element.setAttribute('download', "");
    
      element.style.display = 'none';
      document.body.appendChild(element);
    
      element.click();
    
      document.body.removeChild(element);
    }
  }

  onPage(ev: PageEvent) {
    this.signups.pageIndex = ev.pageIndex;
    this.signups.pageSize = ev.pageSize;
  }

  formatMembershipType(memberShipType: number) {
    switch(memberShipType) {
      case 0: return 'Donateur';
      case 1: return 'Basislidmaatschap';
      case 2: return 'Stamboeklidmaatschap';
      case 3: return 'Kudde';
      default: throw new Error('Unexpected membership type');
    }
  }
}