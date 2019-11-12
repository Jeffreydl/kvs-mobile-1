import {Component, OnInit} from '@angular/core';
import {KennisbankService} from './kennisbank.service';
import {IKennisbankItems, IkennisbankItemsChildren} from './IKennisbank';

@Component({
    selector: 'app-kennisbank',
    templateUrl: './kennisbank.component.html',
    styleUrls: ['./kennisbank.component.scss']
})
export class KennisbankComponent implements OnInit {
    private kennisbankItems: IKennisbankItems[];
    private kennisbankItem: IkennisbankItemsChildren[];
    private show = false;
    private searching = false;
    private subTitleId: string;
    private contentId: string;
    private kennisbankWebsiteItem: IkennisbankItemsChildren[];

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

    private searchBarStatus($event: boolean) {
        this.searching = $event;
    }

    private toggleContent(id: string) {
        if (this.contentId === id) {
            this.contentId = '';
        } else {
            this.contentId = id;
        }
        console.log('toggleContent');

        this.kennisbankService.getById(id).subscribe(
            (data) => {
                this.kennisbankItem = data;
                console.log(this.kennisbankItem);
            }
        );
    }

    private toggleSubContent(id: string, websiteId: string) {
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
                    console.log(this.kennisbankItem);
                }
            );
        }
    }
}
