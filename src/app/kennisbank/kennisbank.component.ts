import {Component, OnDestroy, OnInit} from '@angular/core';
import {KennisbankService} from './kennisbank.service';
import {IKennisbankItems, IkennisbankItemsChildren} from './IKennisbank';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';

@AutoUnsubscribe()
@Component({
    selector: 'app-kennisbank',
    templateUrl: './kennisbank.component.html',
    styleUrls: ['./kennisbank.component.scss']
})
export class KennisbankComponent implements OnInit, OnDestroy {
    public kennisbankItems: IKennisbankItems[];
    public kennisbankItem: IkennisbankItemsChildren[];
    private show = false;
    public searching = false;
    public subTitleId: string;
    public contentId: string;
    public kennisbankWebsiteItem: IkennisbankItemsChildren;

    constructor(private kennisbankService: KennisbankService) {
    }

    ngOnInit() {
        this.kennisbankService.getAll().subscribe(
            (data) => {
                this.kennisbankItems = data;
            }
        );
    }

    ngOnDestroy(): void {
    }

    public searchBarStatus($event: boolean) {
        this.searching = $event;
    }

    public toggleContent(id: string, test) {
        console.log(test);
        if (this.contentId === id) {
            this.contentId = '';
        } else {
            this.contentId = id;
            this.kennisbankService.getById(id).subscribe(
                (data) => {
                    this.kennisbankItem = data;
                }
            );

            setTimeout(() => {
                const el = document.getElementById(test);
                // el.scrollIntoView({behavior: 'smooth', block: 'start'});
                const yOffset = -105;
                const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
                window.scrollTo({top: y, behavior: 'smooth'});
            }, 100);
        }
    }

    public toggleSubContent(id: string, websiteId: string, test) {
        if (this.subTitleId === id) {
            this.subTitleId = '';
            this.show = false;
        } else {
            this.subTitleId = id;
            this.show = true;
            setTimeout(() => {
                const el = document.getElementById(test);
                const yOffset = -105;
                const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
                window.scrollTo({top: y, behavior: 'smooth'});
            }, 100);
        }

        if (websiteId) {
            websiteId = websiteId.replace(':', '');
            this.kennisbankService.getByWebsiteId(websiteId).subscribe(
                (data) => {
                    this.kennisbankWebsiteItem = data;
                }
            );
        }
    }
}
