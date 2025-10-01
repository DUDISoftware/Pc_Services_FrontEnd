import api from "@/lib/api";
import { Info } from "@/types/Info";
import { InfoApi } from "@/types/Info";
import { mapInfo } from "@/lib/mappers";

export const getInfo = async (): Promise<Info> => {
    const response = await api.get<InfoApi>("/info");
    return mapInfo(response.data);
};

export const updateInfo = async (infoData: Partial<Info>): Promise<Info> => {
    const response = await api.put<InfoApi>("/info", infoData);
    return mapInfo(response.data);
};

export const infoService = {
    getInfo,
    updateInfo,
};