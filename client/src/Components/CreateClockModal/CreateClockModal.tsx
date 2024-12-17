import { Box, Button, Modal, TextField } from '@mui/material';
import { useState } from 'react';
import { handleError } from '../../Helpers/ErrorHandler';
import { Station } from '../../Models';
import { createClock } from '../../Services/AuthService';
import './CreateClockModal.scss';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

export type CreateClockModalProps = {
  open: boolean;
  station: Station;
  onCompletion: () => void;
};

const CreateClockModal = (props: CreateClockModalProps) => {
  const _id = 'cmp-create-clock';
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleChangeClockName = (e: any) => setName(e.target.value);
  const handleChangeClockDescription = (e: any) =>
    setDescription(e.target.value);

  const clearAllTextFields = () => {
    setName('');
    setDescription('');
  };

  const handleCreateClockButtonClicked = async () => {
    try {
      await createClock({ name, description, stationId: props.station.id });
      clearAllTextFields();
      props.onCompletion();
    } catch (err) {
      handleError(err);
    }
  };

  const handleCloseModalClicked = () => {
    clearAllTextFields();
    props.onCompletion();
  };

  return (
    <Modal open={props.open} onClose={handleCloseModalClicked}>
      <Box sx={{ ...style, width: 300 }} className={`${_id}__wrapper`}>
        <h2 id='child-modal-title'>Enter Info For New Station</h2>
        <TextField
          style={{
            paddingBottom: '20px',
          }}
          id='outlined-name'
          label='Name'
          variant='outlined'
          value={name}
          fullWidth
          onChange={handleChangeClockName}
        />

        <TextField
          style={{
            paddingBottom: '20px',
          }}
          id='curator-name-textfield'
          label='Description'
          variant='outlined'
          multiline
          fullWidth
          rows={2}
          value={description}
          onChange={handleChangeClockDescription}
        />

        <Button
          onClick={handleCreateClockButtonClicked}
          variant='contained'
          size='large'
        >
          Create Clock
        </Button>
        <Button
          onClick={handleCloseModalClicked}
          variant='outlined'
          size='large'
        >
          Cancel
        </Button>
      </Box>
    </Modal>
  );
};

export default CreateClockModal;
