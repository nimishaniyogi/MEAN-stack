import { Component } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient} from '@angular/common/http'


@Component({
  selector: 'register',
  templateUrl: 'register.component.html'
})
export class RegisterComponent {
 registerData = {}
 path = 'http://localhost:3000';
 selectedFile = null;

 constructor(private authService : AuthService, private http: HttpClient){}

 onFileSelected(event) {
  this.selectedFile = <File>event.target.files[0];
  console.log(event);
}
 post(){

  console.log(this.registerData)

// this.authService.registerUser(this.registerData)
this.authService.registerUser(this.registerData);
const formData = new FormData();
formData.append('image', this.selectedFile, this.selectedFile.name);
this.http.post(this.path + '/upload', formData).subscribe(res => {
  console.log(res);
});
 }
}
