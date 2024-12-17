import { Button, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import AttributesSection from '../../Components/AttributesSection/AttributesSection';
import Waveform, { WaveformData } from '../../Components/Waveform/Waveform';
import { handleError } from '../../Helpers/ErrorHandler';
import { AudioBlock } from '../../Models';
import {
  AudioBlockUpdateData,
  getAudioBlock,
  updateAudioBlock,
} from '../../Services/AuthService';
import './AudioBlockDetails.scss';

type AudioBlockDetailProps = {
  audioBlockId: string;
  onAudioBlockSaved?: (audioBlock: AudioBlock) => void;
};

const AudioBlockDetail = (props: AudioBlockDetailProps) => {
  const _id = 'audio-block-page';
  const { audioBlockId } = props;
  const [audioBlock, setAudioBlock] = useState<AudioBlock>();
  const [currentTimeMS, setCurrentTimeMS] = useState<number>(0);
  const [editableAudioBlock, setEditableAudioBlock] = useState<AudioBlock>();

  const handleAttributesChanged = (attributes: { [id: string]: any }) => {
    let copy = Object.assign({}, editableAudioBlock);
    if (copy) {
      copy.attributes = attributes;
      setEditableAudioBlock(copy);
    }
  };

  const loadAudioBlock = async () => {
    try {
      if (audioBlockId) {
        let audioBlock = await getAudioBlock(audioBlockId);
        setAudioBlock(audioBlock);
        setEditableAudioBlock(Object.assign({}, audioBlock));
      }
    } catch (err) {
      handleError(err);
    }
  };

  const unsavedMarkersChanged = (data: WaveformData) => {
    if (data.beginningOfOutroMS)
      updateEditableAudioBlock('beginningOfOutroMS', data.beginningOfOutroMS);
    if (data.endOfIntroMS)
      updateEditableAudioBlock('endOfIntroMS', data.endOfIntroMS);
    if (data.endOfMessageMS)
      updateEditableAudioBlock('endOfMessageMS', data.endOfMessageMS);
  };

  const handleSaveButtonClicked = async () => {
    if (audioBlock && editableAudioBlock) {
      let differentFields: string[] = Object.keys(editableAudioBlock).filter(
        (k) =>
          audioBlock[k as keyof AudioBlockUpdateData] !=
          editableAudioBlock[k as keyof AudioBlockUpdateData]
      );

      if (!differentFields.length) {
        toast.error('No Fields to update!');
        return;
      }

      let updateData: AudioBlockUpdateData = {};
      for (let field of differentFields) {
        updateData[field as keyof AudioBlockUpdateData] = editableAudioBlock[
          field as keyof AudioBlockUpdateData
        ] as any;
      }
      try {
        let updatedAudioBlock = await updateAudioBlock(
          audioBlock.id,
          updateData
        );
        setAudioBlock(updatedAudioBlock);
        props.onAudioBlockSaved?.(updatedAudioBlock);
        toast.success('AudioBlock updated successfully!');
      } catch (err) {
        handleError(err);
      }
    }
  };

  useEffect(() => {
    loadAudioBlock();
  }, []);

  const updateEditableAudioBlock = async (
    propName: keyof AudioBlock,
    value: any
  ) => {
    await setEditableAudioBlock((prev) => {
      return {
        ...prev,
        ...{
          [propName]: value,
        },
      } as AudioBlock;
    });
  };

  if (!audioBlock) return <></>;
  return (
    <>
      <div className={_id} key={audioBlockId}>
        <div className='common-wrapper'>
          <div className={`${_id}__actions`}></div>
          <br />
          <div className={`${_id}__details`}>
            <h1 className={`${_id}__details--title`}>
              AudioBlock: <span>{audioBlock?.title}</span>
            </h1>
            {audioBlock && editableAudioBlock && (
              <Waveform
                audioUrl={audioBlock.downloadUrl}
                endOfIntroMS={editableAudioBlock.endOfIntroMS}
                endOfMessageMS={editableAudioBlock.endOfMessageMS}
                beginningOfOutroMS={editableAudioBlock.beginningOfOutroMS}
                onMarkerChange={unsavedMarkersChanged}
                onPlaybackCurrentTimeChange={(currentTimeSecs: number) =>
                  setCurrentTimeMS(Math.round(currentTimeSecs * 1000))
                }
              ></Waveform>
            )}

            <div className={`${_id}__action-controls`}>
              <div className={`${_id}__action-block`}>
                <p className={`${_id}__action-block--label`}>Current</p>
                <div className={`${_id}__action-block--mark`}>
                  <p className={`${_id}__action-block--value`}>
                    {currentTimeMS} ms
                  </p>
                </div>
              </div>
              <div className={`${_id}__action-block`}>
                <p className={`${_id}__action-block--label`}>End of Intro</p>
                <div className={`${_id}__action-block--mark`}>
                  <p className={`${_id}__action-block--value`}>
                    {editableAudioBlock?.endOfIntroMS} ms
                  </p>
                  <Button
                    variant='outlined'
                    onClick={() => {
                      unsavedMarkersChanged({ endOfIntroMS: currentTimeMS });
                    }}
                  >
                    Set End
                  </Button>
                </div>
              </div>
              <div className={`${_id}__action-block`}>
                <p className={`${_id}__action-block--label`}>
                  Beginning of Outro
                </p>
                <div className={`${_id}__action-block--mark`}>
                  <p className={`${_id}__action-block--value`}>
                    {editableAudioBlock?.beginningOfOutroMS} ms
                  </p>
                  <Button
                    variant='outlined'
                    onClick={() => {
                      unsavedMarkersChanged({
                        beginningOfOutroMS: currentTimeMS,
                      });
                    }}
                  >
                    Set Beginning
                  </Button>
                </div>
              </div>

              <div className={`${_id}__action-block`}>
                <p className={`${_id}__action-block--label`}>End of Message</p>
                <div className={`${_id}__action-block--mark`}>
                  <p className={`${_id}__action-block--value`}>
                    {editableAudioBlock?.endOfMessageMS} ms
                  </p>
                  <Button
                    variant='outlined'
                    onClick={() => {
                      unsavedMarkersChanged({ endOfMessageMS: currentTimeMS });
                    }}
                  >
                    Set End Of Message
                  </Button>
                </div>
              </div>
            </div>
            <div className={`${_id}__fields`}>
              <TextField
                id='outlined-name'
                label='Title'
                variant='outlined'
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={editableAudioBlock?.title}
                onChange={(event) =>
                  updateEditableAudioBlock('title', event.target.value)
                }
              />
              <TextField
                id='outlined-name'
                label='Artist'
                variant='outlined'
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={editableAudioBlock?.artist}
                onChange={(event) =>
                  updateEditableAudioBlock('artist', event.target.value)
                }
              />
              <TextField
                id='outlined-name'
                label='Album'
                variant='outlined'
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={editableAudioBlock?.album}
                onChange={(event) =>
                  updateEditableAudioBlock('album', event.target.value)
                }
              />
              <TextField
                id='outlined-name'
                label='Image Url'
                variant='outlined'
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={editableAudioBlock?.imageUrl}
                onChange={(event) =>
                  updateEditableAudioBlock('imageUrl', event.target.value)
                }
              />
            </div>

            <AttributesSection
              attributes={editableAudioBlock?.attributes ?? {}}
              onChange={handleAttributesChanged}
            />

            <Button
              color='primary'
              size='large'
              type='submit'
              variant='contained'
              onClick={handleSaveButtonClicked}
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AudioBlockDetail;
