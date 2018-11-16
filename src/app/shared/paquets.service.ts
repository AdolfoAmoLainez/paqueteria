import { Subject } from "rxjs";
import { Paquet } from "../arribades-list/paquet.model";

export class PaquetsService{

    startedEditPaquet  = new Subject<Paquet>();
}