import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterUser'
})
export class FilterUserPipe implements PipeTransform {

  transform(values: any[], search: any) {
  // FILTER PIPE FOR USERS
    if (search == '') {
      return values;
    }

    let users = [];
    for (let user of values) {
      if (
        (user.firstName && user.firstName.toLowerCase().includes(search.toLowerCase()))
        || (user.lastName && user.lastName.toLowerCase().includes(search.toLowerCase()))
        || (user.fullName && user.fullName.toLowerCase().includes(search.toLowerCase()))
        || (user.email && user.email.toLowerCase().includes(search.toLowerCase()))
        || user.isBlocked.toString() == search.toLowerCase()
        || (user.role && user.role.toLowerCase().includes(search.toLowerCase()))
        || user.id == search

      ) {
        users.push(user);
      }
    }
    return users;
  }

}
