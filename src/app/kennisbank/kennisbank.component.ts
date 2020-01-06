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

    public toggleContent(id: string, elementId: string) {
        if (this.contentId === id) {
            this.contentId = '';
        } else {
            this.subTitleId = '';
            this.show = false;
            this.contentId = id;
            this.kennisbankService.getById(id).subscribe(
                (data) => {
                    this.kennisbankItem = data;
                }
            );
            this.scrollToElement(elementId);
        }
    }

    public toggleSubContent(id: string, websiteId: string, elementId: string) {
        if (this.subTitleId !== id) {
            this.subTitleId = id;
            this.show = true;
            this.scrollToElement(elementId);
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

    public scrollToElement(elementId) {
        setTimeout(() => {
            const el = document.getElementById(elementId);
            const yOffset = -105;
            const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo(0, y);
        }, 100);
    }
}
