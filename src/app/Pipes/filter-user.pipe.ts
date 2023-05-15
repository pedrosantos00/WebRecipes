import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterUser'
})
export class FilterUserPipe implements PipeTransform {

  transform(values: any[], search: any ) {
    if(search == '') {
      return values;
    }

    let users = [];
    for(let user of values)
    {
      if (user.firstName.toLowerCase() == search.toLowerCase()
        || user.lastName.toLowerCase()  == search.toLowerCase()
        || user.fullName.toLowerCase()  == search.toLowerCase()
        || user.id == search
        || user.email.toLowerCase() == search.toLowerCase()
        || user.isBlocked.toString() == search.toLowerCase()
        || user.role.toLowerCase() == search.toLowerCase()
        ) {
          users.push(user);
      }
    }
    return users;
  }

}
