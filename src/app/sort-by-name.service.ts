import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
// Takes a property value from an object and returns that object sorted by that property
export class SortByNameService {

  constructor() { }
  public dynamicSort(property: string) {
    let sortOrder = 1;
    if (property[0] === '-') {
      sortOrder = -1;
      property = property.substr(1);
    }
    return (obj1, obj2) => {
      const result = (obj1[property] < obj2[property]) ? -1 : (obj1[property] > obj2[property]) ? 1 : 0;
      return result * sortOrder;
    };
  }

  // Takes multiple property values from an object and returns that object sorted by those properties
  public dynamicSortMultiple(object1: string, object2: string, object3?: string) {

    const properties = arguments;
    return (obj1, obj2) => {
      let i = 0;
      let result = 0;
      const numberOfProperties = properties.length;

      while (result === 0 && i < numberOfProperties) {
        result = this.dynamicSort(properties[i])(obj1, obj2);
        i++;
      }
      return result;
    };
  }

}
