import React from 'react';
import { Card, CardBody, Skeleton } from '@heroui/react';
import Avatar from '../../atoms/Avatar/Avatar';
import Heading from '../../atoms/Heading/Heading';
import FieldGrid from '../../molecules/FieldGrid';
import InfoField from '../../molecules/InfoField';
import type { User } from '../../../types/user';

interface UserCardProps {
  user?: User;
  isLoading?: boolean;
  error?: string;
}

const UserCard: React.FC<UserCardProps> = ({ user, isLoading = false, error }) => {
  if (error) {
    return (
      <Card>
        <CardBody className="text-center text-red-500">
          {error}
        </CardBody>
      </Card>
    );
  }

  if (isLoading || !user) {
    return (
      <Card>
        <CardBody>
          <div className="flex items-center gap-4 mb-4">
            <Skeleton className="w-12 h-12 rounded-full" />
            <Skeleton className="w-20 h-6 rounded-full" />
          </div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-6 w-32 mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-32" />
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardBody>
        <div className="flex items-center gap-4 mb-4">
          <Avatar alt={`${user.nombres} ${user.apellidos}`} />
        </div>
        <Heading>{user.nombres} {user.apellidos}</Heading>
        <Heading level={3}>{user.rol.nombre}</Heading>
        <FieldGrid>
          <InfoField label="Nombre" value={user.nombres} />
          <InfoField label="Apellidos" value={user.apellidos} />
          <InfoField label="N. de documento de identidad" value={user.dni} />
          <InfoField label="Correo" value={user.correo} />
          <InfoField label="Teléfono" value={user.telefono} />
          <InfoField label="Rol" value={user.rol.nombre} />
        </FieldGrid>
      </CardBody>
    </Card>
  );
};

export default UserCard;