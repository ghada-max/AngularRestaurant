import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  

  url = environment.apiUrl;
  constructor(private httpClient:HttpClient) { }
  add(data:any){
    return this.httpClient.post(this.url + "/product/add",data,{
      headers: new HttpHeaders().set('Content-Type',"application/json")})  }


  update(data:any){
    return this.httpClient.post(this.url+"/product/updateProduct",data,{
      headers:new HttpHeaders().set('Content-Type',"application/json")
    })
  }
  delete(id:any){
    return this.httpClient.delete(this.url+"/product/deleteProduct/"+id,{
      headers: new HttpHeaders().set('Content-Type',"application/json")
    })
  }

  updateStatus(data:any){
    return this.httpClient.post(this.url+"/product/updateProductStatus",data,{
      headers:new HttpHeaders().set('Content-Type',"application/json")
    })
  }
  getProduct(){
    return this.httpClient.get(this.url+"/product/getProducts")
  }


  getProductByCategory(id:any){
    return this.httpClient.get(this.url+"/product/GetCategoryById/"+id);
  }

  getById(id:any){
    return this.httpClient.get(this.url+"/product/getById/"+id);
  }
  
}
