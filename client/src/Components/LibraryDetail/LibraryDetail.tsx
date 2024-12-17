import { GridReadyEvent, RowDropZoneParams } from '@ag-grid-community/core';
import { Button, TextField, Typography } from '@mui/material';
import { ReactElement, useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleError } from '../../Helpers/ErrorHandler';
import { AudioBlock, Category, Station } from '../../Models';
import {
  addAudioBlocksToCategory,
  getAllAudioImagesForStation,
  getAllSongs,
  getCategoriesForStation,
  searchAudioBlocks,
} from '../../Services/AuthService';
import AudioBlockTable from '../AudioBlockTable/AudioBlockTable';
import CreateCategoryModal from '../CreateCategoryModal/CreateCategoryModal';
import './LibraryDetail.scss';

type LibraryDetailProps = {
  station: Station;
};

enum SongListType {
  songs = 'Songs',
  audioImages = 'Audio Images',
  category = 'Category',
  productionPieces = 'Production Pieces',
  voiceTracks = 'VoiceTracks',
}

const LibraryDetail = (props: LibraryDetailProps) => {
  const _id = 'cmp-library-details';
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [songListType, setSongListType] = useState(SongListType.songs);
  const [allSongs, setAllSongs] = useState<AudioBlock[]>([]);
  const [allAudioImages, setAllAudioImages] = useState<AudioBlock[]>([]);
  const [allProductionPieces, setAllProductionPieces] = useState<AudioBlock[]>(
    []
  );
  const [allVoiceTracks, setAllVoiceTracks] = useState<AudioBlock[]>([]);
  const [songListFilterText, setSongListFilterText] = useState<string>('');

  const [createCategoryModalIsOpen, setCreateCategoryModalIsOpen] =
    useState(false);

  const [selectedCategory, setSelectedCategory] = useState<Category>();
  const [gridReadyEvent, setGridReadyEvent] = useState<GridReadyEvent>();

  const [loadingSongs, setLoadingSongs] = useState<boolean>(false);

  const categoryButtons: ReactElement[] = categories.map((category) => {
    return (
      <Button
        key={category.id}
        variant='outlined'
        id={`category-button-${category.id}`}
        onClick={() => handleCategoryDetailButtonClicked(category)}
      >
        <Typography>
          {category.name} -- {category.audioBlocks.length}
        </Typography>
      </Button>
    );
  });

  const loadCategories = async () => {
    try {
      setCategories(await getCategoriesForStation(props.station.id));
    } catch (err) {
      handleError(err);
    }
  };

  const loadAllSongs = async () => {
    try {
      setAllSongs(await getAllSongs());
    } catch (err) {
      handleError(err);
    }
  };

  const loadVoiceTracks = async () => {
    try {
      setAllVoiceTracks(await searchAudioBlocks({ type: 'voicetrack' }));
    } catch (err) {
      handleError(err);
    }
  };

  const loadProductionPieces = async () => {
    try {
      setAllProductionPieces(
        await searchAudioBlocks({ type: 'productionpiece' })
      );
    } catch (err) {
      handleError(err);
    }
  };

  const loadAudioImages = async () => {
    try {
      setAllAudioImages(await getAllAudioImagesForStation(props.station.id));
    } catch (err) {
      handleError(err);
    }
  };

  const loadAll = async () => {
    try {
      await Promise.all([
        loadCategories(),
        loadAllSongs(),
        loadAudioImages(),
        loadVoiceTracks(),
        loadProductionPieces(),
      ]);
    } catch (err) {
      handleError(err);
    }
  };

  const handleCategoryCreationCompleted = () => {
    setCreateCategoryModalIsOpen(false);
    loadCategories();
  };

  const handleCreateCategoryButtonClicked = () => {
    setCreateCategoryModalIsOpen(true);
  };

  const handleCategoryDetailButtonClicked = (category: Category) => {
    setSelectedCategory(category);
    setSongListType(SongListType.category);
  };

  const handleAllSongsButtonClicked = () => {
    setSongListType(SongListType.songs);
  };

  const handleChangeSongListButtonClicked = (songListType: SongListType) => {
    setSongListType(songListType);
  };

  const handleAudioBlockSelected = (audioBlockId: string) => {
    navigate(`/audioBlocks/${audioBlockId}`);
  };

  const handleChangeSongListFilterText = (e: any) => {
    setSongListFilterText(e.target.value);
  };

  var songListName: string = '';
  var activeAudioBlocksList: AudioBlock[] = [];

  const setupSonglist = () => {
    let tempActiveAudioBlocksList: AudioBlock[] = [];

    switch (songListType) {
      case SongListType.audioImages:
        songListName = SongListType.audioImages;
        tempActiveAudioBlocksList = allAudioImages;
        break;
      case SongListType.songs:
        songListName = SongListType.songs;
        tempActiveAudioBlocksList = allSongs;
        break;
      case SongListType.productionPieces:
        songListName = SongListType.productionPieces;
        tempActiveAudioBlocksList = allProductionPieces;
        break;
      case SongListType.voiceTracks:
        songListName = SongListType.voiceTracks;
        tempActiveAudioBlocksList = allVoiceTracks;
        break;
      case SongListType.category:
        songListName = selectedCategory?.name ?? 'No Category Selected';
        tempActiveAudioBlocksList = selectedCategory?.audioBlocks ?? [];
    }

    if (songListFilterText.length) {
      tempActiveAudioBlocksList = tempActiveAudioBlocksList.filter(
        (audioBlock) => {
          let searchWords: string[] = songListFilterText.split(' ');
          for (let word of searchWords) {
            if (
              !audioBlock.title.toLowerCase().includes(word.toLowerCase()) &&
              !audioBlock.artist.toLowerCase().includes(word.toLowerCase())
            ) {
              return false;
            }
          }
          return true;
        }
      );
    }
    activeAudioBlocksList = tempActiveAudioBlocksList;
  };

  setupSonglist();

  useEffect(() => {
    loadAll();
  }, []);

  useEffect(() => {
    setupSonglist();
  }, [songListFilterText]);

  useEffect(() => {
    if (categories.length && gridReadyEvent) {
      for (let category of categories) {
        addDropZoneForCategory(gridReadyEvent, category);
      }
      // also replace the selected category, which may have the old audioBlocks
      if (selectedCategory) {
        setSelectedCategory(
          categories.find((category) => category.id == selectedCategory.id)
        );
      }
    }
  }, [categories, gridReadyEvent]);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    setGridReadyEvent(params);
  }, []);

  function addDropZoneForCategory(params: GridReadyEvent, category: Category) {
    var tileContainer = document.querySelector(
      `#category-button-${category.id}`
    ) as HTMLElement;
    var dropZone: RowDropZoneParams = {
      getContainer: () => {
        return tileContainer as any;
      },
      onDragEnter: () => {
        tileContainer.style.transform = 'scale(1.2)';
      },
      onDragLeave: () => {
        tileContainer.style.transform = 'scale(1.0)';
      },
      onDragStop: async (api) => {
        tileContainer.style.transform = 'scale(1.0)';
        const audioBlockIds = api.nodes.map((node) => node.data.id);
        setLoadingSongs(true);
        try {
          setCategories(
            await addAudioBlocksToCategory(
              category.stationId,
              category.id,
              audioBlockIds
            )
          );
          setLoadingSongs(false);
        } catch (err) {
          handleError(err);
          setLoadingSongs(false);
        }
      },
    };
    params.api.removeRowDropZone(dropZone); // in case this is refreshing the categories list
    params.api.addRowDropZone(dropZone);
  }

  return (
    <div className={_id}>
      <div className={`${_id}__actions`}>
        <Button
          color='primary'
          size='large'
          type='submit'
          variant='contained'
          onClick={() => {
            handleAllSongsButtonClicked();
          }}
        >
          All Songs
        </Button>

        <Button
          color='primary'
          size='large'
          type='submit'
          variant='contained'
          onClick={() => {
            handleChangeSongListButtonClicked(SongListType.audioImages);
          }}
        >
          Audio Images
        </Button>

        <Button
          color='primary'
          size='large'
          type='submit'
          variant='contained'
          onClick={() => {
            handleChangeSongListButtonClicked(SongListType.productionPieces);
          }}
        >
          Production Pieces
        </Button>

        <Button
          color='primary'
          size='large'
          type='submit'
          variant='contained'
          onClick={() => {
            handleChangeSongListButtonClicked(SongListType.voiceTracks);
          }}
        >
          VoiceTracks
        </Button>

        <Button
          color='primary'
          size='large'
          type='submit'
          variant='contained'
          id='create-category-button'
          onClick={() => handleCreateCategoryButtonClicked()}
        >
          Create Category
        </Button>
      </div>
      {categoryButtons && (
        <div className={`${_id}__category-buttons`}>{categoryButtons}</div>
      )}

      <h1 className={`${_id}__title`}>Displaying: {songListName}</h1>

      <TextField
        style={{
          paddingBottom: '20px',
          paddingRight: '10px',
        }}
        id='outlined-name'
        label='Filter'
        variant='outlined'
        className={`${_id}__input-filter`}
        value={songListFilterText}
        onChange={handleChangeSongListFilterText}
      />

      <Button
        color='primary'
        size='large'
        type='submit'
        variant='contained'
        onClick={() => {
          setSongListFilterText('');
        }}
      >
        Clear Filter
      </Button>

      {allSongs.length && (
        <div style={{ height: '500px' }}>
          <AudioBlockTable
            audioBlocks={activeAudioBlocksList}
            onGridReady={onGridReady}
            onAudioBlockSelected={handleAudioBlockSelected}
            loading={loadingSongs}
          />
        </div>
      )}
      <CreateCategoryModal
        stationId={props.station.id}
        open={createCategoryModalIsOpen}
        onCompletion={handleCategoryCreationCompleted}
      />
    </div>
  );
};

export default LibraryDetail;
