import { Component } from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
}

/**
 * Historico ordenado por entrega descendente
 * Correo electronico, mirar de enviar mail al dar de alta paquete
 *    posibilidad de reenviament
 * Busqueda por cualquier campo 
 *    (destinatari, remitent, mitja, procedencia)
 */