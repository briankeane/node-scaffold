import axios from 'axios';
import { handleError } from '../Helpers/ErrorHandler';
import {
  AttributeType,
  AudioBlock,
  Category,
  Clock,
  Spin,
  Station,
  TemporaryRule,
} from '../Models';
import { StationRule } from '../Models/StationRule';

const baseUrl = import.meta.env.VITE_SERVER_BASE_URL;

// export const loginAPI = async (username: string, password: string) => {
//   try {
//     const data = await axios.post<UserProfileToken>(baseUrl + "account/login", {
//       username: username,
//       password: password,
//     });
//     return data;
//   } catch (error) {
//     handleError(error);
//   }
// };

// export const registerAPI = async (
//   email: string,
//   username: string,
//   password: string
// ) => {
//   try {
//     const data = await axios.post<UserProfileToken>(baseUrl + "account/register", {
//       email: email,
//       username: username,
//       password: password,
//     });
//     return data;
//   } catch (error) {
//     handleError(error);
//   }
// };

type CreateStationArgs = {
  name: string;
  curatorName: string;
  imageUrl: string;
};

export const createStation = async ({
  name,
  curatorName,
  imageUrl,
}: CreateStationArgs) => {
  try {
    const data = await axios.post<Station>(baseUrl + '/v1/stations', {
      name,
      curatorName,
      imageUrl,
    });
    return data;
  } catch (err) {
    handleError(err);
  }
};

export const getAllStations = async (): Promise<Station[]> => {
  const res = await axios.get<Station[]>(baseUrl + '/v1/stations');
  return res.data;
};

export const getStation = async (stationId: string): Promise<Station> => {
  const res = await axios.get<Station>(baseUrl + `/v1/stations/${stationId}`);
  return res.data;
};

type CreateCategoryArgs = {
  name: string;
  stationId: string;
  audioBlockType?: string;
};

export const createCategory = async ({
  name,
  stationId,
  audioBlockType,
}: CreateCategoryArgs) => {
  const res = await axios.post<Category>(
    baseUrl + `/v1/stations/${stationId}/categories`,
    { name, audioBlockType }
  );
  return res.data;
};

export const getCategoriesForStation = async (
  stationId: string
): Promise<Category[]> => {
  const res = await axios.get<Category[]>(
    baseUrl + `/v1/stations/${stationId}/categories`
  );
  return res.data;
};

export const getAllSongs = async (): Promise<AudioBlock[]> => {
  const res = await axios.get<AudioBlock[]>(baseUrl + '/v1/songs');
  return res.data;
};

type SearchAudioBlockArgs = {
  type?: string;
  attributes?: { [id: string]: any };
};
export const searchAudioBlocks = async ({
  type,
}: SearchAudioBlockArgs): Promise<AudioBlock[]> => {
  const res = await axios.get<AudioBlock[]>(
    baseUrl + '/v1/audioBlocks/search',
    {
      params: { type },
    }
  );
  return res.data;
};

export const addAudioBlocksToCategory = async (
  stationId: string,
  categoryId: string,
  audioBlockIds: string[]
): Promise<Category[]> => {
  const res = await axios.put<Category[]>(
    baseUrl + `/v1/stations/${stationId}/categories/${categoryId}`,
    { audioBlockIds }
  );
  return res.data;
};

type CreateClockArgs = {
  name: string;
  description: string;
  stationId: string;
};

export const createClock = async ({
  name,
  description,
  stationId,
}: CreateClockArgs): Promise<Clock> => {
  const res = await axios.post(baseUrl + `/v1/stations/${stationId}/clocks`, {
    name,
    description,
  });
  return res.data;
};

export const getClocksForStation = async (
  stationId: string
): Promise<Clock[]> => {
  const res = await axios.get(baseUrl + `/v1/stations/${stationId}/clocks`);
  return res.data;
};

export const getClock = async (clockId: string): Promise<Clock> => {
  const res = await axios.get(baseUrl + `/v1/clocks/${clockId}`);
  return res.data;
};

type CreateClockSegmentArgs = {
  clockId: string;
  type: string;
  categoryId?: string;
  syncTimeMS?: number;
  position?: number;
};

export const createClockSegment = async ({
  clockId,
  type,
  categoryId,
  syncTimeMS,
  position,
}: CreateClockSegmentArgs) => {
  const res = await axios.post(baseUrl + `/v1/clocks/${clockId}/segments`, {
    clockId,
    type,
    categoryIds: [categoryId],
    syncTimeMS,
    position,
  });
  return res.data;
};

type CreateComboClockSegmentArgs = {
  categoryIds: string[];
  clockId: string;
  position?: number;
};
export const createComboClockSegment = async ({
  clockId,
  categoryIds,
  position,
}: CreateComboClockSegmentArgs) => {
  const res = await axios.post(baseUrl + `/v1/clocks/${clockId}/segments`, {
    clockId,
    categoryIds,
    position,
  });
  return res.data;
};

type CreateSyncClockSegmentArgs = {
  clockId: string;
  syncTimeMS: number;
};

export const createSnycClockSegment = async ({
  clockId,
  syncTimeMS,
}: CreateSyncClockSegmentArgs): Promise<Clock> => {
  const res = await axios.post(baseUrl + `/v1/clocks/${clockId}/segments`, {
    syncTimeMS,
  });
  return res.data;
};

type CreateTemporaryRuleClockSegmentArgs = {
  clockId: string;
  temporaryRule: TemporaryRule;
};

export const createTemporaryRuleClockSegment = async ({
  clockId,
  temporaryRule,
}: CreateTemporaryRuleClockSegmentArgs): Promise<Clock> => {
  const res = await axios.post(baseUrl + `/v1/clocks/${clockId}/segments`, {
    clockId,
    temporaryRule,
  });
  return res.data;
};

type EditClockSegmentArgs = {
  clockId: string;
  position: number;
  segmentId: string;
};

export const editClockSegment = async (
  props: EditClockSegmentArgs
): Promise<Clock> => {
  const res = await axios.put(
    baseUrl + `/v1/clocks/${props.clockId}/segments/${props.segmentId}`,
    { position: props.position }
  );
  return res.data;
};

type DeleteClockSegmentArgs = {
  clockId: string;
  segmentId: string;
};
export const deleteClockSegment = async (
  props: DeleteClockSegmentArgs
): Promise<Clock> => {
  const res = await axios.delete(
    baseUrl + `/v1/clocks/${props.clockId}/segments/${props.segmentId}`
  );
  return res.data;
};

export const getAudioBlock = async (
  audioBlockId: string
): Promise<AudioBlock> => {
  const res = await axios.get(baseUrl + `/v1/audioBlocks/${audioBlockId}`);
  return res.data;
};

export type AudioBlockUpdateData = {
  title?: string;
  artist?: string;
  album?: string;
  imageUrl?: string;
  endOfMessageMS?: number;
  endOfIntroMS?: number;
  beginningOfOutroMS?: number;
  attributes?: { [id: string]: any };
};

export const updateAudioBlock = async (
  audioBlockId: string,
  audioBlockUpdateData: AudioBlockUpdateData
): Promise<AudioBlock> => {
  const res = await axios.put(
    baseUrl + `/v1/audioBlocks/${audioBlockId}`,
    audioBlockUpdateData
  );
  return res.data;
};

export const getAllAudioImagesForStation = async (
  stationId: string
): Promise<AudioBlock[]> => {
  const res = await axios.get(
    baseUrl + `/v1/stations/${stationId}/audioImages`
  );
  return res.data;
};

export const getAllAttributeTypes = async (): Promise<AttributeType[]> => {
  const res = await axios.get(baseUrl + `/v1/attributeTypes`);
  return res.data;
};

export type AttributeTypeCreateData = {
  name: string;
  type: string;
  enumOptions?: string[];
};

export const getStationRulesForStation = async (
  stationId: string
): Promise<StationRule[]> => {
  const res = await axios.get(
    baseUrl + `/v1/stations/${stationId}/stationRules`
  );
  return res.data;
};

export type CreateStationRuleData = {
  stationId: string;
  property: string;
  restDurationMinutes: number;
  excludedCategoryIds?: string[];
};

export const createStationRule = async ({
  stationId,
  property,
  restDurationMinutes,
  excludedCategoryIds,
}: CreateStationRuleData): Promise<StationRule> => {
  const res = await axios.post(
    baseUrl + `/v1/stations/${stationId}/stationRules`,
    {
      property,
      restDurationMinutes,
      excludedCategoryIds,
    }
  );
  return res.data;
};

export const deleteStationRule = async (
  stationRuleId: string
): Promise<void> => {
  await axios.delete(baseUrl + `/v1/stationRules/${stationRuleId}`);
};

export const createAttributeType = async (
  createData: AttributeTypeCreateData
): Promise<AttributeType[]> => {
  const res = await axios.post(baseUrl + '/v1/attributeTypes', createData);
  return res.data;
};

export type GetScheduleData = {
  stationId: string;
  extended?: boolean;
};

export const getScheduleForStation = async ({
  stationId,
  extended,
}: GetScheduleData): Promise<Spin[]> => {
  const res = await axios.get(baseUrl + `/v1/stations/${stationId}/schedule`, {
    params: { extended },
  });
  for (let spin of res.data) {
    spin.airtime = new Date(spin.airtime);
  }
  return res.data;
};
