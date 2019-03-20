import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth/auth.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.loginUser();
  }
}

/**
 * Historico ordenado por entrega descendente
 * Correo electronico, mirar de enviar mail al dar de alta paquete
 *    posibilidad de reenviament
 * Busqueda por cualquier campo
 *    (destinatari, remitent, mitja, procedencia)
 */
