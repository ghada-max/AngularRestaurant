import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { NgxUiLoaderConfig, NgxUiLoaderService } from 'ngx-ui-loader';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { SnackbarService } from 'src/services/snackbar.service';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  
  oldPassword= true;
  newPassword= true;
  confirmPassword= true;
  changePasswordForm:any=FormGroup ;
  responseMessage:any ;
  constructor(
    private formBuilder:FormBuilder,
    private userService:UserService,
    public dialogRef:MatDialogRef<ChangePasswordComponent>,
    private ngxService:NgxUiLoaderService,
    private snackbarService:SnackbarService
  ) { }

  ngOnInit(): void {
    this.changePasswordForm=this.formBuilder.group({
        oldPassword:[null,Validators.required],
        newPassword:[null,Validators.required],
        confirmPassword:[null,Validators.required],

      })
  }
 
  validateSubmit(){
    if(this.changePasswordForm.controls['newPassword'].value !=this.changePasswordForm.controls['confirmPassword'].value ){
      return true;
    }else{return false;}

 }

  handlepasswordChangeSubmit(){
    this.ngxService.start();
    var formData=this.changePasswordForm.value;
    var data={
      oldPassword:formData.oldPassword,
      newPassword:formData.newPassword,
      confirmPassword:formData.confirmPassword
    }
    this.userService.changePassword(data).subscribe((response:any)=>{
      this.ngxService.stop();
      this.responseMessage=response?.message;
      this.dialogRef.close();
      this.snackbarService.openSnackBar(this.responseMessage,GlobalConstants.error);
    })
  }









}
