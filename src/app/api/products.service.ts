import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class ProductsService {

    constructor(private http: HttpClient) { }

    public getProductsPaginated(filterByNameValue?: string, filterByCategoryValue?: string, orderByValue?: string, orderByDirection?: string, page?: number) {
        
        let params = new HttpParams();
        if(filterByNameValue != undefined)
        {   
            params = params.append('filterByNameValue', filterByNameValue);
        }
        if(filterByCategoryValue != undefined)
        {        
            params = params.append('filterByCategoryValue', filterByCategoryValue);
        }
        
        if(orderByValue != undefined)
        {        
            params = params.append('orderByValue', orderByValue);
        }
        
        if(orderByDirection != undefined)
        {        
            params = params.append('orderByDirection', orderByDirection);
        }

        if(page != undefined)
        {       
            params = params.append('page', page);
        }

        console.log(params.get('page'));
        console.log(params);
        
        return this.http
            .get<any>("http://localhost:5125/api/Products", {params: params});
    }

}