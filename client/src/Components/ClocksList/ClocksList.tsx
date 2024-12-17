import { Button } from '@mui/material';
import { useEffect, useState } from 'react';
import ClockImage from '../../Assets/clock.svg';
import SettingsImage from '../../Assets/settingsCog.svg';
import { handleError } from '../../Helpers/ErrorHandler';
import { Clock, Station } from '../../Models';
import { getClocksForStation } from '../../Services/AuthService';
import CreateClockModal from '../CreateClockModal/CreateClockModal';
import "./ClocksList.scss";

type ClocksListProps = {
  station: Station;
  onClockDetailSelected: (clock: Clock) => void;
};

const ClockList = (props: ClocksListProps) => {
  const _id = "cmp-clock-list"
  const { station } = props;
  const [createClockModalIsShowing, setCreateClockModalIsShowing] =
    useState(false);
  const [clocks, setClocks] = useState<Clock[]>([]);

  const handleClockSettingsButtonClicked = (clock: Clock) => {
    props.onClockDetailSelected(clock);
  };

  const loadClocks = async () => {
    try {
      setClocks(await getClocksForStation(station.id));
    } catch (err) {
      handleError(err);
    }
  };

  useEffect(function () {
    loadClocks();
  }, []);

  const handleCreateClockButtonClicked = () =>
    setCreateClockModalIsShowing(true);

  const handleCreateClockModalDismissed = () => {
    loadClocks();
    setCreateClockModalIsShowing(false);
  };

  return (
    <div className={_id}>
      <Button onClick={handleCreateClockButtonClicked} variant='outlined' size='large'>Create Clock</Button>
      <table>
        <tbody>
          {clocks.map((clock, index) => {
            let color;
            if (index % 3 == 0) {
              color = '#3EDCFF';
            } else if (index % 3 == 1) {
              color = '#FFBD59';
            } else {
              color = '#D288FF';
            }
            return (
              <tr key={`table-${clock.id}`}>
                <td style={{ backgroundColor: color, width: '30px' }}>
                  <img src={ClockImage} alt='Clock' />
                </td>
                <td style={{ fontSize: '20px', paddingLeft: '20px' }}>
                  Clock {clock.clockNumber} - {clock.name}
                </td>
                <td style={{ fontSize: '20px' }}>{clock.description}</td>
                <td style={{ textAlign: 'right'}}>
                  <Button
                    onClick={() => handleClockSettingsButtonClicked(clock)}
                  >
                    <img src={SettingsImage} />{' '}
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <CreateClockModal
        station={props.station}
        open={createClockModalIsShowing}
        onCompletion={handleCreateClockModalDismissed}
      />
    </div>
  );
};

export default ClockList;
