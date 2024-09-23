import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  url=environment.apiUrl;
  constructor(private httpClient:HttpClient) { }
  
  signup(data:any){

    return this.httpClient.post("http://localhost:8081"+
      "/user/signup",data,{headers:new HttpHeaders()
        .set('Content-Type','application/json')
      }   
    )
  }


  forgotPassword(data:any){

    return this.httpClient.post("http://localhost:8081"+
      "/user/forgotPassword",data,{headers:new HttpHeaders()
        .set('Content-Type','application/json')
      }   
    )
  }

  login(data:any){

    return this.httpClient.post("http://localhost:8081"+
      "/user/login",data,{headers:new HttpHeaders()
        .set('Content-Type','application/json')
      }   
    )
  }

 checkToken(){
  return this.httpClient.get("http://localhost:8081"+
  "/user/checkToken")}
   
  changePassword(data:any){

    return this.httpClient.post("http://localhost:8081"+
      "/user/changePassword",data,{headers:new HttpHeaders()
        .set('Content-Type','application/json')
      }   
    )
  }
  getUsers()
  {
    return this.httpClient.get(this.url+"/user/getUsers")
  }
  update(data:any){
    return this.httpClient.post(this.url+
      "/user/updateUsers",data,{
        headers:new HttpHeaders().set('Content-Type',"application/json")
      }
    )
  }
}
