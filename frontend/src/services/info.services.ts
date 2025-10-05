import api from "@/lib/api";
import { Info } from "@/types/Info";
import { InfoApi } from "@/types/Info";
import { mapInfo } from "@/lib/mappers";

export const getInfo = async (): Promise<Info> => {
    try {
        const response = await api.get<InfoApi>("/info");
        return mapInfo(response.data);
    } catch (error) {
        // Optionally handle/log error here
        throw error;
    }
};

export const updateInfo = async (
    data: Partial<Info> & { termsFile?: File; policyFile?: File }
): Promise<Info> => {
    try {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (key !== "termsFile" && key !== "policyFile" && value !== undefined) {
                formData.append(key, value as string);
            }
        });

        // Add files
        if (data.termsFile) {
            formData.append("terms", data.termsFile);
        }
        if (data.policyFile) {
            formData.append("policy", data.policyFile);
        }

        const response = await api.request<InfoApi>({
            method: "PUT",
            url: "/info",
            data: formData,
            headers: {
                // 'Content-Type': 'multipart/form-data', do NOT manually add
            },
        });

        return mapInfo(response.data);
    } catch (error) {
        // Optionally handle/log error here
        throw error;
    }
};

export const sendEmail = async (email: string, subject: string, message: string): Promise<void> => {
    try {
        await api.post("/info/contact", { email, subject, message });
    } catch (error) {
        // Optionally handle/log error here
        throw error;
    }
};

export const infoService = {
    getInfo,
    updateInfo,
    sendEmail
};