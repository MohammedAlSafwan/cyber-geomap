import axios, { AxiosResponse } from 'axios';
import GeoLocationResponse from '../objects/GeoLocationResponse';

export const fetchGeoLocation = async (ipAddress) => {
    try {
        const response = await axios.get(`https://ipapi.co/${ipAddress}/json/`);
        const data = response.data;

        if (data && data.latitude && data.longitude) {
            return {
                success: true,
                ipAddress: ipAddress,
                latitude: data.latitude,
                longitude: data.longitude,
                city: data.city,
                region: data.region,
                country: data.country_name,
                postal: data.postal,
                message: 'successfully',
            };
        } else {
            return {
                success: false,
                ipAddress: ipAddress,
                message: 'failed',
            };
        }
    } catch (error) {
        return {
            success: false,
            ipAddress: ipAddress,
            message: error.message || 'faild',
        };
    }
};


