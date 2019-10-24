import {Component, OnInit} from '@angular/core';
import {KennisbankService} from './kennisbank.service';
import {FormControl} from '@angular/forms';
import { KennisbankItem } from './kennisbank.model';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';

@Component({
    selector: 'app-kennisbank-searchbar',
    templateUrl: './kennisbank-searchbar.component.html',
    styleUrls: ['./kennisbank-searchbar.component.css']
})
export class KennisbankSearchbarComponent implements OnInit {
    kennisbankItems$;
    id;
    title;
    content;

    autoCompletFormControl = new FormControl();

    constructor(private kennisbankService: KennisbankService) {
    }

    ngOnInit() {
        this.autoCompletFormControl.valueChanges.pipe(
            debounceTime(500),
            distinctUntilChanged()
        ).subscribe((value) => {
            this.searchKennisbank(value);
        });
    }

    searchKennisbank(value: string) {
        if (value.length > 0) {
            this.kennisbankItems$ = this.kennisbankService.search(value);
        } else {
            this.kennisbankItems$ = null;
        }
    }
}
