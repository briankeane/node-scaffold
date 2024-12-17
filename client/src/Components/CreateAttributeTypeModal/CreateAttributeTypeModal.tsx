import DeleteIcon from '@mui/icons-material/Delete';
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
} from '@mui/material';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { handleError } from '../../Helpers/ErrorHandler';
import { AttributeType } from '../../Models';
import { createAttributeType } from '../../Services/AuthService';
import './CreateAttributeTypeModal.scss';

export type CreateAttributeTypeModalProps = {
  open: boolean;
  onCompletion: (type?: AttributeType[]) => void;
};

const CreateAttributeTypeModal = (props: CreateAttributeTypeModalProps) => {
  const _id = 'cmp-create-attribute';
  const [name, setName] = useState<string>('');
  const [attributeType, setAttributeType] = useState<string>('string');
  const [enumOptions, setEnumOptions] = useState<string[]>();

  const hasEnums = enumOptions !== undefined;

  const handleHasEnumsChanged = () => {
    enumOptions ? setEnumOptions(undefined) : setEnumOptions(['']);
  };

  const handleAddEnumButtonClicked = () => {
    setEnumOptions([...(enumOptions ?? []), '']);
  };

  const handleChangeAttributeType = (event: any) => {
    setAttributeType(event.target.value);
  };

  const handleChangeName = (e: any) => {
    setName(e.target.value);
  };

  const handleChangeEnumOption = (index: number, value: string) => {
    var copy = [...(enumOptions ?? [])];
    copy[index] = value;
    setEnumOptions(copy);
  };

  const handleCreateButtonClicked = async () => {
    if (enumOptions !== undefined) {
      if (attributeType == 'number') {
        for (let enumValue of enumOptions) {
          if (isNaN(Number(enumValue))) {
            toast.warning("All enums must be of the type 'number'.");
            return;
          }
        }
      }
    }
    try {
      let allAttributeTypes = await createAttributeType({
        name,
        type: attributeType,
        enumOptions,
      });
      props.onCompletion(allAttributeTypes);
    } catch (err) {
      handleError(err);
    }
  };

  const enumOptionBoxes = () => {
    return (enumOptions ?? []).map((option, index) => (
      <TextField
        style={{
          paddingBottom: '20px',
        }}
        key={`enumoptions-${index}`}
        id={`enumoptions-${index}`}
        label='Enum Option'
        variant='outlined'
        value={option}
        onChange={(e) => handleChangeEnumOption(index, e.target.value)}
      />
    ));
  };

  const enumSection = () => (
    <>
      {enumOptionBoxes()}

      <Button
        onClick={handleAddEnumButtonClicked}
        color='primary'
        size='large'
        type='submit'
        variant='contained'
      >
        Add Enum
      </Button>
      <IconButton>
        <DeleteIcon />
      </IconButton>
    </>
  );

  const clearAll = () => {
    setEnumOptions(undefined);
    setName('');
    setAttributeType('');
  };

  const handleCloseModalClicked = () => {
    clearAll();
    props.onCompletion();
  };

  return (
    <Modal open={props.open} onClose={handleCloseModalClicked} className={_id}>
      <div className={`${_id}__wrapper`}>
        <h2 className={`${_id}__title`} id='child-modal-title'>
          Add an Attribute
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

        <FormControl
          fullWidth
          style={{
            paddingBottom: '20px',
          }}
        >
          <InputLabel id='demo-simple-select-label'>Age</InputLabel>
          <Select
            labelId='demo-simple-select-label'
            id='demo-simple-select'
            value={attributeType}
            label='Age'
            onChange={handleChangeAttributeType}
          >
            <MenuItem value={'string'}>String</MenuItem>
            <MenuItem value={'number'}>Number</MenuItem>
            <MenuItem value={'boolean'}>Boolean</MenuItem>
            <MenuItem value={'enum'}>Enum</MenuItem>
          </Select>
        </FormControl>

        {attributeType != 'boolean' && (
          <>
            <FormControl
              fullWidth
              style={{
                paddingBottom: '20px',
              }}
            >
              {/* <InputLabel id='demo-simple-enum-label'>Has Enum Values</InputLabel> */}
              <FormControlLabel
                control={
                  <Checkbox
                    checked={hasEnums}
                    onChange={handleHasEnumsChanged}
                  />
                }
                label='Has Enums'
              />
            </FormControl>
          </>
        )}
        {hasEnums && enumSection()}

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

export default CreateAttributeTypeModal;
