import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { TableDataSource, TableDataSourceFactory } from 'src/app/services/table-data-source.service';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmationDialogComponent } from 'src/app/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { SelectionMap, SelectionType } from 'src/app/services/selection';
import { filter } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { AppTitleService } from 'src/app/services/app-title.service';
import { supportsPDFs } from "pdfobject";

interface Dekverklaring {
  id: number,
  season: number,
  studbook: number,
  date_sent: Date
}

@Component({
  selector: 'app-dekverklaringen-page',
  templateUrl: './dekverklaringen-page.component.html',
  styleUrls: ['./dekverklaringen-page.component.scss']
})
export class DekverklaringenPageComponent {
  dekverklaringen: TableDataSource<Dekverklaring>;
  columnsToDisplay = ['select', 'season', 'studbook', 'date_sent'];
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
    titleService: AppTitleService) {

    this.dekverklaringen = dataSourceFactory.create("/api/dekverklaringen", f => {
      f.date_sent = new Date(f.date_sent);
      return f;
    });

    titleService.setTitle("Dekverklaringen  - Ledenportaal");
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
      element.setAttribute('href', '/api/dekverklaringen/' + id + "?download");
      element.setAttribute('download', "");
    
      element.style.display = 'none';
      document.body.appendChild(element);
    
      element.click();
    
      document.body.removeChild(element);
    }
  }

  onPage(ev: PageEvent) {
    this.dekverklaringen.pageIndex = ev.pageIndex;
    this.dekverklaringen.pageSize = ev.pageSize;
  }
}
