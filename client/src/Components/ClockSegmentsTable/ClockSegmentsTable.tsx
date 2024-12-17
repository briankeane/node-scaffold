import { useState } from 'react';

import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { GridReadyEvent, ModuleRegistry } from '@ag-grid-community/core';
import { AgGridReact } from '@ag-grid-community/react';

import { Button } from '@mui/material';
import { Clock, ClockSegment } from '../../Models';

ModuleRegistry.registerModules([ClientSideRowModelModule]);

import '@ag-grid-community/styles/ag-grid.css';
import '@ag-grid-community/styles/ag-theme-quartz.css';
import { handleError } from '../../Helpers/ErrorHandler';
import {
  createClockSegment,
  deleteClockSegment,
  editClockSegment,
} from '../../Services/AuthService';
import CreateComboClockSegmentModal from '../CreateComboClockSegmentModal/CreateComboClockSegmentModal';
import CreateSyncClockSegmentModal from '../CreateSyncClockSegmentModal/CreateSyncClockSegmentModal';
import CreateTemporaryRuleClockSegmentModal from '../CreateTemporaryRuleClockSegmentModal/CreateTemporaryRuleClockSegmentModal';

type ClockSegmentsTableProps = {
  clock: Clock;
  onGridReady: (params: GridReadyEvent) => void;
  onClockChange: (clock: Clock) => void;
};

function ClockSegmentsTable(props: ClockSegmentsTableProps) {
  const [segmentBeingDragged, setSegmentBeingDragged] =
    useState<ClockSegment>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showCreateSyncSegmentModal, setShowCreateSyncSegmentModal] =
    useState(false);
  const [
    showCreateTemporaryRuleSegmentModal,
    setShowCreateTemporaryRuleSegmentModal,
  ] = useState(false);
  const [showCreateComboSegmentModal, setShowCreateComboSegmentModal] =
    useState<boolean>(false);

  const handleDragEnter = (data: any) => {
    let segment = props.clock.clockSegments[data.overIndex];
    setSegmentBeingDragged(segment);
  };

  const handleDragEnd = async (data: any) => {
    let droppedOnSegment = props.clock.clockSegments[data.overIndex];
    if (segmentBeingDragged) {
      setIsLoading(true);
      try {
        let newClock = await editClockSegment({
          clockId: props.clock.id,
          position: droppedOnSegment.position,
          segmentId: segmentBeingDragged.id,
        });
        props.onClockChange(newClock);
      } catch (err) {
        handleError(err);
      }
      setSegmentBeingDragged(undefined);
      setIsLoading(false);
    }
  };

  const handleGridDragOver = (event: any) => {
    const dragSupported = event.dataTransfer.types.length;
    if (dragSupported) {
      event.dataTransfer.dropEffect = 'copy';
      event.preventDefault();
    }
  };

  const handleClockSegmentCreationCompleted = (clock?: Clock) => {
    if (clock) {
      props.onClockChange(clock);
    }
    setShowCreateSyncSegmentModal(false);
    setShowCreateTemporaryRuleSegmentModal(false);
    setShowCreateComboSegmentModal(false);
  };

  const removeCategorySegment = async (segmentId: string) => {
    setIsLoading(true);
    try {
      let newClock = await deleteClockSegment({
        clockId: props.clock.id,
        segmentId,
      });
      props.onClockChange(newClock);
    } catch (err) {
      handleError(err);
    }
    setIsLoading(false);
  };

  const actionCellRenderer = (params: any) => {
    return (
      <Button
        style={{ backgroundColor: 'red', color: 'white' }}
        onClick={() => removeCategorySegment(params.data.id)}
      >
        Delete
      </Button>
    );
  };

  const handleGridDrop = async (event: any) => {
    event.preventDefault();
    const jsonData = event.dataTransfer.getData('application/json');
    const data = JSON.parse(jsonData);

    if (!data) return;

    if (data.type == 'sync') {
      setShowCreateSyncSegmentModal(true);
      return;
    }

    if (data.type == 'temporaryRule') {
      setShowCreateTemporaryRuleSegmentModal(true);
      return;
    }

    if (data.type == 'combo') {
      setShowCreateComboSegmentModal(true);
      return;
    }

    setIsLoading(true);
    try {
      let newClock = await createClockSegment(data);
      props.onClockChange(newClock);
    } catch (err) {
      handleError(err);
    }
    setIsLoading(false);
  };

  const [colDefs] = useState([
    { field: 'position', rowDrag: true, flex: 1 },
    { field: 'startTime', flex: 1 },
    { field: 'length' },
    { field: 'name' },
    {
      headerName: 'action',
      minWidth: 150,
      cellRenderer: actionCellRenderer,
      editable: false,
      colId: 'action',
    },
  ]);

  const [defaultColDef, _] = useState({
    flex: 1,
  });

  return (
    <>
      <div
        className='ag-theme-quartz' // applying the grid theme
        style={{ height: '70vh', width: '100%' }} // the grid will fill the size of the parent container
        onDragOver={handleGridDragOver}
        onDrop={handleGridDrop}
      >
        <AgGridReact
          rowSelection='multiple'
          rowDragManaged={true}
          rowData={props.clock.clockSegments ?? []}
          columnDefs={colDefs}
          defaultColDef={defaultColDef}
          onGridReady={props.onGridReady}
          onRowDragEnter={handleDragEnter}
          onRowDragEnd={handleDragEnd}
          animateRows={true}
          loading={isLoading}
        />

        <CreateSyncClockSegmentModal
          clock={props.clock}
          open={showCreateSyncSegmentModal}
          onCompletion={handleClockSegmentCreationCompleted}
        />

        <CreateTemporaryRuleClockSegmentModal
          clock={props.clock}
          open={showCreateTemporaryRuleSegmentModal}
          onCompletion={handleClockSegmentCreationCompleted}
        />

        <CreateComboClockSegmentModal
          clock={props.clock}
          open={showCreateComboSegmentModal}
          onCompletion={handleClockSegmentCreationCompleted}
        />
      </div>
    </>
  );
}

export default ClockSegmentsTable;
