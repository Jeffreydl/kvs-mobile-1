import { Component, OnInit } from '@angular/core';
import {KennisbankService} from './kennisbank.service';
import {IKennisbankItems, IkennisbankItemsChildren} from './IKennisbank';

@Component({
  selector: 'app-kennisbank',
  templateUrl: './kennisbank.component.html',
  styleUrls: ['./kennisbank.component.scss']
})
export class KennisbankComponent implements OnInit {
  public kennisbankItems: IKennisbankItems[];
  public kennisbankItem: IkennisbankItemsChildren[];
  public show = false;
  public searching = false;

  constructor(private kennisbankService: KennisbankService) { }

  ngOnInit() {
    this.kennisbankService.getAll().subscribe(
        (data) => {
          console.log(data);
          this.kennisbankItems = data;
        }
    );
  }

  expandItem(id) {
    console.log(id);
    this.kennisbankService.getById(id).subscribe(
        (data) => {
          this.kennisbankItem = data;
          console.log(this.kennisbankItem);
        }
    );
  }

    searchBarStatus($event: boolean) {
        console.log($event);
        this.searching = $event;
    }
}
