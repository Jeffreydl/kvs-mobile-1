import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {KennisbankService} from '../kennisbank.service';
import {FormControl} from '@angular/forms';
import {IKennisbankSearchItem} from '../IKennisbank';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';

@AutoUnsubscribe()
@Component({
    selector: 'app-kennisbank-searchbar',
    templateUrl: './kennisbank-searchbar.component.html',
    styleUrls: ['./kennisbank-searchbar.component.scss']
})
export class KennisbankSearchbarComponent implements OnInit, OnDestroy {
    private kennisbankItems$: Observable<IKennisbankSearchItem[]>;
    private autoCompleteFormControl = new FormControl();
    @Output() public isActive = new EventEmitter<boolean>();
    private iisActive: boolean;

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

    ngOnDestroy(): void {
    }

    private searchKennisbank(value: string) {
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
