export class Paquet {
    public data_arribada: number;
    public remitent: string;
    public procedencia: string;
    public quantitat: number;
    public mitja_arribada: string;
    public referencia: string;
    public destinatari: string;
    public departament: string;
    public data_lliurament: number;
    public dipositari: string;
    public signatura: string;

    constructor(
        data_arribada: number,
        remitent: string,
        procedencia: string,
        quantitat: number,
        mitja_arribada: string,
        referencia: string,
        destinatari: string,
        departament: string,
        data_lliurament: number,
        dipositari: string,
        signatura: string,
    ){
        this.data_arribada = data_arribada;
        this.remitent = remitent;
        this.procedencia  =procedencia;
        this.quantitat = quantitat;
        this.mitja_arribada = mitja_arribada;
        this.referencia  =referencia;
        this.destinatari = destinatari;
        this.departament  =departament;
        this.data_lliurament  =data_lliurament;
        this.dipositari = dipositari;
        this.signatura = signatura;

    }
}