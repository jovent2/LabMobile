import { useCamera } from '@ionic/react-hooks/camera';
import {CameraPhoto, CameraResultType, CameraSource,FilesystemDirectory, Plugins} from '@capacitor/core';
import { useEffect, useState } from 'react';
import { base64FromPath, useFilesystem } from '@ionic/react-hooks/filesystem';
import { useStorage } from '@ionic/react-hooks/storage';
import {save} from "ionicons/icons";
const { Filesystem } = Plugins;

export interface Photo {
    base64Encoding?: string;
}
export interface Photo2 {
    filepath: string;
    webviewPath?: string;
    lat:number | undefined,
    lng:number | undefined
}

export function usePhotoGallery() {
    const [photos, setPhotos] = useState<Photo2[]>([]);
    const { getPhoto } = useCamera();
    const { get, set, remove } = useStorage();

    const takePhoto = async (lat: number | undefined, lng: number | undefined) => {
        const cameraPhoto = await getPhoto({
            resultType: CameraResultType.Uri,
            source: CameraSource.Camera,
            quality: 100,
            saveToGallery: true
        });
        const fileName = new Date().getTime() + '.jpeg';
        const newPhotos = [{
            filepath: fileName,
            webviewPath: cameraPhoto.webPath,
            lat:lat,
            lng:lng
        }, ...photos];
        setPhotos(newPhotos);
        console.log(cameraPhoto.webPath);
        const savedFileImage = await savePicture(cameraPhoto);
        //set(id!!, JSON.stringify(savedFileImage));
        //return savedFileImage;
    };

    const { readFile, writeFile, deleteFile } = useFilesystem();

    const readAsBase64=async (cameraPhoto: CameraPhoto) => {
        // Fetch the photo, read as a blob, then convert to base64 format
        const response = await fetch(cameraPhoto.webPath!);
        const blob = await response.blob();

        return await convertBlobToBase64(blob) as string;
    }
    const convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
        const reader = new FileReader;
        reader.onerror = reject;
        reader.onload = () => {
            resolve(reader.result);
        };
        reader.readAsDataURL(blob);
    });

    const savePicture = async (photo: CameraPhoto) => {
        const base64Data = await readAsBase64(photo);

        // Write the file to the data directory
        const fileName = new Date().getTime() + '.jpeg';
        console.log(FilesystemDirectory.Data);
        const savedFile = await Filesystem.writeFile({
            path: fileName,
            data: base64Data,
            directory: FilesystemDirectory.Documents
        });
        console.log(savedFile);
        // Use webPath to display the new image instead of base64 since it's
        // already loaded into memory
    };

    const loadPhoto = async (id?: string) => {
        const photoString = await get(id!!);
        const photo = (photoString ? JSON.parse(photoString) : undefined) as Photo;
        if(photo == undefined){
            return undefined;
        }
        const file = await readFile({
            path: id + '.jpeg',
            directory: FilesystemDirectory.Data
        });
        photo.base64Encoding = file.data;
        return photo;
    };

    const deletePhoto = async (photo: Photo, id?: string) => {
        if(photo == undefined || id == undefined){
            return;
        }
        remove(id!);
        const filepath = id + '.jpeg';
        const filename = filepath.substr(filepath.lastIndexOf('/') + 1);
        await deleteFile({
            path: filename,
            directory: FilesystemDirectory.Data
        });
    };

    return {
        takePhoto,
        loadPhoto,
        deletePhoto,
        photos
    };
}
