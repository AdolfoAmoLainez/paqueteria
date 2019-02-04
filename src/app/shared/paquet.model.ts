export class Paquet {
    public id: number;
    public data_arribada: string;
    public remitent: string;
    public procedencia: string;
    public quantitat: number;
    public mitja_arribada: string;
    public referencia: string;
    public destinatari: string;
    public departament: string;
    public data_lliurament: string;
    public dipositari: string;
    public signatura: string;
    public qrcode:number;
    public email:string;

    constructor(
        id:number,
        data_arribada: string,
        remitent: string,
        procedencia: string,
        quantitat: number,
        mitja_arribada: string,
        referencia: string,
        destinatari: string,
        departament: string,
        data_lliurament: string,
        dipositari: string,
        signatura: string,
        qrcode:number,
        email:string
    ){
        this.id=id;
        this.data_arribada = data_arribada;
        this.remitent = remitent;
        this.procedencia  =procedencia;
        this.quantitat = quantitat;
        this.mitja_arribada = mitja_arribada;
        this.referencia  =referencia;
        this.destinatari = destinatari;
        this.departament  =departament;
        if (data_lliurament==null){
            this.data_lliurament="";
        }else{
            this.data_lliurament=data_lliurament;
        }
        this.dipositari = dipositari;
        this.signatura = signatura;
        this.qrcode = qrcode;
        if(email==null){
            this.email = "";
        }else{
            this.email = email;
        }
    }
}