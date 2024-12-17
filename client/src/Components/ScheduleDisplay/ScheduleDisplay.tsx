import { List } from '@mui/material';
import { useEffect, useState } from 'react';
import { handleError } from '../../Helpers/ErrorHandler';
import { Category, Spin, Station } from '../../Models';
import { getScheduleForStation } from '../../Services/AuthService';
import './ScheduleDisplay.scss';

type ScheduleDisplayProps = {
  station: Station;
};

const ScheduleDisplay = (props: ScheduleDisplayProps) => {
  const _id = 'cmp-library-details';
  const [schedule, setSchedule] = useState<Spin[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const loadSchedule = async () => {
    try {
      setSchedule(
        await getScheduleForStation({
          stationId: props.station.id,
          extended: true,
        })
      );
    } catch (err) {
      handleError(err);
    }
  };

  useEffect(() => {
    loadSchedule();
  }, []);

  return (
    <div className={_id}>
      {schedule.length && (
        <div style={{ height: '500px' }}>
          <h1>Schedule</h1>
          <List>
            {schedule.map((spin) => (
              <li key={spin.id}>
                {prettyDate(spin.airtime)}
                {'       -        '}
                {spin.audioBlock.artist}
                {'       -        '}
                {spin.audioBlock.title}
              </li>
            ))}
          </List>
        </div>
      )}
    </div>
  );
};

function prettyDate(date: Date): string {
  return (
    date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: '2-digit',
      month: '2-digit',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true,
    }) ?? 'error'
  );
}

export default ScheduleDisplay;
