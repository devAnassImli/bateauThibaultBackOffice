import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  username: string = '';
  password: string = '';
  erreur: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login() {
    if (!this.username || !this.password) {
      this.erreur = 'Veuillez remplir tous les champs';
      return;
    }
    this.authService.login(this.username, this.password).subscribe({
      next: (res: any) => {
        this.authService.saveToken(res.access);
        this.router.navigate(['/']);
      },
      error: () => {
        this.erreur = 'Identifiants incorrects';
      }
    });
  }
}