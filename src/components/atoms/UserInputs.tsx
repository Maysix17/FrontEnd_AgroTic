// src/components/molecules/UserInputs.tsx
import React from "react";
import TextInput from "../atoms/TextInput";
import type { UserInputsProps } from "../../types/UserInputsProps";

type ErrorState = {
  nombres?: string;
  apellidos?: string;
  dni?: string;
  telefono?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
};

const UserInputs: React.FC<UserInputsProps & { errors?: ErrorState }> = ({
  dni, setDni,
  password, setPassword,
  confirmPassword, setConfirmPassword,
  email, setEmail,
  nombres, setNombres,
  apellidos, setApellidos,
  telefono, setTelefono,
  errors = {}
}) => {
  return (
    <>
      <div>
        {nombres !== undefined && setNombres && (
          <TextInput
            label="Nombres"
            placeholder="Ingrese un nombre"
            value={nombres}
            onChange={(e) => setNombres(e.target.value)}
          />
        )}
        {errors.nombres && <p className="text-red-500 text-xs">{errors.nombres}</p>}
      </div>

      <div>
        {apellidos !== undefined && setApellidos && (
          <TextInput
            label="Apellidos"
            placeholder="Ingrese un apellido"
            value={apellidos}
            onChange={(e) => setApellidos(e.target.value)}
          />
        )}
        {errors.apellidos && <p className="text-red-500 text-xs">{errors.apellidos}</p>}
      </div>

      <div>
        {dni !== undefined && setDni && (
          <TextInput
            label="DNI"
            placeholder="Ingrese DNI"
            value={dni}
            onChange={(e) => setDni(e.target.value)}
          />
        )}
        {errors.dni && <p className="text-red-500 text-xs">{errors.dni}</p>}
      </div>

      <div>
        {email !== undefined && setEmail && (
          <TextInput
            label="Correo electrónico"
            type="email"
            placeholder="Ingrese correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        )}
        {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
      </div>

      <div>
        {telefono !== undefined && setTelefono && (
          <TextInput
            label="Teléfono"
            placeholder="Ingrese un teléfono"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
          />
        )}
        {errors.telefono && <p className="text-red-500 text-xs">{errors.telefono}</p>}
      </div>

      <div>
        {password !== undefined && setPassword && (
          <TextInput
            label="Contraseña"
            type="password"
            placeholder="Ingrese contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        )}
        {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
      </div>

      <div>
        {confirmPassword !== undefined && setConfirmPassword && (
          <TextInput
            label="Confirmar Contraseña"
            type="password"
            placeholder="Repita la contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        )}
        {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword}</p>}
      </div>
    </>
  );
};

export default UserInputs;
