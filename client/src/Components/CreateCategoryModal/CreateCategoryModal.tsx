import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
} from '@mui/material';
import { useState } from 'react';
import { handleError } from '../../Helpers/ErrorHandler';
import { createCategory } from '../../Services/AuthService';
import './CreateCategoryModal.scss';

export type CreateCategoryModalProps = {
  stationId: string;
  open: boolean;
  onCompletion: () => void;
};

const CreateCategoryModal = (props: CreateCategoryModalProps) => {
  const _id = 'cmp-create-category';
  const [name, setName] = useState<string>('');
  const [audioBlockType, setAudioBlockType] = useState<string>('any');

  const handleChangeName = (e: any) => setName(e.target.value);
  const handleChangeAudioBlockType = (e: any) =>
    setAudioBlockType(e.target.value);

  const handleCreateCategoryButtonClicked = async () => {
    if (name === '') return;
    try {
      await createCategory({
        name,
        audioBlockType,
        stationId: props.stationId,
      });
    } catch (err) {
      handleError(err);
    }
    props.onCompletion();
  };

  const handleCloseModalClicked = () => {
    props.onCompletion();
  };

  return (
    <Modal open={props.open} onClose={handleCloseModalClicked} className={_id}>
      <div className={`${_id}__wrapper`}>
        <h2 className={`${_id}__title`} id='child-modal-title'>
          Create a Category
        </h2>
        <TextField
          style={{
            paddingBottom: '20px',
          }}
          id='outlined-name'
          label='Name'
          variant='outlined'
          value={name}
          onChange={handleChangeName}
        />
        <FormControl>
          <InputLabel shrink>AudioBlock</InputLabel>
          <Select
            labelId='demo-simple-select-label'
            id='demo-simple-select'
            value={audioBlockType}
            label='AudioBlock'
            onChange={handleChangeAudioBlockType}
            defaultValue='any'
          >
            <MenuItem value={'any'}>Any</MenuItem>
            <MenuItem value={'song'}>Song</MenuItem>
            <MenuItem value={'audioimage'}>Audio Image</MenuItem>
            <MenuItem value={'voicetrack'}>Voice Track</MenuItem>
            <MenuItem value={'commercialblock'}>Commercial Block</MenuItem>
            <MenuItem value={'productionpiece'}>Production Piece</MenuItem>
          </Select>
        </FormControl>
        <Button
          onClick={handleCreateCategoryButtonClicked}
          color='primary'
          size='large'
          type='submit'
          variant='contained'
        >
          Create
        </Button>
        <Button
          onClick={handleCloseModalClicked}
          color='primary'
          size='large'
          type='submit'
          variant='outlined'
        >
          Cancel
        </Button>
      </div>
    </Modal>
  );
};

export default CreateCategoryModal;
