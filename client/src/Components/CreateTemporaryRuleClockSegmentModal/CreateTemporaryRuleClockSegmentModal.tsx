import { Button, Modal, TextField } from '@mui/material';
import { useState } from 'react';
import { handleError } from '../../Helpers/ErrorHandler';
import { Clock, TemporaryRuleAttributes } from '../../Models';
import { createTemporaryRuleClockSegment } from '../../Services/AuthService';
import TemporaryRuleSection from '../TemporaryRuleSection/TemporaryRuleSection';
import './CreateTemporaryRuleClockSegmentModal.scss';

export type CreateTemporaryRuleSegmentModalProps = {
  clock: Clock;
  dropPosition?: number;
  open: boolean;
  onCompletion: (clock: Clock | undefined) => void;
};

const CreateTemporaryRuleClockSegmentModal = (
  props: CreateTemporaryRuleSegmentModalProps
) => {
  const _id = 'cmp-create-category';

  const [temporaryRule, setTemporaryRule] = useState({
    numberOfSpins: 1,
    attributes: {},
  });

  const handleCreateButtonClicked = async () => {
    try {
      let newClock = await createTemporaryRuleClockSegment({
        clockId: props.clock.id,
        temporaryRule,
      });
      props.onCompletion(newClock);
    } catch (err) {
      handleError(err);
    }
  };

  const handleAttributeRulesChanged = (
    temporaryRuleAttributes?: TemporaryRuleAttributes
  ) => {
    let copy = { ...temporaryRule, attributes: temporaryRuleAttributes ?? {} };
    // temporaryRule.attributes = temporaryRuleAttributes ?? {};
    setTemporaryRule(copy);
  };

  const handleChangeNumberOfSpins = (event: any) => {
    try {
      const numberAsNumber = Number(event.target.value);
      let copy = { ...temporaryRule, numberOfSpins: numberAsNumber };
      setTemporaryRule(copy);
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
          Create a Temporary Rule
        </h2>

        <TextField
          style={{
            paddingBottom: '20px',
          }}
          id='outlined-name'
          label='Number of Spins To Apply Rule'
          variant='outlined'
          value={temporaryRule.numberOfSpins}
          onChange={handleChangeNumberOfSpins}
        />

        <TemporaryRuleSection onChange={handleAttributeRulesChanged} />

        <Button
          onClick={handleCreateButtonClicked}
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

export default CreateTemporaryRuleClockSegmentModal;
