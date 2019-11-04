import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {KennisbankService} from '../kennisbank.service';
import {FormControl} from '@angular/forms';
import {IKennisbankSearchItem} from '../IKennisbank';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Component({
    selector: 'app-kennisbank-searchbar',
    templateUrl: './kennisbank-searchbar.component.html',
    styleUrls: ['./kennisbank-searchbar.component.scss']
})
export class KennisbankSearchbarComponent implements OnInit {
    public kennisbankItems$: Observable<IKennisbankSearchItem[]>;
    public autoCompleteFormControl = new FormControl();
    @Output() public isActive = new EventEmitter<boolean>();
    iisActive: boolean;

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
            this.iisActive = true;
            this.isActive.emit(true);
        } else {
            this.kennisbankItems$ = null;
            this.isActive.emit(false);
            this.iisActive = false;
        }
    }
}
