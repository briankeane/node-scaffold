import { Button, Modal, TextField } from '@mui/material';
import { useState } from 'react';
import { handleError } from '../../Helpers/ErrorHandler';
import { Clock } from '../../Models';
import { createSnycClockSegment } from '../../Services/AuthService';
import './CreateSyncClockSegmentModal.scss';

export type CreateSyncClockSegmentModalProps = {
  clock: Clock;
  dropPosition?: number;
  open: boolean;
  onCompletion: (clock: Clock | undefined) => void;
};

const CreateSyncClockSegmentModal = (
  props: CreateSyncClockSegmentModalProps
) => {
  const _id = 'cmp-create-category';
  const [minutes, setMinutes] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);

  const handleChangeMinutes = (e: any) => setMinutes(e.target.value);
  const handleChangeSeconds = (e: any) => setSeconds(e.target.value);

  const handleCreateSyncButtonClicked = async () => {
    let syncTimeMS = minutes * 60 * 1000 + seconds * 1000;
    try {
      let newClock = await createSnycClockSegment({
        clockId: props.clock.id,
        syncTimeMS,
      });
      props.onCompletion(newClock);
    } catch (err) {
      handleError(err);
    }
  };

  const handleCloseModalClicked = () => {
    props.onCompletion(undefined);
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
          id='outlined-minutes'
          label='Minutes'
          variant='outlined'
          value={minutes}
          onChange={handleChangeMinutes}
        />
        <TextField
          style={{
            paddingBottom: '20px',
          }}
          id='outlined-seconds'
          label='Seconds'
          variant='outlined'
          value={seconds}
          onChange={handleChangeSeconds}
        />

        <Button
          onClick={handleCreateSyncButtonClicked}
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

export default CreateSyncClockSegmentModal;
