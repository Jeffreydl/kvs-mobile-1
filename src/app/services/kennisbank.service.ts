import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

const baseUrl = 'https://kvsapi-demo.hexia.io/search/';


@Injectable({
  providedIn: 'root'
})
export class KennisbankService {
  results;

  constructor(private http: HttpClient) {}

  searchKennisbankItems(searchRequest: string) {

    const url = baseUrl + searchRequest;

    this.http.get(url).subscribe(
        (data: any) => {
          console.log(data.KbaseItems);
          this.results = data.KbaseItems;
          this.getItems();
        },
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            console.log('Client-side error occured.');
          } else {
            console.log('Server-side error occured.');
          }
        }
    );
  }
  getItems() {
    console.log(this.results);
    return this.results;
  }
}
