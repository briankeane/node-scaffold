import { useState } from 'react';

import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { GridReadyEvent, ModuleRegistry } from '@ag-grid-community/core';
import { AgGridReact } from '@ag-grid-community/react';

import { AudioBlock } from '../../Models';

ModuleRegistry.registerModules([ClientSideRowModelModule]);

import '@ag-grid-community/styles/ag-grid.css';
import '@ag-grid-community/styles/ag-theme-quartz.css';

type AudioBlockTableProps = {
  audioBlocks: AudioBlock[];
  loading: boolean;
  onGridReady: (params: GridReadyEvent) => void;
  onAudioBlockSelected: (audioBlockId: string) => void;
};

function AudioBlockTable(props: AudioBlockTableProps) {
  const [colDefs] = useState([
    { field: 'title', rowDrag: true, flex: 4 },
    { field: 'artist', flex: 4 },
    { field: 'album' },
    { field: 'durationMS' },
    { field: 'popularity' },
    { field: 'durationMS' },
    { field: 'isrc' },
    { field: 'spotifyId' },
    { field: 'imageUrl' },
    { field: 'type' },
    { field: 'id' },
  ]);

  const [defaultColDef, _] = useState({
    flex: 1,
  });

  const handleRowDoubleClicked = (api: any) => {
    props.onAudioBlockSelected(api.data.id);
  };

  return (
    <>
      <div
        className='ag-theme-quartz' // applying the grid theme
        style={{ height: '100%', width: '100%' }} // the grid will fill the size of the parent container
      >
        <AgGridReact
          rowSelection='multiple'
          rowDragManaged={false}
          rowData={props.audioBlocks}
          columnDefs={colDefs}
          defaultColDef={defaultColDef}
          onGridReady={props.onGridReady}
          rowDragMultiRow={true}
          onRowDoubleClicked={handleRowDoubleClicked}
          loading={props.loading}
        />
      </div>
    </>
  );
}

export default AudioBlockTable;
