import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatDialog} from '@angular/material';
import {ProfileComponent} from '../employees/profile/profile.component';
import {Router} from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() title: string;
  @Output() searchingEmitter = new EventEmitter<boolean>();
  public isSearching = false;

  constructor(private dialog: MatDialog, public router: Router) { }

  ngOnInit() {
      console.log(this.router.url);
  }

    public openProfile(): void {
        this.dialog.open(ProfileComponent, {
            position: {top: '0'},
            height: 'calc(100% - 80px)',
            width: '100%',
            maxWidth: '100%',
            panelClass: 'task-dialog',
            data: {}
        });
    }

    public emitIsSearching(event) {
        if (this.isSearching) {
            this.isSearching = false;
            event.target.classList.remove('search-icon-active');
        } else {
            this.isSearching = true;
            event.target.classList.add('search-icon-active');
        }
        this.searchingEmitter.emit(this.isSearching);
    }
}
