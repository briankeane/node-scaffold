import { Modal, Box, TextField, Button, FormControl } from '@mui/material';
import { useState } from 'react';
import { createStation } from '../../Services/AuthService';
import "./CreateStationModal.scss"
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

export type CreateStationModalProps = {
  open: boolean;
  onCompletion: () => void;
};

const CreateStationModal = (props: CreateStationModalProps) => {
  const _id = "cmp-create-station";
  const [stationName, setStationName] = useState('');
  const [curatorName, setCuratorName] = useState('');
  const [imageUrl, setImageUrl] = useState('https://');

  const handleChangeStationName = (e: any) => setStationName(e.target.value);
  const handleChangeCuratorName = (e: any) => setCuratorName(e.target.value);
  const handleChangeImageUrl = (e: any) => {
    setImageUrl(e.target.value);
  };
  const handleCreateStationButtonClicked = async () => {
    if (!stationName && !curatorName) return;
    await createStation({ name: stationName, curatorName, imageUrl });
    props.onCompletion();
  };

  const handleCloseModalClicked = () => {
    props.onCompletion();
  };

  return (
    <Modal open={props.open} onClose={handleCloseModalClicked} className={_id}>
      <Box sx={{ ...style, width: 200 }}>
        <h2 id='child-modal-title'>Enter Info For New Station</h2>
        <FormControl>
          <TextField
            style={{
              paddingBottom: '20px',
            }}
            id='outlined-name'
            label='Station Name'
            variant='outlined'
            value={stationName}
            onChange={handleChangeStationName}
          />

          <TextField
            style={{
              paddingBottom: '20px',
            }}
            id='curator-name-textfield'
            label='Curator Name'
            variant='outlined'
            value={curatorName}
            onChange={handleChangeCuratorName}
          />

          <TextField
            style={{
              paddingBottom: '20px',
            }}
            id='curator-name-textfield'
            label='Station Image Url'
            variant='outlined'
            value={imageUrl}
            onChange={handleChangeImageUrl}
          />
          <div className={`${_id}__actions`}>
            <Button onClick={handleCreateStationButtonClicked} color='primary'
              size='large' variant='contained'>
              Create Station
            </Button>
            <Button color='primary'
              size='large' variant='outlined' onClick={handleCloseModalClicked}>
              Cancel
            </Button>
          </div>
        </FormControl>
      </Box>
    </Modal>
  );
};

export default CreateStationModal;
