import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {baseUrl} from '../base-api.service';
import {map} from 'rxjs/operators';
import {ICustomer} from './ICustomer';

@Injectable({
    providedIn: 'root'
})
export class CustomersService {

    constructor(private http: HttpClient) {
    }

    public getAll(): Observable<ICustomer[]> {
        return this.http.get<ICustomer[]>(baseUrl + 'api/relaties').pipe(
            map((clients) => {
                clients.map((client) => {
                    this.getFullName(client);
                    this.getTitle(client);
                    this.getFullAddress(client);
                    this.getAge(client);
                });
                return clients;
            })
        );
    }

    public create(formData: ICustomer) {
        return this.http.post(baseUrl + 'api/relaties/createRelation', formData);
    }

    public search(keyword: string): Observable<ICustomer[]> {
        return this.http.get<ICustomer[]>(baseUrl + 'search/' + keyword).pipe(
            map((clients: any) => {
                clients = clients.Relations;
                clients.map((client: ICustomer) => {
                    this.getFullName(client);
                    this.getTitle(client);
                    this.getFullAddress(client);
                    this.getAge(client);
                });
                return clients;
            })
        );
    }

    public getById(id: number): Observable<ICustomer> {
        return this.http.get<ICustomer>(baseUrl + 'api/relaties/' + id).pipe(
            map((client) => {
                this.getFullName(client);
                this.getTitle(client);
                this.getFullAddress(client);
                this.getAge(client);

                return client;
            })
        );
    }

    public getFullName(client: ICustomer): ICustomer {
        if (client.middlename) {
            client.fullname = client.firstname + ' ' + client.middlename + ' ' + client.lastname;
        } else {
            client.fullname = client.firstname + ' ' + client.lastname;
        }
        return client;
    }

    public getTitle(client: ICustomer): ICustomer {
        let title = '';
        if (client.gender === 'Vrouw') {
            title = 'Mevr.';
        } else if (client.gender === 'Man') {
            title = 'M.';
        }
        client.title = title;
        return client;
    }

    public getFullAddress(client: ICustomer): ICustomer {
        for (const address of client.address) {
            let fullAddress = '';
            let houseNumber = address.housenumber.toString();

            if (address.housenumberaddition) {
                houseNumber = address.housenumber + '-' + address.housenumberaddition;
            }
            fullAddress = address.street + ' '
                + houseNumber + ', '
                + address.postalcode + ' '
                + address.city;
            address.fullAddress = fullAddress;
        }
        return client;
    }

    public getAge(client: ICustomer): ICustomer {
        const today = new Date();
        if (client.dateofbirth) {
            const birthDate = new Date(client.dateofbirth);
            let age = today.getFullYear() - birthDate.getFullYear();
            const months = today.getMonth() - birthDate.getMonth();
            if (months < 0 || (months === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            client.age = age;
        }
        return client;
    }
}
