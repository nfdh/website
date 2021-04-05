import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataSource } from "@angular/cdk/collections";
import { BehaviorSubject, Observable, ReplaySubject, Subscription } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TableDataSourceFactory {

  constructor(private httpClient: HttpClient) { }

  create<T>(url: string, reviver?: (v: any) => T): TableDataSource<T> {
    return new TableDataSource<T>(this.httpClient, url, reviver);
  }
}

interface DataSourceResult<T> {
  rows: T[],
  pageIndex: number,
  totalCount: number
}

export class TableDataSource<T> extends DataSource<T> {
  private _items: ReplaySubject<T[]>;
  private _url: string;
  private _pageSize: number;
  private _pageIndex: number;
  private _filter: string;
  private _reloadQueued: boolean;
  private _totalCount: number;
  private _inFlightRequest: Subscription | null;

  loading: BehaviorSubject<boolean>;
  error: BehaviorSubject<Error | null>;

  set pageSize(value: number) {
    if(this._pageSize != value) {
      this._pageSize = value;
      this._queueReload();
    }
  }

  get pageSize() {
    return this._pageSize;
  }

  set pageIndex(value: number) {
    if(this._pageIndex != value) {
      this._pageIndex = value;
      this._queueReload();
    }
  }

  get pageIndex() {
    return this._pageIndex;
  }

  get totalRowCount() {
    return this._totalCount;
  }

  get filter() {
    return this._filter;
  }

  set filter(value: string) {
    if(this._filter != value) {
      this._filter = value;
      this._queueReload();
    }
  }

  constructor(private httpClient: HttpClient, url: string, private _reviver?: (v: any) => T) {
    super();

    this._pageIndex = 0;
    this._pageSize = 50;
    this._filter = "";

    this._reloadQueued = false;

    this._totalCount = 0;
    this._url = url;
    this._items = new ReplaySubject<T[]>(1);
    this.loading = new BehaviorSubject<boolean>(false);
    this._inFlightRequest = null;
    this.error = new BehaviorSubject<Error | null>(null);
  }

  /**
   * Used by the MatTable. Called when it connects to the data source.
   * @docs-private
   */
  connect(): Observable<T[]> {
    this.reload();
    return this._items;
  }

  /**
  * Used by the MatTable. Called when it disconnects from the data source.
  * @docs-private
  */
  disconnect(): void {

  }

  /**
  * Reloads the data.
  */
  reload() {
    if(this.error.value !== null) {
      this.error.next(null);
    }
    this.loading.next(true);

    if(this._inFlightRequest) {
      this._inFlightRequest.unsubscribe();
    }

    let params = new HttpParams();
    params = params.append("$page", this._pageIndex.toString());
    params = params.append("$pageSize", this._pageSize.toString())
    
    if(this._filter) {
      params = params.append("$filter", this._filter);
    }

    this._inFlightRequest = this.httpClient.get<DataSourceResult<T>>(this._url, {
      params: params
    })
      .subscribe(result => {
        let rows = this._reviver ? result.rows.map(this._reviver) : result.rows;

        this._pageIndex = result.pageIndex;
        this._totalCount = result.totalCount;
        this._inFlightRequest = null;
        this._items.next(rows);
        this.loading.next(false);
      }, error => {
        this._inFlightRequest = null;
        this.error.next(error);
        this.loading.next(false);
      });
  }

  private _queueReload() {
    if(this._reloadQueued) {
      return;
    }

    this._reloadQueued = true;
    setTimeout(() => {
      this._reloadQueued = false;
      this.reload();
    }, 0);
  }
}