import React, { useState, useEffect } from 'react';
import ProfileTemplate from '../../components/templates/ProfileTemplate/ProfileTemplate';
import UserCard from '../../components/organisms/UserCard/UserCard';
import { getProfile } from '../../services/profileService';
import type { User } from '../../types/user';

interface UserProfilePageProps {
  user?: User;
}

const UserProfilePage: React.FC<UserProfilePageProps> = ({ user }) => {
  const [userData, setUserData] = useState<User | undefined>(user);
  const [loading, setLoading] = useState<boolean>(!user);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!user) {
      const fetchProfile = async () => {
        try {
          setLoading(true);
          const profile = await getProfile();
          setUserData(profile);
        } catch (err) {
          setError('Error al cargar el perfil');
        } finally {
          setLoading(false);
        }
      };
      fetchProfile();
    }
  }, [user]);

  return (
    <ProfileTemplate>
      <UserCard user={userData} isLoading={loading} error={error} />
    </ProfileTemplate>
  );
};

export default UserProfilePage;