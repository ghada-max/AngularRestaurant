import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from 'src/services/snackbar.service';
import { UserService } from 'src/services/user.service';
import { GlobalConstants } from '../shared/global-constants';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  password = true;
  confirmPassword = true;
  signupForm:any = FormGroup;
  responseMessage:any;

  constructor(private formBuilder:FormBuilder,
    private router:Router,
    private UserService:UserService,
    private snackbarService:SnackbarService,
    public dialogRef:MatDialogRef<SignupComponent>,
    private ngxService:NgxUiLoaderService
  ) { }

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
    name:[null,[Validators.required,Validators.pattern(GlobalConstants.nameRegex)]],
    email:[null,[Validators.required,Validators.pattern(GlobalConstants.emailRegex)]],
    ContactNumber:[null,[Validators.required,Validators.pattern(GlobalConstants.contactNumberRegex)]],
    password:[null,[Validators.required]],
    confirmPassword:[null,[Validators.required]]

  })
  }

  validateSubmit(){
    return this.signupForm.get('password').value !== this.signupForm.get('confirmPassword').value;

    }
    handleSubmit(){
    this.ngxService.start();
    var formData = this.signupForm.value;
    var data={
      name:formData.name,
      email:formData.email,
      contactNumber:formData.ContactNumber,
      password:formData.password
    }
      this.UserService.signup(data).subscribe((response:any) => {
       
        this.ngxService.stop();
        this.dialogRef.close();
        this.responseMessage = response?.message;
        this.snackbarService.openSnackBar(this.responseMessage,"");
        this.router.navigate(['/']);
     },(error)=>{
      this.ngxService.stop();
      if(error.error?.message){
        this.responseMessage=error.error?.message;
      }
      else{
        this.responseMessage=GlobalConstants.genericError;
      }
     })

    }
}
