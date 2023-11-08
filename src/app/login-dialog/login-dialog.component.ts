import {Component, HostListener} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {Login} from "./login";


@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.css'],
})
export class LoginDialogComponent {
  public login: Login

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === "Enter") {
      this.submit();
    }
  }

  constructor(public dialogRef: MatDialogRef<LoginDialogComponent>,
  ) {
    this.login = {email: "", name: "", password: "", isRegistering: false};
  }

  public submit() {
    this.dialogRef.close(this.login);
  }

  toggleRegister() {
    this.login.isRegistering = ! this.login.isRegistering;
  }
}
