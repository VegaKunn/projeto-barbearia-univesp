import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@hooks/useAuth';
import { isAnyFieldSet } from '@utils/utils';
import styles from './BarberSettings.module.scss';
import api from '@api';

import StatCard from '@components/ui/StatCard/StatCard';
import Form from '@components/common/Form/Form';
import Input from '@components/common/Input/Input';
import Icon from '@components/common/Icon/Icon';
import Button from '@components/common/Button/Button';
import Modal from '@components/common/Modal/Modal';
import ProfileImage from '@components/ui/ProfileImage/ProfileImage';
import Spinner from '@components/common/Spinner/Spinner';
import Error from '@components/common/Error/Error';

function BarberSettings() {
  const { profile, setProfile, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false); // Used to disable the update profile button

  // Popup states
  const [uploadPicturePopup, setUploadPicturePopup] = useState(false);
  const [deletePicturePopup, setDeletePicturePopup] = useState(false);
  const [deleteProfilePopup, setDeleteProfilePopup] = useState(false);

  /**
   * Defines fetching latest profile data
   */
  const fetchProfile = useCallback(async () => {
    setIsLoading(true);

    try {
      const { profile } = await api.barber.getBarberProfile();
      setProfile(profile);
    } finally {
      setIsLoading(false);
    }
  }, [setProfile]);

  /**
   *  Fetches on mount to keep profile data always up to date
   */
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // While fetching latest profile data show loading spinner
  if (isLoading) return <Spinner />;

  // Upload de imagens popup state handlers
  const openUploadPicturePopup = () => setUploadPicturePopup(true);
  const closeUploadPicturePopup = () => setUploadPicturePopup(false);

  // Deletar imagens popup state handlers
  const openDeletePicturePopup = () => setDeletePicturePopup(true);
  const closeDeletePicturePopup = () => setDeletePicturePopup(false);

  // Deletar perfil popup state handlers
  const openDeleteProfilePopup = () => setDeleteProfilePopup(true);
  const closeDeleteProfilePopup = () => setDeleteProfilePopup(false);

  /**
   * Handles uploading a new profile picture
   */
  const handleUploadPicture = async (file) => {
    await api.image.uploadProfileImage(file);
    closeUploadPicturePopup();
    await fetchProfile();
  };

  /**
   * Handles deleting a new profile picture
   */
  const handleDeletePicture = async () => {
    await api.image.deleteProfileImage();
    closeDeletePicturePopup();
    await fetchProfile();
  };

  /**
   * Handles deleting a new profile picture
   */
  const handleDeleteProfile = async () => {
    await api.barber.deleteBarberProfile();
    closeDeleteProfilePopup();
    await logout();
  };

  /**
   * Validate at least one field is provided, matching backend logic
   */
  const validateUpdateProfile = ({ username, name, surname, description }) => {
    if (
      (!username || username.trim() === '') &&
      (!name || name.trim() === '') &&
      (!surname || surname.trim() === '') &&
      (!description || description.trim() === '')
    ) {
      return 'Provide at least one field to update: Username, Name, Surname or Description.';
    }
    return undefined;
  };

  /**
   * Handles form submission for updating the profile data
   * Send only the filled fields to the API
   */
  const handleUpdateProfile = async ({ username, name, surname, description }) => {
    setIsUpdatingProfile(true);

    const payload = {};
    if (username && username.trim() !== '') payload.username = username.trim();
    if (name && name.trim() !== '') payload.name = name.trim();
    if (surname && surname.trim() !== '') payload.surname = surname.trim();
    if (description && description.trim() !== '') payload.description = description.trim();

    try {
      await api.barber.updateBarberProfile(payload);
      await fetchProfile(); // Refresh profile after update
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  return (
    <>
      <div className={styles.barberSettings}>
        {/* Profile Update Card */}
        <StatCard icon="pen" label="Atualizar perfil">
          {/* Profile Picture Management */}
          <section className={styles.profileImageSection}>
            <ProfileImage src={profile.profile_image} size="15rem" />

            <div className={styles.imageAction}>
              <Button
                className={styles.actionBtn}
                type="button"
                color="primary"
                size="md"
                onClick={openUploadPicturePopup} //
              >
                <Icon name="plus" size="ty" />
                <span>Upload de imagens</span>
              </Button>

              <Button
                className={styles.actionBtn}
                type="button"
                color="translight"
                autoIconInvert
                size="md"
                onClick={openDeletePicturePopup} //
              >
                <Icon name="trash" size="ty" black />
                <span>Deletar imagens</span>
              </Button>
            </div>
          </section>

          {/* Profile Updating Management  */}
          <section className={styles.updateProfileSection}>
            <Form
              className={styles.updateProfileForm}
              initialFields={{ username: '', name: '', surname: '', description: '' }}
              onSubmit={handleUpdateProfile}
              validate={validateUpdateProfile} //
            >
              <div className={styles.inputGroup}>
                <Input
                  label="Nome de usuario"
                  name="username"
                  type="text"
                  placeholder={profile.username}
                  size="md"
                  disabled={isUpdatingProfile}
                />
                <Input
                  label="Descrição"
                  name="description"
                  type="text"
                  placeholder={profile.description}
                  size="md"
                  disabled={isUpdatingProfile}
                />
              </div>

              <div className={styles.inputGroup}>
                <Input
                  label="Nome"
                  name="name"
                  type="text"
                  placeholder={profile.name}
                  size="md"
                  disabled={isUpdatingProfile} //
                />
                <Input
                  label="Sobrenome"
                  name="surname"
                  type="text"
                  placeholder={profile.surname}
                  size="md"
                  disabled={isUpdatingProfile}
                />
              </div>

              <Button
                className={styles.saveBtn}
                type="submit"
                size="md"
                color="primary"
                disabled={isUpdatingProfile}
                wide //
              >
                <span className={styles.line}>
                  {isUpdatingProfile ? (
                    <>
                      <Spinner size="sm" /> Saving...
                    </>
                  ) : (
                    'Salvar Mudanças'
                  )}
                </span>
              </Button>

              <Error />
            </Form>
          </section>
        </StatCard>

        {/* Profile Delete Card */}
        <StatCard icon="trash" label="Excluir perfil">
          {/* Profile Deletion Management */}
          <section className={styles.deleteProfileSection}>
            <Button
              className={styles.actionBtn}
              type="button"
              color="translight"
              autoIconInvert
              size="md"
              onClick={openDeleteProfilePopup} //
            >
              <Icon name="warning" size="ty" black />
              <span>Deletar perfil</span>
            </Button>
          </section>
        </StatCard>
      </div>

      {/* Carregar imagem Modal */}
      <Modal
        open={uploadPicturePopup}
        fields={{ profile_image: null }}
        action={{ submit: 'Upload', loading: 'Uploading...' }}
        onValidate={(payload) => isAnyFieldSet(payload, 'Selecione uma imagem para enviar.')}
        onSubmit={({ profile_image }) => handleUploadPicture(profile_image)}
        onClose={closeUploadPicturePopup}
      >
        <Modal.Title icon="image">Carregar imagem</Modal.Title>
        <Modal.Description>Selecione uma imagem de perfil para carregar.</Modal.Description>

        <Input
          label="Profile Picture"
          name="profile_image"
          type="file"
          accept="image/*"
          placeholder="Escolha uma imagem" //
        />
      </Modal>

      {/* Delete Picture Modal */}
      <Modal
        open={deletePicturePopup}
        action={{ submit: 'Deletar', loading: 'Deletando...' }}
        onSubmit={handleDeletePicture}
        onClose={closeDeletePicturePopup}
      >
        <Modal.Title icon="warning">Delete Picture</Modal.Title>
        <Modal.Description>
          Tem certeza de que deseja excluir sua foto de perfil? Esta ação não pode ser desfeita.
        </Modal.Description>
      </Modal>

      {/* Excluir perfil Modal */}
      <Modal
        open={deleteProfilePopup}
        action={{ submit: 'Deletar', loading: 'Deletando...' }}
        onSubmit={handleDeleteProfile}
        onClose={closeDeleteProfilePopup}
      >
        <Modal.Title icon="warning">Excluir perfil</Modal.Title>
        <Modal.Description>Tem certeza de que deseja excluir seu perfil? Esta ação não pode ser desfeita.</Modal.Description>
      </Modal>
    </>
  );
}

export default BarberSettings;
