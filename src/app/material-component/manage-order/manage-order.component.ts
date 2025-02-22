import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { saveAs } from 'file-saver';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { BillService } from 'src/services/bill.service';
import { CategoryService } from 'src/services/category.service';
import { ProductService } from 'src/services/product.service';
import { SnackbarService } from 'src/services/snackbar.service';

@Component({
  selector: 'app-manage-order',
  templateUrl: './manage-order.component.html',
  styleUrls: ['./manage-order.component.scss']
})
export class ManageOrderComponent implements OnInit {

  displayedColumns: string[]= ['name','category','price','quantity','total','edit'];
  dataSource:any=[];
  manageOrderForm:any=FormGroup;
  categorys:any=[];
  products:any=[];
  price:any;
  totalAmmont:number=0;
  responseMessage:any;

  constructor(private formBuilder:FormBuilder,
    private categoryService:CategoryService,
    private productService:ProductService,
    private snackbarService:SnackbarService,
    private billService:BillService,
    private ngxService:NgxUiLoaderService

  ) { }

  ngOnInit(): void {

   this.ngxService.start();
    this.getCategorys();
    this.manageOrderForm=this.formBuilder.group({
      name:[null,[Validators.required,Validators.pattern(GlobalConstants.nameRegex  )]],
      email:[null,[Validators.required,Validators.pattern(GlobalConstants.nameRegex)]],
      contactNumber:[null,[Validators.required,Validators.pattern(GlobalConstants.contactNumberRegex)]],
      paymentMethod:[null,[Validators.required]],
      product:[null,[Validators.required]],
      category:[null,[Validators.required]],
      quantity:[null,[Validators.required]],
      price:[null,[Validators.required]],
      total:[0,[Validators.required]]
    });
  }

  getCategorys(){

    this.categoryService.getCategorys().
    subscribe((response:any)=>{
      this.ngxService.stop();
      this.categorys=response;

    },(error:any)=>{
      this.ngxService.stop();
      console.log(error);
      if(error.error?.message){
        this.responseMessage=error.error?.message;
     }
     else{
        this.responseMessage=GlobalConstants.genericError;
     }
      this.snackbarService.openSnackBar(this.responseMessage,GlobalConstants.error);
    })

   
  }


  getProductByCategory(value:any){
    this.productService.getProductByCategory(value.id).subscribe((response:any)=>{
      this.products.response;
      this.manageOrderForm.controls['price'].setValue('');
      this.manageOrderForm.controls['quantity'].setValue('');
      this.manageOrderForm.controls['total'].setValue(0);
 
 
    },(error:any)=>{
     if(error.error?.message){
         this.responseMessage=error.error?.message;
      }
      else{
         this.responseMessage=GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage,GlobalConstants.error);
    })

   
  }

  getProductDetails(value:any){
    this.productService.getProduct().subscribe((response:any)=>{
      this.price=response.price;
      this.manageOrderForm.controls['price'].setValue(response.price);
      this.manageOrderForm.controls['quantity'].setValue('1');
      this.manageOrderForm.controls['total'].setValue(this.price*1);

    },(error:any)=>{
      if(error.error?.message){
          this.responseMessage=error.error?.message;
       }
       else{
          this.responseMessage=GlobalConstants.genericError;
       }
       this.snackbarService.openSnackBar(this.responseMessage,GlobalConstants.error);
     })
 
   }

  setQuantity(value:any){
    var temp=this.manageOrderForm.controls['quantity'].value;
    if( temp> 0){
      this.manageOrderForm.controls['total'].setValue(
        this.manageOrderForm.controls['quantity'].value * this.manageOrderForm.controls['price'].value );
    }
    else if(temp != ''){
       this.manageOrderForm.controls['quanity'].setValue('1');
       this.manageOrderForm.controls['total'].setValue(
       this.manageOrderForm.controls['quantity'].value * this.manageOrderForm.controls['price'].value );

    }
  }
  validateProductAdd(){
    if(this.manageOrderForm.controls['total'].value === 0 ||
      this.manageOrderForm.controls['total'].value === null ||
      this.manageOrderForm.controls['quantity'].value<= 0
    ){
return true;
    }
    else{
      return false;

    }
  }
  
  validateSubmit(){
    if(this.totalAmmont === 0 || this.manageOrderForm.controls['name'].value === null || this.manageOrderForm.Controls['email'].
      value === null || this.manageOrderForm.controls['contactNumber'].value === null || this.manageOrderForm.controls['paymentMethod'].value===null
    )return true;
    else  return false;
  }
  
  add(){
    var formData=this.manageOrderForm.value;
    var productName=this.dataSource.find((e:{id:number})=>e.id === formData.product.id);
    if(productName === undefined){
      this.totalAmmont=this.totalAmmont+formData.total;
      this.dataSource.push({id:formData.product.id,name:formData.product.name,category:formData.category.name,quantity:formData.quanity,price:formData.price,total:formData.total});
      this.dataSource=[...this.dataSource];
      this.snackbarService.openSnackBar(GlobalConstants.productAdded,"success");
   
    }
    else{
      this.snackbarService.openSnackBar(GlobalConstants.productExistError,GlobalConstants.error);
    }
  }
  
  handleDeleteAction(value:any,element:any){
    this.totalAmmont=this.totalAmmont-element.total;
    this.dataSource.splice(value,1);
    this.dataSource=[...this.dataSource];
  }

  submitAction(){
    var formData=this.manageOrderForm.value;
    var data={
      name:formData.name,
      email:formData.email,
      contactNumber:formData.contactNumber,
      paymentMethod:formData.paymentMethod,
      totalAmount:this.totalAmmont.toString(),
      productDetails:JSON.stringify(this.dataSource)
    }
    this.ngxService.start();
    this.billService.generateReport(data).subscribe((response:any)=>{
      this.downloadFile(response?.uuid);
      this.manageOrderForm.reset();
      this.dataSource=[];
      this.totalAmmont=0;
    },(error:any)=>{
      if(error.error?.message){
          this.responseMessage=error.error?.message;
       }
       else{
          this.responseMessage=GlobalConstants.genericError;
       }
       this.snackbarService.openSnackBar(this.responseMessage,GlobalConstants.error);
     })
 
   }

  downloadFile(filename:string){
    var data={
      uuid:filename
    }
    this.billService.getPdf(data).subscribe((response:any)=>{
      saveAs(response,filename+'.pdf');
      this.ngxService.stop();
    })
  }





}
