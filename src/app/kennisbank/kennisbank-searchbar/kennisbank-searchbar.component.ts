import {Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
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

    constructor(private kennisbankService: KennisbankService) {
    }
    public kennisbankItems$: Observable<IKennisbankSearchItem[]>;
    public autoCompleteFormControl = new FormControl();
    @Output() public isActive = new EventEmitter<boolean>();
    @ViewChild('search', {static: true}) searchField: ElementRef;

    ngOnInit() {
        this.autoCompleteFormControl.valueChanges.pipe(
            debounceTime(500),
            distinctUntilChanged()
        ).subscribe((value) => {
            this.searchKennisbank(value);
        });
        this.searchField.nativeElement.focus();
    }

    ngOnDestroy(): void {
    }

    private searchKennisbank(value: string) {
        if (value.length > 0) {
            this.kennisbankItems$ = this.kennisbankService.search(value);
        } else {
            this.kennisbankItems$ = null;
        }
        this.isActive.emit(true);
    }
}
