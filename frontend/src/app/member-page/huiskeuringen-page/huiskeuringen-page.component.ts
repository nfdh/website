import { Component, OnInit } from '@angular/core';
import { TableDataSource, TableDataSourceFactory } from 'src/app/services/table-data-source.service';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { SelectionMap, SelectionType } from 'src/app/services/selection';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import preferredDates from './dates';
import { AppTitleService } from 'src/app/services/app-title.service';
import { IntlDateTimeService } from 'src/app/services/intl-date-time.service';
import { supportsPDFs } from "pdfobject";

interface Huiskeuring {
  id: number,
  year: number,
  preference_date: Date,
  date_sent: Date
}

@Component({
  selector: 'app-huiskeuringen-page',
  templateUrl: './huiskeuringen-page.component.html',
  styleUrls: ['./huiskeuringen-page.component.scss']
})
export class HuiskeuringenPageComponent {
  huiskeuringen: TableDataSource<Huiskeuring>;
  columnsToDisplay = ['select', 'year', 'studbook', 'preferred_date', 'date_sent'];
  selection = new SelectionMap<number>();

  lastSearchTimer: number | null = null;
  pendingSearch = "";

  supportsPDFs = supportsPDFs;

  constructor(
    private dataSourceFactory: TableDataSourceFactory,
    private httpClient: HttpClient, 
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private intlDateTimeService: IntlDateTimeService,
    titleService: AppTitleService) {

    this.huiskeuringen = dataSourceFactory.create("/api/huiskeuringen", f => {
      f.date_sent = new Date(f.date_sent);
      f.preferred_date = new Date(f.preferred_date);
      return f;
    });

    titleService.setTitle("Huiskeuringen - Ledenportaal");
  }

  onAddClick() {
    this.router.navigate(["toevoegen"], { relativeTo: this.route });
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
    this.huiskeuringen.pageIndex = ev.pageIndex;
    this.huiskeuringen.pageSize = ev.pageSize;
  }

  getPreferredDate(region: number, preferredDate: Date | null) {
    if(region === -1) {
      return "Afwijkend";
    }
    else if(preferredDate === null) {
      return "Geen voorkeur";
    }

    return this.intlDateTimeService.format(preferredDate, {
      day: "numeric",
      month: "long"
    });
  }
}
