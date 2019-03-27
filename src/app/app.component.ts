import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import {  Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';

  constructor() { }

  ngOnInit() {

  }
}

/**
 * Historico ordenado por entrega descendente
 * Correo electronico, mirar de enviar mail al dar de alta paquete
 *    posibilidad de reenviament
 * Busqueda por cualquier campo
 *    (destinatari, remitent, mitja, procedencia)
 */
