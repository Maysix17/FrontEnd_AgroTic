/**
 * Interface para el tipo Permiso.
 * Representa una acción o permiso específico que puede tener un rol.
 */
export interface Permission {
  id: string;
  accion: string;
}

/**
 * Interface para el tipo Rol.
 * Representa un rol de usuario (ej: Administrador, Aprendiz) e incluye sus permisos.
 */
export interface Role {
  id: string;
  nombre: string;
  permisos?: Permission[]; // Opcional, lista de permisos asociados al rol
}

/**
 * Interface para el tipo Ficha.
 * Representa una ficha disponible para un aprendiz.
 */
export interface Ficha {
  id: string;
  numero: number;
}

/**
 * Interface para el tipo Usuario.
 * Representa un usuario completo en la aplicación.
 */
export interface User {
  id: string;
  nombres: string;
  apellidos: string;
  dni: string;
  correo: string;
  telefono: string;
  rol: Role;      // Rol asociado al usuario
  ficha?: Ficha;  // Ficha asignada (solo para aprendices)
}

/**
 * Interface para los datos del formulario de creación de usuario.
 */
export interface AdminUserFormData {
  nombres: string;
  apellidos: string;
  dni: string;
  telefono: string;
  correo: string;
  password: string;
  rolId: string;   // ID del rol seleccionado
  fichaId: string; // ID de la ficha seleccionada (si aplica)
}

/**
 * Props para el componente AdminUserForm (modal/formulario).
 */
export interface AdminUserFormProps {
  isOpen: boolean;          // Indica si el modal está abierto
  onClose: () => void;      // Función para cerrar el modal
  onUserCreated: () => void; // Función que se ejecuta después de crear un usuario
}

/**
 * Tipo para los errores del formulario.
 * Clave: nombre del campo, Valor: mensaje de error correspondiente.
 */
export type FormErrors = Record<string, string>;
