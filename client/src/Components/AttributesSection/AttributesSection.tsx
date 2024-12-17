import DeleteIcon from '@mui/icons-material/Delete';
import {
  Button,
  CardContent,
  Grid,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { AttributeType } from '../../Models';
import { getAllAttributeTypes } from '../../Services/AuthService';
import CreateAttributeTypeModal from '../CreateAttributeTypeModal/CreateAttributeTypeModal';
import SelectAttributeTypeModal from '../SelectAttributeTypeModal/SelectAttributeTypeModal';

type AttributesSectionProps = {
  attributes: { [id: string]: any };
  onChange: (attributes: { [id: string]: any }) => void;
};

const AttributesSection = (props: AttributesSectionProps) => {
  const [currentAttributesDraft, setCurrentAttributesDraft] = useState<{
    [id: string]: any;
  }>(props.attributes);
  const [allAttributeTypes, setAllAttributeTypes] = useState<AttributeType[]>(
    []
  );
  const [createAttributeModalIsShowing, setCreateAttributeModalIsShowing] =
    useState(false);
  const [
    selectNewAttributeTypeModalIsOpen,
    setSelectNewAttributeTypeModalIsOpen,
  ] = useState(false);

  const formatAttributes = (attributes: { [id: string]: any }) => {
    let formattedAttributes: { [id: string]: any } = {};
    for (const [key, value] of Object.entries(attributes)) {
      let attributeType = allAttributeTypes.find((type) => type.name == key);
      if (attributeType?.type == 'number') {
        formattedAttributes[key] = Number(value);
      } else {
        formattedAttributes[key] = value;
      }
    }
    return formattedAttributes;
  };

  const changeAttributesValue = (key: string, value?: any) => {
    let newAttributes = { ...currentAttributesDraft };
    newAttributes[key] = value ?? '';
    setCurrentAttributesDraft(newAttributes);
    props.onChange(formatAttributes(newAttributes));
  };

  const deleteAttribute = (key: string) => {
    let newAttributes = { ...currentAttributesDraft };
    delete newAttributes[key];
    setCurrentAttributesDraft(newAttributes);
    props.onChange(newAttributes);
  };

  const handleSelectNewAttributeTypeModalCompleted = (
    attributeType?: AttributeType
  ) => {
    setSelectNewAttributeTypeModalIsOpen(false);
    if (attributeType) {
      changeAttributesValue(attributeType.name);
    }
  };

  const handleAttributeValueChanged = (key: string, value: any) => {
    changeAttributesValue(key, value);
  };

  const generateAttributeComponents = () => {
    let components = [];
    for (const [key, _] of Object.entries(currentAttributesDraft ?? {})) {
      let attributeType = allAttributeTypes.find((type) => type.name == key);
      components.push(
        <Grid container key={key} paddingBottom={'20px'}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              id='outlined-name'
              label='Value'
              variant='outlined'
              InputLabelProps={{ shrink: true }}
              contentEditable={false}
              value={key}
            />
          </Grid>

          <Grid item xs={5}>
            {attributeType?.enumOptions ? (
              <Select
                fullWidth
                labelId={`${attributeType.id}-select-label`}
                id={`${attributeType.id}-select-label`}
                value={currentAttributesDraft[attributeType.name]}
                label='Attribute Value'
                onChange={(event) => {
                  if (attributeType) {
                    handleAttributeValueChanged(
                      attributeType.name,
                      event.target.value
                    );
                  }
                }}
              >
                {attributeType.enumOptions.map((option) => (
                  <MenuItem key={`enum-option-${option}`} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            ) : (
              <TextField
                fullWidth
                id='outlined-name'
                label='Value'
                variant='outlined'
                InputLabelProps={{ shrink: true }}
                value={currentAttributesDraft[key]}
                onChange={(event) =>
                  handleAttributeValueChanged(key, event.target.value)
                }
              />
            )}
          </Grid>

          <Grid item xs={1}>
            <IconButton onClick={() => deleteAttribute(key)}>
              <DeleteIcon />
            </IconButton>
          </Grid>
        </Grid>
      );
    }
    return <>{components}</>;
  };

  const loadAllAttributeTypes = async () => {
    let types = await getAllAttributeTypes();
    setAllAttributeTypes(types);
  };

  const handleCreateANewAttributeButtonClicked = () => {
    setCreateAttributeModalIsShowing(true);
  };

  const handleCreateAttributeTypeModalClosed = () => {
    loadAllAttributeTypes();
    setCreateAttributeModalIsShowing(false);
  };

  useEffect(() => {
    loadAllAttributeTypes();
  }, []);

  const handleAddAttributeButtonClicked = async () => {
    setSelectNewAttributeTypeModalIsOpen(true);
  };

  return (
    <CardContent>
      <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
        Attributes
      </Typography>

      {generateAttributeComponents()}

      <Button
        size='large'
        type='submit'
        variant='outlined'
        onClick={handleAddAttributeButtonClicked}
      >
        Add Attribute
      </Button>
      <Button
        size='large'
        type='submit'
        variant='outlined'
        onClick={handleCreateANewAttributeButtonClicked}
      >
        Create a New Attribute
      </Button>

      <CreateAttributeTypeModal
        open={createAttributeModalIsShowing}
        onCompletion={handleCreateAttributeTypeModalClosed}
      />

      <SelectAttributeTypeModal
        open={selectNewAttributeTypeModalIsOpen}
        onCompletion={handleSelectNewAttributeTypeModalCompleted}
        attributeTypes={allAttributeTypes.filter(
          (type) => currentAttributesDraft[type.name] === undefined
        )}
      />
    </CardContent>
  );
};

export default AttributesSection;
