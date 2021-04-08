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

interface User {
  id: number,
  name: string,
  email: string
}

@Component({
  selector: 'app-users-page',
  templateUrl: './users-page.component.html',
  styleUrls: ['./users-page.component.scss']
})
export class UsersPageComponent {
  users: TableDataSource<User>;
  columnsToDisplay = ['select', 'name', 'email'];
  selection = new SelectionMap<number>();

  lastSearchTimer: number | null = null;
  pendingSearch = "";

  constructor(
    private dataSourceFactory: TableDataSourceFactory,
    private httpClient: HttpClient, 
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    titleService: AppTitleService) {

    this.users = dataSourceFactory.create("/api/users");

    titleService.setTitle("Gebruikers - Ledenportaal");
  }

  onAddClick() {
    this.router.navigate(["toevoegen"], { relativeTo: this.route });
  }

  onUpdateClick() {
    const key = this.selection.items.values().next().value;
    this.router.navigate([key], { relativeTo: this.route });
  }

  onDoubleClick(id: number) {
    this.router.navigate([id], { relativeTo: this.route });
  }

  onDeleteClick() {
    const dialog = this.dialog.open(DeleteConfirmationDialogComponent, { 
      data: {
        entityName: 'Gebruikers',
        selection: this.selection
      }
    });

    dialog.afterClosed().subscribe((v: boolean) => {
      if(!v) return;

      this.httpClient.request("delete", "/api/users", {
        body: {
          type: this.selection.type === SelectionType.Including ? "including" : "excluding",
          items: Array.from(this.selection.items)
        }
      })
        .subscribe(() => {
          this.users.reload();
        });

      this.selection.clear();
    });
  }

  onSearchChange(ev: Event) {
    if(this.lastSearchTimer !== null) {
      window.clearTimeout(this.lastSearchTimer);
    }

    this.pendingSearch = (ev.currentTarget as HTMLInputElement).value;
    this.lastSearchTimer = window.setTimeout(() => {
      this.users.filter = this.pendingSearch;
      this.lastSearchTimer = null;
    }, 200);
  }

  onPage(ev: PageEvent) {
    this.users.pageIndex = ev.pageIndex;
    this.users.pageSize = ev.pageSize;
  }
}