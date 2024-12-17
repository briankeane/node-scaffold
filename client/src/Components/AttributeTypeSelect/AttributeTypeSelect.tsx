import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { AttributeType } from '../../Models';

type AttributeTypeSelectProps = {
  onChange: (attributeType: AttributeType) => void;
  attributeTypes: AttributeType[];
  selectedAttributeType?: AttributeType;
};
const AttributeTypeSelect = (props: AttributeTypeSelectProps) => {
  const handleSelectedAttributeTypeChanged = (event: any) => {
    let newValue = props.attributeTypes.find(
      (attributeType) => attributeType.name == event.target.value
    );
    if (newValue) props.onChange(newValue);
  };

  return (
    <FormControl>
      <InputLabel shrink>AttributeType</InputLabel>
      <Select
        labelId='demo-simple-select-label'
        id='demo-simple-select'
        value={props.selectedAttributeType?.name ?? ''}
        label='Attribute Name'
        onChange={handleSelectedAttributeTypeChanged}
      >
        {props.attributeTypes.map((attributeType) => (
          <MenuItem
            key={`attributetype-select-option-${attributeType.name}`}
            value={attributeType.name}
          >
            {attributeType.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default AttributeTypeSelect;
