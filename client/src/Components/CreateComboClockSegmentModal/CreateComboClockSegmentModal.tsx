import {
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Modal,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { handleError } from '../../Helpers/ErrorHandler';
import { Category, Clock } from '../../Models';
import {
  createComboClockSegment,
  getCategoriesForStation,
} from '../../Services/AuthService';
import './CreateComboClockSegmentModal.scss';

export type CreateComboClockSegmentModalProps = {
  clock: Clock;
  dropPosition?: number;
  open: boolean;
  onCompletion: (clock: Clock | undefined) => void;
};

const CreateComboClockSegmentModal = (
  props: CreateComboClockSegmentModalProps
) => {
  const _id = 'cmp-create-category';
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const loadCategories = async () => {
    if (props.clock.stationId) {
      try {
        setCategories(await getCategoriesForStation(props.clock.stationId));
      } catch (err) {
        handleError(err);
      }
    }
  };

  const handleCheckboxChange = (categoryId: string) => {
    setSelectedCategories((prevSelected) =>
      prevSelected.includes(categoryId)
        ? prevSelected.filter((id) => id !== categoryId)
        : [...prevSelected, categoryId]
    );
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleCreateComboButtonClicked = async () => {
    try {
      let newClock = await createComboClockSegment({
        clockId: props.clock.id,
        categoryIds: Array.from(selectedCategories),
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
          Create a Combo Clock Segment
        </h2>
        <FormGroup>
          {categories
            .sort((a, b) => (a.audioBlockType < b.audioBlockType ? -1 : 1))
            .map((category) => (
              <FormControlLabel
                key={`category-checkbox-${category.id}`}
                control={
                  <Checkbox
                    checked={selectedCategories.includes(category.id)}
                    onChange={() => handleCheckboxChange(category.id)}
                  />
                }
                label={`${category.name} - ${category.audioBlockType}`}
              />
            ))}
        </FormGroup>

        <Button
          onClick={handleCreateComboButtonClicked}
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

export default CreateComboClockSegmentModal;
