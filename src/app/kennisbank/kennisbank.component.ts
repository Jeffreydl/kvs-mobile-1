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
                console.log(data);
                this.kennisbankItems = data;
            }
        );
    }

    ngOnDestroy(): void {
    }

    public searchBarStatus($event: boolean) {
        this.searching = $event;
    }

    public toggleContent(id: string) {
        if (this.contentId === id) {
            this.contentId = '';
            console.log('close');
        } else {
            this.contentId = id;
            console.log('open');
            this.kennisbankService.getById(id).subscribe(
                (data) => {
                    this.kennisbankItem = data;
                    console.log(this.kennisbankItem);
                }
            );
        }
    }

    public toggleSubContent(id: string, websiteId: string) {
        if (this.subTitleId === id) {
            this.subTitleId = '';
            this.show = false;
        } else {
            this.subTitleId = id;
            this.show = true;
            console.log(this.subTitleId);
        }
        console.log('toggleSubContent');

        if (websiteId) {
            websiteId = websiteId.replace(':', '');
            console.log(id);
            this.kennisbankService.getByWebsiteId(websiteId).subscribe(
                (data) => {
                    this.kennisbankWebsiteItem = data;
                    console.log(this.kennisbankWebsiteItem);
                }
            );
        }
    }
}
