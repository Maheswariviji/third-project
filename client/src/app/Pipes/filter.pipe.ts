import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

 	transform(users:any,term:any):any{
		if(term===undefined) return users;
		return users.filter(function(u){
			return u.local.username.toLowerCase().includes(term.toLowerCase());
		})
}

}
