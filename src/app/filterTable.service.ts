import {Injectable} from '@angular/core';
import {MatTableDataSource} from '@angular/material';

@Injectable({
    providedIn: 'root'
})
export class FilterTableService {

    constructor() {
    }

    public filterNestedObjects(dataSource: MatTableDataSource<any>) {
        dataSource.filterPredicate = (order: any, filter: string) => {
            const transformedFilter = filter.trim().toLowerCase();

            const listAsFlatString = (obj): string => {
                let returnVal = '';

                Object.values(obj).forEach((val) => {
                    if (typeof val !== 'object') {
                        returnVal = returnVal + ' ' + val;
                    } else if (val) {
                        returnVal = returnVal + ' ' + listAsFlatString(val);
                    }
                });

                return returnVal.trim().toLowerCase();
            };

            return listAsFlatString(order).includes(transformedFilter);
        };
    }
}
