import React, { useState, useEffect } from 'react';
import ProfileTemplate from '../../components/templates/ProfileTemplate/ProfileTemplate';
import UserModal from '../../components/organisms/UserModal';
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
    console.log('UserProfilePage: useEffect running, user:', user);
    if (!user) {
      const fetchProfile = async () => {
        console.log('UserProfilePage: Starting fetchProfile');
        try {
          setLoading(true);
          const profile = await getProfile();
          console.log('UserProfilePage: fetchProfile successful', profile);
          setUserData(profile);
        } catch (err) {
          console.log('UserProfilePage: fetchProfile failed', err);
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
      <UserModal isOpen={true} onClose={() => {}} />
    </ProfileTemplate>
  );
};

export default UserProfilePage;