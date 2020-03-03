import {Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import * as XLSX from 'xlsx';

import paginate from './pagination.util';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class AppComponent implements OnInit {
  public data2;
  public data = this.data2;
  public value = '';
  public positionToggle = true;
  public nameToggle = true;
  public weightToggle = true;
  public symbolToggle = true;
  @Input() items;
  @Input() label: string;
  @Input() pageSize = 5;
  @Input() maxPages = 10;
  @Input() previousLabel = 'Previous';
  @Input() nextLabel = 'Next';
  @Input() screenReaderPaginationLabel = 'Pagination';
  @Input() screenReaderPageLabel = 'page';
  @Input() screenReaderCurrentLabel = `You're on page`;
  @Output() onItemClick: EventEmitter<any> = new EventEmitter();

  public currentPage = 1;
  public pages: Array<number>;
  public startIndex: number;
  public endIndex: number;
  public willDownload = false;
  public propArr = [];

  constructor() {
  }

  ngOnInit(): void {
    //this.calculateIndexes();
  }

  setRows(event) {
    this.pageSize = parseInt(event.value);
    this.calculateIndexes();
  }

  onKey(value: string) {
    this.items = this.data2;
    this.items = this.items.filter((item) => {
        return this.propArr.some((prop) => {
          return (item && item[prop.key] && item[prop.key].toString() && item[prop.key].toString().toLowerCase() && item[prop.key].toString().toLowerCase().includes(value.toLowerCase())) ? true : false;
        });
    });
    this.calculateIndexes();
  }

  sortData(element, toggle) {
  if (toggle && parseInt(element.value)) {
    this.items.sort((a, b) => a[element.key] - b[element.key]);
  } else if ( !toggle && parseInt(element.value)) {
    this.items.sort((b, a) => a[element.key] - b[element.key]);
  } else if (toggle && !parseInt(element.value)) {
    this.items.sort((a, b) => {
      const nameA = a[element.key].toUpperCase(); // ignore upper and lowercase
      const nameB = b[element.key].toUpperCase(); // ignore upper and lowercase
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });
  } else if ( !toggle && !parseInt(element.value)) {
    this.items.sort((b, a) => {
      const nameA = a[element.key].toUpperCase(); // ignore upper and lowercase
      const nameB = b[element.key].toUpperCase(); // ignore upper and lowercase
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });
  }
  this.calculateIndexes();
  }

  calculateIndexes() {
    const pagination = paginate(
      this.items.length,
      this.currentPage,
      this.pageSize,
      this.maxPages
    );
    this.currentPage = pagination.currentPage;
    this.pages = pagination.pages;
    this.startIndex = pagination.startIndex;
    this.endIndex = pagination.endIndex;
  }

  previous(e) {
    e.preventDefault();
    this.currentPage--;
    this.calculateIndexes();
  }

  next(e) {
    e.preventDefault();
    this.currentPage++;
    this.calculateIndexes();
  }

  setCurrent(e, page) {
    e.preventDefault();
    this.currentPage = page;
    this.calculateIndexes();
  }

  getLabel(i) {
    return this.items[i][this.label];
  }

  onClick(item) {
    this.onItemClick.emit(item);
  }


  onFileChange(ev) {
    let workBook = null;
    let jsonData = null;
    const reader = new FileReader();
    const file = ev.target.files[0];
    reader.onload = (event) => {
      const data = reader.result;
      workBook = XLSX.read(data, { type: 'binary' });
      jsonData = workBook.SheetNames.reduce((initial, name) => {
        const sheet = workBook.Sheets[name];
        initial[name] = XLSX.utils.sheet_to_json(sheet);
        return initial;
      }, {});
      const dataString = JSON.stringify(jsonData);
      this.data2 = this.items = JSON.parse(dataString)[Object.keys(JSON.parse(dataString))[0]];
      let maxkeys=0;
      let maxkeyItem = 0;
      for(let i = 0; i < this.items.length; i++) {
        if(maxkeys < Object.keys(this.items[i]).length){
          maxkeys = Object.keys(this.items[i]).length;
          maxkeyItem = i;
        }
      }
      for(const key in this.items[maxkeyItem]) {
        const obj = {
          key: key,
          value: this.items[maxkeyItem][key]
        }
        this.propArr.push(obj);
      }
      console.log('arr', this.propArr);
      this.calculateIndexes();
      this.setDownload(dataString);
    }
    reader.readAsBinaryString(file);
    this.calculateIndexes();
  }

   setDownload(data) {
    this.willDownload = true;
    setTimeout(() => {
      const el = document.querySelector("#download");
      el.setAttribute("href", `data:text/json;charset=utf-8,${encodeURIComponent(data)}`);
      el.setAttribute("download", 'xlsxtojson.json');
    }, 1000)
  }


}


const ELEMENT_DATA = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
  {position: 11, name: 'Sodium', weight: 22.9897, symbol: 'Na'},
  {position: 12, name: 'Magnesium', weight: 24.305, symbol: 'Mg'},
  {position: 13, name: 'Aluminum', weight: 26.9815, symbol: 'Al'},
  {position: 14, name: 'Silicon', weight: 28.0855, symbol: 'Si'},
  {position: 15, name: 'Phosphorus', weight: 30.9738, symbol: 'P'},
  {position: 16, name: 'Sulfur', weight: 32.065, symbol: 'S'},
  {position: 17, name: 'Chlorine', weight: 35.453, symbol: 'Cl'},
  {position: 18, name: 'Argon', weight: 39.948, symbol: 'Ar'},
  {position: 19, name: 'Potassium', weight: 39.0983, symbol: 'K'},
  {position: 20, name: 'Calcium', weight: 40.078, symbol: 'Ca'},
];
