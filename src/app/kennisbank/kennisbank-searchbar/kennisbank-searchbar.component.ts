import {Component, OnInit} from '@angular/core';
import {KennisbankService} from '../kennisbank.service';
import {FormControl} from '@angular/forms';
import { IKennisbankItem } from '../IKennisbank';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';

@Component({
    selector: 'app-kennisbank-searchbar',
    templateUrl: './kennisbank-searchbar.component.html',
    styleUrls: ['./kennisbank-searchbar.component.scss']
})
export class KennisbankSearchbarComponent implements OnInit {
    public kennisbankItems$: IKennisbankItem[];

    autoCompleteFormControl = new FormControl();

    constructor(private kennisbankService: KennisbankService) {
    }

    ngOnInit() {
        this.autoCompleteFormControl.valueChanges.pipe(
            debounceTime(500),
            distinctUntilChanged()
        ).subscribe((value) => {
            this.searchKennisbank(value);
        });
    }

    searchKennisbank(value: string) {
        if (value.length > 0) {
            this.kennisbankItems$ = this.kennisbankService.search(value);
            console.log(this.kennisbankItems$);
        } else {
            this.kennisbankItems$ = null;
        }
    }
}
