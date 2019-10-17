import { Component } from '@angular/core';
import { KennisbankService } from '../../services/kennisbank.service';

@Component({
  selector: 'app-kennisbank-searchbar',
  templateUrl: './kennisbank-searchbar.component.html',
  styleUrls: ['./kennisbank-searchbar.component.css']
})
export class KennisbankSearchbarComponent {
  kennisbankItems;
  rootlines: any = [];
  searchRequest = 'huur';

  constructor(private kennisbankService: KennisbankService) { }

  searchKennisbank() {
    this.kennisbankItems = this.kennisbankService.searchKennisbankItems(this.searchRequest);
    // this.kbitems();
    console.log(this.kennisbankItems);
  }

  kbitems() {
    this.kennisbankItems = this.kennisbankService.getItems();
    for (const item of this.kennisbankItems) {
      this.rootlines.push(item.data.rootline);
    }
    console.log(this.rootlines);

    const regex: RegExp = /(Kennisbank content)/;
    for (const item of this.rootlines) {
      // console.log(item);
      // item.replace(regex, '');

      // for (const i of item) {
      //   // console.log(i);
      //   const result = i.replace('Kennisbank', '');
      // }

    }
    const position = this.rootlines.indexOf('Kennisbank content');
    // if ( this.rootlines.includes('Kennisbank content')) {
    //   this.rootlines.splice(position, 1);
    // }

    // console.log(this.rootlines);

    // const regex: RegExp = /(Kennisbank content)/;
    // const piet = 'Kennisbank content,Informatieplein, sjaak hallo';
    // if (piet.match(regex)) {
    //   const sjaak = piet.replace('sjaak', 'piet');
    //   console.log(piet);
    // }
  }

}
