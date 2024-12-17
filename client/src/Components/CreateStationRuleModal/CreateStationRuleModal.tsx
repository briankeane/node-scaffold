import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
} from '@mui/material';
import { useState } from 'react';
import { handleError } from '../../Helpers/ErrorHandler';
import { Category } from '../../Models';
import { StationRule } from '../../Models/StationRule';
import { createStationRule } from '../../Services/AuthService';
import './CreateStationRuleModal.scss';

const propertyChoices = ['id', 'artist'];

export type CreateStationRuleModalProps = {
  categories: Category[];
  stationId: string;
  open: boolean;
  onCompletion: (stationRule?: StationRule) => void;
};

const CreateStationRuleModal = (props: CreateStationRuleModalProps) => {
  const _id = 'cmp-create-category';

  const [property, setProperty] = useState<string>(propertyChoices[0]);
  const [restDurationMinutes, setRestDurationMinutes] = useState<number>(30);
  const [excludedCategoryIds, setExcludedCategoryIds] = useState<string[]>([]);

  const resetState = () => {
    setExcludedCategoryIds([]);
    setProperty(propertyChoices[0]);
    setRestDurationMinutes(30);
  };

  const finishModal = (stationRule?: StationRule) => {
    resetState();
    props.onCompletion(stationRule);
  };

  const handleCreateButtonClicked = async () => {
    try {
      let stationRule = await createStationRule({
        stationId: props.stationId,
        property,
        restDurationMinutes,
        excludedCategoryIds,
      });
      finishModal(stationRule);
    } catch (err) {
      handleError(err);
    }
  };

  const handleChangeProperty = (event: any) => {
    setProperty(event.target.value);
  };

  const handleCheckboxChange = (categoryId: string) => {
    setExcludedCategoryIds((prevSelected) =>
      prevSelected.includes(categoryId)
        ? prevSelected.filter((id) => id !== categoryId)
        : [...prevSelected, categoryId]
    );
  };

  const handleChangeRestDurationMinutes = (event: any) => {
    try {
      const numberAsNumber = Number(event.target.value);
      setRestDurationMinutes(numberAsNumber);
    } catch (err) {
      handleError(err);
    }
  };

  const handleCloseModalClicked = () => {
    finishModal();
  };

  return (
    <Modal open={props.open} onClose={handleCloseModalClicked} className={_id}>
      <div className={`${_id}__wrapper`}>
        <h2 className={`${_id}__title`} id='child-modal-title'>
          Create a Station Rule
        </h2>

        <TextField
          style={{
            paddingBottom: '20px',
          }}
          id='outlined-name'
          label='Rest Duration (Minutes)'
          variant='outlined'
          value={restDurationMinutes}
          onChange={handleChangeRestDurationMinutes}
        />

        <FormGroup>
          <InputLabel shrink>Included Categories</InputLabel>
          {props.categories
            .sort((a, b) => (a.audioBlockType < b.audioBlockType ? -1 : 1))
            .map((category) => (
              <FormControlLabel
                key={`category-checkbox-${category.id}`}
                control={
                  <Checkbox
                    checked={!excludedCategoryIds.includes(category.id)}
                    onChange={() => handleCheckboxChange(category.id)}
                  />
                }
                label={`${category.name} - ${category.audioBlockType}`}
              />
            ))}
        </FormGroup>

        <FormControl>
          <InputLabel shrink>AudioBlock</InputLabel>
          <Select
            labelId='demo-simple-select-label'
            id='demo-simple-select'
            value={property}
            label='AudioBlock'
            onChange={handleChangeProperty}
            defaultValue='any'
          >
            {propertyChoices.map((choice) => (
              <MenuItem key={`key-${choice}`} value={choice}>
                {choice}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

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

export default CreateStationRuleModal;
