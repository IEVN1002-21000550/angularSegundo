import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Empleado {
  matricula: number;
  nombre: string;
  email: string;
  edad: number;
  horas: number;
}

@Component({
  selector: 'app-empleados',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './empleados.component.html',
  styleUrls: ['./empleados.component.css']
})
export default class EmpleadosComponent implements OnInit {
  formulario!: FormGroup;
  empleados: Empleado[] = [];
  totalPagos: number = 0;
  errorMessage: string = '';
  successMessage: string = '';
  matriculaModificar: number | null = null;
  matriculaEliminar: number | null = null;
  tablaVisible: boolean = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.formulario = this.initForm();
    this.cargarEmpleados();
    this.calcularTotalPagos();
  }

  initForm(): FormGroup {
    return this.fb.group({
      matricula: ['', Validators.required],
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      edad: ['', [Validators.required, Validators.min(18)]],
      horas: ['', [Validators.required, Validators.min(1)]]
    });
  }

  onSubmit(): void {
    if (this.formulario.invalid) {
      this.errorMessage = 'Por favor, complete todos los campos correctamente.';
      this.successMessage = '';
      return;
    }

    const { matricula, nombre, email, edad, horas } = this.formulario.value;
    let matriculaExiste = false;
    let correoExiste = false;

    for (let i = 0; i < this.empleados.length; i++) {
      if (this.empleados[i].matricula === matricula) {
        matriculaExiste = true;
      }
      if (this.empleados[i].email === email) {
        correoExiste = true;
      }
      if (matriculaExiste || correoExiste) {
        break;
      }
    }

    if (matriculaExiste && this.matriculaModificar === null) {
      this.errorMessage = 'La matrícula ya existe. Ingrese otra.';
      this.successMessage = '';
      return;
    }

    if (correoExiste && this.matriculaModificar === null) {
      this.errorMessage = 'El correo ya existe. Ingrese otro.';
      this.successMessage = '';
      return;
    }

    const empleado: Empleado = { matricula, nombre, email, edad, horas };

    if (this.matriculaModificar !== null) {
      for (let i = 0; i < this.empleados.length; i++) {
        if (this.empleados[i].matricula === this.matriculaModificar) {
          this.empleados[i] = empleado;
          break;
        }
      }
      this.matriculaModificar = null;
      this.successMessage = 'Empleado modificado correctamente.';
    } else {
      this.empleados.push(empleado);
      this.successMessage = 'Empleado agregado correctamente.';
    }

    this.errorMessage = '';
    localStorage.setItem('empleados', JSON.stringify(this.empleados));
    this.calcularTotalPagos();
    this.formulario.reset();
    this.tablaVisible = false;
  }

  cargarEmpleados(): void {
    const empleadosGuardados = localStorage.getItem('empleados');
    if (empleadosGuardados) {
      this.empleados = JSON.parse(empleadosGuardados);
    }
  }

  calcularPagoNormal(horas: number): number {
    return Math.min(horas, 40) * 70;
  }

  calcularPagoExtra(horas: number): number {
    return Math.max(horas - 40, 0) * 140;
  }

  calcularTotalPagos(): void {
    this.totalPagos = this.empleados.reduce((sum, empleado) => {
      const pagoNormal = this.calcularPagoNormal(empleado.horas);
      const pagoExtra = this.calcularPagoExtra(empleado.horas);
      return sum + pagoNormal + pagoExtra;
    }, 0);
  }

  mostrarOcultarTabla(): void {
    this.tablaVisible = !this.tablaVisible;
  }

  buscarEmpleadoPorMatricula(): void {
    if (this.matriculaModificar !== null) {
      for (let i = 0; i < this.empleados.length; i++) {
        if (this.empleados[i].matricula === this.matriculaModificar) {
          this.formulario.setValue({
            matricula: this.empleados[i].matricula,
            nombre: this.empleados[i].nombre,
            email: this.empleados[i].email,
            edad: this.empleados[i].edad,
            horas: this.empleados[i].horas
          });
          this.successMessage = '';
          this.errorMessage = '';
          return;
        }
      }
      this.errorMessage = 'Empleado no encontrado.';
      this.successMessage = '';
    }
  }

  eliminarEmpleadoPorMatricula(): void {
    if (this.matriculaEliminar !== null) {
      for (let i = 0; i < this.empleados.length; i++) {
        if (this.empleados[i].matricula === this.matriculaEliminar) {
          this.empleados.splice(i, 1);
          this.successMessage = 'Empleado eliminado correctamente.';
          this.errorMessage = '';
          break;
        }
      }
      localStorage.setItem('empleados', JSON.stringify(this.empleados));
      this.calcularTotalPagos();
      this.matriculaEliminar = null;
    }
  }
}
