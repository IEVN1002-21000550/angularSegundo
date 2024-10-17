import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Signos {
  nombre: string;
  apaterno: string;
  amaterno: string;
  dia: number;
  mes: number;
  year: number;
  sexo: string;
}

@Component({
  selector: 'app-zodiaco',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './zodiaco.component.html',
  styleUrls: ['./zodiaco.component.css']
})
export default class ZodiacoComponent implements OnInit {
  formGroup!: FormGroup;
  clientes: Signos = {
    nombre: '',
    apaterno: '',
    amaterno: '',
    dia: 0,
    mes: 0,
    year: 0,
    sexo: '',
  };
  imagenSigno!: string;
  signoZodiacal!: string;
  edad!: number;
  nombreCompleto!: string;
  dia!: number;
  mes!: number;
  year!: number;

  signosZodiacoChino = [
    'Rata', 'Buey', 'Tigre', 'Conejo', 'Dragón', 'Serpiente',
    'Caballo', 'Cabra', 'Mono', 'Gallo', 'Perro', 'Cerdo'
  ];

  signosZodiacoImagenes = [
    'https://th.bing.com/th/id/R.7263a84dea6f16a5952b4045716b4fe4?rik=eF%2bCKlTaCwYkOA&riu=http%3a%2f%2fimages-site-chefsimon-eu.s3-eu-west-1.amazonaws.com%2farticles%2fcaef341c-0ba6-43c3-ad5c-1c8a8c419d7a%2fratatouille.png&ehk=xrT5jcEa8X%2b0bL2SH9Kxmb4f%2f6NxTgUcu9ngXMkqeYM%3d&risl=&pid=ImgRaw&r=0', // Rata
    'https://th.bing.com/th/id/R.ab55e9a612b002f702c5f4ad13eb2a3d?rik=LGoXRTWGXAlv6w&pid=ImgRaw&r=0', // Buey
    'https://masaryk.tv/wp-content/uploads/2021/07/8-380x764.jpg', // Tigre
    'https://i.pinimg.com/originals/14/bc/48/14bc48bda253bdf217f20f67b7b1a8ff.png', // Conejo
    'https://th.bing.com/th/id/OIP.zMJ0tC49UNZAJ_oOkJZrKgHaHa?rs=1&pid=ImgDetMain', // Dragón
    'https://th.bing.com/th/id/R.057044031808725a6411982b12af1f71?rik=PFP2r0wdHsVm%2bQ&riu=http%3a%2f%2fimg1.wikia.nocookie.net%2f__cb20130823184805%2fkungfupanda%2fes%2fimages%2f9%2f9a%2fViper....png&ehk=%2ffY6UYJuEgmfTp9GK034MA6Utb2yCv9vlAGpPx27dF0%3d&risl=&pid=ImgRaw&r=0', // Serpiente
    'https://i.imgflip.com/4ndpo6.png', // Caballo
    'https://th.bing.com/th/id/R.ed6586d64a79a6dbc987335b0f45219b?rik=R8WBS1AqlXibUg&riu=http%3a%2f%2fimages7.memedroid.com%2fimages%2fUPLOADED760%2f5f4fd59e02b31.jpeg&ehk=0aafJQuU6RpqobyO0skDsctpEtCdH9sMmyA0MKFC%2fvk%3d&risl=&pid=ImgRaw&r=0', // Cabra
    'https://cdn1.eldia.com/072021/1626792085551.jpg', // Mono
    'https://th.bing.com/th/id/R.2891a9f063ea245d816fcdd967130e79?rik=DlBc8X%2fRt0Q6vw&pid=ImgRaw&r=0', // Gallo
    'https://i.pinimg.com/enabled_hi/564x/88/c1/f6/88c1f6a7440c864dba302deab87dc8a7.jpg', // Perro
    'https://th.bing.com/th/id/OIP.ZGcbI5sFqxZ6qmDpkV5JugHaGH?rs=1&pid=ImgDetMain' // Cerdo
  ];

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.formGroup = this.initForm();

    // Suscribirse a los cambios del formulario
    this.formGroup.valueChanges.subscribe(() => {
      this.actualizarInfoCliente();
    });
  }

  mostrar(): void {
    const clienteInfo = localStorage.getItem('clienteInfo');
    if (clienteInfo) {
      const cliente = JSON.parse(clienteInfo);
      this.nombreCompleto = `${cliente.nombre} ${cliente.apaterno} ${cliente.amaterno}`;
      this.dia = cliente.dia;
      this.mes = cliente.mes;
      this.year = cliente.year;

      // Calcular el signo zodiacal chino
      this.calcularSignoZodiacal(this.year);

      // Calcular la edad
      this.calcularEdad(this.dia, this.mes, this.year);
    }
  }

  initForm(): FormGroup {
    return this.fb.group({
      nombre: [''],
      apaterno: [''],
      amaterno: [''],
      dia: [''],
      mes: [''],
      year: [''],
      sexo: ['']
    });
  }

  calcularSignoZodiacal(year: number): void {
    const index = (year - 4) % 12;
    this.signoZodiacal = this.signosZodiacoChino[index];
    this.imagenSigno = this.signosZodiacoImagenes[index]; // Asigna la URL de la imagen
  }

  calcularEdad(dia: number, mes: number, year: number): void {
    const actual = new Date();
    let edad = actual.getFullYear() - year;
    const cumple = new Date(actual.getFullYear(), mes - 1, dia);

    if (actual < cumple) {
      edad--;
    }

    this.edad = edad;
  }

  actualizarInfoCliente(): void {
    const { nombre, apaterno, amaterno, dia, mes, year, sexo } = this.formGroup.value;

    this.clientes.nombre = nombre;
    this.clientes.apaterno = apaterno;
    this.clientes.amaterno = amaterno;
    this.clientes.dia = dia;
    this.clientes.mes = mes;
    this.clientes.year = year;
    this.clientes.sexo = sexo;

    // Actualizar los datos en localStorage cada vez que el formulario cambia
    localStorage.setItem('clienteInfo', JSON.stringify(this.clientes));
  }

  onSubmit(): void {
    this.actualizarInfoCliente();
  }
}
