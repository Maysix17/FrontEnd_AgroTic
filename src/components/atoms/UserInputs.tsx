// src/components/molecules/UserInputs.tsx
import React from "react";
import TextInput from "../atoms/TextInput";
import type { UserInputsProps } from "../../types/UserInputsProps";

const UserInputs: React.FC<UserInputsProps> = ({
  dni, setDni,
  password, setPassword,
  confirmPassword, setConfirmPassword,
  email, setEmail,
  nombres, setNombres,
  apellidos, setApellidos,
  telefono, setTelefono
}) => {
  return (
    <>
      {nombres !== undefined && setNombres && (
        <TextInput
          label="Nombres"
          placeholder="Ingrese un nombre"
          value={nombres}
          onChange={(e) => setNombres(e.target.value)}
        />
      )}

      {apellidos !== undefined && setApellidos && (
        <TextInput
          label="Apellidos"
          placeholder="Ingrese un apellido"
          value={apellidos}
          onChange={(e) => setApellidos(e.target.value)}
        />
      )}

      {dni !== undefined && setDni && (
        <TextInput
          label="DNI"
          placeholder="Ingrese DNI"
          value={dni}
          onChange={(e) => setDni(e.target.value)}
        />
      )}

      {email !== undefined && setEmail && (
        <TextInput
          label="Correo electrónico"
          type="email"
          placeholder="Ingrese correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      )}

      {telefono !== undefined && setTelefono && (
        <TextInput
          label="Teléfono"
          placeholder="Ingrese un teléfono"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
        />
      )}

      {password !== undefined && setPassword && (
        <TextInput
          label="Contraseña"
          type="password"
          placeholder="Ingrese contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      )}

      {confirmPassword !== undefined && setConfirmPassword && (
        <TextInput
          label="Confirmar Contraseña"
          type="password"
          placeholder="Repita la contraseña"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      )}
    </>
  );
};

export default UserInputs;
